//start of code
import express, { Express, Request, Response, NextFunction } from "express"
import session from "express-session"
import { setupAuth } from "../auth"
import { IStorage } from "../storage"

export async function registerRoutes(app: Express, storage: IStorage) {
  // Attach session middleware
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
  )

  // Attach auth routes
  await setupAuth(app, storage)

  // Route: GET /api/result/:id
  app.get("/api/result/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resultId = parseInt(req.params.id, 10)
      const result = await storage.getResultById(resultId)

      if (!result) {
        return res.status(404).json({ error: "Result not found" })
      }

      // Parse categories into list if it's an object
      if (typeof result.categories === "string") {
        try {
          const parsed = JSON.parse(result.categories)
          result.categories = Object.keys(parsed)
        } catch {
          result.categories = []
        }
      } else if (typeof result.categories === "object" && result.categories !== null) {
        result.categories = Object.keys(result.categories)
      } else {
        result.categories = []
      }

      const recommendations = await storage.getRecommendationsByAssessmentType(result.assessmentType)
      res.json({ result, recommendations })
    } catch (err) {
      next(err)
    }
  })

  return app
}
//end of code.
