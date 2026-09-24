import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Circle,
  Code2,
  EyeOff,
  Flag,
  Gauge,
  LoaderCircle,
  LockKeyhole,
  Play,
  Send,
  ShieldCheck,
  TimerReset,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CodeEditor } from "../components/CodeEditor";
import { ErrorState, LoadingState } from "../components/LoadingState";
import { ProblemStatement } from "../components/ProblemStatement";
import { Timer } from "../components/Timer";
import { VerdictBadge } from "../components/VerdictBadge";
import { useCatalog } from "../hooks/useCatalog";
import { api } from "../lib/api";
import { getActiveAttemptForMock, saveAttempt } from "../lib/storage";
import type { LocalAttempt, SampleRunResult, SubmissionResult } from "../types";

type ConsoleState =
  | { type: "idle" }
  | { type: "loading"; message: string }
  | { type: "sample"; result: SampleRunResult }
  | { type: "submission"; result: SubmissionResult }
  | { type: "error"; message: string };

function MockIntro({ mockId, onStarted }: { mockId: string; onStarted: (attempt: LocalAttempt) => void }) {
  const { catalog } = useCatalog();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string>();
  const mock = catalog?.mocks.find((item) => item.id === mockId);
  const topic = catalog?.topics.find((item) => item.id === mock?.topicId);

  if (!mock) return <ErrorState message="This mock does not exist." />;

  const start = async () => {
    setStarting(true);
    setError(undefined);
    try {
      const session = await api.startAttempt(mock.id);
      const attempt: LocalAttempt = {
        id: crypto.randomUUID(),
        mockId: mock.id,
        attemptToken: session.attemptToken,
        startedAt: session.startedAt,
        deadline: session.deadline,
        status: "active",
        codeByProblem: Object.fromEntries(mock.problems.map((problem) => [problem.id, problem.starterCode])),
        resultsByProblem: {},
        runCountByProblem: {},
        reflectionTags: [],
      };
      saveAttempt(attempt);
      onStarted(attempt);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not start the mock");
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="mock-intro-page">
      <header className="minimal-header">
        <Link className="brand compact" to="/"><span className="brand-mark">D</span><strong>Deva</strong></Link>
        <Link className="text-link" to="/"><ArrowLeft size={16} /> Dashboard</Link>
      </header>
      <main className="mock-intro-card">
        <div className="intro-badge">{topic?.shortTitle || "Topic"} track · Level {mock.level}</div>
        <h1>{mock.title}</h1>
        <p className="intro-subtitle">{mock.subtitle}</p>

        <div className="intro-metrics">
          <div><TimerReset size={20} /><strong>{mock.durationMinutes} min</strong><span>Strict timer</span></div>
          <div><Code2 size={20} /><strong>{mock.problems.length} problems</strong><span>C++17</span></div>
          <div><ShieldCheck size={20} /><strong>Hidden tests</strong><span>Edge-case weighted</span></div>
        </div>

        <div className="problem-preview-list">
          {mock.problems.map((problem, index) => (
            <div key={problem.id}>
              <span>Q{index + 1}</span>
              <div><strong>{problem.title}</strong><small>{problem.difficulty} · {problem.recommendedMinutes} min target</small></div>
              <LockKeyhole size={17} />
            </div>
          ))}
        </div>

        <div className="strict-rules">
          <h2>Before you start</h2>
          <ul>
            <li><Gauge size={17} /> The timer continues if you refresh or leave this screen.</li>
            <li><EyeOff size={17} /> Pattern labels, hidden inputs, and editorials stay locked until you finish.</li>
            <li><Send size={17} /> Run checks the visible sample; Submit checks the complete hidden suite.</li>
          </ul>
        </div>

        {error && <p className="inline-error">{error}</p>}
        <button className="button button-primary button-large" onClick={start} disabled={starting}>
          {starting ? <><LoaderCircle className="spin" size={18} /> Starting…</> : <>Begin strict mock <ArrowRightIcon /></>}
        </button>
      </main>
    </div>
  );
}

function ArrowRightIcon() {
  return <ChevronRight size={18} />;
}

export function MockPage() {
  const { mockId = "" } = useParams();
  const navigate = useNavigate();
  const { catalog, loading, error, retry } = useCatalog();
  const [attempt, setAttempt] = useState<LocalAttempt | undefined>(() => getActiveAttemptForMock(mockId));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [consoleState, setConsoleState] = useState<ConsoleState>({ type: "idle" });
  const [showFinish, setShowFinish] = useState(false);
  const [finishing, setFinishing] = useState(false);

  const mock = catalog?.mocks.find((item) => item.id === mockId);
  const problem = mock?.problems[currentIndex];

  useEffect(() => {
    if (!attempt) setAttempt(getActiveAttemptForMock(mockId));
  }, [attempt, mockId]);

  useEffect(() => {
    if (!attempt) return;
    const timeout = window.setTimeout(() => saveAttempt(attempt), 350);
    return () => window.clearTimeout(timeout);
  }, [attempt]);

  const finish = useCallback(async (timedOut = false) => {
    if (!attempt || finishing) return;
    setFinishing(true);
    try {
      const finished = await api.finishAttempt(attempt.attemptToken);
      const updated: LocalAttempt = {
        ...attempt,
        reviewToken: finished.reviewToken,
        completedAt: finished.completedAt,
        status: timedOut ? "timed_out" : "completed",
      };
      saveAttempt(updated);
      setAttempt(updated);
      navigate(`/review/${updated.id}`, { replace: true });
    } catch (reason) {
      setConsoleState({ type: "error", message: reason instanceof Error ? reason.message : "Could not finish mock" });
      setShowFinish(false);
    } finally {
      setFinishing(false);
    }
  }, [attempt, finishing, navigate]);

  const updateCode = (value: string) => {
    if (!attempt || !problem) return;
    setAttempt({ ...attempt, codeByProblem: { ...attempt.codeByProblem, [problem.id]: value } });
  };

  const incrementRuns = () => {
    if (!attempt || !problem) return;
    setAttempt({
      ...attempt,
      runCountByProblem: {
        ...attempt.runCountByProblem,
        [problem.id]: (attempt.runCountByProblem[problem.id] || 0) + 1,
      },
    });
  };

  const run = async () => {
    if (!attempt || !problem) return;
    setConsoleState({ type: "loading", message: "Running the visible sample…" });
    incrementRuns();
    try {
      setConsoleState({ type: "sample", result: await api.runSample(problem.id, attempt.codeByProblem[problem.id]) });
    } catch (reason) {
      setConsoleState({ type: "error", message: reason instanceof Error ? reason.message : "Judge unavailable" });
    }
  };

  const submit = async () => {
    if (!attempt || !problem) return;
    setConsoleState({ type: "loading", message: "Evaluating hidden edge cases…" });
    try {
      const result = await api.submit(attempt.attemptToken, problem.id, attempt.codeByProblem[problem.id]);
      const updated: LocalAttempt = {
        ...attempt,
        resultsByProblem: {
          ...attempt.resultsByProblem,
          [problem.id]: { ...result, submittedAt: Date.now() },
        },
      };
      setAttempt(updated);
      saveAttempt(updated);
      setConsoleState({ type: "submission", result });
    } catch (reason) {
      setConsoleState({ type: "error", message: reason instanceof Error ? reason.message : "Judge unavailable" });
    }
  };

  if (loading) return <LoadingState label="Preparing the assessment…" />;
  if (error) return <ErrorState message={error} onRetry={retry} />;
  if (!mock) return <ErrorState message="This mock does not exist." />;
  if (!attempt || attempt.status !== "active") return <MockIntro mockId={mock.id} onStarted={setAttempt} />;
  if (!problem) return <ErrorState message="This problem is missing from the mock." />;

  const currentResult = attempt.resultsByProblem[problem.id];
  const solvedCount = Object.values(attempt.resultsByProblem).filter((result) => result.verdict === "accepted").length;
  const busy = consoleState.type === "loading";

  return (
    <div className="workspace-page">
      <header className="workspace-header">
        <div className="workspace-brand"><span className="brand-mark">D</span><strong>{mock.title}</strong></div>
        <div className="question-switcher">
          {mock.problems.map((item, index) => {
            const result = attempt.resultsByProblem[item.id];
            return (
              <button key={item.id} className={index === currentIndex ? "active" : ""} onClick={() => { setCurrentIndex(index); setConsoleState({ type: "idle" }); }}>
                {result?.verdict === "accepted" ? <Check size={15} /> : <Circle size={12} />}
                Question {index + 1}
              </button>
            );
          })}
        </div>
        <div className="workspace-actions">
          <span className="solved-count">{solvedCount}/{mock.problems.length} solved</span>
          <Timer deadline={attempt.deadline} onExpire={() => void finish(true)} />
          <button className="button button-ghost" onClick={() => setShowFinish(true)}><Flag size={16} /> End mock</button>
        </div>
      </header>

      <div className="workspace-grid">
        <div className="statement-pane"><ProblemStatement problem={problem} /></div>
        <div className="editor-pane">
          <div className="editor-toolbar">
            <div><Code2 size={16} /><span>C++17</span><small>{problem.starterCode.includes("void solve()") ? "Full program" : "Function stub"}</small></div>
            {currentResult && <VerdictBadge verdict={currentResult.verdict} />}
          </div>
          <div className="editor-frame">
            <CodeEditor value={attempt.codeByProblem[problem.id]} onChange={updateCode} />
          </div>
          <div className="console-panel">
            <div className="console-header">
              <strong>Evaluation</strong>
              <div>
                <button className="button button-secondary" onClick={run} disabled={busy}><Play size={15} /> Run sample</button>
                <button className="button button-primary" onClick={submit} disabled={busy}><Send size={15} /> Submit</button>
              </div>
            </div>
            <ConsoleOutput state={consoleState} />
          </div>
        </div>
      </div>

      <footer className="workspace-footer">
        <button className="button button-ghost" disabled={currentIndex === 0} onClick={() => { setCurrentIndex((value) => value - 1); setConsoleState({ type: "idle" }); }}>
          <ChevronLeft size={16} /> Previous
        </button>
        <span>Code is saved locally while the server remains the timer authority.</span>
        <button className="button button-ghost" disabled={currentIndex === mock.problems.length - 1} onClick={() => { setCurrentIndex((value) => value + 1); setConsoleState({ type: "idle" }); }}>
          Next <ChevronRight size={16} />
        </button>
      </footer>

      {showFinish && (
        <div className="modal-backdrop" role="presentation">
          <div className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="finish-title">
            <button className="dialog-close" onClick={() => setShowFinish(false)} aria-label="Close"><X size={18} /></button>
            <span className="dialog-icon"><Flag size={22} /></span>
            <h2 id="finish-title">End this mock?</h2>
            <p>You solved {solvedCount} of {mock.problems.length}. Ending unlocks patterns, edge cases, and reference solutions; the timer cannot be resumed afterward.</p>
            <div className="dialog-actions">
              <button className="button button-secondary" onClick={() => setShowFinish(false)}>Keep solving</button>
              <button className="button button-primary" onClick={() => void finish(false)} disabled={finishing}>
                {finishing ? <><LoaderCircle className="spin" size={16} /> Finishing…</> : "End and review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ConsoleOutput({ state }: { state: ConsoleState }) {
  if (state.type === "idle") return <div className="console-empty">Run the visible sample or submit against hidden tests.</div>;
  if (state.type === "loading") return <div className="console-loading"><LoaderCircle className="spin" size={18} /> {state.message}</div>;
  if (state.type === "error") return <div className="console-error"><X size={17} /> {state.message}</div>;

  if (state.type === "submission") {
    return (
      <div className="console-result">
        <div><VerdictBadge verdict={state.result.verdict} /><strong>{state.result.passed}/{state.result.total} hidden groups passed</strong></div>
        {(state.result.compileOutput || state.result.stderr) && <pre>{state.result.compileOutput || state.result.stderr}</pre>}
        {state.result.verdict === "wrong_answer" && <p>A hidden boundary case failed. The input remains locked until review.</p>}
      </div>
    );
  }

  return (
    <div className="console-result">
      <div><VerdictBadge verdict={state.result.verdict} /><strong>Visible sample</strong></div>
      {state.result.stderr ? <pre>{state.result.stderr}</pre> : (
        <div className="output-compare">
          <div><span>Expected</span><pre>{state.result.expectedOutput || "(empty)"}</pre></div>
          <div><span>Your output</span><pre>{state.result.actualOutput || "(empty)"}</pre></div>
        </div>
      )}
    </div>
  );
}
