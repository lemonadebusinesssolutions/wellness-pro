import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { setupAuth } from "./auth";
import { IStorage } from "./storage";
import { calculateScoreAndCategories } from "./utils/quiz-utils";

export async function registerRoutes(app: Express, storage: IStorage): Promise<Express> {
  console.log("✅ Routes: Initialized");

  // 🔐 Session middleware
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
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      },
    })
  );

  // 🔐 Auth setup
  await setupAuth(app, storage);

  // 📡 GET /api/assessments
  app.get("/api/assessments", async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const assessments = await storage.getAssessments();
      res.json(assessments);
    } catch (err) {
      console.error("❌ Error: /api/assessments", err);
      next(err);
    }
  });

  // 📡 GET /api/assessments/:type
  app.get("/api/assessments/:type", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.params;
      const assessment = await storage.getAssessmentByType(type);
      if (!assessment) {
        return res.status(404).json({ error: "Assessment not found" });
      }
      res.json(assessment);
    } catch (err) {
      console.error("❌ Error: /api/assessments/:type", err);
      next(err);
    }
  });

  // 📊 GET /api/result/:id
  app.get("/api/result/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await storage.getResultById(id);
      if (!result) {
        return res.status(404).json({ error: "Result not found" });
      }

      // 🧠 Normalize categories
      if (typeof result.categories === "string") {
        try {
          const parsed = JSON.parse(result.categories);
          result.categories = Object.keys(parsed);
        } catch {
          result.categories = [];
        }
      } else if (typeof result.categories === "object" && result.categories !== null) {
        result.categories = Object.keys(result.categories);
      } else {
        result.categories = [];
      }

      const recommendations = await storage.getRecommendationsByAssessmentType(result.assessmentType);
      res.json({ result, recommendations });
    } catch (err) {
      console.error("❌ Error: /api/result/:id", err);
      next(err);
    }
  });

  // ❓ GET /api/questions/:type
  app.get("/api/questions/:type", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const type = req.params.type;
      const questions = await storage.getQuestionsByAssessmentType(type);
      if (!questions || questions.length === 0) {
        return res.status(404).json({ error: "No questions found for this assessment type" });
      }
      res.json(questions);
    } catch (err) {
      console.error("❌ Error: /api/questions/:type", err);
      next(err);
    }
  });

  // 🧾 POST /api/submit-quiz
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
      console.error("❌ Error: /api/submit-quiz", err);
      next(err);
    }
  });

  return app;
}
