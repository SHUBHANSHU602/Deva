import type { MockDefinition, ProblemDefinition } from "../../types/catalog.js";
import { mock, problem, recentEvidence } from "./helpers.js";

export const greedyProblems: ProblemDefinition[] = [
  problem({
    id: "can-complete-rollout",
    title: "Can the Rollout Reach Production?",
    shortTitle: "Rollout Reach",
    difficulty: "Medium",
    recommendedMinutes: 20,
    statement: "At stage i, a rollout token may advance by at most jump[i] stages. Starting at stage 0, determine whether the final stage is reachable. A zero permits no movement from that stage.",
    inputFormat: ["The first line contains n.", "The second line contains n non-negative jump limits."],
    outputFormat: ["Print YES if the final stage is reachable, otherwise NO."],
    constraints: ["1 ≤ n ≤ 200,000", "0 ≤ jump[i] ≤ 10^9"],
    samples: [{ input: "5\n2 3 1 1 4", output: "YES", explanation: "Stage 0 reaches stage 1, whose range includes the end." }],
    tags: ["greedy", "farthest reach", "invariant"],
    tests: [
      { name: "sample", input: "5\n2 3 1 1 4\n", expectedOutput: "YES\n" },
      { name: "blocked", input: "5\n3 2 1 0 4\n", expectedOutput: "NO\n" },
      { name: "single", input: "1\n0\n", expectedOutput: "YES\n" },
      { name: "large jump", input: "4\n10 0 0 0\n", expectedOutput: "YES\n" },
    ],
    editorial: {
      recognitionSignal: "The exact path is irrelevant; among all reachable stages only the farthest reachable boundary matters.",
      approach: ["Track the greatest reachable index.", "If the current index exceeds it, a gap is unavoidable.", "Otherwise extend it with i + jump[i]."],
      complexity: "O(n) time and O(1) space.",
      edgeCases: ["single stage", "zero barrier", "jump beyond end", "unreachable prefix"],
      referenceCode: `void solve() {
    int n; cin >> n; long long farthest = 0;
    for (int i = 0; i < n; ++i) { long long jump; cin >> jump; if (i <= farthest) farthest = max(farthest, i + jump); }
    cout << (farthest >= n - 1 ? "YES" : "NO") << '\\n';
}`,
      alignment: { analogousPattern: "Jump Game", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
  problem({
    id: "minimum-rollout-hops",
    title: "Minimum Rollout Hops",
    shortTitle: "Rollout Hops",
    difficulty: "Medium",
    recommendedMinutes: 28,
    statement: "At stage i, you may advance between 1 and jump[i] stages. Return the minimum hops from stage 0 to the final stage, or −1 if it is unreachable.",
    inputFormat: ["The first line contains n.", "The second line contains n non-negative jump limits."],
    outputFormat: ["Print the minimum hop count, or −1."],
    constraints: ["1 ≤ n ≤ 200,000", "0 ≤ jump[i] ≤ 10^9"],
    samples: [{ input: "5\n2 3 1 1 4", output: "2", explanation: "Jump from stage 0 to 1, then to the final stage." }],
    tags: ["greedy", "implicit BFS layer", "range frontier"],
    tests: [
      { name: "sample", input: "5\n2 3 1 1 4\n", expectedOutput: "2\n" },
      { name: "blocked", input: "5\n3 2 1 0 4\n", expectedOutput: "-1\n" },
      { name: "single", input: "1\n0\n", expectedOutput: "0\n" },
      { name: "exact layers", input: "6\n1 2 1 1 1 0\n", expectedOutput: "4\n" },
    ],
    editorial: {
      recognitionSignal: "All positions reachable with the same number of jumps form a contiguous range, like one BFS layer.",
      approach: ["Track the current layer end and farthest next reach.", "When scanning reaches the layer end, consume one jump and advance the boundary.", "If the boundary cannot advance, return −1."],
      complexity: "O(n) time and O(1) space.",
      edgeCases: ["single stage", "unreachable end", "one jump to end", "zero inside reachable range"],
      referenceCode: `void solve() {
    int n; cin >> n; vector<long long> jump(n); for (auto& x : jump) cin >> x;
    if (n == 1) { cout << 0 << '\\n'; return; }
    long long farthest = 0, layerEnd = 0; int hops = 0;
    for (int i = 0; i < n - 1 && i <= farthest; ++i) {
        farthest = max(farthest, i + jump[i]);
        if (i == layerEnd) { ++hops; if (farthest == layerEnd) break; layerEnd = farthest; if (layerEnd >= n - 1) { cout << hops << '\\n'; return; } }
    }
    cout << -1 << '\\n';
}`,
      alignment: { analogousPattern: "Jump Game II", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
  problem({
    id: "circular-fuel-start",
    title: "Choose a Circular Refuel Start",
    shortTitle: "Refuel Start",
    difficulty: "Medium",
    recommendedMinutes: 27,
    statement: "Station i supplies fuel[i] units and travel to the next station costs cost[i]. Start empty at one station and complete exactly one clockwise circuit. Print the unique feasible zero-based start, or −1 if no circuit is possible.",
    inputFormat: ["The first line contains n.", "The second line contains fuel values.", "The third line contains travel costs."],
    outputFormat: ["Print the start index or −1."],
    constraints: ["1 ≤ n ≤ 200,000", "0 ≤ fuel[i], cost[i] ≤ 10^9", "If a solution exists, it is unique."],
    samples: [{ input: "5\n1 2 3 4 5\n3 4 5 1 2", output: "3", explanation: "Starting at index 3 never lets the tank become negative." }],
    tags: ["greedy", "prefix deficit", "circular array"],
    tests: [
      { name: "sample", input: "5\n1 2 3 4 5\n3 4 5 1 2\n", expectedOutput: "3\n" },
      { name: "impossible", input: "3\n2 3 4\n3 4 3\n", expectedOutput: "-1\n" },
      { name: "single feasible", input: "1\n5\n5\n", expectedOutput: "0\n" },
      { name: "late reset", input: "4\n0 0 5 0\n1 1 1 2\n", expectedOutput: "2\n" },
    ],
    editorial: {
      recognitionSignal: "If the running tank becomes negative at i, no station since the current candidate can reach i + 1.",
      approach: ["Check total fuel minus total cost for global feasibility.", "Maintain a candidate start and running balance.", "After a negative balance, reset the candidate to the next station."],
      complexity: "O(n) time and O(1) space.",
      edgeCases: ["total deficit", "exactly zero total", "single station", "multiple candidate resets"],
      referenceCode: `void solve() {
    int n; cin >> n; vector<long long> fuel(n), cost(n); for (auto& x : fuel) cin >> x; for (auto& x : cost) cin >> x;
    long long total = 0, tank = 0; int start = 0;
    for (int i = 0; i < n; ++i) { long long gain = fuel[i] - cost[i]; total += gain; tank += gain; if (tank < 0) { start = i + 1; tank = 0; } }
    cout << (total < 0 ? -1 : start % n) << '\\n';
}`,
      alignment: { analogousPattern: "Gas Station", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
  problem({
    id: "minimum-review-credits",
    title: "Minimum Review Credits",
    shortTitle: "Review Credits",
    difficulty: "Hard",
    recommendedMinutes: 32,
    statement: "Engineers stand in a line with performance ratings. Give each at least one credit. Any engineer with a strictly higher rating than an adjacent engineer must receive more credits than that neighbor. Return the minimum total credits.",
    inputFormat: ["The first line contains n.", "The second line contains n ratings."],
    outputFormat: ["Print the minimum total as a 64-bit integer."],
    constraints: ["1 ≤ n ≤ 200,000", "Ratings fit signed 32-bit integers."],
    samples: [{ input: "3\n1 0 2", output: "5", explanation: "A minimum assignment is 2, 1, 2." }],
    tags: ["greedy", "two directional constraints", "slope"],
    tests: [
      { name: "sample", input: "3\n1 0 2\n", expectedOutput: "5\n" },
      { name: "equal", input: "3\n1 2 2\n", expectedOutput: "4\n" },
      { name: "descending", input: "5\n5 4 3 2 1\n", expectedOutput: "15\n" },
      { name: "valley", input: "5\n1 3 4 5 2\n", expectedOutput: "11\n" },
    ],
    editorial: {
      recognitionSignal: "Each neighbor rule is directional; satisfying left and right constraints separately and taking the maximum yields the minimum joint assignment.",
      approach: ["Scan left-to-right to satisfy rises from the left.", "Scan right-to-left, tracking the required right-side count.", "Add the maximum left and right requirement at each index."],
      complexity: "O(n) time and O(n) space; the second array can be reduced to O(1).",
      edgeCases: ["equal ratings", "long descent", "valley", "single engineer"],
      referenceCode: `void solve() {
    int n; cin >> n; vector<long long> rating(n); for (auto& x : rating) cin >> x;
    vector<long long> left(n, 1); for (int i = 1; i < n; ++i) if (rating[i] > rating[i - 1]) left[i] = left[i - 1] + 1;
    long long answer = 0, right = 1;
    for (int i = n - 1; i >= 0; --i) { if (i + 1 < n && rating[i] > rating[i + 1]) ++right; else right = 1; answer += max(left[i], right); }
    cout << answer << '\\n';
}`,
      alignment: { analogousPattern: "Candy", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
  problem({
    id: "merge-outage-windows",
    title: "Consolidate Outage Windows",
    shortTitle: "Merge Windows",
    difficulty: "Medium",
    recommendedMinutes: 23,
    statement: "Each outage window is a closed interval [start, end]. Consolidate every overlapping or touching pair and print the disjoint windows in increasing order. Because intervals are closed, [1, 3] and [3, 5] merge.",
    inputFormat: ["The first line contains n.", "The next n lines contain start and end."],
    outputFormat: ["Print the number of merged windows, followed by one window per line."],
    constraints: ["0 ≤ n ≤ 200,000", "−10^9 ≤ start ≤ end ≤ 10^9"],
    samples: [{ input: "4\n1 3\n2 6\n8 10\n10 12", output: "2\n1 6\n8 12", explanation: "Both overlap and shared closed endpoints are consolidated." }],
    tags: ["intervals", "sorting", "merge invariant"],
    tests: [
      { name: "sample", input: "4\n1 3\n2 6\n8 10\n10 12\n", expectedOutput: "2\n1 6\n8 12\n" },
      { name: "empty", input: "0\n", expectedOutput: "0\n" },
      { name: "nested", input: "4\n1 10\n2 3\n4 8\n10 12\n", expectedOutput: "1\n1 12\n" },
      { name: "separate", input: "3\n5 6\n1 2\n3 4\n", expectedOutput: "3\n1 2\n3 4\n5 6\n" },
    ],
    editorial: {
      recognitionSignal: "After sorting by start, a new interval can interact only with the last consolidated interval.",
      approach: ["Sort by start then end.", "Extend the last output interval while the next start is at most its end.", "Otherwise begin a new output interval."],
      complexity: "O(n log n) time and O(n) output space.",
      edgeCases: ["empty input", "touching endpoints", "nested intervals", "unsorted input"],
      referenceCode: `void solve() {
    int n; cin >> n; vector<pair<long long, long long>> intervals(n); for (auto& [left, right] : intervals) cin >> left >> right;
    sort(intervals.begin(), intervals.end()); vector<pair<long long, long long>> merged;
    for (auto interval : intervals) { if (merged.empty() || interval.first > merged.back().second) merged.push_back(interval); else merged.back().second = max(merged.back().second, interval.second); }
    cout << merged.size() << '\\n'; for (auto [left, right] : merged) cout << left << ' ' << right << '\\n';
}`,
      alignment: { analogousPattern: "Merge Intervals", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
  problem({
    id: "minimum-incident-bridges",
    title: "Minimum Concurrent Incident Bridges",
    shortTitle: "Incident Bridges",
    difficulty: "Medium",
    recommendedMinutes: 27,
    statement: "Each incident occupies a bridge during the half-open interval [start, end). A bridge can immediately serve another incident whose start equals the previous end. Return the minimum bridges required so no incidents assigned to one bridge overlap.",
    inputFormat: ["The first line contains n.", "The next n lines contain start and end."],
    outputFormat: ["Print the minimum bridge count."],
    constraints: ["0 ≤ n ≤ 200,000", "−10^9 ≤ start < end ≤ 10^9"],
    samples: [{ input: "3\n0 30\n5 10\n15 20", output: "2", explanation: "The long incident overlaps each shorter one." }],
    tags: ["intervals", "min heap", "sweep line"],
    tests: [
      { name: "sample", input: "3\n0 30\n5 10\n15 20\n", expectedOutput: "2\n" },
      { name: "touching reuse", input: "4\n0 5\n5 10\n10 15\n15 20\n", expectedOutput: "1\n" },
      { name: "all overlap", input: "4\n1 9\n2 8\n3 7\n4 6\n", expectedOutput: "4\n" },
      { name: "empty", input: "0\n", expectedOutput: "0\n" },
    ],
    editorial: {
      recognitionSignal: "When incidents are processed by start time, the bridge becoming free earliest is the only existing resource worth checking first.",
      approach: ["Sort incidents by start.", "Remove every end time at or before the new start, because those bridges are reusable.", "Push the new end and track the largest heap size."],
      complexity: "O(n log n) time and O(n) space.",
      edgeCases: ["touching half-open intervals", "all overlap", "empty input", "unsorted input"],
      referenceCode: `void solve() {
    int n; cin >> n; vector<pair<long long, long long>> incidents(n); for (auto& [start, end] : incidents) cin >> start >> end;
    sort(incidents.begin(), incidents.end()); priority_queue<long long, vector<long long>, greater<long long>> endings; int answer = 0;
    for (auto [start, end] : incidents) { while (!endings.empty() && endings.top() <= start) endings.pop(); endings.push(end); answer = max(answer, (int)endings.size()); }
    cout << answer << '\\n';
}`,
      alignment: { analogousPattern: "Meeting Rooms II", evidenceWindow: "Targeted interval-scheduling gap", confidence: "High" },
    },
  }),
];

export const greedyMocks: MockDefinition[] = [
  mock("greedy-intervals", "greedy-frontiers", "Greedy 01 · Reach Frontiers", "Separate feasibility from minimum-step reasoning on the same deceptive movement model.", 1, 55, ["can-complete-rollout", "minimum-rollout-hops"], ["farthest reach", "implicit BFS layers", "unreachable state"]),
  mock("greedy-intervals", "greedy-local-global", "Greedy 02 · Local Decisions, Global Proof", "Reset a circular candidate and reconcile constraints arriving from both directions.", 2, 65, ["circular-fuel-start", "minimum-review-credits"], ["prefix deficit", "two passes", "greedy proof"]),
  mock("greedy-intervals", "greedy-interval-pressure", "Greedy 03 · Interval Pressure", "Closed versus half-open endpoints decide whether windows merge or a resource can be reused.", 3, 60, ["merge-outage-windows", "minimum-incident-bridges"], ["endpoint semantics", "sorting", "resource reuse"]),
];
