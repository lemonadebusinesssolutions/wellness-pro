import { pgTable, text, serial, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password"),
  googleId: text("google_id").unique(),
  profilePicture: text("profile_picture"),
  displayName: text("display_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  googleId: true,
  profilePicture: true,
  displayName: true,
});

export const loginUserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type User = typeof users.$inferSelect;

// Assessment types
export const assessmentTypes = [
  'stress', 
  'workplace', 
  'digital', 
  'happiness', 
  'physical_wellbeing', 
  'emotional_wellbeing', 
  'social_connection', 
  'sleep_quality', 
  'mindfulness', 
  'self_compassion', 
  'financial_wellbeing', 
  'life_purpose', 
  'resilience', 
  'nutrition', 
  'physical_activity'
] as const;
export type AssessmentType = typeof assessmentTypes[number];

// Assessment schema
export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  duration: text("duration"),
  icon: text("icon"),
});

export const insertAssessmentSchema = createInsertSchema(assessments).pick({
  type: true,
  title: true,
  description: true,
  duration: true,
  icon: true,
});

export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessments.$inferSelect;

// Question schema
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  assessmentType: text("assessment_type").notNull(),
  text: text("text").notNull(),
  options: jsonb("options").notNull(),
  order: integer("order").notNull(),
  category: text("category").notNull(),
});

export const insertQuestionSchema = createInsertSchema(questions).pick({
  assessmentType: true,
  text: true,
  options: true,
  order: true,
  category: true,
});

export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;

// User assessment result schema
export const results = pgTable("results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  assessmentType: text("assessment_type").notNull(),
  score: integer("score").notNull(),
  answers: jsonb("answers").notNull(),
  categories: jsonb("categories").notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

export const insertResultSchema = createInsertSchema(results).pick({
  userId: true,
  assessmentType: true,
  score: true,
  answers: true,
  categories: true,
  completedAt: true,
});

export type InsertResult = z.infer<typeof insertResultSchema>;
export type Result = typeof results.$inferSelect;

export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  assessmentType: text("assessment_type").notNull(),
  category: text("category").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  tips: jsonb("tips").notNull(),
  minScore: integer("min_score").notNull(),
  maxScore: integer("max_score").notNull(),
  priority: text("priority").notNull(),
});

export const insertRecommendationSchema = createInsertSchema(recommendations).pick({
  assessmentType: true,
  category: true,
  title: true,
  description: true,
  tips: true,
  minScore: true,
  maxScore: true,
  priority: true,
});

export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;
export type Recommendation = typeof recommendations.$inferSelect;

// Zod schema for submitting quiz answers
export const submitQuizSchema = z.object({
  assessmentType: z.enum(assessmentTypes),
  answers: z.array(z.number().min(1).max(5)),
  userId: z.number().optional(),
});

export type SubmitQuizPayload = z.infer<typeof submitQuizSchema>;
