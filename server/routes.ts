import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { setupAuth } from "./auth";
import { IStorage } from "./storage";
import { calculateScoreAndCategories } from "./utils/quiz-utils";
import { journalRouter } from "./journal"; // ✅ ADDED

export async function registerRoutes(app: Express, storage: IStorage): Promise<Express> {
  console.log("✅ Routes: Initialized");

  // 🔐 Session middleware...
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

  // 🔐 Authentication setup
  await setupAuth(app, storage);

  // 📝 Journal routes
  app.use("/api/journal", journalRouter(storage)); // ✅ ADDED

  // 📡 All assessments
  app.get("/api/assessments", async (_req, res, next) => {
    try {
      const assessments = await storage.getAssessments();
      res.json(assessments);
    } catch (err) {
      next(err);
    }
  });

  // 📡 Single assessment
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

  // ❓ Questions by type
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

  // 📊 Result by ID
  app.get("/api/result/:id", async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      const raw = await storage.getResultById(id);

      if (!raw) {
        return res.status(404).json({ error: "Result not found" });
      }

      let categoryList: string[] = [];
      if (typeof raw.categories === "string") {
        try {
          const parsed = JSON.parse(raw.categories);
          categoryList = Object.keys(parsed);
        } catch {
          categoryList = [];
        }
      } else if (typeof raw.categories === "object" && raw.categories !== null) {
        categoryList = Object.keys(raw.categories);
      }

      const recommendations = await storage.getRecommendationsByAssessmentType(
        raw.assessment_type,
        raw.score
      );

      res.json({
        result: {
          id: raw.id,
          userId: raw.user_id,
          assessmentType: raw.assessment_type,
          score: raw.score,
          answers: raw.answers,
          categories: categoryList,
          completedAt: raw.completed_at,
        },
        recommendations,
      });
    } catch (err) {
      next(err);
    }
  });

  // 📝 Submit Quiz
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
