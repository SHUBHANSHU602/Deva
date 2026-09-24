import type { MockDefinition, ProblemDefinition } from "../../types/catalog.js";
import { mock, problem, recentEvidence } from "./helpers.js";

export const linkedListProblems: ProblemDefinition[] = [
  problem({
    id: "sum-reversed-ledgers",
    title: "Merge Two Reversed Ledgers",
    shortTitle: "Reversed Ledgers",
    difficulty: "Medium",
    recommendedMinutes: 25,
    statement: "Two non-negative integers are stored as digit chains with the least significant digit first. Add them and print the resulting chain in the same order. Leading zeroes do not occur except for the number zero.",
    inputFormat: ["The first line contains n followed by n digits.", "The second line contains m followed by m digits."],
    outputFormat: ["Print the result length followed by its digits."],
    constraints: ["1 ≤ n, m ≤ 100,000", "Every digit is between 0 and 9."],
    samples: [{ input: "3 2 4 3\n3 5 6 4", output: "3 7 0 8", explanation: "342 + 465 = 807, represented as 7 → 0 → 8." }],
    tags: ["linked list", "carry", "dummy head"],
    tests: [
      { name: "sample", input: "3 2 4 3\n3 5 6 4\n", expectedOutput: "3 7 0 8\n" },
      { name: "final carry", input: "2 9 9\n1 1\n", expectedOutput: "3 0 0 1\n" },
      { name: "unequal", input: "1 5\n4 5 4 3 2\n", expectedOutput: "4 0 5 3 2\n" },
      { name: "zero", input: "1 0\n1 0\n", expectedOutput: "1 0\n" },
    ],
    editorial: {
      recognitionSignal: "The reversed representation lets addition proceed in traversal order; the only state crossing nodes is carry.",
      approach: ["Walk both chains while either has a digit or carry remains.", "Add available digits and carry, append sum % 10, and update carry.", "A dummy head avoids a special first-node case."],
      complexity: "O(max(n, m)) time and output space.",
      edgeCases: ["final carry", "unequal lengths", "zero", "long carry chain"],
      referenceCode: `void solve() {
    int n; cin >> n; vector<int> a(n); for (int& x : a) cin >> x;
    int m; cin >> m; vector<int> b(m); for (int& x : b) cin >> x;
    vector<int> answer; int carry = 0;
    for (int i = 0; i < n || i < m || carry; ++i) {
        int sum = carry + (i < n ? a[i] : 0) + (i < m ? b[i] : 0);
        answer.push_back(sum % 10); carry = sum / 10;
    }
    cout << answer.size(); for (int digit : answer) cout << ' ' << digit; cout << '\\n';
}`,
      alignment: { analogousPattern: "Add Two Numbers", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
  problem({
    id: "clone-routing-graph",
    title: "Clone a Routed Node Chain",
    shortTitle: "Clone Random Chain",
    difficulty: "Medium",
    recommendedMinutes: 32,
    statement: "A chain has next links in index order and one optional routing link per node. Routing value −1 means null; otherwise it is a zero-based node index. Construct a deep copy without using a map from original nodes to copies, then print the copied values and routing indices.",
    inputFormat: ["The first line contains n.", "The second line contains n node values.", "The third line contains n routing indices."],
    outputFormat: ["Print copied values on one line and copied routing indices on the next."],
    constraints: ["0 ≤ n ≤ 100,000", "−1 ≤ route[i] < n"],
    samples: [{ input: "4\n7 13 11 10\n-1 0 3 1", output: "7 13 11 10\n-1 0 3 1", explanation: "The copy preserves topology while owning distinct nodes." }],
    tags: ["linked list", "interleaving copy", "random pointer"],
    tests: [
      { name: "sample", input: "4\n7 13 11 10\n-1 0 3 1\n", expectedOutput: "7 13 11 10\n-1 0 3 1\n" },
      { name: "empty", input: "0\n\n\n", expectedOutput: "EMPTY\nEMPTY\n" },
      { name: "self", input: "1\n9\n0\n", expectedOutput: "9\n0\n" },
      { name: "all null", input: "3\n1 2 3\n-1 -1 -1\n", expectedOutput: "1 2 3\n-1 -1 -1\n" },
    ],
    editorial: {
      recognitionSignal: "The no-map constraint suggests placing each copy next to its original so an original pointer can find its copy in O(1).",
      approach: ["Interleave copied nodes after originals.", "Set each copy's route to original.route.next.", "Detach the two chains while restoring the original."],
      complexity: "O(n) time and O(1) auxiliary space, excluding copied nodes.",
      edgeCases: ["empty chain", "self route", "null routes", "backward and forward routes"],
      referenceCode: `struct Node { long long value; Node* next = nullptr; Node* route = nullptr; Node(long long v): value(v) {} };
void solve() {
    int n; cin >> n; if (!n) { cout << "EMPTY\\nEMPTY\\n"; return; }
    vector<long long> values(n); for (auto& x : values) cin >> x;
    vector<int> route(n); for (int& x : route) cin >> x;
    vector<Node*> original(n); for (int i = 0; i < n; ++i) original[i] = new Node(values[i]);
    for (int i = 0; i + 1 < n; ++i) original[i]->next = original[i + 1];
    for (int i = 0; i < n; ++i) if (route[i] != -1) original[i]->route = original[route[i]];
    for (Node* current = original[0]; current;) { Node* copy = new Node(current->value); copy->next = current->next; current->next = copy; current = copy->next; }
    for (Node* current = original[0]; current; current = current->next->next) if (current->route) current->next->route = current->route->next;
    Node* copyHead = original[0]->next;
    for (Node* current = original[0]; current;) { Node* copy = current->next; current->next = copy->next; current = current->next; copy->next = current ? current->next : nullptr; }
    vector<Node*> copied; for (Node* p = copyHead; p; p = p->next) copied.push_back(p);
    unordered_map<Node*, int> index; for (int i = 0; i < n; ++i) index[copied[i]] = i;
    for (int i = 0; i < n; ++i) cout << (i ? " " : "") << copied[i]->value; cout << '\\n';
    for (int i = 0; i < n; ++i) cout << (i ? " " : "") << (copied[i]->route ? index[copied[i]->route] : -1); cout << '\\n';
}`,
      alignment: { analogousPattern: "Copy List with Random Pointer", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
  problem({
    id: "reverse-maintenance-window",
    title: "Reverse a Maintenance Window",
    shortTitle: "Reverse Window",
    difficulty: "Medium",
    recommendedMinutes: 25,
    statement: "A singly linked work queue is given in traversal order. Reverse nodes from one-based position left through right in place, using one pass, and print the resulting queue.",
    inputFormat: ["The first line contains n, left, and right.", "The second line contains n values."],
    outputFormat: ["Print the reordered values."],
    constraints: ["1 ≤ left ≤ right ≤ n ≤ 200,000"],
    samples: [{ input: "5 2 4\n1 2 3 4 5", output: "1 4 3 2 5", explanation: "Only positions 2 through 4 are reversed." }],
    tags: ["linked list", "pointer rewiring", "dummy head"],
    tests: [
      { name: "sample", input: "5 2 4\n1 2 3 4 5\n", expectedOutput: "1 4 3 2 5\n" },
      { name: "whole", input: "4 1 4\n1 2 3 4\n", expectedOutput: "4 3 2 1\n" },
      { name: "one node", input: "3 2 2\n8 9 10\n", expectedOutput: "8 9 10\n" },
      { name: "tail", input: "5 3 5\n1 2 3 4 5\n", expectedOutput: "1 2 5 4 3\n" },
    ],
    editorial: {
      recognitionSignal: "The segment may start at the head, so a dummy predecessor makes every case use the same rewiring.",
      approach: ["Move a predecessor to the node before left.", "Repeatedly remove the node after the segment tail and insert it after the predecessor.", "Perform right − left head insertions."],
      complexity: "O(n) time and O(1) auxiliary space.",
      edgeCases: ["left equals right", "segment starts at head", "segment ends at tail", "entire chain"],
      referenceCode: `struct Node { long long value; Node* next; Node(long long v): value(v), next(nullptr) {} };
void solve() {
    int n, left, right; cin >> n >> left >> right; Node dummy(0), *tail = &dummy;
    for (int i = 0; i < n; ++i) { long long x; cin >> x; tail->next = new Node(x); tail = tail->next; }
    Node* before = &dummy; for (int i = 1; i < left; ++i) before = before->next;
    Node* segmentTail = before->next;
    for (int i = left; i < right; ++i) { Node* moved = segmentTail->next; segmentTail->next = moved->next; moved->next = before->next; before->next = moved; }
    for (Node* p = dummy.next; p; p = p->next) cout << (p == dummy.next ? "" : " ") << p->value; cout << '\\n';
}`,
      alignment: { analogousPattern: "Reverse Linked List II", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
  problem({
    id: "reverse-service-batches",
    title: "Reverse Complete Service Batches",
    shortTitle: "Reverse K Batch",
    difficulty: "Hard",
    recommendedMinutes: 38,
    statement: "Reverse a singly linked queue in consecutive groups of exactly k nodes. If fewer than k nodes remain, preserve their order. Node values may not be swapped; links must be changed.",
    inputFormat: ["The first line contains n and k.", "The second line contains n values."],
    outputFormat: ["Print the reordered queue."],
    constraints: ["1 ≤ k ≤ n ≤ 200,000"],
    samples: [{ input: "5 2\n1 2 3 4 5", output: "2 1 4 3 5", explanation: "Two full pairs are reversed and the final node remains." }],
    tags: ["linked list", "k-group reversal", "boundary scan"],
    tests: [
      { name: "sample", input: "5 2\n1 2 3 4 5\n", expectedOutput: "2 1 4 3 5\n" },
      { name: "three", input: "8 3\n1 2 3 4 5 6 7 8\n", expectedOutput: "3 2 1 6 5 4 7 8\n" },
      { name: "one", input: "4 1\n5 6 7 8\n", expectedOutput: "5 6 7 8\n" },
      { name: "whole", input: "4 4\n1 2 3 4\n", expectedOutput: "4 3 2 1\n" },
    ],
    editorial: {
      recognitionSignal: "A group must be proven complete before rewiring; otherwise an incomplete suffix could be damaged.",
      approach: ["From the previous group tail, locate the kth node or stop.", "Reverse links up to the node after kth.", "Reconnect the previous boundary and advance it to the old group head."],
      complexity: "O(n) time and O(1) auxiliary space.",
      edgeCases: ["k equals 1", "k equals n", "incomplete suffix", "multiple full groups"],
      referenceCode: `struct Node { long long value; Node* next; Node(long long v): value(v), next(nullptr) {} };
void solve() {
    int n, k; cin >> n >> k; Node dummy(0), *tail = &dummy;
    for (int i = 0; i < n; ++i) { long long x; cin >> x; tail->next = new Node(x); tail = tail->next; }
    Node* groupBefore = &dummy;
    while (true) {
        Node* kth = groupBefore; for (int i = 0; i < k && kth; ++i) kth = kth->next; if (!kth) break;
        Node* after = kth->next; Node* previous = after; Node* current = groupBefore->next;
        while (current != after) { Node* next = current->next; current->next = previous; previous = current; current = next; }
        Node* oldHead = groupBefore->next; groupBefore->next = kth; groupBefore = oldHead;
    }
    for (Node* p = dummy.next; p; p = p->next) cout << (p == dummy.next ? "" : " ") << p->value; cout << '\\n';
}`,
      alignment: { analogousPattern: "Reverse Nodes in k-Group", evidenceWindow: "User revision queue plus Microsoft-tagged public data", confidence: "High" },
    },
  }),
  problem({
    id: "bounded-cache-console",
    title: "Operate a Bounded Cache Console",
    shortTitle: "LRU Console",
    difficulty: "Hard",
    recommendedMinutes: 40,
    statement: "Implement a cache with fixed capacity. GET key returns its value or −1 and makes a hit most recently used. PUT key value updates or inserts the key and also makes it most recent; when full, evict the least recently used key. Print every GET result.",
    inputFormat: ["The first line contains capacity and q.", "The next q lines contain GET key or PUT key value."],
    outputFormat: ["Print one line per GET."],
    constraints: ["1 ≤ capacity, q ≤ 200,000", "Keys and values fit signed 32-bit integers."],
    samples: [{ input: "2 9\nPUT 1 1\nPUT 2 2\nGET 1\nPUT 3 3\nGET 2\nPUT 4 4\nGET 1\nGET 3\nGET 4", output: "1\n-1\n-1\n3\n4", explanation: "Hits change recency, so keys 2 and then 1 are evicted." }],
    tags: ["LRU cache", "hash map", "doubly linked list"],
    tests: [
      { name: "sample", input: "2 9\nPUT 1 1\nPUT 2 2\nGET 1\nPUT 3 3\nGET 2\nPUT 4 4\nGET 1\nGET 3\nGET 4\n", expectedOutput: "1\n-1\n-1\n3\n4\n" },
      { name: "update", input: "2 6\nPUT 1 5\nPUT 2 6\nPUT 1 9\nPUT 3 7\nGET 1\nGET 2\n", expectedOutput: "9\n-1\n" },
      { name: "capacity one", input: "1 5\nPUT 8 1\nGET 8\nPUT 9 2\nGET 8\nGET 9\n", expectedOutput: "1\n-1\n2\n" },
      { name: "miss no effect", input: "2 5\nPUT 1 1\nPUT 2 2\nGET 9\nPUT 3 3\nGET 1\n", expectedOutput: "-1\n-1\n" },
    ],
    editorial: {
      recognitionSignal: "O(1) lookup needs hashing, while O(1) arbitrary recency movement needs a doubly linked list.",
      approach: ["Keep most recent entries at the front of a list.", "Map each key to its list iterator.", "On access, splice to the front; on overflow, remove the back key from both structures."],
      complexity: "O(1) average time per command and O(capacity) space.",
      edgeCases: ["update existing key", "capacity one", "miss does not change order", "hit before eviction"],
      referenceCode: `void solve() {
    int capacity, q; cin >> capacity >> q;
    list<pair<int, int>> order; unordered_map<int, list<pair<int, int>>::iterator> where;
    while (q--) {
        string command; int key; cin >> command >> key;
        if (command == "GET") {
            auto it = where.find(key); if (it == where.end()) { cout << -1 << '\\n'; continue; }
            order.splice(order.begin(), order, it->second); cout << it->second->second << '\\n';
        } else {
            int value; cin >> value; auto it = where.find(key);
            if (it != where.end()) { it->second->second = value; order.splice(order.begin(), order, it->second); }
            else { order.push_front({key, value}); where[key] = order.begin(); if ((int)order.size() > capacity) { where.erase(order.back().first); order.pop_back(); } }
        }
    }
}`,
      alignment: { analogousPattern: "LRU Cache", evidenceWindow: "Targeted user gap plus Microsoft-tagged public data", confidence: "High" },
    },
  }),
  problem({
    id: "partition-priority-chain",
    title: "Partition a Priority Chain",
    shortTitle: "Stable Partition",
    difficulty: "Medium",
    recommendedMinutes: 28,
    statement: "Rewire a singly linked chain so every value smaller than pivot appears before every value greater than or equal to pivot. Preserve relative order within both groups.",
    inputFormat: ["The first line contains n and pivot.", "The second line contains n values."],
    outputFormat: ["Print the stable partitioned chain."],
    constraints: ["0 ≤ n ≤ 200,000", "Values and pivot fit signed 32-bit integers."],
    samples: [{ input: "6 3\n1 4 3 2 5 2", output: "1 2 2 4 3 5", explanation: "Both partitions retain their original internal order." }],
    tags: ["linked list", "stable partition", "two dummy heads"],
    tests: [
      { name: "sample", input: "6 3\n1 4 3 2 5 2\n", expectedOutput: "1 2 2 4 3 5\n" },
      { name: "all before", input: "3 10\n1 2 3\n", expectedOutput: "1 2 3\n" },
      { name: "all after", input: "4 0\n0 2 1 0\n", expectedOutput: "0 2 1 0\n" },
      { name: "empty", input: "0 5\n\n", expectedOutput: "EMPTY\n" },
    ],
    editorial: {
      recognitionSignal: "Stable partitioning is easier by building two chains than by repeatedly moving nodes in one chain.",
      approach: ["Append each node to a smaller or not-smaller chain.", "Terminate the second chain to avoid retaining an old link.", "Connect the first tail to the second head."],
      complexity: "O(n) time and O(1) auxiliary node space.",
      edgeCases: ["empty chain", "all in one partition", "values equal pivot", "stability"],
      referenceCode: `struct Node { long long value; Node* next; Node(long long v): value(v), next(nullptr) {} };
void solve() {
    int n; long long pivot; cin >> n >> pivot; Node beforeDummy(0), afterDummy(0); Node *before = &beforeDummy, *after = &afterDummy;
    for (int i = 0; i < n; ++i) { long long x; cin >> x; Node* node = new Node(x); if (x < pivot) before = before->next = node; else after = after->next = node; }
    before->next = afterDummy.next; Node* head = beforeDummy.next;
    if (!head) { cout << "EMPTY\\n"; return; }
    for (Node* p = head; p; p = p->next) cout << (p == head ? "" : " ") << p->value; cout << '\\n';
}`,
      alignment: { analogousPattern: "Partition List", evidenceWindow: recentEvidence, confidence: "Medium" },
    },
  }),
];

export const linkedListMocks: MockDefinition[] = [
  mock("linked-list-design", "linked-copy-arithmetic", "Linked List 01 · Copy & Carry", "Traverse two chains safely, then clone a graph-like pointer structure without a lookup map.", 1, 65, ["sum-reversed-ledgers", "clone-routing-graph"], ["carry", "interleaving copy", "pointer ownership"]),
  mock("linked-list-design", "linked-rewiring", "Linked List 02 · Rewiring Boundaries", "Two pointer-heavy reversals test dummy nodes, boundaries, and incomplete groups.", 2, 70, ["reverse-maintenance-window", "reverse-service-batches"], ["dummy head", "segment boundaries", "k-group"]),
  mock("linked-list-design", "linked-design-pressure", "Linked List 03 · Stateful Design", "Pair stable chain construction with a production-style O(1) cache contract.", 3, 75, ["partition-priority-chain", "bounded-cache-console"], ["stable partition", "hash + list", "operation invariants"]),
];
