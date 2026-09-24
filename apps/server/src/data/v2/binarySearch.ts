import type { MockDefinition, ProblemDefinition } from "../../types/catalog.js";
import { mock, problem, recentEvidence } from "./helpers.js";

export const binarySearchProblems: ProblemDefinition[] = [
  problem({
    id: "locate-ordered-dashboard-cell",
    title: "Locate an Ordered Dashboard Cell",
    shortTitle: "Matrix Locate",
    difficulty: "Medium",
    recommendedMinutes: 22,
    statement: "A matrix is ordered so every row is non-decreasing and the first value of each row is greater than the last value of the previous row. Determine whether target exists without scanning every cell.",
    inputFormat: ["The first line contains rows, columns, and target.", "The next rows lines contain the matrix."],
    outputFormat: ["Print YES if target exists, otherwise NO."],
    constraints: ["1 ≤ rows × columns ≤ 500,000", "Values and target fit signed 64-bit integers."],
    samples: [{ input: "3 4 16\n1 3 5 7\n10 11 16 20\n23 30 34 60", output: "YES", explanation: "The ordering is identical to one flattened sorted array." }],
    tags: ["binary search", "matrix flattening", "index mapping"],
    tests: [
      { name: "sample", input: "3 4 16\n1 3 5 7\n10 11 16 20\n23 30 34 60\n", expectedOutput: "YES\n" },
      { name: "missing gap", input: "2 3 4\n1 2 3\n5 6 7\n", expectedOutput: "NO\n" },
      { name: "single", input: "1 1 -5\n-5\n", expectedOutput: "YES\n" },
      { name: "last", input: "1 5 9\n-2 0 3 8 9\n", expectedOutput: "YES\n" },
    ],
    editorial: {
      recognitionSignal: "The cross-row ordering makes the entire matrix one conceptual sorted array.",
      approach: ["Binary-search indices from 0 to rows × columns − 1.", "Map index p to row p / columns and column p % columns.", "Compare that cell with target."],
      complexity: "O(log(rows × columns)) time and O(1) space.",
      edgeCases: ["one row", "one cell", "target between rows", "first or last value"],
      referenceCode: `void solve() {
    int rows, columns; long long target; cin >> rows >> columns >> target;
    vector<vector<long long>> matrix(rows, vector<long long>(columns));
    for (auto& row : matrix) for (auto& x : row) cin >> x;
    long long left = 0, right = 1LL * rows * columns - 1;
    while (left <= right) {
        long long middle = left + (right - left) / 2;
        long long value = matrix[middle / columns][middle % columns];
        if (value == target) { cout << "YES\\n"; return; }
        if (value < target) left = middle + 1; else right = middle - 1;
    }
    cout << "NO\\n";
}`,
      alignment: { analogousPattern: "Search a 2D Matrix", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
  problem({
    id: "unpaired-version-record",
    title: "Unpaired Version Record",
    shortTitle: "Unpaired Record",
    difficulty: "Medium",
    recommendedMinutes: 24,
    statement: "A sorted audit sequence contains every version exactly twice except one version that appears once. Find the unpaired version in logarithmic time and constant extra space.",
    inputFormat: ["The first line contains odd n.", "The second line contains the sorted versions."],
    outputFormat: ["Print the unpaired version."],
    constraints: ["1 ≤ n ≤ 200,001", "n is odd", "All paired values occur exactly twice."],
    samples: [{ input: "9\n1 1 3 3 4 8 8 9 9", output: "4", explanation: "Pair alignment flips after the single value." }],
    tags: ["binary search", "pair parity", "boundary invariant"],
    tests: [
      { name: "sample", input: "9\n1 1 3 3 4 8 8 9 9\n", expectedOutput: "4\n" },
      { name: "first", input: "5\n-2 0 0 7 7\n", expectedOutput: "-2\n" },
      { name: "last", input: "5\n1 1 2 2 10\n", expectedOutput: "10\n" },
      { name: "single", input: "1\n42\n", expectedOutput: "42\n" },
    ],
    editorial: {
      recognitionSignal: "Before the single value, pairs start at even indices; afterward they start at odd indices.",
      approach: ["Binary-search a candidate pair start and force mid to be even.", "If a[mid] equals a[mid+1], the single is to the right of that pair.", "Otherwise keep the left half including mid."],
      complexity: "O(log n) time and O(1) space.",
      edgeCases: ["single at first", "single at last", "n = 1", "negative values"],
      referenceCode: `void solve() {
    int n; cin >> n; vector<long long> a(n); for (auto& x : a) cin >> x;
    int left = 0, right = n - 1;
    while (left < right) {
        int middle = left + (right - left) / 2;
        if (middle & 1) --middle;
        if (a[middle] == a[middle + 1]) left = middle + 2; else right = middle;
    }
    cout << a[left] << '\\n';
}`,
      alignment: { analogousPattern: "Single Element in a Sorted Array", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
  problem({
    id: "rotated-registry-membership",
    title: "Rotated Registry Membership",
    shortTitle: "Rotated Registry",
    difficulty: "Medium",
    recommendedMinutes: 28,
    statement: "A non-decreasing registry was rotated at an unknown boundary and may contain duplicates. Determine whether target exists. Avoid linear scanning when duplicate ambiguity does not force it.",
    inputFormat: ["The first line contains n and target.", "The second line contains the rotated registry."],
    outputFormat: ["Print YES or NO."],
    constraints: ["1 ≤ n ≤ 200,000", "Values fit signed 64-bit integers."],
    samples: [{ input: "7 0\n2 5 6 0 0 1 2", output: "YES", explanation: "The target lies in the rotated right portion." }],
    tags: ["rotated binary search", "duplicates", "ambiguous boundary"],
    tests: [
      { name: "sample", input: "7 0\n2 5 6 0 0 1 2\n", expectedOutput: "YES\n" },
      { name: "missing", input: "7 3\n2 5 6 0 0 1 2\n", expectedOutput: "NO\n" },
      { name: "ambiguous duplicates", input: "7 3\n1 1 1 1 3 1 1\n", expectedOutput: "YES\n" },
      { name: "single", input: "1 -2\n-2\n", expectedOutput: "YES\n" },
    ],
    editorial: {
      recognitionSignal: "At least one half is normally sorted, but equal left/middle/right values can hide which half that is.",
      approach: ["Compare target with middle.", "When both boundaries equal middle, move both inward.", "Otherwise identify the sorted half and keep the half whose value range can contain target."],
      complexity: "O(log n) average and O(n) worst-case time with all duplicates; O(1) space.",
      edgeCases: ["all duplicates", "target at rotation point", "single element", "unrotated input"],
      referenceCode: `void solve() {
    int n; long long target; cin >> n >> target; vector<long long> a(n); for (auto& x : a) cin >> x;
    int left = 0, right = n - 1;
    while (left <= right) {
        int middle = left + (right - left) / 2;
        if (a[middle] == target) { cout << "YES\\n"; return; }
        if (a[left] == a[middle] && a[middle] == a[right]) { ++left; --right; continue; }
        if (a[left] <= a[middle]) {
            if (a[left] <= target && target < a[middle]) right = middle - 1; else left = middle + 1;
        } else {
            if (a[middle] < target && target <= a[right]) left = middle + 1; else right = middle - 1;
        }
    }
    cout << "NO\\n";
}`,
      alignment: { analogousPattern: "Search in Rotated Sorted Array II", evidenceWindow: recentEvidence, confidence: "Medium" },
    },
  }),
  problem({
    id: "minimum-signal-radius",
    title: "Minimum Signal Radius",
    shortTitle: "Signal Radius",
    difficulty: "Medium",
    recommendedMinutes: 30,
    statement: "Devices and transmitters occupy integer points on a line. Every transmitter uses the same non-negative radius. Find the minimum radius that places every device within range of at least one transmitter.",
    inputFormat: ["The first line contains n and m.", "The second line contains n device positions.", "The third line contains m transmitter positions."],
    outputFormat: ["Print the minimum integer radius."],
    constraints: ["1 ≤ n, m ≤ 200,000", "−10^9 ≤ positions ≤ 10^9"],
    samples: [{ input: "4 2\n1 2 3 10\n2 8", output: "2", explanation: "Device 10 is distance 2 from transmitter 8; all others are closer." }],
    tags: ["nearest neighbor", "binary search", "sorted positions"],
    tests: [
      { name: "sample", input: "4 2\n1 2 3 10\n2 8\n", expectedOutput: "2\n" },
      { name: "one transmitter", input: "3 1\n-5 0 7\n1\n", expectedOutput: "6\n" },
      { name: "exact", input: "3 3\n1 5 9\n9 1 5\n", expectedOutput: "0\n" },
      { name: "outside both ends", input: "4 2\n-10 -2 4 20\n0 5\n", expectedOutput: "15\n" },
    ],
    editorial: {
      recognitionSignal: "For each device only its nearest sorted transmitter matters; the global answer is the worst nearest distance.",
      approach: ["Sort transmitter positions.", "For each device, lower_bound the first transmitter not left of it.", "Check that transmitter and its predecessor, then maximize the smaller distance."],
      complexity: "O(m log m + n log m) time and O(1) extra space apart from sorting.",
      edgeCases: ["device outside transmitter range", "unsorted input", "exact match", "one transmitter"],
      referenceCode: `void solve() {
    int n, m; cin >> n >> m; vector<long long> devices(n), transmitters(m);
    for (auto& x : devices) cin >> x; for (auto& x : transmitters) cin >> x;
    sort(transmitters.begin(), transmitters.end());
    long long answer = 0;
    for (long long device : devices) {
        auto it = lower_bound(transmitters.begin(), transmitters.end(), device);
        long long nearest = LLONG_MAX;
        if (it != transmitters.end()) nearest = min(nearest, llabs(*it - device));
        if (it != transmitters.begin()) nearest = min(nearest, llabs(*prev(it) - device));
        answer = max(answer, nearest);
    }
    cout << answer << '\\n';
}`,
      alignment: { analogousPattern: "Heaters", evidenceWindow: recentEvidence, confidence: "Medium" },
    },
  }),
  problem({
    id: "median-of-telemetry-feeds",
    title: "Median of Two Telemetry Feeds",
    shortTitle: "Feed Median",
    difficulty: "Hard",
    recommendedMinutes: 42,
    statement: "Two independently sorted telemetry feeds must be viewed as one logical sequence. Print their median without merging the feeds. The answer is printed with exactly one digit after the decimal point.",
    inputFormat: ["The first line contains n and m, with n + m > 0.", "The next two lines contain the sorted feeds; an empty feed contributes an empty line."],
    outputFormat: ["Print the median with exactly one decimal place."],
    constraints: ["0 ≤ n, m ≤ 200,000", "−10^9 ≤ values ≤ 10^9", "Target complexity is logarithmic in the smaller feed."],
    samples: [{ input: "2 3\n1 3\n2 4 8", output: "3.0", explanation: "The logical merged order is 1,2,3,4,8." }],
    tags: ["partition binary search", "median", "sentinels"],
    tests: [
      { name: "sample", input: "2 3\n1 3\n2 4 8\n", expectedOutput: "3.0\n" },
      { name: "even", input: "2 2\n1 2\n3 4\n", expectedOutput: "2.5\n" },
      { name: "empty first", input: "0 3\n\n-2 0 10\n", expectedOutput: "0.0\n" },
      { name: "duplicates", input: "3 4\n1 1 1\n1 1 2 2\n", expectedOutput: "1.0\n" },
    ],
    editorial: {
      recognitionSignal: "A valid cut places half the total elements on the left and requires both left maxima to be no larger than the opposite right minima.",
      approach: ["Binary-search the cut position in the smaller array.", "Derive the complementary cut in the other array.", "Move left or right when a cross-boundary ordering fails; otherwise compute from boundary values."],
      complexity: "O(log min(n,m)) time and O(1) space.",
      edgeCases: ["one feed empty", "odd/even total", "duplicates", "all values of one feed before the other"],
      referenceCode: `void solve() {
    int n, m; cin >> n >> m; vector<long long> a(n), b(m); for (auto& x : a) cin >> x; for (auto& x : b) cin >> x;
    if (a.size() > b.size()) swap(a, b);
    int totalLeft = (a.size() + b.size() + 1) / 2;
    int left = 0, right = a.size();
    while (left <= right) {
        int cutA = left + (right - left) / 2, cutB = totalLeft - cutA;
        long long leftA = cutA ? a[cutA - 1] : LLONG_MIN;
        long long rightA = cutA < (int)a.size() ? a[cutA] : LLONG_MAX;
        long long leftB = cutB ? b[cutB - 1] : LLONG_MIN;
        long long rightB = cutB < (int)b.size() ? b[cutB] : LLONG_MAX;
        if (leftA <= rightB && leftB <= rightA) {
            double answer = (a.size() + b.size()) % 2 ? max(leftA, leftB) : (max(leftA, leftB) + min(rightA, rightB)) / 2.0;
            cout << fixed << setprecision(1) << answer << '\\n'; return;
        }
        if (leftA > rightB) right = cutA - 1; else left = cutA + 1;
    }
}`,
      alignment: { analogousPattern: "Median of Two Sorted Arrays", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
  problem({
    id: "minimum-daily-throughput",
    title: "Minimum Daily Transfer Capacity",
    shortTitle: "Transfer Capacity",
    difficulty: "Medium",
    recommendedMinutes: 30,
    statement: "Packages must be transferred in their given order over at most days days. A day accepts a consecutive prefix of the remaining packages whose total weight does not exceed one fixed capacity. Find the minimum capacity that finishes on time.",
    inputFormat: ["The first line contains n and days.", "The second line contains n positive weights."],
    outputFormat: ["Print the minimum feasible capacity."],
    constraints: ["1 ≤ days ≤ n ≤ 200,000", "1 ≤ weight[i] ≤ 10^9", "Use 64-bit sums."],
    samples: [{ input: "5 3\n1 2 3 4 5", output: "6", explanation: "Capacity 6 permits [1,2,3], [4], [5]." }],
    tags: ["binary search on answer", "monotone feasibility", "64-bit"],
    tests: [
      { name: "sample", input: "5 3\n1 2 3 4 5\n", expectedOutput: "6\n" },
      { name: "one day", input: "4 1\n7 2 5 10\n", expectedOutput: "24\n" },
      { name: "one per day", input: "4 4\n7 2 5 10\n", expectedOutput: "10\n" },
      { name: "large", input: "3 2\n1000000000 1000000000 1000000000\n", expectedOutput: "2000000000\n" },
    ],
    editorial: {
      recognitionSignal: "If a capacity works, every larger capacity works; that monotone feasibility boundary is the search target.",
      approach: ["Search capacities from max(weight) to sum(weight).", "Greedily count days needed for a candidate capacity.", "Keep the lower half when the candidate needs at most the allowed days."],
      complexity: "O(n log(sum − max)) time and O(1) space.",
      edgeCases: ["one day", "days equals n", "large sums", "largest single package"],
      referenceCode: `void solve() {
    int n, days; cin >> n >> days; vector<long long> weights(n); long long left = 0, right = 0;
    for (auto& weight : weights) { cin >> weight; left = max(left, weight); right += weight; }
    while (left < right) {
        long long capacity = left + (right - left) / 2, usedDays = 1, load = 0;
        for (long long weight : weights) { if (load + weight > capacity) { ++usedDays; load = 0; } load += weight; }
        if (usedDays <= days) right = capacity; else left = capacity + 1;
    }
    cout << left << '\\n';
}`,
      alignment: { analogousPattern: "Capacity To Ship Packages Within D Days", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
];

export const binarySearchMocks: MockDefinition[] = [
  mock("binary-search", "binary-search-invariants", "Binary Search 01 · Index Invariants", "Flattened coordinates and pair alignment with boundary-heavy hidden cases.", 1, 55, ["locate-ordered-dashboard-cell", "unpaired-version-record"], ["index mapping", "parity", "boundaries"]),
  mock("binary-search", "binary-search-ambiguity", "Binary Search 02 · Ambiguous Order", "Rotation duplicates and nearest-neighbor coverage challenge default templates.", 2, 65, ["rotated-registry-membership", "minimum-signal-radius"], ["duplicate ambiguity", "neighbor checks", "worst case"]),
  mock("binary-search", "binary-search-answer-space", "Binary Search 03 · Partition & Feasibility", "One structural partition hard and one monotone answer search under 64-bit pressure.", 3, 80, ["median-of-telemetry-feeds", "minimum-daily-throughput"], ["partition proof", "feasibility", "64-bit safety"]),
];
