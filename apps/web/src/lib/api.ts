import type { Catalog, Editorial, SampleRunResult, SubmissionResult } from "../types";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...options?.headers,
    },
  });

  const payload = (await response.json().catch(() => ({}))) as { error?: string } & T;
  if (!response.ok) throw new Error(payload.error || `Request failed (${response.status})`);
  return payload;
}

export const api = {
  catalog: () => request<Catalog>("/api/catalog"),
  startAttempt: (mockId: string) =>
    request<{ attemptToken: string; startedAt: number; deadline: number }>("/api/attempts/start", {
      method: "POST",
      body: JSON.stringify({ mockId }),
    }),
  finishAttempt: (attemptToken: string) =>
    request<{ reviewToken: string; completedAt: number }>("/api/attempts/finish", {
      method: "POST",
      body: JSON.stringify({ attemptToken }),
    }),
  runSample: (problemId: string, code: string, sampleIndex = 0) =>
    request<SampleRunResult>("/api/judge/run", {
      method: "POST",
      body: JSON.stringify({ problemId, code, sampleIndex }),
    }),
  submit: (attemptToken: string, problemId: string, code: string) =>
    request<SubmissionResult>("/api/judge/submit", {
      method: "POST",
      body: JSON.stringify({ attemptToken, problemId, code }),
    }),
  review: (problemId: string, reviewToken: string) =>
    request<{ problemId: string; editorial: Editorial }>(`/api/review/${problemId}`, {
      headers: { "x-review-token": reviewToken },
    }),
};
