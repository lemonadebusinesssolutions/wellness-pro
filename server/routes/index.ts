import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { setupAuth } from "../auth";
import { IStorage } from "../storage";

export async function registerRoutes(app: Express, storage: IStorage): Promise<Express> {
  console.log("✅ Routes: Initialized");

  // 🔐 Session configuration
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

  // 📘 GET /api/questions/:type
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

  return app;
}
