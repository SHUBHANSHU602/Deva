import type {
  MockDefinition,
  ProblemDefinition,
  PublicMock,
  PublicProblem,
} from "../types/catalog.js";

const liveCutoffStarter = `#include <bits/stdc++.h>
using namespace std;

vector<string> qualityCutoff(const vector<int>& scores, int k) {
    // Return one token per score: "NA" until k scores exist,
    // otherwise the current k-th largest score.
    return {};
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, k;
    cin >> n >> k;
    vector<int> scores(n);
    for (int& score : scores) cin >> score;

    vector<string> answer = qualityCutoff(scores, k);
    for (int i = 0; i < (int)answer.size(); ++i) {
        if (i) cout << ' ';
        cout << answer[i];
    }
    cout << '\\n';
}`;

const frequencyStarter = `#include <bits/stdc++.h>
using namespace std;

vector<int> rebuildStream(const vector<int>& events) {
    // Higher frequency comes first. For equal frequency,
    // the smaller event code comes first.
    return {};
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    cin >> n;
    vector<int> events(n);
    for (int& event : events) cin >> event;

    vector<int> answer = rebuildStream(events);
    for (int i = 0; i < (int)answer.size(); ++i) {
        if (i) cout << ' ';
        cout << answer[i];
    }
    cout << '\\n';
}`;

const mergeStreamsStarter = `#include <bits/stdc++.h>
using namespace std;

vector<long long> mergeTelemetry(const vector<vector<long long>>& streams) {
    return {};
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int k;
    cin >> k;
    vector<vector<long long>> streams(k);
    for (auto& stream : streams) {
        int length;
        cin >> length;
        stream.resize(length);
        for (long long& value : stream) cin >> value;
    }

    vector<long long> answer = mergeTelemetry(streams);
    if (answer.empty()) {
        cout << "EMPTY\\n";
        return 0;
    }
    for (int i = 0; i < (int)answer.size(); ++i) {
        if (i) cout << ' ';
        cout << answer[i];
    }
    cout << '\\n';
}`;

const maintenanceStarter = `#include <bits/stdc++.h>
using namespace std;

int maximumMaintenanceJobs(vector<pair<int, int>> windows) {
    return 0;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n;
    cin >> n;
    vector<pair<int, int>> windows(n);
    for (auto& [startDay, endDay] : windows) {
        cin >> startDay >> endDay;
    }
    cout << maximumMaintenanceJobs(windows) << '\\n';
}`;

const cooldownStarter = `#include <bits/stdc++.h>
using namespace std;

long long minimumBuildSlots(const vector<char>& jobs, int cooldown) {
    return 0;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, cooldown;
    cin >> n >> cooldown;
    vector<char> jobs(n);
    for (char& job : jobs) cin >> job;
    cout << minimumBuildSlots(jobs, cooldown) << '\\n';
}`;

const pairPlansStarter = `#include <bits/stdc++.h>
using namespace std;

vector<pair<long long, long long>> cheapestPlans(
    const vector<long long>& primary,
    const vector<long long>& secondary,
    int k
) {
    return {};
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m, k;
    cin >> n >> m >> k;
    vector<long long> primary(n), secondary(m);
    for (long long& value : primary) cin >> value;
    for (long long& value : secondary) cin >> value;

    for (auto [first, second] : cheapestPlans(primary, secondary, k)) {
        cout << first << ' ' << second << '\\n';
    }
}`;

export const problems: ProblemDefinition[] = [
  {
    id: "live-quality-cutoff",
    title: "Live Quality Cutoff",
    shortTitle: "Quality Cutoff",
    difficulty: "Medium",
    recommendedMinutes: 24,
    statement:
      "A release pipeline receives quality scores one at a time. After every arrival, the dashboard must show the score currently occupying position k when all scores seen so far are ordered from highest to lowest. Equal scores represent different builds and must be counted separately. Until at least k builds have arrived, show NA.",
    inputFormat: [
      "The first line contains n and k.",
      "The second line contains n integer quality scores in arrival order.",
    ],
    outputFormat: [
      "Print n space-separated tokens. Token i is NA if fewer than k scores have arrived; otherwise it is the current k-th largest score.",
    ],
    constraints: [
      "1 ≤ k ≤ n ≤ 200,000",
      "−1,000,000,000 ≤ score[i] ≤ 1,000,000,000",
      "Duplicate and negative scores are valid.",
    ],
    samples: [
      {
        input: "6 3\n4 5 8 2 10 9",
        output: "NA NA 4 4 5 8",
        explanation:
          "Once three scores exist, only the three strongest scores can affect the cutoff.",
      },
    ],
    starterCode: liveCutoffStarter,
    tags: ["bounded heap", "stream", "top-k"],
    tests: [
      { name: "sample", input: "6 3\n4 5 8 2 10 9\n", expectedOutput: "NA NA 4 4 5 8\n" },
      { name: "k equals one", input: "5 1\n-2 -2 7 0 7\n", expectedOutput: "-2 -2 7 7 7\n" },
      { name: "all duplicates", input: "4 4\n5 5 5 5\n", expectedOutput: "NA NA NA 5\n" },
      { name: "negative values", input: "7 2\n-5 -1 -3 -1 -10 0 0\n", expectedOutput: "NA -5 -3 -1 -1 -1 0\n" },
      { name: "integer bounds", input: "2 2\n1000000000 -1000000000\n", expectedOutput: "NA -1000000000\n" },
    ],
    editorial: {
      recognitionSignal:
        "The answer changes after every insertion, but only the best k values matter. That is the bounded-heap signal.",
      approach: [
        "Maintain a min-heap containing the k largest scores seen so far.",
        "Push the new score. If the heap grows beyond k, remove its smallest value.",
        "When the heap size is k, its root is exactly the current k-th largest score.",
      ],
      complexity: "O(n log k) time and O(k) auxiliary space.",
      edgeCases: ["k = 1", "k = n", "duplicates", "negative scores"],
      referenceCode: `vector<string> qualityCutoff(const vector<int>& scores, int k) {
    priority_queue<int, vector<int>, greater<int>> best;
    vector<string> answer;
    for (int score : scores) {
        best.push(score);
        if ((int)best.size() > k) best.pop();
        answer.push_back((int)best.size() < k ? "NA" : to_string(best.top()));
    }
    return answer;
}`,
      alignment: {
        analogousPattern: "K-th largest element in a stream / bounded top-k heap",
        evidenceWindow: "Microsoft-tagged recent-question data, last three months",
        confidence: "High",
      },
    },
  },
  {
    id: "frequency-rebuild",
    title: "Rebuild the Event Stream",
    shortTitle: "Frequency Rebuild",
    difficulty: "Medium",
    recommendedMinutes: 26,
    statement:
      "A telemetry buffer retained every event code but lost its grouping metadata. Rebuild the sequence so codes with higher total frequency appear first. If two codes occur equally often, the numerically smaller code must appear first. Every original occurrence must remain in the rebuilt stream.",
    inputFormat: [
      "The first line contains n.",
      "The second line contains n integer event codes.",
    ],
    outputFormat: [
      "Print the rebuilt sequence as n space-separated integers.",
    ],
    constraints: [
      "1 ≤ n ≤ 200,000",
      "−1,000,000,000 ≤ event[i] ≤ 1,000,000,000",
      "The tie rule is part of the required output contract.",
    ],
    samples: [
      {
        input: "8\n4 4 1 2 2 2 4 3",
        output: "2 2 2 4 4 4 1 3",
        explanation:
          "Codes 2 and 4 both occur three times, so code 2 wins the tie.",
      },
    ],
    starterCode: frequencyStarter,
    tags: ["frequency heap", "hash map", "custom comparator"],
    tests: [
      { name: "sample", input: "8\n4 4 1 2 2 2 4 3\n", expectedOutput: "2 2 2 4 4 4 1 3\n" },
      { name: "all unique", input: "5\n9 -1 3 0 7\n", expectedOutput: "-1 0 3 7 9\n" },
      { name: "single", input: "1\n42\n", expectedOutput: "42\n" },
      { name: "negative ties", input: "9\n-2 -2 -1 -1 -1 5 5 4 4\n", expectedOutput: "-1 -1 -1 -2 -2 4 4 5 5\n" },
      { name: "dominant value", input: "7\n3 3 3 3 2 1 2\n", expectedOutput: "3 3 3 3 2 2 1\n" },
    ],
    editorial: {
      recognitionSignal:
        "The input must be grouped by global frequency with a deterministic tie-breaker—count first, then prioritize groups.",
      approach: [
        "Count every event code with a hash map.",
        "Push (frequency, code) groups into a max-priority queue whose comparator prefers larger frequency and then smaller code.",
        "Pop one group at a time and append its code frequency times.",
      ],
      complexity: "O(n + u log u) time and O(u) auxiliary space, where u is the number of distinct codes.",
      edgeCases: ["all frequencies equal", "negative codes", "one distinct code", "large duplicate groups"],
      referenceCode: `vector<int> rebuildStream(const vector<int>& events) {
    unordered_map<int, int> frequency;
    for (int event : events) ++frequency[event];

    struct Compare {
        bool operator()(const pair<int, int>& a, const pair<int, int>& b) const {
            if (a.first != b.first) return a.first < b.first;
            return a.second > b.second;
        }
    };
    priority_queue<pair<int, int>, vector<pair<int, int>>, Compare> groups;
    for (auto [event, count] : frequency) groups.push({count, event});

    vector<int> answer;
    while (!groups.empty()) {
        auto [count, event] = groups.top();
        groups.pop();
        while (count--) answer.push_back(event);
    }
    return answer;
}`,
      alignment: {
        analogousPattern: "Sort elements by frequency with a custom heap order",
        evidenceWindow: "Microsoft-tagged question data, last thirty days and three months",
        confidence: "High",
      },
    },
  },
  {
    id: "merge-telemetry-streams",
    title: "Merge Telemetry Streams",
    shortTitle: "Merge Streams",
    difficulty: "Medium",
    recommendedMinutes: 30,
    statement:
      "Several regional collectors independently emit timestamps in non-decreasing order. A central service must produce one globally ordered stream without first copying every value into a separate array and sorting it. Some collectors may have emitted no values.",
    inputFormat: [
      "The first line contains k, the number of collectors.",
      "Each of the next k lines starts with length followed by that many sorted 64-bit timestamps.",
    ],
    outputFormat: [
      "Print all timestamps in non-decreasing order, or EMPTY if every stream is empty.",
    ],
    constraints: [
      "1 ≤ k ≤ 100,000",
      "0 ≤ total number of timestamps ≤ 500,000",
      "Each collector stream is already sorted.",
      "Timestamps fit in signed 64-bit integers.",
    ],
    samples: [
      {
        input: "3\n4 1 4 9 20\n3 2 2 11\n4 -3 5 8 15",
        output: "-3 1 2 2 4 5 8 9 11 15 20",
        explanation:
          "At any moment, only the current smallest unused value from each non-empty stream can be globally next.",
      },
    ],
    starterCode: mergeStreamsStarter,
    tags: ["k-way merge", "min-heap", "sorted streams"],
    tests: [
      { name: "sample", input: "3\n4 1 4 9 20\n3 2 2 11\n4 -3 5 8 15\n", expectedOutput: "-3 1 2 2 4 5 8 9 11 15 20\n" },
      { name: "empty collectors", input: "4\n0\n3 1 2 3\n0\n2 -1 8\n", expectedOutput: "-1 1 2 3 8\n" },
      { name: "all empty", input: "3\n0\n0\n0\n", expectedOutput: "EMPTY\n" },
      { name: "duplicates", input: "3\n3 1 1 1\n2 1 2\n4 0 1 2 2\n", expectedOutput: "0 1 1 1 1 1 2 2 2\n" },
      { name: "64 bit", input: "2\n2 -9000000000000000000 0\n2 1 9000000000000000000\n", expectedOutput: "-9000000000000000000 0 1 9000000000000000000\n" },
    ],
    editorial: {
      recognitionSignal:
        "There are k sorted sources and only one candidate—the current head—from each source can be next.",
      approach: [
        "Insert the first value of every non-empty stream into a min-heap together with its stream and index.",
        "Repeatedly pop the smallest value, append it, and push the next value from the same stream.",
        "The heap never contains more than k elements.",
      ],
      complexity: "O(N log k) time and O(k) auxiliary space for N total timestamps.",
      edgeCases: ["empty streams", "all streams empty", "duplicates", "very uneven stream lengths", "64-bit values"],
      referenceCode: `vector<long long> mergeTelemetry(const vector<vector<long long>>& streams) {
    using Entry = tuple<long long, int, int>;
    priority_queue<Entry, vector<Entry>, greater<Entry>> nextValues;
    for (int stream = 0; stream < (int)streams.size(); ++stream) {
        if (!streams[stream].empty()) nextValues.push({streams[stream][0], stream, 0});
    }

    vector<long long> answer;
    while (!nextValues.empty()) {
        auto [value, stream, index] = nextValues.top();
        nextValues.pop();
        answer.push_back(value);
        if (index + 1 < (int)streams[stream].size()) {
            nextValues.push({streams[stream][index + 1], stream, index + 1});
        }
    }
    return answer;
}`,
      alignment: {
        analogousPattern: "Merge k sorted lists / k-way merge",
        evidenceWindow: "Microsoft-tagged recent-question data plus reported Microsoft variants",
        confidence: "High",
      },
    },
  },
  {
    id: "maintenance-window",
    title: "One Maintenance Window per Day",
    shortTitle: "Maintenance Windows",
    difficulty: "Medium",
    recommendedMinutes: 32,
    statement:
      "Each pending maintenance job may be performed on any integer day from its opening day through its closing day, inclusive. The operations team can finish at most one job per day. Jobs may be processed in any order. Determine the maximum number of jobs that can be completed before their windows close.",
    inputFormat: [
      "The first line contains n.",
      "Each of the next n lines contains openingDay and closingDay for one job.",
    ],
    outputFormat: ["Print the maximum number of jobs that can be completed."],
    constraints: [
      "1 ≤ n ≤ 200,000",
      "1 ≤ openingDay ≤ closingDay ≤ 1,000,000,000",
      "The input windows are not necessarily sorted.",
    ],
    samples: [
      {
        input: "5\n1 2\n2 2\n1 4\n3 3\n4 5",
        output: "5",
        explanation:
          "A valid plan processes one job on each day from 1 through 5; choosing the earliest closing available job avoids wasting narrow windows.",
      },
    ],
    starterCode: maintenanceStarter,
    tags: ["sweep line", "deadline heap", "greedy"],
    tests: [
      { name: "sample", input: "5\n1 2\n2 2\n1 4\n3 3\n4 5\n", expectedOutput: "5\n" },
      { name: "same narrow window", input: "4\n1 2\n2 2\n1 2\n1 1\n", expectedOutput: "2\n" },
      { name: "single", input: "1\n100 100\n", expectedOutput: "1\n" },
      { name: "large gaps", input: "4\n1 1\n100 100\n50 60\n60 60\n", expectedOutput: "4\n" },
      { name: "duplicate windows", input: "6\n2 4\n2 4\n2 4\n2 4\n2 4\n2 4\n", expectedOutput: "3\n" },
    ],
    editorial: {
      recognitionSignal:
        "On each day, several jobs may be available; the job with the earliest deadline is the safest choice.",
      approach: [
        "Sort jobs by opening day.",
        "Sweep through relevant days, adding closing days of newly opened jobs to a min-heap.",
        "Remove expired jobs, then execute the available job with the smallest closing day.",
        "When the heap is empty, jump directly to the next opening day instead of iterating through large gaps.",
      ],
      complexity: "O(n log n) time and O(n) auxiliary space.",
      edgeCases: ["identical windows", "single-day jobs", "large gaps between days", "many already-expired jobs"],
      referenceCode: `int maximumMaintenanceJobs(vector<pair<int, int>> windows) {
    sort(windows.begin(), windows.end());
    priority_queue<int, vector<int>, greater<int>> deadlines;
    int completed = 0, index = 0, n = windows.size();
    long long day = 0;

    while (index < n || !deadlines.empty()) {
        if (deadlines.empty()) day = max(day, (long long)windows[index].first);
        while (index < n && windows[index].first <= day) {
            deadlines.push(windows[index].second);
            ++index;
        }
        while (!deadlines.empty() && deadlines.top() < day) deadlines.pop();
        if (!deadlines.empty()) {
            deadlines.pop();
            ++completed;
            ++day;
        }
    }
    return completed;
}`,
      alignment: {
        analogousPattern: "Maximum number of events that can be attended",
        evidenceWindow: "Microsoft-tagged question data, last three months",
        confidence: "Medium",
      },
    },
  },
  {
    id: "build-agent-cooldown",
    title: "Build Agent Cooldown",
    shortTitle: "Agent Cooldown",
    difficulty: "Medium",
    recommendedMinutes: 34,
    statement:
      "A single build agent executes one job per time slot. Jobs with the same label reuse an isolated environment, so two executions of the same label must have at least cooldown complete slots between them. The agent may stay idle. Reorder the jobs to minimize the time at which all work finishes.",
    inputFormat: [
      "The first line contains n and cooldown.",
      "The second line contains n uppercase job labels.",
    ],
    outputFormat: ["Print the minimum number of time slots required, including idle slots."],
    constraints: [
      "1 ≤ n ≤ 200,000",
      "0 ≤ cooldown ≤ 1,000,000",
      "Each job label is an uppercase English letter.",
    ],
    samples: [
      {
        input: "6 2\nA A A B B B",
        output: "8",
        explanation:
          "One optimal schedule is A B idle A B idle A B.",
      },
    ],
    starterCode: cooldownStarter,
    tags: ["max-heap", "cooldown queue", "scheduling"],
    tests: [
      { name: "sample", input: "6 2\nA A A B B B\n", expectedOutput: "8\n" },
      { name: "zero cooldown", input: "5 0\nA B A C B\n", expectedOutput: "5\n" },
      { name: "single label", input: "4 3\nA A A A\n", expectedOutput: "13\n" },
      { name: "dominant label", input: "6 2\nA A A A B C\n", expectedOutput: "10\n" },
      { name: "enough variety", input: "8 1\nA A A B B B C C\n", expectedOutput: "8\n" },
    ],
    editorial: {
      recognitionSignal:
        "Repeated work cannot return immediately, so the scheduler needs the strongest available candidate plus a separate view of work that is cooling down.",
      approach: [
        "Count the labels and place their remaining counts in a max-heap.",
        "After running a label, place its reduced count in a min-heap keyed by the first slot when that label becomes eligible again.",
        "Before every execution, move all eligible entries back to the max-heap. If none is available, jump time directly to the next release slot.",
        "Use 64-bit time: a long cooldown and one repeated label can create far more than n slots.",
      ],
      complexity: "O(n log alphabet) time and O(alphabet) space; alphabet is 26 here.",
      edgeCases: ["cooldown = 0", "one job type", "several labels tied for maximum frequency", "enough variety to avoid idle slots"],
      referenceCode: `long long minimumBuildSlots(const vector<char>& jobs, int cooldown) {
    array<long long, 26> frequency{};
    for (char job : jobs) ++frequency[job - 'A'];

    priority_queue<long long> available;
    for (long long count : frequency) {
        if (count) available.push(count);
    }

    using Waiting = pair<long long, long long>; // ready time, remaining count
    priority_queue<Waiting, vector<Waiting>, greater<Waiting>> cooling;
    long long time = 0;

    while (!available.empty() || !cooling.empty()) {
        if (available.empty() && cooling.top().first > time) {
            time = cooling.top().first;
        }
        while (!cooling.empty() && cooling.top().first <= time) {
            available.push(cooling.top().second);
            cooling.pop();
        }

        long long remaining = available.top() - 1;
        available.pop();
        ++time;
        if (remaining) cooling.push({time + cooldown, remaining});
    }
    return time;
}`,
      alignment: {
        analogousPattern: "Task Scheduler",
        evidenceWindow: "Microsoft-tagged question data, last three months",
        confidence: "High",
      },
    },
  },
  {
    id: "paired-capacity-plans",
    title: "Cheapest Paired Capacity Plans",
    shortTitle: "Paired Plans",
    difficulty: "Hard",
    recommendedMinutes: 40,
    statement:
      "A deployment needs one primary capacity unit and one secondary capacity unit. Their sorted cost catalogs are given separately. A plan chooses one position from each catalog, and equal values at different positions represent different purchasable plans. Return the k plans with the smallest combined cost.",
    inputFormat: [
      "The first line contains n, m, and k.",
      "The second line contains n non-decreasing primary costs.",
      "The third line contains m non-decreasing secondary costs.",
    ],
    outputFormat: [
      "Print k lines containing primaryCost and secondaryCost.",
      "Order plans by combined cost; break ties by primary index, then secondary index.",
    ],
    constraints: [
      "1 ≤ n, m ≤ 100,000",
      "1 ≤ k ≤ min(n × m, 200,000)",
      "Costs are sorted and fit in signed 64-bit integers.",
      "Use 64-bit arithmetic when comparing combined costs.",
    ],
    samples: [
      {
        input: "3 3 3\n1 7 11\n2 4 6",
        output: "1 2\n1 4\n1 6",
        explanation:
          "Expanding only the next candidate from a popped row avoids materializing all n × m plans.",
      },
    ],
    starterCode: pairPlansStarter,
    tags: ["best-first search", "min-heap", "implicit matrix"],
    tests: [
      { name: "sample", input: "3 3 3\n1 7 11\n2 4 6\n", expectedOutput: "1 2\n1 4\n1 6\n" },
      { name: "duplicate positions", input: "3 2 5\n1 1 2\n1 2\n", expectedOutput: "1 1\n1 1\n1 2\n1 2\n2 1\n" },
      { name: "negative costs", input: "3 3 4\n-4 -1 2\n-3 0 5\n", expectedOutput: "-4 -3\n-4 0\n-1 -3\n-1 0\n" },
      { name: "single result", input: "2 2 1\n5 8\n-2 4\n", expectedOutput: "5 -2\n" },
      { name: "all plans", input: "2 2 4\n1 3\n2 4\n", expectedOutput: "1 2\n1 4\n3 2\n3 4\n" },
    ],
    editorial: {
      recognitionSignal:
        "The Cartesian product is an implicit sorted matrix. You need only its first k cells, not all n × m pairs.",
      approach: [
        "Treat each primary index as a row whose pair sums increase as the secondary index increases.",
        "Seed a min-heap with (i, 0) for only the first min(n, k) rows.",
        "Pop the cheapest pair and push (i, j + 1) from the same row.",
        "Include indices in the heap comparator to satisfy deterministic tie-breaking.",
      ],
      complexity: "O(k log min(n, k)) time and O(min(n, k)) auxiliary space.",
      edgeCases: ["duplicate values at different indices", "negative costs", "k = 1", "k = n × m", "64-bit sums"],
      referenceCode: `vector<pair<long long, long long>> cheapestPlans(
    const vector<long long>& primary,
    const vector<long long>& secondary,
    int k
) {
    using State = tuple<long long, int, int>;
    priority_queue<State, vector<State>, greater<State>> candidates;
    for (int i = 0; i < min<int>(primary.size(), k); ++i) {
        candidates.push({primary[i] + secondary[0], i, 0});
    }

    vector<pair<long long, long long>> answer;
    while (k-- && !candidates.empty()) {
        auto [sum, i, j] = candidates.top();
        candidates.pop();
        answer.push_back({primary[i], secondary[j]});
        if (j + 1 < (int)secondary.size()) {
            candidates.push({primary[i] + secondary[j + 1], i, j + 1});
        }
    }
    return answer;
}`,
      alignment: {
        analogousPattern: "Find k pairs with smallest sums",
        evidenceWindow: "Microsoft-tagged question data, last three months",
        confidence: "High",
      },
    },
  },
];

export const mocks: MockDefinition[] = [
  {
    id: "heap-foundations",
    title: "Heap 01 · Selection Signals",
    subtitle: "Two production-flavored prompts with deliberately indirect signals and sharp tie rules.",
    level: 1,
    durationMinutes: 55,
    problemIds: ["live-quality-cutoff", "frequency-rebuild"],
    focus: ["invariant control", "tie handling", "boundary cases"],
  },
  {
    id: "heap-scheduling",
    title: "Heap 02 · Streams & Deadlines",
    subtitle: "Two operational scenarios where stale state and large input ranges punish shortcuts.",
    level: 2,
    durationMinutes: 70,
    problemIds: ["merge-telemetry-streams", "maintenance-window"],
    focus: ["state discipline", "expiry boundaries", "complexity"],
  },
  {
    id: "heap-pressure",
    title: "Heap 03 · Microsoft Pressure Set",
    subtitle: "Two dense OA-style scenarios designed to punish premature pattern matching.",
    level: 3,
    durationMinutes: 80,
    problemIds: ["build-agent-cooldown", "paired-capacity-plans"],
    focus: ["indirect wording", "64-bit safety", "time management"],
  },
];

export const problemById = new Map(problems.map((problem) => [problem.id, problem]));
export const mockById = new Map(mocks.map((mock) => [mock.id, mock]));

export function toPublicProblem(problem: ProblemDefinition): PublicProblem {
  const { tests: _tests, editorial: _editorial, tags: _tags, ...publicProblem } = problem;
  return publicProblem;
}

export function getPublicCatalog(): PublicMock[] {
  return mocks.map(({ problemIds, ...mock }) => ({
    ...mock,
    problems: problemIds.map((id) => {
      const problem = problemById.get(id);
      if (!problem) throw new Error(`Missing problem: ${id}`);
      return toPublicProblem(problem);
    }),
  }));
}
