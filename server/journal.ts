import { Router, Request, Response } from "express";
import { z } from "zod";
import { IStorage } from "./storage";

export function journalRouter(storage: IStorage) {
  const router = Router();

  const journalSchema = z.object({
    entry: z.string().min(1, "Entry cannot be empty"),
  });

  // Middleware to ensure user is authenticated
  const requireAuth = (req: Request, res: Response, next: () => void) => {
    if (!req.isAuthenticated?.() || !req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    next();
  };

  // Create journal entry
  router.post("/", requireAuth, async (req: Request, res: Response) => {
    const parsed = journalSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }

    const userId = req.user.id;
    const { entry } = parsed.data;

    try {
      await storage.createJournalEntry(userId, entry);
      res.status(201).json({ message: "Journal entry saved" });
    } catch (err) {
      console.error("Error saving journal entry:", err);
      res.status(500).json({ error: "Failed to save journal entry" });
    }
  });

  // Get journal entries
  router.get("/", requireAuth, async (req: Request, res: Response) => {
    const userId = req.user.id;

    try {
      const entries = await storage.getJournalEntries(userId);
      res.json(entries);
    } catch (err) {
      console.error("Error fetching journal entries:", err);
      res.status(500).json({ error: "Failed to fetch journal entries" });
    }
  });

  return router;
}
