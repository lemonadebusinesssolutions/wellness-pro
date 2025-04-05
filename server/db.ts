import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from '../shared/schema';

const { Pool } = pg;

// Initialize postgres connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize drizzle with the pg pool and schema
export const db = drizzle(pool, { schema });

// Export pool for use in other modules
export { pool };

// Function to migrate the database
export async function migrate() {
  console.log('Creating database tables if they don\'t exist...');
  
  try {
    // Create tables based on our schema
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255)
      );

      CREATE TABLE IF NOT EXISTS assessments (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL UNIQUE,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        duration VARCHAR(50),
        icon VARCHAR(50)
      );
      
      -- Add new columns to assessments if they don't exist
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='assessments' AND column_name='duration') THEN
          ALTER TABLE assessments ADD COLUMN duration VARCHAR(50);
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='assessments' AND column_name='icon') THEN
          ALTER TABLE assessments ADD COLUMN icon VARCHAR(50);
        END IF;
      END $$;

      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,
        assessment_type VARCHAR(50) NOT NULL REFERENCES assessments(type),
        text TEXT NOT NULL,
        options JSONB NOT NULL,
        "order" INTEGER,
        category VARCHAR(100)
      );
      
      -- Add order column to questions if it doesn't exist
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='questions' AND column_name='order') THEN
          ALTER TABLE questions ADD COLUMN "order" INTEGER;
        END IF;
      END $$;

      CREATE TABLE IF NOT EXISTS results (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        assessment_type VARCHAR(50) NOT NULL REFERENCES assessments(type),
        answers JSONB NOT NULL,
        score INTEGER NOT NULL,
        categories JSONB NOT NULL,
        completed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS recommendations (
        id SERIAL PRIMARY KEY,
        assessment_type VARCHAR(50) NOT NULL REFERENCES assessments(type),
        category VARCHAR(100) NOT NULL,
        min_score INTEGER NOT NULL,
        max_score INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        priority VARCHAR(20) NOT NULL,
        tips JSONB
      );
      
      -- Add tips column to recommendations if it doesn't exist
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='recommendations' AND column_name='tips') THEN
          ALTER TABLE recommendations ADD COLUMN tips JSONB;
        END IF;
      END $$;
    `);
    
    console.log('Database tables created successfully');
  } catch (err) {
    console.error('Error creating database tables:', err);
    throw err;
  }
}

// Function to seed initial data
export async function seedInitialData() {
  console.log('Seeding initial data...');
  
  try {
    // Check if we already have assessments data
    const assessmentsResult = await pool.query('SELECT COUNT(*) FROM assessments');
    
    if (parseInt(assessmentsResult.rows[0].count) === 0) {
      console.log('Seeding assessments...');
      
      // Seed assessments
      await pool.query(`
        INSERT INTO assessments (type, title, description, duration, icon) VALUES
        ('stress', 'Stress Assessment', 'Evaluate your current stress levels and identify areas for improvement', '5-10 minutes', 'brain'),
        ('workplace', 'Workplace Wellbeing', 'Assess factors affecting your wellbeing at work', '5-10 minutes', 'briefcase'),
        ('digital', 'Digital Wellbeing', 'Evaluate your relationship with technology and digital habits', '5-10 minutes', 'smartphone')
      `);
      
      console.log('Seeding questions...');
      
      // Seed stress questions
      await pool.query(`
        INSERT INTO questions (assessment_type, text, options, "order", category) VALUES
        ('stress', 'How often do you feel overwhelmed by your responsibilities?', 
          '["Never", "Rarely", "Sometimes", "Often", "Very often"]', 1, 'general'),
        ('stress', 'How would you rate your ability to manage stress?', 
          '["Excellent", "Good", "Average", "Below average", "Poor"]', 2, 'management'),
        ('stress', 'How often do you experience physical symptoms of stress (headaches, tension, etc.)?', 
          '["Never", "Rarely", "Sometimes", "Often", "Very often"]', 3, 'physical'),
        ('stress', 'How well do you sleep on most nights?', 
          '["Very well", "Well", "Average", "Poorly", "Very poorly"]', 4, 'physical'),
        ('stress', 'How often do you take time for relaxation or self-care?', 
          '["Daily", "Several times a week", "Once a week", "Rarely", "Never"]', 5, 'management')
      `);
      
      // Seed workplace questions
      await pool.query(`
        INSERT INTO questions (assessment_type, text, options, "order", category) VALUES
        ('workplace', 'How satisfied are you with your current job role?',
          '["Very satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very dissatisfied"]', 1, 'job_satisfaction'),
        ('workplace', 'How would you rate the level of support from your management?',
          '["Excellent", "Good", "Average", "Poor", "Very poor"]', 2, 'management_support'),
        ('workplace', 'How comfortable is your physical work environment?',
          '["Very comfortable", "Comfortable", "Neutral", "Uncomfortable", "Very uncomfortable"]', 3, 'environment')
      `);
      
      // Seed digital questions
      await pool.query(`
        INSERT INTO questions (assessment_type, text, options, "order", category) VALUES
        ('digital', 'How many hours per day do you typically spend on digital devices?',
          '["Less than 2 hours", "2-4 hours", "4-6 hours", "6-8 hours", "More than 8 hours"]', 1, 'screen_time'),
        ('digital', 'How often do you check your phone without a specific purpose?',
          '["Rarely", "A few times a day", "Every hour", "Every 30 minutes", "Every 10 minutes or less"]', 2, 'phone_usage'),
        ('digital', 'How often do you take breaks from screen time?',
          '["Every 30 minutes", "Every hour", "Every few hours", "Rarely", "Never"]', 3, 'breaks')
      `);
      
      console.log('Seeding recommendations...');
      
      // Seed high stress recommendations
      await pool.query(`
        INSERT INTO recommendations (assessment_type, category, min_score, max_score, title, description, priority) VALUES
        ('stress', 'physical', 0, 30, 'Prioritize Physical Recovery', 'Your body is showing signs of stress. Focus on sleep, nutrition, and gentle exercise to help your physical recovery.', 'High'),
        ('stress', 'management', 0, 30, 'Develop a Stress Management Plan', 'Create a structured plan to identify stressors and implement daily stress reduction techniques.', 'High')
      `);
      
      // Seed moderate stress recommendations
      await pool.query(`
        INSERT INTO recommendations (assessment_type, category, min_score, max_score, title, description, priority) VALUES
        ('stress', 'general', 31, 70, 'Regular Mindfulness Practice', 'Incorporate 10-15 minutes of daily mindfulness meditation to improve stress resilience.', 'Medium'),
        ('stress', 'work_life', 31, 70, 'Establish Work-Life Boundaries', 'Create clearer boundaries between work and personal time to prevent burnout.', 'Medium'),
        ('stress', 'emotional', 31, 70, 'Emotional Regulation Techniques', 'Practice techniques like deep breathing and progressive muscle relaxation to manage emotional responses to stress.', 'Medium')
      `);
      
      // Seed low stress recommendations
      await pool.query(`
        INSERT INTO recommendations (assessment_type, category, min_score, max_score, title, description, priority) VALUES
        ('stress', 'general', 71, 100, 'Maintain Your Wellbeing Routine', 'Continue your effective stress management practices and consider sharing your strategies with others.', 'Low'),
        ('stress', 'cognitive', 71, 100, 'Cognitive Optimization', 'Your stress management is working well. Consider techniques like brain training games to further enhance cognitive performance.', 'Low'),
        ('stress', 'control', 71, 100, 'Build on Your Success', 'You are managing stress effectively. Consider setting new wellbeing goals to further enhance your quality of life.', 'Low')
      `);
      
      // Seed workplace recommendations (high)
      await pool.query(`
        INSERT INTO recommendations (assessment_type, category, min_score, max_score, title, description, priority) VALUES
        ('workplace', 'job_satisfaction', 0, 30, 'Career Path Evaluation', 'Take time to reflect on your career goals and whether your current position aligns with them.', 'High'),
        ('workplace', 'management_support', 0, 30, 'Communicate Needs to Management', 'Schedule a meeting with your supervisor to discuss specific support needs and challenges.', 'High'),
        ('workplace', 'work_stress', 0, 30, 'Workplace Stress Reduction Plan', 'Identify key workplace stressors and develop specific strategies to address each one.', 'High')
      `);
      
      // Seed workplace recommendations (medium)
      await pool.query(`
        INSERT INTO recommendations (assessment_type, category, min_score, max_score, title, description, priority) VALUES
        ('workplace', 'environment', 31, 70, 'Optimize Your Work Environment', 'Make ergonomic adjustments to your workspace and consider how to minimize distractions.', 'Medium'),
        ('workplace', 'work_life_balance', 31, 70, 'Review Work Schedule', 'Analyze your work schedule and identify opportunities to create better boundaries for personal time.', 'Medium'),
        ('workplace', 'communication', 31, 70, 'Enhance Workplace Communication', 'Practice clear communication techniques and consider how to address communication challenges.', 'Medium')
      `);
      
      // Seed workplace recommendations (low)
      await pool.query(`
        INSERT INTO recommendations (assessment_type, category, min_score, max_score, title, description, priority) VALUES
        ('workplace', 'recognition', 71, 100, 'Mentoring Opportunities', 'Consider sharing your positive workplace experiences by mentoring colleagues.', 'Low'),
        ('workplace', 'growth', 71, 100, 'Advanced Professional Development', 'Build on your workplace satisfaction by seeking additional growth opportunities like specialized training.', 'Low'),
        ('workplace', 'strengths_use', 71, 100, 'Strengths Optimization', 'Identify ways to further leverage your key strengths in new projects or responsibilities.', 'Low')
      `);
      
      // Seed digital wellbeing recommendations (high)
      await pool.query(`
        INSERT INTO recommendations (assessment_type, category, min_score, max_score, title, description, priority) VALUES
        ('digital', 'screen_time', 0, 30, 'Digital Detox Plan', 'Create a structured plan to gradually reduce screen time, starting with screen-free meals.', 'High'),
        ('digital', 'phone_usage', 0, 30, 'Phone Usage Intervention', 'Use screen time tracking apps and set specific goals to reduce checking your phone.', 'High'),
        ('digital', 'anxiety', 0, 30, 'Digital Anxiety Management', 'Practice being unreachable for short periods and gradually build your comfort with being offline.', 'High')
      `);
      
      // Seed digital wellbeing recommendations (medium)
      await pool.query(`
        INSERT INTO recommendations (assessment_type, category, min_score, max_score, title, description, priority) VALUES
        ('digital', 'breaks', 31, 70, 'Structured Screen Breaks', 'Implement the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds.', 'Medium'),
        ('digital', 'sleep', 31, 70, 'Digital Sleep Hygiene', 'Create a technology-free bedroom and stop using devices at least 1 hour before bedtime.', 'Medium'),
        ('digital', 'social_comparison', 31, 70, 'Healthy Social Media Habits', 'Audit your social media feeds and remove or mute accounts that trigger negative comparisons.', 'Medium')
      `);
      
      // Seed digital wellbeing recommendations (low)
      await pool.query(`
        INSERT INTO recommendations (assessment_type, category, min_score, max_score, title, description, priority) VALUES
        ('digital', 'focus', 71, 100, 'Digital Focus Optimization', 'Build on your good habits by exploring productivity techniques like timeboxing when using technology.', 'Low'),
        ('digital', 'boundaries', 71, 100, 'Digital Boundary Mastery', 'Share your effective digital boundary strategies with friends and family who might benefit.', 'Low'),
        ('digital', 'social_connections', 71, 100, 'Technology for Connection', 'Explore ways to use technology intentionally to enhance rather than replace meaningful connections.', 'Low')
      `);
      
      console.log('Initial data seeded successfully');
    } else {
      console.log('Database already contains data, skipping seed');
    }
  } catch (err) {
    console.error('Error seeding initial data:', err);
    throw err;
  }
}

// Create an anonymous user if needed
export async function getOrCreateAnonymousUser(userId: number): Promise<number> {
  try {
    // Check if user exists
    const userResult = await pool.query(
      'SELECT id FROM users WHERE id = $1', 
      [userId]
    );
    
    if (userResult.rows.length === 0) {
      // Create new anonymous user
      const newUserResult = await pool.query(
        'INSERT INTO users (id, username, email) VALUES ($1, $2, NULL) RETURNING id',
        [userId, 'anonymous_' + userId]
      );
      
      return newUserResult.rows[0].id;
    }
    
    return userResult.rows[0].id;
  } catch (err) {
    console.error('Error getting or creating anonymous user:', err);
    throw err;
  }
}