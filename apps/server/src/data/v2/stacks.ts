import type { MockDefinition, ProblemDefinition } from "../../types/catalog.js";
import { mock, problem, recentEvidence } from "./helpers.js";

export const stackProblems: ProblemDefinition[] = [
  problem({
    id: "circular-next-load-spike",
    title: "Next Load Spike on a Circular Timeline",
    shortTitle: "Circular Spike",
    difficulty: "Medium",
    recommendedMinutes: 25,
    statement: "For each load reading on a circular timeline, report the first strictly greater reading encountered while moving forward. A search may wrap once but cannot reuse the starting position. Report −1 when none exists.",
    inputFormat: ["The first line contains n.", "The second line contains n readings."],
    outputFormat: ["Print n answers in original order."],
    constraints: ["1 ≤ n ≤ 200,000", "Readings fit signed 32-bit integers."],
    samples: [{ input: "5\n1 2 1 4 3", output: "2 4 4 -1 4", explanation: "The last reading wraps to find 4; the maximum has no greater value." }],
    tags: ["monotonic stack", "circular array", "unresolved indices"],
    tests: [
      { name: "sample", input: "5\n1 2 1 4 3\n", expectedOutput: "2 4 4 -1 4\n" },
      { name: "descending", input: "4\n4 3 2 1\n", expectedOutput: "-1 4 4 4\n" },
      { name: "duplicates", input: "3\n2 2 2\n", expectedOutput: "-1 -1 -1\n" },
      { name: "single", input: "1\n7\n", expectedOutput: "-1\n" },
    ],
    editorial: {
      recognitionSignal: "Each unresolved index waits for the first later value that is greater; a decreasing stack preserves exactly those candidates.",
      approach: ["Simulate two passes with indices modulo n.", "While the current value exceeds the value at the stack top, resolve that index.", "Push indices only during the first pass to avoid duplicates."],
      complexity: "O(n) time and O(n) space.",
      edgeCases: ["all equal", "strictly decreasing", "single reading", "wrap-only answers"],
      referenceCode: `void solve() {
    int n; cin >> n; vector<long long> a(n), answer(n, -1); for (auto& x : a) cin >> x;
    vector<int> pending;
    for (int i = 0; i < 2 * n; ++i) {
        int index = i % n;
        while (!pending.empty() && a[pending.back()] < a[index]) { answer[pending.back()] = a[index]; pending.pop_back(); }
        if (i < n) pending.push_back(index);
    }
    for (int i = 0; i < n; ++i) cout << (i ? " " : "") << answer[i];
    cout << '\\n';
}`,
      alignment: { analogousPattern: "Next Greater Element II", evidenceWindow: "Recent Microsoft internship report plus tagged data", confidence: "High" },
    },
  }),
  problem({
    id: "next-eligible-discount",
    title: "Apply the Next Eligible Discount",
    shortTitle: "Next Discount",
    difficulty: "Easy",
    recommendedMinutes: 20,
    statement: "For each listed price, subtract the first later price that is less than or equal to it. If no later price qualifies, leave it unchanged. Return all final prices.",
    inputFormat: ["The first line contains n.", "The second line contains n non-negative prices."],
    outputFormat: ["Print the final prices."],
    constraints: ["1 ≤ n ≤ 200,000", "0 ≤ price[i] ≤ 10^9"],
    samples: [{ input: "5\n8 4 6 2 3", output: "4 2 4 2 3", explanation: "Price 4 uses the later 2; price 2 has no qualifying later price." }],
    tags: ["monotonic stack", "next smaller or equal", "indices"],
    tests: [
      { name: "sample", input: "5\n8 4 6 2 3\n", expectedOutput: "4 2 4 2 3\n" },
      { name: "increasing", input: "4\n1 2 3 4\n", expectedOutput: "1 2 3 4\n" },
      { name: "equal qualifies", input: "3\n5 5 5\n", expectedOutput: "0 0 5\n" },
      { name: "zero", input: "4\n10 0 5 0\n", expectedOutput: "10 0 5 0\n" },
    ],
    editorial: {
      recognitionSignal: "Earlier prices remain unresolved until the first later value no greater than them appears.",
      approach: ["Keep unresolved indices in a stack with increasing prices from top toward bottom.", "For each new price, resolve while it is ≤ the top's price.", "Push the current index."],
      complexity: "O(n) time and O(n) space.",
      edgeCases: ["equal price qualifies", "zero discount", "strictly increasing", "strictly decreasing"],
      referenceCode: `void solve() {
    int n; cin >> n; vector<long long> prices(n); for (auto& x : prices) cin >> x;
    vector<int> pending;
    for (int i = 0; i < n; ++i) {
        while (!pending.empty() && prices[i] <= prices[pending.back()]) { prices[pending.back()] -= prices[i]; pending.pop_back(); }
        pending.push_back(i);
    }
    for (int i = 0; i < n; ++i) cout << (i ? " " : "") << prices[i];
    cout << '\\n';
}`,
      alignment: { analogousPattern: "Final Prices With a Special Discount", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
  problem({
    id: "wait-for-higher-telemetry",
    title: "Wait for Higher Telemetry",
    shortTitle: "Higher Telemetry",
    difficulty: "Medium",
    recommendedMinutes: 25,
    statement: "For every daily telemetry value, report how many days must pass before a strictly higher value appears. Report 0 if no future day is higher.",
    inputFormat: ["The first line contains n.", "The second line contains n daily values."],
    outputFormat: ["Print n waiting times."],
    constraints: ["1 ≤ n ≤ 200,000", "Values fit signed 32-bit integers."],
    samples: [{ input: "8\n73 74 75 71 69 72 76 73", output: "1 1 4 2 1 1 0 0", explanation: "The value 75 waits four positions for 76." }],
    tags: ["monotonic stack", "distance to next greater", "indices"],
    tests: [
      { name: "sample", input: "8\n73 74 75 71 69 72 76 73\n", expectedOutput: "1 1 4 2 1 1 0 0\n" },
      { name: "decreasing", input: "4\n4 3 2 1\n", expectedOutput: "0 0 0 0\n" },
      { name: "equal not higher", input: "4\n5 5 6 5\n", expectedOutput: "2 1 0 0\n" },
      { name: "single", input: "1\n10\n", expectedOutput: "0\n" },
    ],
    editorial: {
      recognitionSignal: "The answer needs both the next greater event and its distance, so store unresolved indices rather than only values.",
      approach: ["Maintain a stack whose indexed values are non-increasing.", "When a larger current value appears, pop and set currentIndex − poppedIndex.", "Unresolved indices retain answer 0."],
      complexity: "O(n) time and O(n) space.",
      edgeCases: ["equal values", "strictly decreasing", "single value", "late resolution"],
      referenceCode: `void solve() {
    int n; cin >> n; vector<long long> values(n); for (auto& x : values) cin >> x;
    vector<int> answer(n), pending;
    for (int i = 0; i < n; ++i) {
        while (!pending.empty() && values[pending.back()] < values[i]) { answer[pending.back()] = i - pending.back(); pending.pop_back(); }
        pending.push_back(i);
    }
    for (int i = 0; i < n; ++i) cout << (i ? " " : "") << answer[i];
    cout << '\\n';
}`,
      alignment: { analogousPattern: "Daily Temperatures", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
  problem({
    id: "largest-dashboard-band",
    title: "Largest Dashboard Band",
    shortTitle: "Largest Band",
    difficulty: "Hard",
    recommendedMinutes: 36,
    statement: "A dashboard contains adjacent columns with integer heights. Choose a contiguous band and a common height no greater than every column in that band. Return the maximum rectangular area.",
    inputFormat: ["The first line contains n.", "The second line contains n non-negative heights."],
    outputFormat: ["Print the maximum area as a 64-bit integer."],
    constraints: ["1 ≤ n ≤ 200,000", "0 ≤ height[i] ≤ 10^9"],
    samples: [{ input: "6\n2 1 5 6 2 3", output: "10", explanation: "Heights 5 and 6 support area 5 × 2." }],
    tags: ["monotonic stack", "span boundary", "sentinel"],
    tests: [
      { name: "sample", input: "6\n2 1 5 6 2 3\n", expectedOutput: "10\n" },
      { name: "increasing", input: "5\n1 2 3 4 5\n", expectedOutput: "9\n" },
      { name: "all equal", input: "4\n7 7 7 7\n", expectedOutput: "28\n" },
      { name: "zero split", input: "5\n2 0 3 3 0\n", expectedOutput: "6\n" },
    ],
    editorial: {
      recognitionSignal: "A bar's maximal width becomes known when the first shorter bar arrives on its right.",
      approach: ["Keep indices of increasing heights, including a sentinel base.", "On a lower current height, pop bars and use the new top as their left boundary.", "Process one extra zero height to flush the stack."],
      complexity: "O(n) time and O(n) space.",
      edgeCases: ["increasing input", "equal heights", "zero separators", "64-bit area"],
      referenceCode: `void solve() {
    int n; cin >> n; vector<long long> height(n + 1); for (int i = 0; i < n; ++i) cin >> height[i];
    vector<int> indices{-1}; long long answer = 0;
    for (int i = 0; i <= n; ++i) {
        while (indices.back() != -1 && height[indices.back()] > height[i]) {
            long long h = height[indices.back()]; indices.pop_back();
            answer = max(answer, h * (i - indices.back() - 1LL));
        }
        indices.push_back(i);
    }
    cout << answer << '\\n';
}`,
      alignment: { analogousPattern: "Largest Rectangle in Histogram", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
  problem({
    id: "largest-healthy-service-block",
    title: "Largest Healthy Service Block",
    shortTitle: "Healthy Block",
    difficulty: "Hard",
    recommendedMinutes: 40,
    statement: "A binary matrix marks healthy service cells with 1. Return the area of the largest axis-aligned rectangle containing only healthy cells.",
    inputFormat: ["The first line contains rows and columns.", "The next rows lines contain columns binary integers."],
    outputFormat: ["Print the maximum all-1 rectangle area."],
    constraints: ["1 ≤ rows × columns ≤ 300,000"],
    samples: [{ input: "4 5\n1 0 1 0 0\n1 0 1 1 1\n1 1 1 1 1\n1 0 0 1 0", output: "6", explanation: "Rows 2–3 and columns 3–5 form a 2 × 3 healthy block." }],
    tags: ["histogram reduction", "monotonic stack", "matrix"],
    tests: [
      { name: "sample", input: "4 5\n1 0 1 0 0\n1 0 1 1 1\n1 1 1 1 1\n1 0 0 1 0\n", expectedOutput: "6\n" },
      { name: "all zero", input: "2 3\n0 0 0\n0 0 0\n", expectedOutput: "0\n" },
      { name: "all one", input: "3 4\n1 1 1 1\n1 1 1 1\n1 1 1 1\n", expectedOutput: "12\n" },
      { name: "single column", input: "5 1\n1\n1\n0\n1\n1\n", expectedOutput: "2\n" },
    ],
    editorial: {
      recognitionSignal: "Each row can be the base of a histogram whose heights count consecutive healthy cells above it.",
      approach: ["Maintain column heights while scanning rows.", "After each row, compute the largest histogram rectangle with an increasing stack.", "Keep the maximum over all row bases."],
      complexity: "O(rows × columns) time and O(columns) space.",
      edgeCases: ["all zero", "all one", "single row/column", "reset height after zero"],
      referenceCode: `void solve() {
    int rows, columns; cin >> rows >> columns; vector<long long> height(columns + 1); long long answer = 0;
    for (int r = 0; r < rows; ++r) {
        for (int c = 0; c < columns; ++c) { int cell; cin >> cell; height[c] = cell ? height[c] + 1 : 0; }
        vector<int> stack{-1};
        for (int c = 0; c <= columns; ++c) {
            while (stack.back() != -1 && height[stack.back()] > height[c]) {
                long long h = height[stack.back()]; stack.pop_back();
                answer = max(answer, h * (c - stack.back() - 1LL));
            }
            stack.push_back(c);
        }
    }
    cout << answer << '\\n';
}`,
      alignment: { analogousPattern: "Maximal Rectangle", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
  problem({
    id: "minimum-aware-stack-service",
    title: "Minimum-Aware Stack Service",
    shortTitle: "Min Stack",
    difficulty: "Medium",
    recommendedMinutes: 28,
    statement: "Process stack commands while supporting constant-time minimum queries. Commands are PUSH x, POP, TOP, and MIN. POP, TOP, and MIN are guaranteed to target a non-empty stack. Print answers for TOP and MIN commands.",
    inputFormat: ["The first line contains q.", "The next q lines contain one command."],
    outputFormat: ["For every TOP or MIN command, print its result on a new line."],
    constraints: ["1 ≤ q ≤ 300,000", "−10^9 ≤ pushed value ≤ 10^9"],
    samples: [{ input: "8\nPUSH 3\nPUSH 5\nMIN\nPUSH 2\nMIN\nPOP\nTOP\nMIN", output: "3\n2\n5\n3", explanation: "The minimum restores correctly after popping 2." }],
    tags: ["design", "auxiliary stack", "duplicate minimum"],
    tests: [
      { name: "sample", input: "8\nPUSH 3\nPUSH 5\nMIN\nPUSH 2\nMIN\nPOP\nTOP\nMIN\n", expectedOutput: "3\n2\n5\n3\n" },
      { name: "duplicate minimum", input: "8\nPUSH 1\nPUSH 1\nMIN\nPOP\nMIN\nTOP\nPOP\nPUSH -5\n", expectedOutput: "1\n1\n1\n" },
      { name: "negative", input: "6\nPUSH -2\nPUSH 0\nPUSH -3\nMIN\nPOP\nTOP\n", expectedOutput: "-3\n0\n" },
      { name: "alternating", input: "7\nPUSH 4\nMIN\nPUSH 2\nMIN\nPOP\nMIN\nTOP\n", expectedOutput: "4\n2\n4\n4\n" },
    ],
    editorial: {
      recognitionSignal: "A popped minimum must reveal the previous minimum, so each stack level needs its minimum history.",
      approach: ["Store pairs (value, minimum through this level), or maintain a second stack.", "On push, combine x with the previous minimum.", "TOP and MIN read the pair at the top in O(1)."],
      complexity: "O(1) per operation and O(q) space.",
      edgeCases: ["duplicate minimum", "negative values", "minimum popped", "single element"],
      referenceCode: `void solve() {
    int q; cin >> q; vector<pair<long long, long long>> stack;
    while (q--) {
        string command; cin >> command;
        if (command == "PUSH") { long long x; cin >> x; long long current = stack.empty() ? x : min(x, stack.back().second); stack.push_back({x, current}); }
        else if (command == "POP") stack.pop_back();
        else if (command == "TOP") cout << stack.back().first << '\\n';
        else cout << stack.back().second << '\\n';
    }
}`,
      alignment: { analogousPattern: "Min Stack", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
];

export const stackMocks: MockDefinition[] = [
  mock("stack-queue", "stack-next-event", "Stack 01 · Next-Event Signals", "Resolve pending indices against future values, including circular and equality traps.", 1, 55, ["circular-next-load-spike", "next-eligible-discount"], ["strict vs non-strict", "circular state", "indices"]),
  mock("stack-queue", "stack-span", "Stack 02 · Span Boundaries", "Distance and maximal-span reasoning with delayed resolution.", 2, 70, ["wait-for-higher-telemetry", "largest-dashboard-band"], ["distance", "left boundary", "sentinel"]),
  mock("stack-queue", "stack-pressure", "Stack 03 · Matrix & Design Pressure", "Histogram reduction and operation design expose unfamiliar stack invariants.", 3, 80, ["largest-healthy-service-block", "minimum-aware-stack-service"], ["2D reduction", "state history", "API commands"]),
];
