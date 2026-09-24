# Deva

Deva is a personal, Microsoft-aligned DSA online-assessment lab. V2 expands the original Heap track into a **12-topic curriculum with 36 strict mocks and 72 original problems**, backed by a C++17 judge, hidden edge cases, and post-mock diagnosis.

The prompts are original. Their underlying patterns and pressure profile were selected from public Microsoft OA/interview reports and recent Microsoft-tagged problem data; they are not leaked questions and cannot predict a future assessment.

## What V2 includes

- Twelve topic tracks: Heap; Arrays/Hashing/Matrix; Strings/Windows; Binary Search; Stack/Queue; Linked Lists/Design; Greedy/Intervals; Trees/BST; Graphs/Shortest Paths/DSU; Dynamic Programming; Backtracking/Trie; and Bit/Math/Recurrence
- Three progressive mocks per topic, with two problems per mock
- Seventy-two production-style questions with indirect wording, deterministic contracts, and deliberately twisted edge cases
- Explicit **Core** versus **Targeted gap** labels so unfamiliar material is treated as planned coverage, not a recognition failure
- Monaco C++17 editor with locally persisted drafts
- Server-authoritative attempt deadlines and signed attempt/review tokens
- Visible-sample runs plus hidden test submissions
- Edge cases for duplicates, negative values, empty inputs, large gaps, tie-breaking, and 64-bit arithmetic
- Post-mock report with score, elapsed time, run count, self-diagnosis, recognition cues, optimal approaches, and reference solutions
- Topic-switching dashboard with per-track progress, activity, streak, accuracy, retries, and active-attempt recovery
- Responsive dark UI for desktop and mobile

Mixed Microsoft OA + interview mocks are intentionally deferred to the next version; V2 keeps one topic controlled at a time.

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

The server test suite verifies catalog integrity, token integrity, output comparison, and compiles/runs all 72 reference implementations against every curated visible and hidden case.

## Architecture

```text
apps/web     React dashboard, timed workspace, local attempt history, review UI
apps/server  Catalog, signed sessions, judge API, Piston adapter, hidden suites
```

Attempt history and drafts are intentionally stored in the browser for this personal preparation tool. Multi-device sync, authentication, an admin question studio, and mixed-round generation remain later iterations.

## Research note

The curriculum uses recurring public Microsoft-style signals across arrays, strings, matrices, linked-list design, interval scheduling, tree construction, BFS/topological ordering, DSU, constrained shortest paths, DP, backtracking, tries, and bit reasoning. Source inputs included public candidate reports, [InterviewBit's topic index](https://www.interviewbit.com/coding-interview-questions/#tags[]=4), and the community-maintained [company-wise LeetCode dataset](https://github.com/snehasishroy/leetcode-companywise-interview-questions). Source signals guide pattern selection only; Deva's wording, examples, edge cases, tests, and implementations are original.
