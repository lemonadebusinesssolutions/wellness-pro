import {
  User, InsertUser,
  Assessment, InsertAssessment,
  Question, InsertQuestion,
  Result, InsertResult,
  Recommendation, InsertRecommendation
} from '@shared/schema'
import { IStorage } from './storage'
import pg from 'pg'
import { migrate, seedInitialData, pool } from './db'
import connectPgSimple from 'connect-pg-simple'
import session from 'express-session'

const PostgresStore = connectPgSimple(session)

export class DbStorage implements IStorage {
  private pool: pg.Pool
  sessionStore: session.Store

  constructor() {
    this.pool = pool
    this.sessionStore = new PostgresStore({
      pool: this.pool,
      tableName: 'session',
      createTableIfMissing: true
    })
  }

  async initialize(): Promise<void> {
    try {
      await migrate()
      await seedInitialData()
      console.log('Database initialized successfully')
    } catch (error) {
      console.error('Error initializing database:', error)
      throw error
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    const result = await this.pool.query('SELECT * FROM users WHERE id = $1', [id])
    return result.rows[0]
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.pool.query('SELECT * FROM users WHERE username = $1', [username])
    return result.rows[0]
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await this.pool.query('SELECT * FROM users WHERE email = $1', [email])
    return result.rows[0]
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const result = await this.pool.query('SELECT * FROM users WHERE google_id = $1', [googleId])
    return result.rows[0]
  }

  async createUser(user: InsertUser): Promise<User> {
    const fields = Object.keys(user)
    const values = fields.map(field => user[field as keyof InsertUser])
    const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ')
    const columns = fields.map(field =>
      field === 'googleId' ? 'google_id' :
      field === 'profilePicture' ? 'profile_picture' :
      field === 'displayName' ? 'display_name' : field
    ).join(', ')
    const query = `INSERT INTO users (${columns}) VALUES (${placeholders}) RETURNING *`
    const result = await this.pool.query(query, values)
    return result.rows[0]
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    if (Object.keys(userData).length === 0) return await this.getUser(id)

    const fields = Object.keys(userData)
    const values = fields.map(field => userData[field as keyof InsertUser])
    const setClause = fields.map((field, i) => {
      const column =
        field === 'googleId' ? 'google_id' :
        field === 'profilePicture' ? 'profile_picture' :
        field === 'displayName' ? 'display_name' : field
      return `${column} = $${i + 1}`
    }).join(', ')

    const query = `UPDATE users SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`
    const result = await this.pool.query(query, [...values, id])
    return result.rows[0]
  }

  async getAssessments(): Promise<Assessment[]> {
    const result = await this.pool.query('SELECT * FROM assessments ORDER BY id')
    return result.rows
  }

  async getAssessmentByType(type: string): Promise<Assessment | undefined> {
    const result = await this.pool.query('SELECT * FROM assessments WHERE type = $1', [type])
    return result.rows[0]
  }

  async createAssessment(assessment: InsertAssessment): Promise<Assessment> {
    const result = await this.pool.query(
      `INSERT INTO assessments (type, title, description, duration, icon)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        assessment.type,
        assessment.title,
        assessment.description,
        assessment.duration,
        assessment.icon
      ]
    )
    return result.rows[0]
  }

  async getQuestionsByAssessmentType(assessmentType: string): Promise<Question[]> {
    const result = await this.pool.query(
      'SELECT * FROM questions WHERE assessment_type = $1 ORDER BY "order"',
      [assessmentType]
    )
    return result.rows
  }

  async createQuestion(question: InsertQuestion): Promise<Question> {
    const result = await this.pool.query(
      `INSERT INTO questions (assessment_type, text, options, "order", category)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        question.assessmentType,
        question.text,
        question.options,
        question.order,
        question.category
      ]
    )
    return result.rows[0]
  }

  async getResultById(id: number): Promise<Result | undefined> {
    const result = await this.pool.query('SELECT * FROM results WHERE id = $1', [id])
    return result.rows[0]
  }

  async getResultsByUserId(userId: number): Promise<Result[]> {
    const result = await this.pool.query(
      'SELECT * FROM results WHERE user_id = $1 ORDER BY completed_at DESC',
      [userId]
    )
    return result.rows
  }

  async getResultsByAssessmentType(assessmentType: string): Promise<Result[]> {
    const result = await this.pool.query(
      'SELECT * FROM results WHERE assessment_type = $1 ORDER BY completed_at DESC',
      [assessmentType]
    )
    return result.rows
  }

  async createResult(result: InsertResult): Promise<Result> {
    console.log('Creating result with:', {
      userId: result.userId,
      assessmentType: result.assessmentType,
      score: result.score,
      answers: result.answers,
      categories: result.categories,
      completedAt: result.completedAt
    })

    const queryResult = await this.pool.query(
      `INSERT INTO results (user_id, assessment_type, score, answers, categories, completed_at)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        result.userId,
        result.assessmentType,
        result.score,
        JSON.stringify(result.answers),
        JSON.stringify(result.categories),
        result.completedAt || new Date()
      ]
    )
    return queryResult.rows[0]
  }

  async getRecommendationsByAssessmentType(assessmentType: string): Promise<Recommendation[]> {
    const result = await this.pool.query(
      'SELECT * FROM recommendations WHERE assessment_type = $1',
      [assessmentType]
    )
    return result.rows
  }

  async getRecommendationsByCategory(category: string): Promise<Recommendation[]> {
    const result = await this.pool.query(
      'SELECT * FROM recommendations WHERE category = $1',
      [category]
    )
    return result.rows
  }

  async getRecommendationsByCategoryAndScore(category: string, score: number): Promise<Recommendation[]> {
    const result = await this.pool.query(
      `SELECT * FROM recommendations WHERE category = $1 AND min_score <= $2 AND max_score >= $2`,
      [category, score]
    )
    return result.rows
  }

  async createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation> {
    const result = await this.pool.query(
      `INSERT INTO recommendations (assessment_type, category, title, description, tips, min_score, max_score, priority)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
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
    )
    return result.rows[0]
  }
}
