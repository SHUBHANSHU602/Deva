import type { NextFunction, Request, Response } from "express";

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export function submissionRateLimit(req: Request, res: Response, next: NextFunction): void {
  const key = req.ip || "local";
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + 60_000 });
    next();
    return;
  }

  if (existing.count >= 24) {
    res.status(429).json({ error: "Too many judge requests. Wait a minute and try again." });
    return;
  }

  existing.count += 1;
  next();
}
