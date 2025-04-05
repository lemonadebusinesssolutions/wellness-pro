import { 
  User, InsertUser, 
  Assessment, InsertAssessment, 
  Question, InsertQuestion, 
  Result, InsertResult, 
  Recommendation, InsertRecommendation
} from '@shared/schema';
import { IStorage } from './storage';
import pg from 'pg';
import { migrate, seedInitialData, getOrCreateAnonymousUser, pool } from './db';
import connectPgSimple from 'connect-pg-simple';
import session from 'express-session';

const PostgresStore = connectPgSimple(session);

export class DbStorage implements IStorage {
  private pool: pg.Pool;
  sessionStore: session.Store;

  constructor() {
    this.pool = pool;
    this.sessionStore = new PostgresStore({
      pool: this.pool,
      tableName: 'session',
      createTableIfMissing: true
    });
  }

  async initialize(): Promise<void> {
    try {
      await migrate();
      await seedInitialData();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    try {
      const result = await this.pool.query('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows[0] as User | undefined;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const result = await this.pool.query('SELECT * FROM users WHERE username = $1', [username]);
      return result.rows[0] as User | undefined;
    } catch (error) {
      console.error('Error getting user by username:', error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const result = await this.pool.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0] as User | undefined;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    try {
      const result = await this.pool.query('SELECT * FROM users WHERE google_id = $1', [googleId]);
      return result.rows[0] as User | undefined;
    } catch (error) {
      console.error('Error getting user by Google ID:', error);
      throw error;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    try {
      const fields = Object.keys(user).filter(key => user[key as keyof InsertUser] !== undefined);
      const values = fields.map(field => user[field as keyof InsertUser]);
      const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');
      const columns = fields.map(field =>
        field === 'googleId' ? 'google_id' : 
        field === 'profilePicture' ? 'profile_picture' : 
        field === 'displayName' ? 'display_name' : field
      ).join(', ');
      const query = `INSERT INTO users (${columns}) VALUES (${placeholders}) RETURNING *`;
      const result = await this.pool.query(query, values);
      return result.rows[0] as User;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    try {
      if (Object.keys(userData).length === 0) return await this.getUser(id);
      const fields = Object.keys(userData).filter(key => userData[key as keyof Partial<InsertUser>] !== undefined);
      const values = fields.map(field => userData[field as keyof Partial<InsertUser>]);
      const setClause = fields.map((field, i) => {
        const columnName =
          field === 'googleId' ? 'google_id' :
          field === 'profilePicture' ? 'profile_picture' :
          field === 'displayName' ? 'display_name' : field;
        return `${columnName} = $${i + 1}`;
      }).join(', ');
      const query = `UPDATE users SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`;
      const result = await this.pool.query(query, [...values, id]);
      return result.rows[0] as User | undefined;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async getAssessments(): Promise<Assessment[]> {
    try {
      const result = await this.pool.query('SELECT * FROM assessments ORDER BY id');
      return result.rows as Assessment[];
    } catch (error) {
      console.error('Error getting assessments:', error);
      throw error;
    }
  }

  async getAssessmentByType(type: string): Promise<Assessment | undefined> {
    try {
      const result = await this.pool.query('SELECT * FROM assessments WHERE type = $1', [type]);
      return result.rows[0] as Assessment | undefined;
    } catch (error) {
      console.error('Error getting assessment by type:', error);
      throw error;
    }
  }

  async createAssessment(assessment: InsertAssessment): Promise<Assessment> {
    try {
      const result = await this.pool.query(
        `INSERT INTO assessments (type, title, description, duration, icon)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [assessment.type, assessment.title, assessment.description, assessment.duration, assessment.icon]
      );
      return result.rows[0] as Assessment;
    } catch (error) {
      console.error('Error creating assessment:', error);
      throw error;
    }
  }

  async getQuestionsByAssessmentType(assessmentType: string): Promise<Question[]> {
    try {
      const result = await this.pool.query('SELECT * FROM questions WHERE assessment_type = $1 ORDER BY "order"', [assessmentType]);
      return result.rows as Question[];
    } catch (error) {
      console.error('Error getting questions by assessment type:', error);
      throw error;
    }
  }

  async createQuestion(question: InsertQuestion): Promise<Question> {
    try {
      const result = await this.pool.query(
        `INSERT INTO questions (assessment_type, text, options, "order", category)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [question.assessmentType, question.text, question.options, question.order, question.category]
      );
      return result.rows[0] as Question;
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  }

  async getResultById(id: number): Promise<Result | undefined> {
    try {
      const result = await this.pool.query('SELECT * FROM results WHERE id = $1', [id]);
      return result.rows[0] as Result | undefined;
    } catch (error) {
      console.error('Error getting result by ID:', error);
      throw error;
    }
  }

  async getResultsByUserId(userId: number): Promise<Result[]> {
    try {
      const result = await this.pool.query('SELECT * FROM results WHERE user_id = $1 ORDER BY completed_at DESC', [userId]);
      return result.rows as Result[];
    } catch (error) {
      console.error('Error getting results by user ID:', error);
      throw error;
    }
  }

  async getResultsByAssessmentType(assessmentType: string): Promise<Result[]> {
    try {
      const result = await this.pool.query('SELECT * FROM results WHERE assessment_type = $1 ORDER BY completed_at DESC', [assessmentType]);
      return result.rows as Result[];
    } catch (error) {
      console.error('Error getting results by assessment type:', error);
      throw error;
    }
  }

  async createResult(result: InsertResult): Promise<Result> {
    try {
      console.log('Creating result with:', {
        userId: result.userId,
        assessmentType: result.assessmentType,
        score: result.score,
        answers: result.answers,
        categories: result.categories,
        completedAt: result.completedAt
      });

      const queryResult = await this.pool.query(
        `INSERT INTO results (user_id, assessment_type, score, answers, categories, completed_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          result.userId,
          result.assessmentType,
          result.score,
          JSON.stringify(result.answers),
          JSON.stringify(result.categories),
          result.completedAt || new Date()
        ]
      );
      return queryResult.rows[0] as Result;
    } catch (error) {
      console.error('Error creating result:', error);
      throw error;
    }
  }

  async getRecommendationsByAssessmentType(assessmentType: string): Promise<Recommendation[]> {
    try {
      const result = await this.pool.query('SELECT * FROM recommendations WHERE assessment_type = $1', [assessmentType]);
      return result.rows as Recommendation[];
    } catch (error) {
      console.error('Error getting recommendations by assessment type:', error);
      throw error;
    }
  }

  async getRecommendationsByCategory(category: string): Promise<Recommendation[]> {
    try {
      const result = await this.pool.query('SELECT * FROM recommendations WHERE category = $1', [category]);
      return result.rows as Recommendation[];
    } catch (error) {
      console.error('Error getting recommendations by category:', error);
      throw error;
    }
  }

  async getRecommendationsByCategoryAndScore(category: string, score: number): Promise<Recommendation[]> {
    try {
      const result = await this.pool.query(
        'SELECT * FROM recommendations WHERE category = $1 AND min_score <= $2 AND max_score >= $2',
        [category, score]
      );
      return result.rows as Recommendation[];
    } catch (error) {
      console.error('Error getting recommendations by category and score:', error);
      throw error;
    }
  }

  async createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation> {
    try {
      const result = await this.pool.query(
        `INSERT INTO recommendations (assessment_type, category, title, description, tips, min_score, max_score, priority)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          recommendation.assessmentType,
          recommendation.category,
          recommendation.title,
          recommendation.description,
          recommendation.tips,
          recommendation.minScore,
          recommendation.maxScore,
          recommendation.priority
        ]
      );
      return result.rows[0] as Recommendation;
    } catch (error) {
      console.error('Error creating recommendation:', error);
      throw error;
    }
  }
}