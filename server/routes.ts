import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { setupAuth } from "./auth";
import { IStorage } from "./storage";
import { calculateScoreAndCategories } from "./utils/quiz-utils";

export async function registerRoutes(app: Express, storage: IStorage): Promise<Express> {
  console.log("✅ Routes: Initialized");

  app.use(
    session({
      secret: process.env.SESSION_SECRET || "mysecret",
      resave: false,
      saveUninitialized: false,
      store: storage.sessionStore,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 30,
      },
    })
  );

  await setupAuth(app, storage);

  app.get("/api/assessments", async (_req, res, next) => {
    try {
      const assessments = await storage.getAssessments();
      res.json(assessments);
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/assessments/:type", async (req, res, next) => {
    try {
      const { type } = req.params;
      const assessment = await storage.getAssessmentByType(type);
      if (!assessment) {
        return res.status(404).json({ error: "Assessment not found" });
      }
      res.json(assessment);
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/questions/:type", async (req, res, next) => {
    try {
      const questions = await storage.getQuestionsByAssessmentType(req.params.type);
      if (!questions || questions.length === 0) {
        return res.status(404).json({ error: "No questions found" });
      }
      res.json(questions);
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/result/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      const dbResult = await storage.getResultById(id);

      if (!dbResult) {
        return res.status(404).json({ error: "Result not found" });
      }

      // Normalize categories
      let categoryList: string[] = [];
      if (typeof dbResult.categories === "string") {
        try {
          const parsed = JSON.parse(dbResult.categories);
          categoryList = Object.keys(parsed);
        } catch {
          categoryList = [];
        }
      } else if (typeof dbResult.categories === "object" && dbResult.categories !== null) {
        categoryList = Object.keys(dbResult.categories);
      }

      const recommendations = await storage.getRecommendationsByAssessmentType(
        dbResult.assessmentType,
        dbResult.score
      );

      res.json({
        result: {
          id: dbResult.id,
          userId: dbResult.userId,
          assessmentType: dbResult.assessmentType,
          score: dbResult.score,
          answers: dbResult.answers,
          categories: categoryList,
          completedAt: dbResult.completedAt,
        },
        recommendations,
      });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/submit-quiz", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { assessmentType, answers, userId } = req.body;

      const questions = await storage.getQuestionsByAssessmentType(assessmentType);
      if (!questions || questions.length === 0) {
        return res.status(400).json({ error: "Invalid assessment type or no questions" });
      }

      const { score, categories } = calculateScoreAndCategories(questions, answers);

      const result = await storage.createResult({
        userId,
        assessmentType,
        answers,
        score,
        categories,
        completedAt: new Date(),
      });

      res.status(201).json({ result });
    } catch (err) {
      next(err);
    }
  });

  return app;
}
