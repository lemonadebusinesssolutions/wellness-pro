import type { Express } from "express";
import { createServer, type Server } from "http";
import { DbStorage } from "./storage";
import { pool } from "./db";
import { setupAuth } from "./auth";
import { z } from "zod";
import { submitQuizSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// Initialize storage
const storage = new DbStorage();

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize storage with seed data
  await storage.initialize();
  
  // Set up authentication
  await setupAuth(app, storage);

  // Get all assessments
  app.get("/api/assessments", async (req, res) => {
    try {
      const assessments = await storage.getAssessments();
      
      // Create a map to store unique assessments by type
      const uniqueAssessmentMap = new Map();
      
      // Only keep the first occurrence of each assessment type
      assessments.forEach(assessment => {
        if (!uniqueAssessmentMap.has(assessment.type)) {
          uniqueAssessmentMap.set(assessment.type, assessment);
        }
      });
      
      // Convert map back to array
      const uniqueAssessments = Array.from(uniqueAssessmentMap.values());
      
      res.json(uniqueAssessments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assessments" });
    }
  });

  // Get assessment by type
  app.get("/api/assessments/:type", async (req, res) => {
    try {
      const assessmentType = req.params.type;
      const assessment = await storage.getAssessmentByType(assessmentType);
      
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }
      
      res.json(assessment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assessment" });
    }
  });

  // Get questions for an assessment
  app.get("/api/questions/:assessmentType", async (req, res) => {
    try {
      const assessmentType = req.params.assessmentType;
      const questions = await storage.getQuestionsByAssessmentType(assessmentType);
      
      if (questions.length === 0) {
        return res.status(404).json({ message: "Questions not found for this assessment type" });
      }
      
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch questions" });
    }
  });

  // Submit quiz answers and get result
  app.post("/api/submit-quiz", async (req, res) => {
    try {
      // Validate request body
      const payload = submitQuizSchema.parse(req.body);
      
      // Get questions for this assessment
      const questions = await storage.getQuestionsByAssessmentType(payload.assessmentType);
      
      if (questions.length === 0) {
        return res.status(404).json({ message: "Questions not found for this assessment type" });
      }
      
      // Check if we have the right number of answers
      if (payload.answers.length !== questions.length) {
        return res.status(400).json({ 
          message: `Invalid number of answers. Expected ${questions.length}, got ${payload.answers.length}` 
        });
      }
      
      // Calculate overall score (scale: 0-100)
      // For inverse scoring questions, we'd need to handle that here
      const maxPossibleScore = questions.length * 5;
      const actualScore = payload.answers.reduce((sum, value) => sum + value, 0);
      const normalizedScore = Math.round((actualScore / maxPossibleScore) * 100);
      
      // Calculate category scores
      // This is a simplified implementation - in a real app we would map questions to categories
      const categories: Record<string, number> = {};
      
      if (payload.assessmentType === 'stress') {
        categories["Work Pressure"] = calculateCategoryScore(payload.answers.slice(0, 3));
        categories["Life Balance"] = calculateCategoryScore(payload.answers.slice(3, 5));
        categories["Sleep Quality"] = calculateCategoryScore(payload.answers.slice(5, 7));
        categories["Social Support"] = calculateCategoryScore(payload.answers.slice(7, 10));
      } else if (payload.assessmentType === 'workplace') {
        categories["Work-Life Balance"] = calculateCategoryScore(payload.answers.slice(0, 2));
        categories["Workplace Support"] = calculateCategoryScore(payload.answers.slice(2, 4));
        categories["Job Clarity"] = calculateCategoryScore(payload.answers.slice(4, 7));
        categories["Workload Management"] = calculateCategoryScore(payload.answers.slice(7, 10));
      } else if (payload.assessmentType === 'digital') {
        categories["Screen Time"] = calculateCategoryScore(payload.answers.slice(0, 3));
        categories["Digital Boundaries"] = calculateCategoryScore(payload.answers.slice(3, 6));
        categories["Social Media"] = calculateCategoryScore(payload.answers.slice(6, 10));
      }
      
      // Save result
      const result = await storage.createResult({
        userId: payload.userId,
        assessmentType: payload.assessmentType,
        score: normalizedScore,
        answers: payload.answers,
        categories,
        completedAt: new Date()
      });
      
      // Get recommendations based on categories and scores
      const allRecommendations = await storage.getRecommendationsByAssessmentType(payload.assessmentType);
      
      // Filter recommendations based on category scores
      const recommendations = Object.entries(categories).flatMap(([category, score]) => {
        return allRecommendations.filter(rec => 
          rec.category === category && 
          score >= rec.minScore && 
          score <= rec.maxScore
        );
      });
      
      // Return result with recommendations
      res.json({
        result,
        recommendations
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error(error);
      res.status(500).json({ message: "Failed to process quiz submission" });
    }
  });

  // Get all results for a user
  app.get("/api/results/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const results = await storage.getResultsByUserId(userId);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch results" });
    }
  });

  // Get specific result by ID
  app.get("/api/result/:resultId", async (req, res) => {
    try {
      const resultId = parseInt(req.params.resultId);
      
      if (isNaN(resultId)) {
        return res.status(400).json({ message: "Invalid result ID" });
      }
      
      const result = await storage.getResultById(resultId);
      
      if (!result) {
        return res.status(404).json({ message: "Result not found" });
      }
      
      // Get recommendations for this result
      const allRecommendations = await storage.getRecommendationsByAssessmentType(result.assessmentType);
      
      // Filter recommendations based on category scores
      const recommendations = Object.entries(result.categories as Record<string, number>).flatMap(([category, score]) => {
        return allRecommendations.filter(rec => 
          rec.category === category && 
          score >= rec.minScore && 
          score <= rec.maxScore
        );
      });
      
      res.json({
        result,
        recommendations
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch result" });
    }
  });

  // Get latest results for each assessment type (for dashboard)
  app.get("/api/latest-results/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const userResults = await storage.getResultsByUserId(userId);
      
      // Get all assessment types
      const assessments = await storage.getAssessments();
      const assessmentTypes = Array.from(new Set(assessments.map(a => a.type)));
      
      // Group by assessment type and get the latest for each
      const latestResults = assessmentTypes.map(type => {
        const results = userResults.filter(r => r.assessmentType === type);
        return results.length > 0 ? results[0] : null;
      }).filter(Boolean);
      
      res.json(latestResults);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch latest results" });
    }
  });

  // Get top recommendations across all assessments
  app.get("/api/top-recommendations/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const userResults = await storage.getResultsByUserId(userId);
      
      if (userResults.length === 0) {
        return res.json([]);
      }
      
      // Collect all recommendations
      const allRecommendations = [];
      
      for (const result of userResults) {
        const recommendationsForResult = await storage.getRecommendationsByAssessmentType(result.assessmentType);
        
        // Filter based on category scores
        const filteredRecs = Object.entries(result.categories as Record<string, number>).flatMap(([category, score]) => {
          return recommendationsForResult.filter(rec => 
            rec.category === category && 
            score >= rec.minScore && 
            score <= rec.maxScore
          ).map(rec => ({
            ...rec,
            assessmentType: result.assessmentType,
            score
          }));
        });
        
        allRecommendations.push(...filteredRecs);
      }
      
      // Sort by priority (High > Medium > Low)
      const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
      const sortedRecommendations = allRecommendations.sort((a, b) => {
        return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
      });
      
      // Take top 3-5 recommendations
      const topRecommendations = sortedRecommendations.slice(0, 5);
      
      res.json(topRecommendations);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch top recommendations" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to calculate category score (0-100)
function calculateCategoryScore(answers: number[]): number {
  if (answers.length === 0) return 0;
  
  const maxPossibleScore = answers.length * 5;
  const actualScore = answers.reduce((sum, value) => sum + value, 0);
  return Math.round((actualScore / maxPossibleScore) * 100);
}
