import { randomUUID } from "node:crypto";
import { Router } from "express";
import { z } from "zod";
import { getPublicCatalog, mockById, problemById, topics } from "../data/catalog.js";
import { submissionRateLimit } from "../lib/rateLimit.js";
import {
  signToken,
  verifyToken,
  type AttemptTokenPayload,
  type ReviewTokenPayload,
} from "../lib/tokens.js";
import { runSample, submitProblem } from "../services/judge.js";

const router = Router();
const codeSchema = z.string().min(20).max(50_000);

router.get("/health", (_req, res) => {
  res.json({ status: "ok", judge: "piston", version: "0.1.0" });
});

router.get("/catalog", (_req, res) => {
  res.json({ topics, mocks: getPublicCatalog() });
});

router.post("/attempts/start", (req, res) => {
  const parsed = z.object({ mockId: z.string() }).safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid mock request" });
    return;
  }

  const mock = mockById.get(parsed.data.mockId);
  if (!mock) {
    res.status(404).json({ error: "Mock not found" });
    return;
  }

  const startedAt = Date.now();
  const deadline = startedAt + mock.durationMinutes * 60_000;
  const payload: AttemptTokenPayload = {
    kind: "attempt",
    mockId: mock.id,
    startedAt,
    deadline,
    nonce: randomUUID(),
  };

  res.status(201).json({ attemptToken: signToken(payload), startedAt, deadline });
});

router.post("/attempts/finish", (req, res) => {
  const parsed = z.object({ attemptToken: z.string() }).safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid finish request" });
    return;
  }

  try {
    const attempt = verifyToken<AttemptTokenPayload>(parsed.data.attemptToken, "attempt");
    const review: ReviewTokenPayload = {
      kind: "review",
      mockId: attempt.mockId,
      completedAt: Date.now(),
      nonce: attempt.nonce,
    };
    res.json({ reviewToken: signToken(review), completedAt: review.completedAt });
  } catch {
    res.status(401).json({ error: "Invalid attempt token" });
  }
});

router.post("/judge/run", submissionRateLimit, async (req, res) => {
  const parsed = z
    .object({ problemId: z.string(), code: codeSchema, sampleIndex: z.number().int().min(0).default(0) })
    .safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid run request" });
    return;
  }

  const problem = problemById.get(parsed.data.problemId);
  if (!problem) {
    res.status(404).json({ error: "Problem not found" });
    return;
  }

  try {
    res.json(await runSample(problem, parsed.data.sampleIndex, parsed.data.code));
  } catch (error) {
    res.status(502).json({ error: error instanceof Error ? error.message : "Judge unavailable" });
  }
});

router.post("/judge/submit", submissionRateLimit, async (req, res) => {
  const parsed = z
    .object({ attemptToken: z.string(), problemId: z.string(), code: codeSchema })
    .safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid submission" });
    return;
  }

  const problem = problemById.get(parsed.data.problemId);
  if (!problem) {
    res.status(404).json({ error: "Problem not found" });
    return;
  }

  try {
    const attempt = verifyToken<AttemptTokenPayload>(parsed.data.attemptToken, "attempt");
    const mock = mockById.get(attempt.mockId);
    if (!mock?.problemIds.includes(problem.id)) {
      res.status(403).json({ error: "Problem is not part of this mock" });
      return;
    }
    if (Date.now() > attempt.deadline + 5_000) {
      res.status(410).json({ error: "The mock timer has expired" });
      return;
    }

    res.json(await submitProblem(problem, parsed.data.code));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Judge unavailable";
    const status = message.includes("token") ? 401 : 502;
    res.status(status).json({ error: status === 401 ? "Invalid attempt token" : message });
  }
});

router.get("/review/:problemId", (req, res) => {
  const token = req.header("x-review-token");
  const problem = problemById.get(req.params.problemId);
  if (!token || !problem) {
    res.status(!problem ? 404 : 401).json({ error: !problem ? "Problem not found" : "Review token required" });
    return;
  }

  try {
    const review = verifyToken<ReviewTokenPayload>(token, "review");
    const mock = mockById.get(review.mockId);
    if (!mock?.problemIds.includes(problem.id)) {
      res.status(403).json({ error: "Problem is not part of this review" });
      return;
    }
    res.json({ problemId: problem.id, editorial: problem.editorial });
  } catch {
    res.status(401).json({ error: "Invalid review token" });
  }
});

export default router;
