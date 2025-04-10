import {
  type User, type InsertUser,
  type Assessment, type InsertAssessment,
  type Question, type InsertQuestion,
  type Result, type InsertResult,
  type Recommendation, type InsertRecommendation
} from "@shared/schema";
import session from "express-session";

export interface IStorage {
  // User
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;

  // Session
  sessionStore: session.Store;

  // Assessment
  getAssessments(): Promise<Assessment[]>;
  getAssessmentByType(type: string): Promise<Assessment | undefined>;
  createAssessment(a: InsertAssessment): Promise<Assessment>;

  // Questions
  getQuestionsByAssessmentType(type: string): Promise<Question[]>;
  createQuestion(q: InsertQuestion): Promise<Question>;

  // Results
  getResultById(id: number): Promise<Result | undefined>;
  getResultsByUserId(userId: number): Promise<Result[]>;
  getResultsByAssessmentType(type: string): Promise<Result[]>;
  createResult(r: InsertResult): Promise<Result>;

  // Recommendations
  getRecommendationsByAssessmentType(type: string, score: number): Promise<Recommendation[]>;
  getRecommendationsByCategory(category: string): Promise<Recommendation[]>;
  getRecommendationsByCategoryAndScore(category: string, score: number): Promise<Recommendation[]>;

  // Journal
  createJournalEntry(userId: number, entry: string): Promise<void>;
  getJournalEntries(userId: number): Promise<{ id: number; entry: string; createdAt: Date }[]>;

  // Setup
  initialize(): Promise<void>;
}
