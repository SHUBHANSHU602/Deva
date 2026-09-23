import type { LocalAttempt } from "../types";

function localDateKey(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function ActivityGrid({ attempts }: { attempts: LocalAttempt[] }) {
  const counts = new Map<string, number>();
  for (const attempt of attempts) {
    if (!attempt.completedAt) continue;
    const key = localDateKey(attempt.completedAt);
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  const days = Array.from({ length: 35 }, (_, offset) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - (34 - offset));
    const key = localDateKey(date.getTime());
    return { key, label: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }), count: counts.get(key) || 0 };
  });

  return (
    <div className="activity-grid" aria-label="Practice activity over the last five weeks">
      {days.map((day) => (
        <span
          key={day.key}
          className={`activity-cell level-${Math.min(day.count, 3)}`}
          title={`${day.label}: ${day.count} completed mock${day.count === 1 ? "" : "s"}`}
        />
      ))}
    </div>
  );
}
