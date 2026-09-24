import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Flame,
  Gauge,
  Layers3,
  Play,
  RotateCcw,
  Sparkles,
  Target,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ActivityGrid } from "../components/ActivityGrid";
import { AppShell } from "../components/AppShell";
import { ErrorState, LoadingState } from "../components/LoadingState";
import { useAttempts } from "../hooks/useAttempts";
import { useCatalog } from "../hooks/useCatalog";
import type { LocalAttempt, Mock, Topic } from "../types";

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
        <h3>{mock.title.replace(/^[^·]+·\s*/, "")}</h3>
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

function TopicCard({
  topic,
  mocks,
  attempts,
  selected,
  onSelect,
}: {
  topic: Topic;
  mocks: Mock[];
  attempts: LocalAttempt[];
  selected: boolean;
  onSelect: () => void;
}) {
  const completedIds = new Set(
    attempts.filter((attempt) => attempt.status !== "active").map((attempt) => attempt.mockId),
  );
  const complete = mocks.filter((mock) => completedIds.has(mock.id)).length;
  const problems = mocks.reduce((sum, mock) => sum + mock.problems.length, 0);
  const progress = mocks.length ? (complete / mocks.length) * 100 : 0;

  return (
    <button className={`topic-card ${selected ? "selected" : ""}`} onClick={onSelect}>
      <div className="topic-card-top">
        <span className="topic-index">{String(topic.order).padStart(2, "0")}</span>
        <span className={`priority-chip ${topic.priority === "Targeted gap" ? "gap" : ""}`}>
          {topic.priority === "Targeted gap" ? <Sparkles size={11} /> : <Layers3 size={11} />}
          {topic.priority}
        </span>
      </div>
      <strong>{topic.title}</strong>
      <p>{topic.description}</p>
      <div className="topic-card-progress"><i style={{ width: `${progress}%` }} /></div>
      <small>{complete}/{mocks.length} mocks complete · {problems} problems</small>
    </button>
  );
}

export function DashboardPage() {
  const { catalog, loading, error, retry } = useCatalog();
  const attempts = useAttempts();
  const [selectedTopicId, setSelectedTopicId] = useState("heap");

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
  const selectedTopic = catalog.topics.find((topic) => topic.id === selectedTopicId) || catalog.topics[0];
  const selectedMocks = catalog.mocks.filter((mock) => mock.topicId === selectedTopic.id);
  const completedMockIds = new Set(completed.map((attempt) => attempt.mockId));
  const selectedComplete = selectedMocks.filter((mock) => completedMockIds.has(mock.id)).length;
  const selectedProgress = selectedMocks.length ? Math.round((selectedComplete / selectedMocks.length) * 100) : 0;
  const totalProblems = catalog.mocks.reduce((sum, mock) => sum + mock.problems.length, 0);

  return (
    <AppShell>
      <div className="dashboard-page">
        <header className="page-header dashboard-header">
          <div>
            <p className="eyebrow">Microsoft-focused · Topic-wise V2</p>
            <h1>{greeting()}, Subhanshu.</h1>
            <p>{catalog.topics.length} topic tracks · {catalog.mocks.length} strict mocks · {totalProblems} original C++ problems.</p>
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
            <p className="eyebrow">Selected-track progress</p>
            <div className="readiness-ring" style={{ "--score": `${selectedProgress * 3.6}deg` } as React.CSSProperties}>
              <div><strong>{selectedProgress}%</strong><span>{selectedTopic.shortTitle}</span></div>
            </div>
            <p>{selectedComplete ? `${selectedComplete} of ${selectedMocks.length} mocks completed. Use a retry only after reviewing the failure signal.` : "Start with calibration, then advance to the unfamiliar pressure set."}</p>
          </section>
        </div>

        <section className="topic-library" aria-labelledby="topic-library-heading">
          <div className="section-heading">
            <div><p className="eyebrow">Coverage map</p><h2 id="topic-library-heading">Choose a topic track</h2></div>
            <span className="research-chip">Microsoft patterns · personal gap weighted</span>
          </div>
          <div className="topic-grid">
            {catalog.topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                mocks={catalog.mocks.filter((mock) => mock.topicId === topic.id)}
                attempts={attempts}
                selected={topic.id === selectedTopic.id}
                onSelect={() => setSelectedTopicId(topic.id)}
              />
            ))}
          </div>
        </section>

        <section id="mock-library" className="mock-library">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Topic {String(selectedTopic.order).padStart(2, "0")} · {selectedTopic.priority}</p>
              <h2>{selectedTopic.title}</h2>
              <p className="section-description">{selectedTopic.description}</p>
            </div>
            <span className="research-chip">{selectedMocks.length} mocks · original prompts</span>
          </div>
          <div className="mock-list">
            {selectedMocks.map((mock) => <MockCard key={mock.id} mock={mock} attempts={attempts} />)}
          </div>
        </section>

        <section className="roadmap-strip" aria-label="V2 coverage plan">
          <div><span>Foundation</span><strong>4 core tracks</strong><small>Calibrate speed and correctness</small></div>
          <div className="roadmap-line" />
          <div><span>Personal gaps</span><strong>8 targeted tracks</strong><small>Unfamiliar patterns are labeled</small></div>
          <div className="roadmap-line" />
          <div className="muted"><span>Next version</span><strong>Mixed Microsoft rounds</strong><small>OA + interview · intentionally deferred</small></div>
        </section>
      </div>
    </AppShell>
  );
}
