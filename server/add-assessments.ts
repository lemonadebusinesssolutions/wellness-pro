import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a connection to the database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runAdditionalAssessments() {
  try {
    console.log('Adding additional assessment types...');
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'seeds', 'additional-assessments.sql');
    let sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    // First insert assessments
    console.log("Adding basic assessment types...");
    const assessmentsSql = `
      INSERT INTO assessments (type, title, description, duration, icon) VALUES
        ('happiness', 'Happiness Assessment', 'Evaluate your current levels of happiness and life satisfaction', '5-10 minutes', 'smile'),
        ('physical_wellbeing', 'Physical Wellbeing Assessment', 'Assess your overall physical health and wellness habits', '5-10 minutes', 'activity'),
        ('emotional_wellbeing', 'Emotional Wellbeing Assessment', 'Evaluate your emotional health and regulation abilities', '5-10 minutes', 'heart'),
        ('social_connection', 'Social Connection Assessment', 'Assess the quality and quantity of your social relationships', '5-10 minutes', 'users'),
        ('sleep_quality', 'Sleep Quality Assessment', 'Evaluate your sleep patterns and quality', '5-10 minutes', 'moon'),
        ('mindfulness', 'Mindfulness Assessment', 'Assess your mindfulness practice and relaxation techniques', '5-10 minutes', 'zap'),
        ('self_compassion', 'Self-Compassion Assessment', 'Evaluate how you treat yourself during difficult times', '5-10 minutes', 'shield'),
        ('financial_wellbeing', 'Financial Wellbeing Assessment', 'Assess your financial health and money management', '5-10 minutes', 'dollar-sign'),
        ('life_purpose', 'Life Purpose Assessment', 'Evaluate your sense of meaning and purpose in life', '5-10 minutes', 'compass'),
        ('resilience', 'Resilience Assessment', 'Assess your ability to bounce back from challenges', '5-10 minutes', 'trending-up'),
        ('nutrition', 'Nutrition Assessment', 'Evaluate your dietary habits and nutrition knowledge', '5-10 minutes', 'apple'),
        ('physical_activity', 'Physical Activity Assessment', 'Assess your exercise habits and physical activity levels', '5-10 minutes', 'dumbbell');
    `;
    
    try {
      await pool.query(assessmentsSql);
      console.log("Assessment types added successfully!");
    } catch (error: any) {
      console.error("Error adding assessment types:", error?.message || String(error));
    }
    
    // Extract all question insert statements and run them one by one
    const questionRegex = /INSERT INTO questions \(assessment_type, text, options, "order", category\) VALUES\s*\(([^;]+)\);/g;
    let match;
    let questionCounter = 0;
    
    console.log("Adding questions...");
    while ((match = questionRegex.exec(sql)) !== null) {
      const values = match[1].trim();
      const questionsSql = `INSERT INTO questions (assessment_type, text, options, "order", category) VALUES (${values});`;
      
      try {
        await pool.query(questionsSql);
        questionCounter++;
      } catch (error: any) {
        console.error(`Error adding questions group ${questionCounter + 1}:`, error?.message || String(error));
      }
    }
    console.log(`Added ${questionCounter} groups of questions`);
    
    // Add recommendations one by one
    console.log("Adding recommendations...");
    
    // Extract all recommendation entries and run them with correct jsonb casting
    const singleRecommendationRegex = /\([^)]+\)/g;
    const recRegex = /INSERT INTO recommendations \(assessment_type, category, min_score, max_score, title, description, priority, tips\) VALUES\s*([^;]+);/g;
    
    let recMatch;
    let recCounter = 0;
    
    while ((recMatch = recRegex.exec(sql)) !== null) {
      let recValuesBlock = recMatch[1].trim();
      
      // Extract individual recommendation entries
      const recEntries = [];
      let recEntryMatch;
      
      while ((recEntryMatch = singleRecommendationRegex.exec(recValuesBlock)) !== null) {
        // Replace '[]' with proper jsonb array 
        let entry = recEntryMatch[0].replace(/'(\w+)', '\[\]'/, "'$1', '[]'::jsonb");
        recEntries.push(entry);
      }
      
      // Process each recommendation individually
      for (const entry of recEntries) {
        try {
          const singleRecSql = `INSERT INTO recommendations (assessment_type, category, min_score, max_score, title, description, priority, tips) VALUES ${entry};`;
          await pool.query(singleRecSql);
          recCounter++;
        } catch (error: any) {
          console.error(`Error adding recommendation ${recCounter + 1}:`, error?.message || String(error));
        }
      }
    }
    
    console.log(`Added ${recCounter} recommendations`);
    console.log('Additional assessment types, questions, and recommendations added successfully!');
  } catch (error: any) {
    console.error('Error adding additional assessments:', error?.message || String(error));
  } finally {
    // Close the pool
    await pool.end();
  }
}


// Run the function
runAdditionalAssessments();