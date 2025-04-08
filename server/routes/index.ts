import express, { Express, Request, Response, NextFunction } from "express"
import session from "express-session"
import MySQLStoreFactory from "express-mysql-session"
import { setupAuth } from "../auth"
import { pool } from "../db"
import { IStorage } from "../storage"

const MySQLStore = MySQLStoreFactory(session)

export async function registerRoutes(app: Express) {
  const sessionStore = new MySQLStore({}, pool as any)

  const storage: IStorage = {
    getUser: async (id) => {
      const [rows]: any = await pool.query("SELECT * FROM users WHERE id = ?", [id])
      return Array.isArray(rows) && rows.length > 0 ? rows[0] : undefined
    },
    getUserByEmail: async (email) => {
      const [rows]: any = await pool.query("SELECT * FROM users WHERE email = ?", [email])
      return Array.isArray(rows) && rows.length > 0 ? rows[0] : undefined
    },
    getUserByUsername: async (username) => {
      const [rows]: any = await pool.query("SELECT * FROM users WHERE username = ?", [username])
      return Array.isArray(rows) && rows.length > 0 ? rows[0] : undefined
    },
    createUser: async ({ username, email, password }) => {
      const [result]: any = await pool.query(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, password]
      )
      const [rows]: any = await pool.query("SELECT * FROM users WHERE id = ?", [result.insertId])
      return Array.isArray(rows) && rows.length > 0 ? rows[0] : undefined
    },
    sessionStore,

    // Filler methods to satisfy IStorage
    getUserByGoogleId: async () => null,
    updateUser: async (user) => user,
    getAssessments: async () => [],
    getAssessmentByType: async () => null,
    getResultById: async () => null,
    createResult: async () => null,
    getRecommendations: async () => [],
    getRecommendationsByType: async () => [],
    getRecommendationsByCategory: async () => [],
    getRecommendationsByScoreRange: async () => [],
    createFeedback: async () => null,
    getAllUsers: async () => [],
  }

  await setupAuth(app, storage)

  // ------------------------
  // Route: GET /api/result/:id
  // ------------------------
  app.get("/api/result/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resultId = parseInt(req.params.id, 10)
      const [results]: any = await pool.query("SELECT * FROM results WHERE id = ?", [resultId])

      if (!Array.isArray(results) || results.length === 0) {
        return res.status(404).json({ error: "Result not found" })
      }

      const result = results[0]

      // Parse categories from JSON string
      if (typeof result.categories === "string") {
        try {
          const parsed = JSON.parse(result.categories)
          result.categories = Object.keys(parsed)
        } catch {
          result.categories = []
        }
      }

      // Fix column name from assessmentType to assessment_type
      const [recs]: any = await pool.query(
        "SELECT * FROM recommendations WHERE assessment_type = ?",
        [result.assessmentType]
      )

      res.json({
        result,
        recommendations: recs,
      })
    } catch (err) {
      next(err)
    }
  })

  return app
}
