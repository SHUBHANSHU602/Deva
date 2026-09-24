import type { MockDefinition, ProblemDefinition } from "../../types/catalog.js";
import { mock, problem, recentEvidence } from "./helpers.js";

export const treeProblems: ProblemDefinition[] = [
  problem({
    id: "recover-tree-orders",
    title: "Recover the Missing Tree Order",
    shortTitle: "Recover Traversal",
    difficulty: "Medium",
    recommendedMinutes: 30,
    statement: "A binary tree has distinct node identifiers. Its preorder and inorder traversals are given. Reconstruct the tree conceptually and print its postorder traversal.",
    inputFormat: ["The first line contains n.", "The second line contains preorder.", "The third line contains inorder."],
    outputFormat: ["Print the postorder traversal, or EMPTY when n = 0."],
    constraints: ["0 ≤ n ≤ 200,000", "All identifiers are distinct and both traversals describe one valid tree."],
    samples: [{ input: "5\n3 9 20 15 7\n9 3 15 20 7", output: "9 15 7 20 3", explanation: "Preorder selects each root; inorder splits its left and right subtrees." }],
    tags: ["tree construction", "preorder", "inorder"],
    tests: [
      { name: "sample", input: "5\n3 9 20 15 7\n9 3 15 20 7\n", expectedOutput: "9 15 7 20 3\n" },
      { name: "empty", input: "0\n\n\n", expectedOutput: "EMPTY\n" },
      { name: "left chain", input: "4\n4 3 2 1\n1 2 3 4\n", expectedOutput: "1 2 3 4\n" },
      { name: "balanced", input: "7\n4 2 1 3 6 5 7\n1 2 3 4 5 6 7\n", expectedOutput: "1 3 2 5 7 6 4\n" },
    ],
    editorial: {
      recognitionSignal: "The next preorder value is the subtree root, and its inorder position uniquely determines both subtree sizes.",
      approach: ["Map every inorder value to its index.", "Consume preorder roots while recursing on inorder ranges.", "Append a root after its two recursive calls to directly produce postorder."],
      complexity: "O(n) time and O(n) map/recursion space.",
      edgeCases: ["empty tree", "fully skewed tree", "single node", "deep recursion"],
      referenceCode: `void solve() {
    int n; cin >> n; vector<long long> preorder(n), inorder(n); for (auto& x : preorder) cin >> x; for (auto& x : inorder) cin >> x;
    if (!n) { cout << "EMPTY\\n"; return; }
    unordered_map<long long, int> position; for (int i = 0; i < n; ++i) position[inorder[i]] = i;
    vector<long long> postorder; int nextRoot = 0;
    function<void(int,int)> build = [&](int left, int right) { if (left > right) return; long long root = preorder[nextRoot++]; int middle = position[root]; build(left, middle - 1); build(middle + 1, right); postorder.push_back(root); };
    build(0, n - 1); for (int i = 0; i < n; ++i) cout << (i ? " " : "") << postorder[i]; cout << '\\n';
}`,
      alignment: { analogousPattern: "Construct Binary Tree from Preorder and Inorder", evidenceWindow: "User revision queue plus Microsoft-tagged public data", confidence: "High" },
    },
  }),
  problem({
    id: "maximum-tree-route",
    title: "Maximum Tree Route Value",
    shortTitle: "Maximum Tree Route",
    difficulty: "Hard",
    recommendedMinutes: 36,
    statement: "A route in a binary tree follows parent-child edges, contains at least one node, and cannot repeat a node. It may start and end anywhere. Return the greatest possible sum of node values. The tree is encoded by level-order tokens; N marks a missing child.",
    inputFormat: ["The first line contains the token count t.", "The second line contains t level-order tokens."],
    outputFormat: ["Print the maximum route sum."],
    constraints: ["1 ≤ t ≤ 200,000", "The first token is not N; node values fit signed 32-bit integers."],
    samples: [{ input: "7\n-10 9 20 N N 15 7", output: "42", explanation: "The best route is 15 → 20 → 7." }],
    tags: ["tree DP", "postorder", "global optimum"],
    tests: [
      { name: "sample", input: "7\n-10 9 20 N N 15 7\n", expectedOutput: "42\n" },
      { name: "all negative", input: "3\n-3 -2 -5\n", expectedOutput: "-2\n" },
      { name: "single", input: "1\n8\n", expectedOutput: "8\n" },
      { name: "one branch discarded", input: "7\n5 4 8 11 N -20 1\n", expectedOutput: "29\n" },
    ],
    editorial: {
      recognitionSignal: "A parent can extend at most one child branch upward, but a completed route at that parent may join both positive branches.",
      approach: ["Postorder each node and compute its best downward gain.", "Clamp negative child gains to zero.", "Update a global answer with node + left gain + right gain."],
      complexity: "O(n) time and O(height) recursion space.",
      edgeCases: ["all negative", "single node", "discard negative branch", "route not through root"],
      referenceCode: `struct Node { long long value; Node *left = nullptr, *right = nullptr; Node(long long v): value(v) {} };
Node* readTree() { int t; cin >> t; vector<string> token(t); for (auto& x : token) cin >> x; if (!t || token[0] == "N") return nullptr; Node* root = new Node(stoll(token[0])); queue<Node*> q; q.push(root); int i = 1; while (!q.empty() && i < t) { Node* p = q.front(); q.pop(); if (i < t && token[i] != "N") { p->left = new Node(stoll(token[i])); q.push(p->left); } ++i; if (i < t && token[i] != "N") { p->right = new Node(stoll(token[i])); q.push(p->right); } ++i; } return root; }
void solve() {
    Node* root = readTree(); long long answer = LLONG_MIN;
    function<long long(Node*)> gain = [&](Node* node) -> long long { if (!node) return 0; long long left = max(0LL, gain(node->left)), right = max(0LL, gain(node->right)); answer = max(answer, node->value + left + right); return node->value + max(left, right); };
    gain(root); cout << answer << '\\n';
}`,
      alignment: { analogousPattern: "Binary Tree Maximum Path Sum", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
  problem({
    id: "lazy-bst-audit",
    title: "Audit a BST Lazily",
    shortTitle: "BST Iterator",
    difficulty: "Medium",
    recommendedMinutes: 30,
    statement: "Build a binary search tree by inserting distinct values, then operate a lazy ascending iterator. NEXT prints the next value. HAS prints YES when another value exists and NO otherwise. Every NEXT is guaranteed valid; materializing the entire traversal before commands is forbidden.",
    inputFormat: ["The first line contains n and q.", "The second line contains n insertion values.", "The next q lines contain NEXT or HAS."],
    outputFormat: ["Print one line for each command."],
    constraints: ["1 ≤ n, q ≤ 200,000", "All inserted values are distinct."],
    samples: [{ input: "5 7\n7 3 15 9 20\nHAS\nNEXT\nNEXT\nHAS\nNEXT\nNEXT\nNEXT", output: "YES\n3\n7\nYES\n9\n15\n20", explanation: "The iterator keeps only the pending left spine." }],
    tags: ["BST", "iterator design", "controlled stack"],
    tests: [
      { name: "sample", input: "5 7\n7 3 15 9 20\nHAS\nNEXT\nNEXT\nHAS\nNEXT\nNEXT\nNEXT\n", expectedOutput: "YES\n3\n7\nYES\n9\n15\n20\n" },
      { name: "one", input: "1 3\n4\nHAS\nNEXT\nHAS\n", expectedOutput: "YES\n4\nNO\n" },
      { name: "descending insert", input: "4 5\n4 3 2 1\nNEXT\nNEXT\nNEXT\nNEXT\nHAS\n", expectedOutput: "1\n2\n3\n4\nNO\n" },
      { name: "interleaved", input: "3 6\n2 1 3\nHAS\nNEXT\nHAS\nNEXT\nHAS\nNEXT\n", expectedOutput: "YES\n1\nYES\n2\nYES\n3\n" },
    ],
    editorial: {
      recognitionSignal: "Inorder order can be generated incrementally by retaining only ancestors whose node or right subtree is still pending.",
      approach: ["Push the root's entire left spine.", "NEXT pops one node, then pushes the left spine of its right child.", "HAS checks whether the stack is non-empty."],
      complexity: "O(1) amortized NEXT, O(1) HAS, and O(height) iterator space.",
      edgeCases: ["single node", "skewed BST", "HAS after exhaustion", "interleaved queries"],
      referenceCode: `struct Node { long long value; Node *left = nullptr, *right = nullptr; Node(long long v): value(v) {} };
void solve() {
    int n, q; cin >> n >> q; Node* root = nullptr;
    for (int i = 0; i < n; ++i) { long long x; cin >> x; Node** link = &root; while (*link) link = x < (*link)->value ? &(*link)->left : &(*link)->right; *link = new Node(x); }
    vector<Node*> pending; auto pushLeft = [&](Node* node) { while (node) { pending.push_back(node); node = node->left; } }; pushLeft(root);
    while (q--) { string command; cin >> command; if (command == "HAS") cout << (pending.empty() ? "NO" : "YES") << '\\n'; else { Node* node = pending.back(); pending.pop_back(); cout << node->value << '\\n'; pushLeft(node->right); } }
}`,
      alignment: { analogousPattern: "Binary Search Tree Iterator", evidenceWindow: "Targeted BST consolidation gap", confidence: "High" },
    },
  }),
  problem({
    id: "canonical-tree-snapshot",
    title: "Canonicalize a Tree Snapshot",
    shortTitle: "Tree Snapshot",
    difficulty: "Medium",
    recommendedMinutes: 32,
    statement: "Deserialize a level-order binary-tree snapshot where N is null, then serialize it canonically: preserve internal N markers but remove all trailing N markers. Print the canonical token count and tokens. An empty tree is represented by count 0 and no token line.",
    inputFormat: ["The first line contains t.", "The second line contains t snapshot tokens when t > 0."],
    outputFormat: ["Print the canonical count; when nonzero, print canonical tokens on the next line."],
    constraints: ["0 ≤ t ≤ 200,000", "Non-empty input begins with a numeric token."],
    samples: [{ input: "11\n1 2 3 N N 4 5 N N N N", output: "7\n1 2 3 N N 4 5", explanation: "Internal null positions remain, but null-only suffix positions carry no structure." }],
    tags: ["tree serialization", "BFS", "null markers"],
    tests: [
      { name: "sample", input: "11\n1 2 3 N N 4 5 N N N N\n", expectedOutput: "7\n1 2 3 N N 4 5\n" },
      { name: "empty", input: "0\n", expectedOutput: "0\n" },
      { name: "right child", input: "7\n1 N 2 N N N N\n", expectedOutput: "3\n1 N 2\n" },
      { name: "single", input: "3\n9 N N\n", expectedOutput: "1\n9\n" },
    ],
    editorial: {
      recognitionSignal: "Null markers inside the sequence define left-versus-right positions; only a suffix of null markers is redundant.",
      approach: ["Deserialize with a queue of real parents.", "Serialize by BFS while emitting markers for null children.", "Trim trailing N tokens before printing."],
      complexity: "O(n) time and O(n) space.",
      edgeCases: ["empty tree", "right-only child", "single node", "long null suffix"],
      referenceCode: `struct Node { string value; Node *left = nullptr, *right = nullptr; Node(string v): value(move(v)) {} };
void solve() {
    int t; cin >> t; if (!t) { cout << 0 << '\\n'; return; } vector<string> token(t); for (auto& x : token) cin >> x;
    Node* root = new Node(token[0]); queue<Node*> build; build.push(root); int i = 1;
    while (!build.empty() && i < t) { Node* p = build.front(); build.pop(); if (i < t && token[i] != "N") { p->left = new Node(token[i]); build.push(p->left); } ++i; if (i < t && token[i] != "N") { p->right = new Node(token[i]); build.push(p->right); } ++i; }
    vector<string> output; queue<Node*> q; q.push(root);
    while (!q.empty()) { Node* node = q.front(); q.pop(); if (!node) output.push_back("N"); else { output.push_back(node->value); q.push(node->left); q.push(node->right); } }
    while (!output.empty() && output.back() == "N") output.pop_back(); cout << output.size() << '\\n'; for (int j = 0; j < (int)output.size(); ++j) cout << (j ? " " : "") << output[j]; cout << '\\n';
}`,
      alignment: { analogousPattern: "Serialize and Deserialize Binary Tree", evidenceWindow: "User revision queue", confidence: "High" },
    },
  }),
  problem({
    id: "nodes-at-routing-distance",
    title: "Nodes at Routing Distance K",
    shortTitle: "Distance K",
    difficulty: "Hard",
    recommendedMinutes: 36,
    statement: "A binary tree has unique values and is encoded by level-order tokens with N for null. Given a target value and k, print all node values exactly k edges from the target in increasing order, or EMPTY if none exist.",
    inputFormat: ["The first line contains t, target, and k.", "The second line contains t level-order tokens."],
    outputFormat: ["Print sorted values at distance k, or EMPTY."],
    constraints: ["1 ≤ t ≤ 200,000", "0 ≤ k ≤ 200,000", "The target exists and values are unique."],
    samples: [{ input: "11 5 2\n3 5 1 6 2 0 8 N N 7 4", output: "1 4 7", explanation: "Distance can travel down through children or upward through a parent." }],
    tags: ["tree", "parent map", "BFS"],
    tests: [
      { name: "sample", input: "11 5 2\n3 5 1 6 2 0 8 N N 7 4\n", expectedOutput: "1 4 7\n" },
      { name: "zero", input: "3 2 0\n2 1 3\n", expectedOutput: "2\n" },
      { name: "beyond", input: "3 1 5\n2 1 3\n", expectedOutput: "EMPTY\n" },
      { name: "from leaf", input: "7 1 2\n4 2 6 1 3 5 7\n", expectedOutput: "3 4\n" },
    ],
    editorial: {
      recognitionSignal: "Distance from a non-root target requires moving upward, so the rooted tree must be viewed as an undirected graph.",
      approach: ["Build parent pointers while locating the target.", "Run BFS from the target over left, right, and parent neighbors.", "Stop expansion at depth k, sort that frontier, and print it."],
      complexity: "O(n + a log a) time, where a is the answer size, and O(n) space.",
      edgeCases: ["k equals zero", "target is a leaf", "distance beyond tree", "avoid revisiting parent-child edges"],
      referenceCode: `struct Node { long long value; Node *left = nullptr, *right = nullptr; Node(long long v): value(v) {} };
void solve() {
    int t, k; long long targetValue; cin >> t >> targetValue >> k; vector<string> token(t); for (auto& x : token) cin >> x;
    Node* root = new Node(stoll(token[0])), *target = nullptr; unordered_map<Node*, Node*> parent; queue<Node*> q; q.push(root); int i = 1;
    while (!q.empty()) { Node* p = q.front(); q.pop(); if (p->value == targetValue) target = p; if (i < t) { if (token[i] != "N") { p->left = new Node(stoll(token[i])); parent[p->left] = p; q.push(p->left); } ++i; } if (i < t) { if (token[i] != "N") { p->right = new Node(stoll(token[i])); parent[p->right] = p; q.push(p->right); } ++i; } }
    queue<Node*> frontier; frontier.push(target); unordered_set<Node*> seen{target}; int distance = 0;
    while (!frontier.empty() && distance < k) { int width = frontier.size(); while (width--) { Node* node = frontier.front(); frontier.pop(); for (Node* next : {node->left, node->right, parent.count(node) ? parent[node] : nullptr}) if (next && !seen.count(next)) { seen.insert(next); frontier.push(next); } } ++distance; }
    vector<long long> answer; while (!frontier.empty()) { answer.push_back(frontier.front()->value); frontier.pop(); } sort(answer.begin(), answer.end());
    if (answer.empty()) cout << "EMPTY"; else for (int j = 0; j < (int)answer.size(); ++j) cout << (j ? " " : "") << answer[j]; cout << '\\n';
}`,
      alignment: { analogousPattern: "All Nodes Distance K in Binary Tree", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
  problem({
    id: "vertical-tree-report",
    title: "Produce a Vertical Tree Report",
    shortTitle: "Vertical Report",
    difficulty: "Hard",
    recommendedMinutes: 38,
    statement: "Assign the root row 0, column 0; a left child is (row+1, column−1) and a right child is (row+1, column+1). Report columns left to right. Within a column, sort by row then value. The tree uses level-order tokens with N for null.",
    inputFormat: ["The first line contains t.", "The second line contains t tokens."],
    outputFormat: ["Print the number of non-empty columns, then one line of values per column."],
    constraints: ["1 ≤ t ≤ 200,000", "Node values fit signed 32-bit integers."],
    samples: [{ input: "7\n3 9 20 N N 15 7", output: "4\n9\n3 15\n20\n7", explanation: "Node 15 shares column 0 with root 3 but appears later by row." }],
    tags: ["tree", "coordinates", "multi-key sorting"],
    tests: [
      { name: "sample", input: "7\n3 9 20 N N 15 7\n", expectedOutput: "4\n9\n3 15\n20\n7\n" },
      { name: "tie by value", input: "7\n1 2 3 N 6 5 N\n", expectedOutput: "3\n2\n1 5 6\n3\n" },
      { name: "single", input: "1\n8\n", expectedOutput: "1\n8\n" },
      { name: "left chain", input: "7\n4 3 N 2 N 1 N\n", expectedOutput: "4\n1\n2\n3\n4\n" },
    ],
    editorial: {
      recognitionSignal: "The output contract is a lexicographic ordering of triples (column, row, value).",
      approach: ["Traverse while recording one triple per node.", "Sort triples by column, then row, then value.", "Group adjacent triples with equal column."],
      complexity: "O(n log n) time and O(n) space.",
      edgeCases: ["same row and column", "negative columns", "single node", "skewed tree"],
      referenceCode: `struct Node { long long value; Node *left = nullptr, *right = nullptr; Node(long long v): value(v) {} };
void solve() {
    int t; cin >> t; vector<string> token(t); for (auto& x : token) cin >> x; Node* root = new Node(stoll(token[0])); queue<Node*> build; build.push(root); int i = 1;
    while (!build.empty() && i < t) { Node* p = build.front(); build.pop(); if (i < t && token[i] != "N") { p->left = new Node(stoll(token[i])); build.push(p->left); } ++i; if (i < t && token[i] != "N") { p->right = new Node(stoll(token[i])); build.push(p->right); } ++i; }
    vector<tuple<int,int,long long>> nodes; queue<tuple<Node*,int,int>> q; q.push({root, 0, 0});
    while (!q.empty()) { auto [node, row, column] = q.front(); q.pop(); nodes.push_back({column, row, node->value}); if (node->left) q.push({node->left, row + 1, column - 1}); if (node->right) q.push({node->right, row + 1, column + 1}); }
    sort(nodes.begin(), nodes.end()); vector<vector<long long>> columns;
    for (int j = 0; j < (int)nodes.size();) { int column = get<0>(nodes[j]); columns.push_back({}); while (j < (int)nodes.size() && get<0>(nodes[j]) == column) columns.back().push_back(get<2>(nodes[j++])); }
    cout << columns.size() << '\\n'; for (auto& values : columns) { for (int j = 0; j < (int)values.size(); ++j) cout << (j ? " " : "") << values[j]; cout << '\\n'; }
}`,
      alignment: { analogousPattern: "Vertical Order Traversal", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
];

export const treeMocks: MockDefinition[] = [
  mock("trees-bst", "trees-structure", "Trees 01 · Recover Structure", "Construction and path-state recursion test whether traversal meaning is truly internalized.", 1, 70, ["recover-tree-orders", "maximum-tree-route"], ["traversal ranges", "postorder DP", "negative gains"]),
  mock("trees-bst", "trees-stateful", "Trees 02 · Stateful Traversal", "Expose only the necessary frontier in an iterator, then preserve exact shape through null markers.", 2, 65, ["lazy-bst-audit", "canonical-tree-snapshot"], ["BST stack", "serialization", "stateful API"]),
  mock("trees-bst", "trees-coordinate-pressure", "Trees 03 · Graph & Coordinate Pressure", "Convert parent links into graph edges and enforce multi-key geometric ordering.", 3, 78, ["nodes-at-routing-distance", "vertical-tree-report"], ["parent map", "BFS frontier", "coordinate sort"]),
];
