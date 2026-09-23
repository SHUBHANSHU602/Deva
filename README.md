# Deva

Deva is a personal, Microsoft-aligned DSA online-assessment lab. V1 focuses on **Heap & Priority Queue** practice: three strict mocks, six original problems, a C++17 judge, hidden edge cases, and post-mock diagnosis.

The prompts are original. Their underlying patterns and pressure profile were selected from public Microsoft OA/interview reports and recent Microsoft-tagged problem data; they are not leaked questions and cannot predict a future assessment.

## What V1 includes

- Three progressive Heap mocks (55, 70, and 80 minutes)
- Six production-style questions with indirect wording and deterministic contracts
- Monaco C++17 editor with locally persisted drafts
- Server-authoritative attempt deadlines and signed attempt/review tokens
- Visible-sample runs plus hidden test submissions
- Edge cases for duplicates, negative values, empty inputs, large gaps, tie-breaking, and 64-bit arithmetic
- Post-mock report with score, elapsed time, run count, self-diagnosis, recognition cues, optimal approaches, and reference solutions
- Personal dashboard with activity, streak, accuracy, readiness, retries, and active-attempt recovery
- Responsive dark UI for desktop and mobile

## Stack

- React 19, TypeScript, Vite, React Router, Monaco Editor
- Node.js 20+, Express 5, Zod
- Piston-compatible C++17 execution API
- Vitest plus native `g++` validation of every reference solution against the full curated suite

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173`. The API runs at `http://localhost:4000` and Vite proxies `/api` during development.

For a production-style local build:

```bash
npm run build
npm start
```

Then open `http://localhost:4000`.

## Environment

| Variable | Purpose | Default |
| --- | --- | --- |
| `PORT` | Express port | `4000` |
| `WEB_ORIGIN` | Allowed development origin | `http://localhost:5173` |
| `ATTEMPT_TOKEN_SECRET` | HMAC secret for attempt/review tokens | Local-only fallback |
| `PISTON_URL` | Piston-compatible execute endpoint | Public Piston endpoint |
| `PISTON_CPP_VERSION` | Executor C++ runtime version | `*` |

Set a strong `ATTEMPT_TOKEN_SECRET` outside local development. The default public executor is convenient for development; for a durable deployment, use a controlled or self-hosted isolated execution service and point `PISTON_URL` to it.

## Verification

```bash
npm test
npm run build
```

The server test suite verifies token integrity, output comparison, and compiles/runs all six reference implementations against every curated visible and hidden case.

## Architecture

```text
apps/web     React dashboard, timed workspace, local attempt history, review UI
apps/server  Catalog, signed sessions, judge API, Piston adapter, hidden suites
```

Attempt history and drafts are intentionally stored in the browser for this personal V1. Multi-device sync, authentication, an admin question studio, and additional topic tracks are natural later iterations.

## Research note

The first track uses recurring public Microsoft-tagged patterns such as stream selection, frequency ordering, k-way merge, deadline selection, cooldown scheduling, and k-smallest pair expansion. Source inputs included public candidate reports and the community-maintained [company-wise LeetCode dataset](https://github.com/snehasishroy/leetcode-companywise-interview-questions). Source signals guide pattern selection only; Deva's wording, examples, edge cases, and implementations are original.
