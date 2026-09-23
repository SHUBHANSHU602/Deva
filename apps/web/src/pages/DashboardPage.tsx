import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Flame,
  Gauge,
  Play,
  RotateCcw,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ActivityGrid } from "../components/ActivityGrid";
import { AppShell } from "../components/AppShell";
import { ErrorState, LoadingState } from "../components/LoadingState";
import { useAttempts } from "../hooks/useAttempts";
import { useCatalog } from "../hooks/useCatalog";
import type { LocalAttempt, Mock } from "../types";

function dayKey(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-CA");
}

function currentStreak(attempts: LocalAttempt[]): number {
  const activeDays = new Set(attempts.filter((attempt) => attempt.completedAt).map((attempt) => dayKey(attempt.completedAt!)));
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(12, 0, 0, 0);
  if (!activeDays.has(dayKey(cursor.getTime()))) cursor.setDate(cursor.getDate() - 1);
  while (activeDays.has(dayKey(cursor.getTime()))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function MockCard({ mock, attempts }: { mock: Mock; attempts: LocalAttempt[] }) {
  const related = attempts.filter((attempt) => attempt.mockId === mock.id);
  const active = related.find((attempt) => attempt.status === "active");
  const completed = related.filter((attempt) => attempt.status !== "active");
  const bestSolved = completed.reduce((best, attempt) => {
    const accepted = Object.values(attempt.resultsByProblem).filter((result) => result.verdict === "accepted").length;
    return Math.max(best, accepted);
  }, 0);
  const action = active ? "Continue" : completed.length ? "Retry" : "Start mock";
  const ActionIcon = active ? Play : completed.length ? RotateCcw : ArrowRight;

  return (
    <article className="mock-card">
      <div className="mock-level">0{mock.level}</div>
      <div className="mock-card-copy">
        <div className="mock-meta">
          <span><Clock3 size={14} /> {mock.durationMinutes} min</span>
          <span>{mock.problems.length} problems</span>
          {completed.length > 0 && <span className="best-score">Best {bestSolved}/{mock.problems.length}</span>}
        </div>
        <h3>{mock.title.replace(/^Heap \d+ · /, "")}</h3>
        <p>{mock.subtitle}</p>
        <div className="focus-tags">
          {mock.focus.map((focus) => <span key={focus}>{focus}</span>)}
        </div>
      </div>
      <Link className="button button-secondary mock-action" to={`/mock/${mock.id}`}>
        {action} <ActionIcon size={16} />
      </Link>
    </article>
  );
}

export function DashboardPage() {
  const { catalog, loading, error, retry } = useCatalog();
  const attempts = useAttempts();

  if (loading) return <AppShell><LoadingState /></AppShell>;
  if (error || !catalog) return <AppShell><ErrorState message={error || "Catalog unavailable"} onRetry={retry} /></AppShell>;

  const completed = attempts.filter((attempt) => attempt.status !== "active");
  const results = completed.flatMap((attempt) => Object.values(attempt.resultsByProblem));
  const accepted = results.filter((result) => result.verdict === "accepted").length;
  const accuracy = results.length ? Math.round((accepted / results.length) * 100) : 0;
  const scoreAverage = completed.length
    ? Math.round(
        completed.reduce((sum, attempt) => {
          const mock = catalog.mocks.find((item) => item.id === attempt.mockId);
          const solved = Object.values(attempt.resultsByProblem).filter((result) => result.verdict === "accepted").length;
          return sum + (mock ? (solved / mock.problems.length) * 100 : 0);
        }, 0) / completed.length,
      )
    : 0;
  const activeAttempt = attempts.find((attempt) => attempt.status === "active");
  const nextMock = activeAttempt
    ? catalog.mocks.find((mock) => mock.id === activeAttempt.mockId)
    : catalog.mocks.find((mock) => !completed.some((attempt) => attempt.mockId === mock.id)) || catalog.mocks[0];

  return (
    <AppShell>
      <div className="dashboard-page">
        <header className="page-header dashboard-header">
          <div>
            <p className="eyebrow">Personal training workspace</p>
            <h1>{greeting()}, Subhanshu.</h1>
            <p>Train recognition under OA pressure. Review the failure—not only the verdict.</p>
          </div>
          {nextMock && (
            <Link className="button button-primary" to={`/mock/${nextMock.id}`}>
              {activeAttempt ? "Resume mock" : "Start next mock"} <ArrowRight size={17} />
            </Link>
          )}
        </header>

        <section className="stats-grid" aria-label="Practice statistics">
          <div className="stat-card">
            <span className="stat-icon cyan"><CheckCircle2 size={19} /></span>
            <div><strong>{completed.length}</strong><span>Mocks completed</span></div>
          </div>
          <div className="stat-card">
            <span className="stat-icon green"><Target size={19} /></span>
            <div><strong>{accepted}</strong><span>Problems accepted</span></div>
          </div>
          <div className="stat-card">
            <span className="stat-icon amber"><Gauge size={19} /></span>
            <div><strong>{accuracy}%</strong><span>Submission accuracy</span></div>
          </div>
          <div className="stat-card">
            <span className="stat-icon coral"><Flame size={19} /></span>
            <div><strong>{currentStreak(attempts)}</strong><span>Day streak</span></div>
          </div>
        </section>

        <div className="dashboard-grid">
          <section className="panel activity-panel">
            <div className="panel-heading">
              <div><p className="eyebrow">Consistency</p><h2>Five-week activity</h2></div>
              <span className="score-chip">Avg score {scoreAverage}%</span>
            </div>
            <ActivityGrid attempts={attempts} />
            <div className="activity-legend"><span>Less</span><i className="level-0"/><i className="level-1"/><i className="level-2"/><i className="level-3"/><span>More</span></div>
          </section>

          <section className="panel readiness-panel">
            <p className="eyebrow">Current readiness</p>
            <div className="readiness-ring" style={{ "--score": `${scoreAverage * 3.6}deg` } as React.CSSProperties}>
              <div><strong>{scoreAverage}%</strong><span>Heap track</span></div>
            </div>
            <p>{completed.length ? "Use the next mock to confirm the pattern holds under a new story." : "Complete your first strict mock to establish a baseline."}</p>
          </section>
        </div>

        <section id="mock-library" className="mock-library">
          <div className="section-heading">
            <div><p className="eyebrow">Topic 01</p><h2>Heap & Priority Queue</h2></div>
            <span className="research-chip">Microsoft-aligned · original prompts</span>
          </div>
          <div className="mock-list">
            {catalog.mocks.map((mock) => <MockCard key={mock.id} mock={mock} attempts={attempts} />)}
          </div>
        </section>

        <section className="roadmap-strip">
          <div><span>Now</span><strong>Heap</strong><small>3 mocks</small></div>
          <div className="roadmap-line" />
          <div className="muted"><span>Next</span><strong>Greedy</strong><small>Planned</small></div>
          <div className="roadmap-line" />
          <div className="muted"><span>Later</span><strong>Graphs + DP</strong><small>Subtopic sets</small></div>
        </section>
      </div>
    </AppShell>
  );
}
