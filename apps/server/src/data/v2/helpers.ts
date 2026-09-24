import type { MockDefinition, ProblemDefinition } from "../../types/catalog.js";

export const solveStarter = `#include <bits/stdc++.h>
using namespace std;

void solve() {
    // Read the input, implement the required algorithm, and print the answer.
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    solve();
}`;

export function problem(
  definition: Omit<ProblemDefinition, "starterCode">,
): ProblemDefinition {
  return { ...definition, starterCode: solveStarter };
}

export function mock(
  topicId: string,
  id: string,
  title: string,
  subtitle: string,
  level: 1 | 2 | 3,
  durationMinutes: number,
  problemIds: string[],
  focus: string[],
): MockDefinition {
  return { topicId, id, title, subtitle, level, durationMinutes, problemIds, focus };
}

export const recentEvidence = "Microsoft-tagged public question data, rolling six-month window";
