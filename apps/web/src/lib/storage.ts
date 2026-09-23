import type { LocalAttempt, ReflectionTag } from "../types";

const key = "deva.attempts.v1";

export function getAttempts(): LocalAttempt[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]") as LocalAttempt[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getAttempt(id: string): LocalAttempt | undefined {
  return getAttempts().find((attempt) => attempt.id === id);
}

export function getActiveAttemptForMock(mockId: string): LocalAttempt | undefined {
  return getAttempts().find((attempt) => attempt.mockId === mockId && attempt.status === "active");
}

export function saveAttempt(attempt: LocalAttempt): void {
  const attempts = getAttempts();
  const index = attempts.findIndex((item) => item.id === attempt.id);
  if (index >= 0) attempts[index] = attempt;
  else attempts.unshift(attempt);
  localStorage.setItem(key, JSON.stringify(attempts));
  window.dispatchEvent(new CustomEvent("deva-attempts-updated"));
}

export function updateReflection(id: string, tags: ReflectionTag[]): LocalAttempt | undefined {
  const attempt = getAttempt(id);
  if (!attempt) return undefined;
  const updated = { ...attempt, reflectionTags: tags };
  saveAttempt(updated);
  return updated;
}
