import {
  User, InsertUser,
  Assessment, InsertAssessment,
  Question, InsertQuestion,
  Result, InsertResult,
  Recommendation, InsertRecommendation
} from '@shared/schema';
import { IStorage } from './storage';
import pg from 'pg';
import { migrate, seedInitialData, pool } from './db';
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
    await migrate();
    await seedInitialData();
    console.log("\ud83d\udce6 Database initialized");
  }

  // ───── USER ─────
  async getUser(id: number) {
    const { rows } = await this.pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return rows[0];
  }

  async getUserByUsername(username: string) {
    const { rows } = await this.pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return rows[0];
  }

  async getUserByEmail(email: string) {
    const { rows } = await this.pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0];
  }

  async getUserByGoogleId(googleId: string) {
    const { rows } = await this.pool.query('SELECT * FROM users WHERE google_id = $1', [googleId]);
    return rows[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const fields = Object.keys(user);
    const values = fields.map(field => user[field as keyof InsertUser]);
    const columns = fields.map(field =>
      field === "googleId" ? "google_id" :
      field === "displayName" ? "display_name" :
      field === "profilePicture" ? "profile_picture" : field
    ).join(", ");
    const placeholders = fields.map((_, i) => `$${i + 1}`).join(", ");

    const { rows } = await this.pool.query(
      `INSERT INTO users (${columns}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    return rows[0];
  }

  async updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined> {
    if (Object.keys(data).length === 0) return this.getUser(id);

    const keys = Object.keys(data);
    const values = keys.map(k => data[k as keyof InsertUser]);
    const updates = keys.map((key, i) => {
      const col =
        key === "googleId" ? "google_id" :
        key === "displayName" ? "display_name" :
        key === "profilePicture" ? "profile_picture" : key;
      return `${col} = $${i + 1}`;
    }).join(", ");

    const query = `UPDATE users SET ${updates} WHERE id = $${keys.length + 1} RETURNING *`;
    const { rows } = await this.pool.query(query, [...values, id]);
    return rows[0];
  }

  // ───── SESSION ─────
  async getAssessments() {
    const { rows } = await this.pool.query('SELECT * FROM assessments ORDER BY id');
    return rows;
  }

  async getAssessmentByType(type: string) {
    const { rows } = await this.pool.query('SELECT * FROM assessments WHERE type = $1', [type]);
    return rows[0];
  }

  async createAssessment(a: InsertAssessment) {
    const { rows } = await this.pool.query(
      `INSERT INTO assessments (type, title, description, duration, icon)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [a.type, a.title, a.description, a.duration, a.icon]
    );
    return rows[0];
  }

  async getQuestionsByAssessmentType(type: string) {
    const { rows } = await this.pool.query(
      'SELECT * FROM questions WHERE assessment_type = $1 ORDER BY "order"',
      [type]
    );
    return rows;
  }

  async createQuestion(q: InsertQuestion) {
    const { rows } = await this.pool.query(
      `INSERT INTO questions (assessment_type, text, options, "order", category)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [q.assessmentType, q.text, q.options, q.order, q.category]
    );
    return rows[0];
  }

  async getResultById(id: number) {
    const { rows } = await this.pool.query('SELECT * FROM results WHERE id = $1', [id]);
    return rows[0];
  }

  async getResultsByUserId(userId: number) {
    const { rows } = await this.pool.query(
      'SELECT * FROM results WHERE user_id = $1 ORDER BY completed_at DESC',
      [userId]
    );
    return rows;
  }

  async getResultsByAssessmentType(type: string) {
    const { rows } = await this.pool.query(
      'SELECT * FROM results WHERE assessment_type = $1 ORDER BY completed_at DESC',
      [type]
    );
    return rows;
  }

  async createResult(r: InsertResult) {
    const { rows } = await this.pool.query(
      `INSERT INTO results (user_id, assessment_type, score, answers, categories, completed_at)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        r.userId,
        r.assessmentType,
        r.score,
        JSON.stringify(r.answers),
        JSON.stringify(r.categories),
        r.completedAt || new Date()
      ]
    );
    return rows[0];
  }

  async getRecommendationsByAssessmentType(type: string, score: number) {
    const { rows } = await this.pool.query(
      `SELECT * FROM recommendations
       WHERE assessment_type = $1 AND $2 BETWEEN min_score AND max_score
       ORDER BY priority ASC`,
      [type, score]
    );
    return rows;
  }

  async getRecommendationsByCategory(category: string) {
    const { rows } = await this.pool.query(
      `SELECT * FROM recommendations WHERE category = $1`,
      [category]
    );
    return rows;
  }

  async getRecommendationsByCategoryAndScore(category: string, score: number) {
    const { rows } = await this.pool.query(
      `SELECT * FROM recommendations WHERE category = $1 AND $2 BETWEEN min_score AND max_score`,
      [category, score]
    );
    return rows;
  }

  async createRecommendation(rec: InsertRecommendation) {
    const { rows } = await this.pool.query(
      `INSERT INTO recommendations (assessment_type, category, title, description, tips, min_score, max_score, priority)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        rec.assessmentType,
        rec.category,
        rec.title,
        rec.description,
        rec.tips,
        rec.minScore,
        rec.maxScore,
        rec.priority
      ]
    );
    return rows[0];
  }

  async createJournalEntry(userId: number, entry: string): Promise<void> {
    await this.pool.query(
      `INSERT INTO journal (user_id, entry, created_at) VALUES ($1, $2, NOW())`,
      [userId, entry]
    );
  }

  async getJournalEntries(userId: number): Promise<{ id: number; entry: string; createdAt: Date }[]> {
    const { rows } = await this.pool.query(
      `SELECT id, entry, created_at as "createdAt" FROM journal WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    return rows;
  }
}
