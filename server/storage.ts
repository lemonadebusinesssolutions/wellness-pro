import { 
  type User, type InsertUser,
  type Assessment, type InsertAssessment,
  type Question, type InsertQuestion,
  type Result, type InsertResult,
  type Recommendation, type InsertRecommendation
} from "@shared/schema";
import { DbStorage } from './db-storage';
import session from 'express-session';

// Interface for all storage implementations
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  
  // Session store for authentication
  sessionStore: session.Store;
  
  // Assessment methods
  getAssessments(): Promise<Assessment[]>;
  getAssessmentByType(type: string): Promise<Assessment | undefined>;
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  
  // Question methods
  getQuestionsByAssessmentType(assessmentType: string): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  
  // Result methods
  getResultById(id: number): Promise<Result | undefined>;
  getResultsByUserId(userId: number): Promise<Result[]>;
  getResultsByAssessmentType(assessmentType: string): Promise<Result[]>;
  createResult(result: InsertResult): Promise<Result>;
  
  // Recommendation methods
  getRecommendationsByAssessmentType(assessmentType: string): Promise<Recommendation[]>;
  getRecommendationsByCategory(category: string): Promise<Recommendation[]>;
  getRecommendationsByCategoryAndScore(category: string, score: number): Promise<Recommendation[]>;
  createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation>;
  
  // Initialization method
  initialize(): Promise<void>;
}

// Export a PostgreSQL-based storage implementation
// We import and use DbStorage in routes.ts
export { DbStorage };