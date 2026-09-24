import type { MockDefinition, ProblemDefinition } from "../../types/catalog.js";
import { mock, problem, recentEvidence } from "./helpers.js";

export const arrayProblems: ProblemDefinition[] = [
  problem({
    id: "pair-demand-count",
    title: "Count Compatible Service Pairs",
    shortTitle: "Service Pairs",
    difficulty: "Medium",
    recommendedMinutes: 22,
    statement: "Each service instance reports an integer capacity delta. Two different indices are compatible when their deltas add to target. Count compatible unordered index pairs. Equal values at different indices are distinct instances.",
    inputFormat: ["The first line contains n and target.", "The second line contains n integers."],
    outputFormat: ["Print the number of index pairs (i, j) with i < j and a[i] + a[j] = target."],
    constraints: ["1 ≤ n ≤ 200,000", "−10^9 ≤ a[i], target ≤ 10^9", "The answer may require 64-bit storage."],
    samples: [{ input: "6 6\n1 5 3 3 5 1", output: "5", explanation: "Duplicate positions contribute separate pairs." }],
    tags: ["hash map", "pair counting", "duplicates"],
    tests: [
      { name: "sample", input: "6 6\n1 5 3 3 5 1\n", expectedOutput: "5\n" },
      { name: "no pair", input: "4 20\n1 2 3 4\n", expectedOutput: "0\n" },
      { name: "all equal", input: "5 4\n2 2 2 2 2\n", expectedOutput: "10\n" },
      { name: "negative", input: "6 0\n-3 3 -3 3 0 0\n", expectedOutput: "5\n" },
    ],
    editorial: {
      recognitionSignal: "The question asks for pair multiplicity rather than one pair; retain counts of earlier complements.",
      approach: ["Scan from left to right.", "For value x, add the number of earlier target − x values to the answer.", "Then increment x in the frequency map."],
      complexity: "O(n) expected time and O(n) space.",
      edgeCases: ["duplicate values", "x equals its own complement", "negative values", "64-bit answer"],
      referenceCode: `void solve() {
    int n; long long target;
    cin >> n >> target;
    unordered_map<long long, long long> seen;
    long long answer = 0;
    for (int i = 0; i < n; ++i) {
        long long value; cin >> value;
        answer += seen[target - value];
        ++seen[value];
    }
    cout << answer << '\\n';
}`,
      alignment: { analogousPattern: "Two Sum counting variant", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
  problem({
    id: "longest-stable-release-run",
    title: "Longest Stable Release Run",
    shortTitle: "Stable Run",
    difficulty: "Medium",
    recommendedMinutes: 24,
    statement: "A deployment log contains release identifiers in arbitrary order. A stable run is a set of distinct identifiers that forms consecutive integers. Return the maximum run length; input order is irrelevant and duplicate records do not extend a run.",
    inputFormat: ["The first line contains n.", "The second line contains n release identifiers."],
    outputFormat: ["Print the maximum number of consecutive distinct identifiers."],
    constraints: ["0 ≤ n ≤ 200,000", "−10^9 ≤ id[i] ≤ 10^9"],
    samples: [{ input: "8\n100 4 200 1 3 2 2 5", output: "5", explanation: "Identifiers 1 through 5 form the longest run." }],
    tags: ["hash set", "sequence start", "deduplication"],
    tests: [
      { name: "sample", input: "8\n100 4 200 1 3 2 2 5\n", expectedOutput: "5\n" },
      { name: "empty", input: "0\n\n", expectedOutput: "0\n" },
      { name: "duplicates", input: "6\n7 7 7 8 8 9\n", expectedOutput: "3\n" },
      { name: "negative", input: "7\n-2 -1 0 2 4 3 3\n", expectedOutput: "3\n" },
    ],
    editorial: {
      recognitionSignal: "Ordering is irrelevant, but predecessor existence tells whether a value can start a maximal run.",
      approach: ["Insert identifiers into a hash set.", "Only expand from x when x − 1 is absent.", "Count forward until the sequence ends and track the maximum."],
      complexity: "O(n) expected time and O(n) space.",
      edgeCases: ["empty input", "duplicates", "negative identifiers", "single element"],
      referenceCode: `void solve() {
    int n; cin >> n;
    unordered_set<long long> values;
    for (int i = 0; i < n; ++i) { long long x; cin >> x; values.insert(x); }
    int answer = 0;
    for (long long x : values) {
        if (values.count(x - 1)) continue;
        int length = 1;
        while (values.count(x + length)) ++length;
        answer = max(answer, length);
    }
    cout << answer << '\\n';
}`,
      alignment: { analogousPattern: "Longest Consecutive Sequence", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
  problem({
    id: "capacity-without-node",
    title: "Capacity Without This Node",
    shortTitle: "Excluded Capacity",
    difficulty: "Medium",
    recommendedMinutes: 25,
    statement: "For every node in a cluster, report the product of all other node multipliers. Division is forbidden because multipliers may be zero. Preserve the original node order.",
    inputFormat: ["The first line contains n.", "The second line contains n integer multipliers."],
    outputFormat: ["Print n space-separated 64-bit products."],
    constraints: ["2 ≤ n ≤ 200,000", "−10^4 ≤ multiplier[i] ≤ 10^4", "Every required product fits in signed 64-bit."],
    samples: [{ input: "4\n1 2 3 4", output: "24 12 8 6", explanation: "Each position excludes exactly its own multiplier." }],
    tags: ["prefix product", "suffix product", "zero safe"],
    tests: [
      { name: "sample", input: "4\n1 2 3 4\n", expectedOutput: "24 12 8 6\n" },
      { name: "one zero", input: "4\n2 0 -3 4\n", expectedOutput: "0 -24 0 0\n" },
      { name: "two zeroes", input: "3\n0 5 0\n", expectedOutput: "0 0 0\n" },
      { name: "negative", input: "3\n-1 -2 -3\n", expectedOutput: "6 3 2\n" },
    ],
    editorial: {
      recognitionSignal: "Each answer is a left aggregate multiplied by a right aggregate; division is explicitly blocked.",
      approach: ["Write prefix products into the answer array.", "Sweep from right with a running suffix product.", "Multiply each stored prefix by the suffix before extending it."],
      complexity: "O(n) time and O(1) auxiliary space beyond the output.",
      edgeCases: ["one zero", "multiple zeroes", "negative values", "64-bit products"],
      referenceCode: `void solve() {
    int n; cin >> n;
    vector<long long> a(n), answer(n, 1);
    for (long long& x : a) cin >> x;
    long long prefix = 1;
    for (int i = 0; i < n; ++i) { answer[i] = prefix; prefix *= a[i]; }
    long long suffix = 1;
    for (int i = n - 1; i >= 0; --i) { answer[i] *= suffix; suffix *= a[i]; }
    for (int i = 0; i < n; ++i) cout << (i ? " " : "") << answer[i];
    cout << '\\n';
}`,
      alignment: { analogousPattern: "Product of Array Except Self", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
  problem({
    id: "rotate-incident-board",
    title: "Rotate the Incident Board",
    shortTitle: "Rotate Board",
    difficulty: "Medium",
    recommendedMinutes: 25,
    statement: "An n × n incident board must be rotated 90 degrees clockwise before display. Produce the rotated board without changing any cell values.",
    inputFormat: ["The first line contains n.", "The next n lines contain n integers each."],
    outputFormat: ["Print the rotated board using n rows."],
    constraints: ["1 ≤ n ≤ 500", "−10^9 ≤ board[r][c] ≤ 10^9"],
    samples: [{ input: "3\n1 2 3\n4 5 6\n7 8 9", output: "7 4 1\n8 5 2\n9 6 3", explanation: "Columns become rows from bottom to top." }],
    tags: ["matrix", "transpose", "reverse"],
    tests: [
      { name: "sample", input: "3\n1 2 3\n4 5 6\n7 8 9\n", expectedOutput: "7 4 1\n8 5 2\n9 6 3\n" },
      { name: "single", input: "1\n42\n", expectedOutput: "42\n" },
      { name: "two", input: "2\n1 -2\n3 4\n", expectedOutput: "3 1\n4 -2\n" },
      { name: "four", input: "4\n1 2 3 4\n5 6 7 8\n9 10 11 12\n13 14 15 16\n", expectedOutput: "13 9 5 1\n14 10 6 2\n15 11 7 3\n16 12 8 4\n" },
    ],
    editorial: {
      recognitionSignal: "A clockwise rotation maps (r, c) to (c, n − 1 − r); transpose plus row reversal performs that mapping.",
      approach: ["Transpose the square matrix across its main diagonal.", "Reverse every row.", "Print the transformed matrix."],
      complexity: "O(n²) time and O(1) auxiliary space.",
      edgeCases: ["n = 1", "negative values", "even and odd dimensions"],
      referenceCode: `void solve() {
    int n; cin >> n;
    vector<vector<long long>> board(n, vector<long long>(n));
    for (auto& row : board) for (long long& x : row) cin >> x;
    for (int r = 0; r < n; ++r) for (int c = r + 1; c < n; ++c) swap(board[r][c], board[c][r]);
    for (auto& row : board) reverse(row.begin(), row.end());
    for (const auto& row : board) {
        for (int c = 0; c < n; ++c) cout << (c ? " " : "") << row[c];
        cout << '\\n';
    }
}`,
      alignment: { analogousPattern: "Rotate Image", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
  problem({
    id: "next-rollout-order",
    title: "Next Rollout Order",
    shortTitle: "Next Order",
    difficulty: "Medium",
    recommendedMinutes: 28,
    statement: "A rollout order is represented by an integer permutation. Return the lexicographically next greater permutation. If no greater order exists, wrap to the smallest possible order.",
    inputFormat: ["The first line contains n.", "The second line contains a permutation of n distinct integers."],
    outputFormat: ["Print the resulting permutation."],
    constraints: ["1 ≤ n ≤ 200,000", "Values are distinct signed integers."],
    samples: [{ input: "5\n1 4 3 2 5", output: "1 4 3 5 2", explanation: "Change the rightmost possible pivot by the smallest valid amount." }],
    tags: ["permutation", "pivot", "suffix reversal"],
    tests: [
      { name: "sample", input: "5\n1 4 3 2 5\n", expectedOutput: "1 4 3 5 2\n" },
      { name: "descending", input: "4\n4 3 2 1\n", expectedOutput: "1 2 3 4\n" },
      { name: "single", input: "1\n8\n", expectedOutput: "8\n" },
      { name: "middle pivot", input: "6\n1 2 6 5 4 3\n", expectedOutput: "1 3 2 4 5 6\n" },
    ],
    editorial: {
      recognitionSignal: "The longest non-increasing suffix is already maximal; the change must occur immediately before it.",
      approach: ["Find the rightmost index i with a[i] < a[i+1].", "Swap it with the rightmost value greater than a[i].", "Reverse the suffix; if no pivot exists, reverse the whole permutation."],
      complexity: "O(n) time and O(1) auxiliary space.",
      edgeCases: ["fully descending", "single value", "pivot near the front or end"],
      referenceCode: `void solve() {
    int n; cin >> n; vector<long long> a(n); for (auto& x : a) cin >> x;
    int pivot = n - 2;
    while (pivot >= 0 && a[pivot] >= a[pivot + 1]) --pivot;
    if (pivot >= 0) {
        int swapIndex = n - 1;
        while (a[swapIndex] <= a[pivot]) --swapIndex;
        swap(a[pivot], a[swapIndex]);
    }
    reverse(a.begin() + pivot + 1, a.end());
    for (int i = 0; i < n; ++i) cout << (i ? " " : "") << a[i];
    cout << '\\n';
}`,
      alignment: { analogousPattern: "Next Permutation", evidenceWindow: "Recent Microsoft internship report plus tagged data", confidence: "High" },
    },
  }),
  problem({
    id: "quarantine-matrix-lines",
    title: "Quarantine Matrix Lines",
    shortTitle: "Quarantine Lines",
    difficulty: "Medium",
    recommendedMinutes: 28,
    statement: "A zero marks a compromised cell in an m × n dependency matrix. Every row and column containing an original zero must be cleared to zero. Changes made during processing must not create additional cleared lines.",
    inputFormat: ["The first line contains m and n.", "The next m lines contain n integers each."],
    outputFormat: ["Print the transformed matrix."],
    constraints: ["1 ≤ m, n ≤ 1,000", "m × n ≤ 500,000", "Values fit in signed 32-bit integers."],
    samples: [{ input: "3 4\n1 2 0 4\n5 6 7 8\n0 10 11 12", output: "0 0 0 0\n0 6 0 8\n0 0 0 0", explanation: "Only rows and columns containing original zeroes are cleared." }],
    tags: ["matrix markers", "in-place state", "boundary flags"],
    tests: [
      { name: "sample", input: "3 4\n1 2 0 4\n5 6 7 8\n0 10 11 12\n", expectedOutput: "0 0 0 0\n0 6 0 8\n0 0 0 0\n" },
      { name: "no zero", input: "2 2\n1 2\n3 4\n", expectedOutput: "1 2\n3 4\n" },
      { name: "first cell", input: "2 3\n0 2 3\n4 5 6\n", expectedOutput: "0 0 0\n0 5 6\n" },
      { name: "all zero", input: "2 2\n0 0\n0 0\n", expectedOutput: "0 0\n0 0\n" },
    ],
    editorial: {
      recognitionSignal: "Mutation can cascade incorrectly, so preserve original zero information using dedicated markers.",
      approach: ["Record whether the first row and first column originally contain zero.", "Use them as markers for all inner zeroes.", "Clear marked inner cells, then handle the first row and column."],
      complexity: "O(mn) time and O(1) auxiliary space.",
      edgeCases: ["zero at (0,0)", "first row only", "first column only", "no zeroes"],
      referenceCode: `void solve() {
    int m, n; cin >> m >> n;
    vector<vector<long long>> a(m, vector<long long>(n));
    for (auto& row : a) for (auto& x : row) cin >> x;
    bool firstRow = false, firstColumn = false;
    for (int c = 0; c < n; ++c) firstRow |= a[0][c] == 0;
    for (int r = 0; r < m; ++r) firstColumn |= a[r][0] == 0;
    for (int r = 1; r < m; ++r) for (int c = 1; c < n; ++c) if (a[r][c] == 0) a[r][0] = a[0][c] = 0;
    for (int r = 1; r < m; ++r) for (int c = 1; c < n; ++c) if (a[r][0] == 0 || a[0][c] == 0) a[r][c] = 0;
    if (firstRow) fill(a[0].begin(), a[0].end(), 0);
    if (firstColumn) for (int r = 0; r < m; ++r) a[r][0] = 0;
    for (const auto& row : a) { for (int c = 0; c < n; ++c) cout << (c ? " " : "") << row[c]; cout << '\\n'; }
}`,
      alignment: { analogousPattern: "Set Matrix Zeroes", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
];

export const arrayMocks: MockDefinition[] = [
  mock("arrays", "arrays-hash-foundations", "Arrays 01 · Counting Signals", "Multiplicity and sequence structure hidden behind operational records.", 1, 55, ["pair-demand-count", "longest-stable-release-run"], ["count discipline", "deduplication", "boundaries"]),
  mock("arrays", "arrays-transformations", "Arrays 02 · Transform Without Shortcuts", "Prefix state and 2D index mapping under zero and sign pressure.", 2, 65, ["capacity-without-node", "rotate-incident-board"], ["in-place reasoning", "zero handling", "2D mapping"]),
  mock("arrays", "arrays-pressure", "Arrays 03 · Ordering & Mutation", "Two deceptively local transformations whose correctness depends on global invariants.", 3, 70, ["next-rollout-order", "quarantine-matrix-lines"], ["suffix invariant", "marker state", "edge discipline"]),
];
