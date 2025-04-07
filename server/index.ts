//start of code
import express, { Request, Response, NextFunction } from "express"
import cors from "cors"
import { registerRoutes } from "./routes"
import { setupVite, serveStatic, log } from "./vite"

const app = express()

const allowedOrigins = [
  "https://wellnesspro1.onrender.com",
  "http://localhost:5173",
]

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now()
  const path = req.path
  let capturedJson: Record<string, any> | undefined

  const originalResJson = res.json
  res.json = function (bodyJson, ...args) {
    capturedJson = bodyJson
    return originalResJson.apply(res, [bodyJson, ...args])
  }

  res.on("finish", () => {
    const duration = Date.now() - start
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`
      if (capturedJson) logLine += ` :: ${JSON.stringify(capturedJson)}`
      if (logLine.length > 80) logLine = logLine.slice(0, 79) + "…"
      log(logLine)
    }
  })

  next()
})

;(async () => {
  await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    console.error("Unhandled server error:", err);
  });

  const port = process.env.PORT || 5000;
  const server = app.listen(port, () => log(`serving on port ${port}`));

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
})();

