import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import session from "express-session";
import pg from "pg";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
const PostgresStore = connectPgSimple(session);

// ---------------------------
// CORS Middleware
// ---------------------------
app.use(cors({
  origin: "https://wellnesspro1.onrender.com", // Match your frontend URL exactly
  credentials: true,
}));

// ---------------------------
// Body Parsers
// ---------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ---------------------------
// Session Middleware
// ---------------------------
app.use(session({
  store: new PostgresStore({
    pool: pool,
    tableName: "session",
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET || "default-session-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax", // Important for cross-origin cookie handling
    secure: true,     // Required for HTTPS
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week.
  },
}));

// ---------------------------
// Logging Middleware
// ---------------------------
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

// ---------------------------
// Main Async Setup
// ---------------------------
(async () => {
  const server = await registerRoutes(app);

  // Error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    console.error("Unhandled server error:", err);
  });

  // Dev server with Vite
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Start server
  const port = 5000;
  server.listen({ port, host: "0.0.0.0", reusePort: true }, () => {
    log(`serving on port ${port}`);
  });
})();
