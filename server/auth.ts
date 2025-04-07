import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import { Express, Request, Response, NextFunction } from "express"
import session from "express-session"
import bcrypt from "bcrypt"
import { IStorage } from "./storage"
import { User, loginUserSchema } from "@shared/schema"
import { z } from "zod"

declare global {
  namespace Express {
    interface User {
      id: number
      username: string
      email: string
      password?: string
      googleId?: string
      profilePicture?: string
      displayName?: string
      createdAt?: Date
    }
  }
}

const SESSION_SECRET = process.env.SESSION_SECRET || "wellbeing-app-secret"
const IS_PROD = process.env.NODE_ENV === "production"

export async function setupAuth(app: Express, storage: IStorage) {
  app.use(
    session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: storage.sessionStore,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
        secure: IS_PROD,
        sameSite: IS_PROD ? "none" : "lax",
      },
    })
  )

  app.use((req, _res, next) => {
    console.log("Session at middleware:", req.session);
    next();
  });

  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email)
          if (!user) return done(null, false, { message: "Invalid email or password." })

          const isValid = await bcrypt.compare(password, user.password || "")
          if (!isValid) return done(null, false, { message: "Invalid email or password." })

          return done(null, {
            id: user.id,
            username: user.username ?? "",
            email: user.email,
            password: user.password ?? undefined,
            googleId: user.googleId ?? undefined,
            profilePicture: user.profilePicture ?? undefined,
            displayName: user.displayName ?? undefined,
            createdAt: user.createdAt ?? undefined,
          })
        } catch (err) {
          return done(err)
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id)
      if (!user) return done(null, false)

      done(null, {
        id: user.id,
        username: user.username ?? "",
        email: user.email,
        password: user.password ?? undefined,
        googleId: user.googleId ?? undefined,
        profilePicture: user.profilePicture ?? undefined,
        displayName: user.displayName ?? undefined,
        createdAt: user.createdAt ?? undefined,
      })
    } catch (err) {
      done(err)
    }
  })

  app.post("/api/auth/register", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const schema = loginUserSchema.extend({
        username: z.string().min(3, "Username must be at least 3 characters"),
      })

      const parsed = schema.safeParse(req.body)
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors[0].message })
      }

      const { username, email, password } = parsed.data

      if (await storage.getUserByEmail(email)) {
        return res.status(400).json({ error: "Email already in use" })
      }

      if (await storage.getUserByUsername(username)) {
        return res.status(400).json({ error: "Username already taken" })
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      const user = await storage.createUser({ username, email, password: hashedPassword })

      const cleanedUser: Express.User = {
        id: user.id,
        username: user.username ?? "",
        email: user.email,
        password: user.password ?? undefined,
        googleId: user.googleId ?? undefined,
        profilePicture: user.profilePicture ?? undefined,
        displayName: user.displayName ?? undefined,
        createdAt: user.createdAt ?? undefined,
      }

      req.login(cleanedUser, (err: Error | null) => {
        if (err) return next(err)
        const { password, ...userWithoutPassword } = cleanedUser
        res.status(201).json(userWithoutPassword)
      })
    } catch (err) {
      next(err)
    }
  })

  app.post("/api/auth/login", (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "local",
      (err: Error | null, user: Express.User | false, info: { message?: string }) => {
        if (err) return next(err)
        if (!user) return res.status(401).json({ error: info?.message || "Invalid credentials" })

        req.login(user, (err: Error | null) => {
          if (err) return next(err)
          const { password, ...userWithoutPassword } = user
          res.json(userWithoutPassword)
        })
      }
    )(req, res, next)
  })

  app.post("/api/auth/logout", (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
      if (err) return next(err)
      res.status(200).json({ message: "Logged out successfully" })
    })
  })

  app.get("/api/auth/me", (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" })
    }

    const { password, ...userWithoutPassword } = req.user as User
    res.json(userWithoutPassword)
  })
}
