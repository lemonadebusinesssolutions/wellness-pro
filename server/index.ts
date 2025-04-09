import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { DbStorage } from "./db-storage";

const app = express();

const allowedOrigins = [
  "https://wellnesspro1.onrender.com",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJson: Record<string, any> | undefined;

  if (path.startsWith("/api")) {
    res.setHeader("Cache-Control", "no-store");
  }

  const originalJson = res.json;
  res.json = function (body, ...args) {
    capturedJson = body;
    return originalJson.apply(res, [body, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJson) logLine += ` :: ${JSON.stringify(capturedJson)}`;
      if (logLine.length > 100) logLine = logLine.slice(0, 99) + "…";
      log(logLine);
    }
  });

  next();
});

(async () => {
  const storage = new DbStorage();
  await storage.initialize();

  // 👇 Pass full storage to route loader
  await registerRoutes(app, storage);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    console.error("🔥 Unhandled server error:", err);
  });

  const port = process.env.PORT || 5000;
  const server = app.listen(port, () => log(`🚀 Server running on port ${port}`));

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
})();
