import {
  ArrowLeft,
  BookOpenCheck,
  BrainCircuit,
  Check,
  ChevronDown,
  Clock3,
  Code2,
  Gauge,
  Lightbulb,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Target,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { ErrorState, LoadingState } from "../components/LoadingState";
import { VerdictBadge } from "../components/VerdictBadge";
import { useCatalog } from "../hooks/useCatalog";
import { api } from "../lib/api";
import { getAttempt, updateReflection } from "../lib/storage";
import type { Editorial, LocalAttempt, ReflectionTag } from "../types";

const reflectionOptions: Array<{ id: ReflectionTag; label: string }> = [
  { id: "recognition", label: "Pattern recognition" },
  { id: "implementation", label: "Implementation" },
  { id: "edge_cases", label: "Edge cases" },
  { id: "complexity", label: "Complexity" },
  { id: "time", label: "Time management" },
];

function formatDuration(milliseconds: number): string {
  const minutes = Math.max(1, Math.round(milliseconds / 60_000));
  return `${minutes} min`;
}

function automaticSignal(attempt: LocalAttempt): string {
  const results = Object.values(attempt.resultsByProblem);
  if (!results.length) return "No submitted solution—recognition or time management likely blocked progress.";
  if (results.some((result) => result.verdict === "time_limit")) return "At least one solution exceeded the execution limit—complexity needs review.";
  if (results.some((result) => result.verdict === "compile_error" || result.verdict === "runtime_error")) return "Implementation reliability was the main observable failure.";
  if (results.some((result) => result.verdict === "wrong_answer")) return "The approach reached code, but at least one hidden boundary case was missed.";
  return "All submitted solutions passed. Review whether your reasoning and complexity claims are equally sharp.";
}

export function ReviewPage() {
  const { attemptId = "" } = useParams();
  const { catalog, loading, error, retry } = useCatalog();
  const [attempt, setAttempt] = useState<LocalAttempt | undefined>(() => getAttempt(attemptId));
  const [editorials, setEditorials] = useState<Record<string, Editorial>>({});
  const [reviewError, setReviewError] = useState<string>();
  const [openProblem, setOpenProblem] = useState<string>();

  const mock = catalog?.mocks.find((item) => item.id === attempt?.mockId);

  useEffect(() => {
    if (!attempt?.reviewToken || !mock) return;
    let cancelled = false;
    Promise.all(mock.problems.map((problem) => api.review(problem.id, attempt.reviewToken!)))
      .then((reviews) => {
        if (cancelled) return;
        setEditorials(Object.fromEntries(reviews.map((review) => [review.problemId, review.editorial])));
        setOpenProblem(mock.problems[0]?.id);
      })
      .catch((reason: unknown) => {
        if (!cancelled) setReviewError(reason instanceof Error ? reason.message : "Could not unlock the review");
      });
    return () => {
      cancelled = true;
    };
  }, [attempt?.reviewToken, mock]);

  const solved = useMemo(
    () => Object.values(attempt?.resultsByProblem || {}).filter((result) => result.verdict === "accepted").length,
    [attempt],
  );

  if (loading) return <AppShell><LoadingState label="Building your report…" /></AppShell>;
  if (error) return <AppShell><ErrorState message={error} onRetry={retry} /></AppShell>;
  if (!attempt || !mock) return <AppShell><ErrorState message="This attempt could not be found on this device." /></AppShell>;
  if (!attempt.completedAt || !attempt.reviewToken) return <AppShell><ErrorState message="Finish the mock before opening its review." /></AppShell>;

  const elapsed = Math.min(attempt.completedAt - attempt.startedAt, attempt.deadline - attempt.startedAt);
  const score = Math.round((solved / mock.problems.length) * 100);
  const totalRuns = Object.values(attempt.runCountByProblem).reduce((sum, count) => sum + count, 0);

  const toggleReflection = (tag: ReflectionTag) => {
    const next = attempt.reflectionTags.includes(tag)
      ? attempt.reflectionTags.filter((item) => item !== tag)
      : [...attempt.reflectionTags, tag];
    const updated = updateReflection(attempt.id, next);
    if (updated) setAttempt(updated);
  };

  return (
    <AppShell>
      <div className="review-page">
        <header className="review-header">
          <div>
            <Link className="text-link" to="/"><ArrowLeft size={16} /> Dashboard</Link>
            <p className="eyebrow">Post-mock report</p>
            <h1>{mock.title}</h1>
            <p>{attempt.status === "timed_out" ? "Time expired. The result below uses submissions received before the deadline." : "Mock completed. Convert every miss into a repeatable rule."}</p>
          </div>
          <Link className="button button-secondary" to={`/mock/${mock.id}`}><RefreshCw size={16} /> Retry mock</Link>
        </header>

        <section className="report-score-panel">
          <div className={`score-orb ${score === 100 ? "perfect" : ""}`}><strong>{score}</strong><span>/100</span></div>
          <div className="report-summary">
            <p className="eyebrow">Observed result</p>
            <h2>{score === 100 ? "Clean pass. Now inspect the trade-offs." : score >= 50 ? "Partial pass. One pattern still breaks under pressure." : "Baseline captured. Diagnose before retrying."}</h2>
            <p>{automaticSignal(attempt)}</p>
          </div>
          <div className="report-metrics">
            <div><Target size={17} /><span><strong>{solved}/{mock.problems.length}</strong> accepted</span></div>
            <div><Clock3 size={17} /><span><strong>{formatDuration(elapsed)}</strong> elapsed</span></div>
            <div><Code2 size={17} /><span><strong>{totalRuns}</strong> sample runs</span></div>
          </div>
        </section>

        <div className="review-grid">
          <section className="panel reflection-panel">
            <div className="panel-heading">
              <div><p className="eyebrow">Your diagnosis</p><h2>What slowed you down?</h2></div>
              <BrainCircuit size={21} />
            </div>
            <p>Select the causes you felt—not what the verdict alone suggests.</p>
            <div className="reflection-options">
              {reflectionOptions.map((option) => {
                const selected = attempt.reflectionTags.includes(option.id);
                return <button key={option.id} className={selected ? "selected" : ""} onClick={() => toggleReflection(option.id)}><span>{selected && <Check size={14} />}</span>{option.label}</button>;
              })}
            </div>
          </section>

          <section className="panel next-action-panel">
            <p className="eyebrow">Next action</p>
            <Gauge size={24} />
            <h2>{score === 100 ? "Advance to the next heap mock" : "Retry after one focused revision"}</h2>
            <p>{score === 100 ? "The next set changes the signal from selection to streams and deadlines." : "Read the editorials below, rewrite only the failed solution, then retry the full mock tomorrow."}</p>
          </section>
        </div>

        <section className="editorial-section">
          <div className="section-heading">
            <div><p className="eyebrow">Unlocked review</p><h2>Recognition, edge cases, and solutions</h2></div>
            <span className="research-chip"><Sparkles size={14} /> Pattern evidence included</span>
          </div>

          {reviewError && <p className="inline-error">{reviewError}</p>}
          {!reviewError && Object.keys(editorials).length === 0 && <LoadingState label="Unlocking editorials…" />}

          <div className="editorial-list">
            {mock.problems.map((problem, index) => {
              const editorial = editorials[problem.id];
              const result = attempt.resultsByProblem[problem.id];
              const open = openProblem === problem.id;
              return (
                <article className={`editorial-card ${open ? "open" : ""}`} key={problem.id}>
                  <button className="editorial-toggle" onClick={() => setOpenProblem(open ? undefined : problem.id)}>
                    <span className="question-number">Q{index + 1}</span>
                    <div><strong>{problem.title}</strong><small>{result ? <VerdictBadge verdict={result.verdict} /> : "Not submitted"}</small></div>
                    <ChevronDown size={19} />
                  </button>
                  {open && editorial && (
                    <div className="editorial-content">
                      <div className="recognition-callout"><Lightbulb size={19} /><div><strong>Recognition signal</strong><p>{editorial.recognitionSignal}</p></div></div>
                      <div className="editorial-columns">
                        <div>
                          <h3>Optimal approach</h3>
                          <ol>{editorial.approach.map((step) => <li key={step}>{step}</li>)}</ol>
                        </div>
                        <div>
                          <h3>Complexity</h3>
                          <p>{editorial.complexity}</p>
                          <h3>Edge cases</h3>
                          <div className="edge-tags">{editorial.edgeCases.map((edge) => <span key={edge}>{edge}</span>)}</div>
                        </div>
                      </div>
                      <div className="alignment-note"><ShieldAlert size={17} /><div><strong>Microsoft alignment: {editorial.alignment.analogousPattern}</strong><span>{editorial.alignment.evidenceWindow} · {editorial.alignment.confidence} confidence</span></div></div>
                      <div className="reference-code"><div><BookOpenCheck size={17} /><strong>Reference function</strong></div><pre><code>{editorial.referenceCode}</code></pre></div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
