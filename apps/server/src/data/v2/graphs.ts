import type { MockDefinition, ProblemDefinition } from "../../types/catalog.js";
import { mock, problem, recentEvidence } from "./helpers.js";

export const graphProblems: ProblemDefinition[] = [
  problem({
    id: "shortest-word-rollout",
    title: "Shortest Word Rollout",
    shortTitle: "Word Rollout",
    difficulty: "Medium",
    recommendedMinutes: 30,
    statement: "Transform start into target by changing exactly one character per step. Every word after start must belong to the supplied dictionary, and all words have equal lowercase length. Return the number of words in a shortest sequence, including both endpoints, or 0 if none exists.",
    inputFormat: ["The first line contains start, target, and n.", "The next n lines contain dictionary words."],
    outputFormat: ["Print the shortest sequence length, or 0."],
    constraints: ["1 ≤ word length ≤ 20", "0 ≤ n ≤ 100,000", "Total dictionary characters ≤ 1,000,000"],
    samples: [{ input: "hit cog 6\nhot\ndot\ndog\nlot\nlog\ncog", output: "5", explanation: "One shortest rollout is hit → hot → dot → dog → cog." }],
    tags: ["graph", "implicit neighbors", "BFS"],
    tests: [
      { name: "sample", input: "hit cog 6\nhot\ndot\ndog\nlot\nlog\ncog\n", expectedOutput: "5\n" },
      { name: "missing target", input: "hit cog 5\nhot\ndot\ndog\nlot\nlog\n", expectedOutput: "0\n" },
      { name: "same", input: "same same 0\n", expectedOutput: "1\n" },
      { name: "direct", input: "a c 2\nb\nc\n", expectedOutput: "2\n" },
    ],
    editorial: {
      recognitionSignal: "Every valid one-character mutation has equal cost, so shortest transformation is an unweighted shortest-path problem.",
      approach: ["Store unused dictionary words in a hash set.", "BFS from start, generating each one-character mutation.", "Erase a word when enqueued so it is never revisited."],
      complexity: "O(n × L × alphabet) time and O(n × L) space.",
      edgeCases: ["target absent", "start equals target", "direct change", "duplicate dictionary words"],
      referenceCode: `void solve() {
    string start, target; int n; cin >> start >> target >> n; unordered_set<string> unused; for (int i = 0; i < n; ++i) { string word; cin >> word; unused.insert(word); }
    if (start == target) { cout << 1 << '\\n'; return; } if (!unused.count(target)) { cout << 0 << '\\n'; return; }
    queue<pair<string,int>> q; q.push({start, 1}); unused.erase(start);
    while (!q.empty()) { auto [word, distance] = q.front(); q.pop(); for (int i = 0; i < (int)word.size(); ++i) { char saved = word[i]; for (char c = 'a'; c <= 'z'; ++c) { if (c == saved) continue; word[i] = c; if (word == target) { cout << distance + 1 << '\\n'; return; } auto it = unused.find(word); if (it != unused.end()) { q.push({word, distance + 1}); unused.erase(it); } } word[i] = saved; } }
    cout << 0 << '\\n';
}`,
      alignment: { analogousPattern: "Word Ladder", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
  problem({
    id: "lexicographic-build-plan",
    title: "Lexicographically Smallest Build Plan",
    shortTitle: "Build Plan",
    difficulty: "Medium",
    recommendedMinutes: 30,
    statement: "There are n modules numbered 0 through n−1. A dependency pair a b means module b must be built before module a. Print the lexicographically smallest valid build order, or IMPOSSIBLE when dependencies contain a cycle.",
    inputFormat: ["The first line contains n and m.", "The next m lines contain a and b."],
    outputFormat: ["Print n module ids, or IMPOSSIBLE."],
    constraints: ["1 ≤ n ≤ 200,000", "0 ≤ m ≤ 400,000"],
    samples: [{ input: "4 4\n1 0\n2 0\n3 1\n3 2", output: "0 1 2 3", explanation: "When both 1 and 2 become available, lexicographic order chooses 1." }],
    tags: ["directed graph", "Kahn algorithm", "min heap"],
    tests: [
      { name: "sample", input: "4 4\n1 0\n2 0\n3 1\n3 2\n", expectedOutput: "0 1 2 3\n" },
      { name: "cycle", input: "3 3\n1 0\n2 1\n0 2\n", expectedOutput: "IMPOSSIBLE\n" },
      { name: "no edges", input: "4 0\n", expectedOutput: "0 1 2 3\n" },
      { name: "choice", input: "5 3\n4 1\n4 2\n3 0\n", expectedOutput: "0 1 2 3 4\n" },
    ],
    editorial: {
      recognitionSignal: "Prerequisites define a DAG order; lexicographic minimality changes Kahn's zero-indegree queue into a min-heap.",
      approach: ["Create edges prerequisite → dependent and count indegrees.", "Repeatedly take the smallest zero-indegree module.", "If fewer than n modules are emitted, a directed cycle exists."],
      complexity: "O((n + m) log n) time and O(n + m) space.",
      edgeCases: ["cycle", "isolated modules", "multiple available modules", "duplicate dependencies"],
      referenceCode: `void solve() {
    int n, m; cin >> n >> m; vector<vector<int>> graph(n); vector<int> indegree(n);
    for (int i = 0; i < m; ++i) { int a, b; cin >> a >> b; graph[b].push_back(a); ++indegree[a]; }
    priority_queue<int, vector<int>, greater<int>> ready; for (int i = 0; i < n; ++i) if (!indegree[i]) ready.push(i); vector<int> order;
    while (!ready.empty()) { int node = ready.top(); ready.pop(); order.push_back(node); for (int next : graph[node]) if (--indegree[next] == 0) ready.push(next); }
    if ((int)order.size() != n) { cout << "IMPOSSIBLE\\n"; return; } for (int i = 0; i < n; ++i) cout << (i ? " " : "") << order[i]; cout << '\\n';
}`,
      alignment: { analogousPattern: "Course Schedule II", evidenceWindow: "User revision queue plus Microsoft interview patterns", confidence: "High" },
    },
  }),
  problem({
    id: "merge-identity-accounts",
    title: "Merge Identity Accounts",
    shortTitle: "Identity Accounts",
    difficulty: "Medium",
    recommendedMinutes: 35,
    statement: "Each account has a name and one or more email addresses. Accounts sharing any email belong to the same person; all accounts of one person use the same name. Merge transitively. Sort emails within a person, then sort output people by name and their first email.",
    inputFormat: ["The first line contains n.", "Each of the next n lines contains name, k, then k emails; names contain no spaces."],
    outputFormat: ["Print the number of people. For each person print name, email count, and sorted emails."],
    constraints: ["1 ≤ n ≤ 100,000", "Total email occurrences ≤ 300,000"],
    samples: [{ input: "4\nJohn 2 a@mail b@mail\nJohn 2 b@mail c@mail\nMary 1 m@mail\nJohn 1 z@mail", output: "3\nJohn 3 a@mail b@mail c@mail\nJohn 1 z@mail\nMary 1 m@mail", explanation: "The first two accounts merge through b@mail; the other John account remains separate." }],
    tags: ["DSU", "transitive merge", "deterministic output"],
    tests: [
      { name: "sample", input: "4\nJohn 2 a@mail b@mail\nJohn 2 b@mail c@mail\nMary 1 m@mail\nJohn 1 z@mail\n", expectedOutput: "3\nJohn 3 a@mail b@mail c@mail\nJohn 1 z@mail\nMary 1 m@mail\n" },
      { name: "chain merge", input: "3\nA 2 x y\nA 2 y z\nA 2 z w\n", expectedOutput: "1\nA 4 w x y z\n" },
      { name: "separate", input: "2\nB 1 q\nA 1 p\n", expectedOutput: "2\nA 1 p\nB 1 q\n" },
      { name: "duplicate within", input: "1\nKai 3 x x y\n", expectedOutput: "1\nKai 2 x y\n" },
    ],
    editorial: {
      recognitionSignal: "Shared identifiers form transitive connected components, which is exactly the equivalence relation maintained by DSU.",
      approach: ["Union account indices whenever an email was seen in another account.", "Collect unique emails by final representative.", "Sort each component and then sort components by the required output keys."],
      complexity: "O(E α(n) + E log E) time and O(E + n) space.",
      edgeCases: ["transitive overlap", "same name but no overlap", "duplicate email in one account", "deterministic ordering"],
      referenceCode: `struct DSU { vector<int> p, size; DSU(int n): p(n), size(n,1) { iota(p.begin(), p.end(), 0); } int find(int x) { return p[x] == x ? x : p[x] = find(p[x]); } void join(int a, int b) { a=find(a); b=find(b); if(a==b)return; if(size[a]<size[b])swap(a,b); p[b]=a; size[a]+=size[b]; } };
void solve() {
    int n; cin >> n; vector<string> name(n); vector<vector<string>> emails(n); DSU dsu(n); unordered_map<string,int> owner;
    for (int i = 0; i < n; ++i) { int k; cin >> name[i] >> k; emails[i].resize(k); for (string& email : emails[i]) { cin >> email; auto [it, fresh] = owner.emplace(email, i); if (!fresh) dsu.join(i, it->second); } }
    unordered_map<int, set<string>> grouped; for (int i = 0; i < n; ++i) for (auto& email : emails[i]) grouped[dsu.find(i)].insert(email);
    vector<tuple<string,string,vector<string>>> output;
    for (auto& [root, setEmails] : grouped) { vector<string> list(setEmails.begin(), setEmails.end()); output.push_back({name[root], list[0], move(list)}); }
    sort(output.begin(), output.end(), [](auto& a, auto& b){ return tie(get<0>(a), get<1>(a)) < tie(get<0>(b), get<1>(b)); });
    cout << output.size() << '\\n'; for (auto& [person, first, list] : output) { cout << person << ' ' << list.size(); for (auto& email : list) cout << ' ' << email; cout << '\\n'; }
}`,
      alignment: { analogousPattern: "Accounts Merge", evidenceWindow: "Targeted DSU consolidation gap", confidence: "High" },
    },
  }),
  problem({
    id: "live-island-counter",
    title: "Track Live Service Islands",
    shortTitle: "Live Islands",
    difficulty: "Hard",
    recommendedMinutes: 36,
    statement: "An rows × columns grid begins inactive. Each update activates one cell; repeated activation is allowed and changes nothing. After every update, print the number of four-directionally connected active components.",
    inputFormat: ["The first line contains rows, columns, and q.", "The next q lines contain a zero-based row and column."],
    outputFormat: ["Print q component counts on one line."],
    constraints: ["1 ≤ rows × columns ≤ 1,000,000", "1 ≤ q ≤ 300,000"],
    samples: [{ input: "3 3 5\n0 0\n0 1\n1 2\n2 1\n1 1", output: "1 1 2 3 1", explanation: "The final center activation joins three previously separate islands." }],
    tags: ["DSU", "online connectivity", "grid"],
    tests: [
      { name: "sample", input: "3 3 5\n0 0\n0 1\n1 2\n2 1\n1 1\n", expectedOutput: "1 1 2 3 1\n" },
      { name: "duplicates", input: "2 2 4\n0 0\n0 0\n1 1\n1 1\n", expectedOutput: "1 1 2 2\n" },
      { name: "bridge", input: "1 5 5\n0 0\n0 4\n0 2\n0 1\n0 3\n", expectedOutput: "1 2 3 2 1\n" },
      { name: "single", input: "1 1 2\n0 0\n0 0\n", expectedOutput: "1 1\n" },
    ],
    editorial: {
      recognitionSignal: "Updates only add nodes and edges, so connected components can be maintained incrementally with union-find.",
      approach: ["Mark a newly activated cell and increment the component count.", "Union it with each active neighbor.", "Decrement the count only when two different roots merge."],
      complexity: "O(q α(rows × columns)) time and O(rows × columns) space.",
      edgeCases: ["duplicate activation", "one update joins several islands", "border cells", "single-cell grid"],
      referenceCode: `struct DSU { vector<int> p, size; DSU(int n): p(n,-1), size(n,1) {} int find(int x){ return p[x]==x?x:p[x]=find(p[x]); } bool activate(int x){ if(p[x]!=-1)return false; p[x]=x; return true; } bool join(int a,int b){ a=find(a);b=find(b);if(a==b)return false;if(size[a]<size[b])swap(a,b);p[b]=a;size[a]+=size[b];return true;} };
void solve() {
    int rows, columns, q; cin >> rows >> columns >> q; DSU dsu(rows * columns); int islands = 0; vector<int> answer; int dr[4]={1,-1,0,0}, dc[4]={0,0,1,-1};
    while (q--) { int r,c; cin >> r >> c; int id=r*columns+c; if(dsu.activate(id)){ ++islands; for(int d=0;d<4;++d){int nr=r+dr[d],nc=c+dc[d];if(nr>=0&&nr<rows&&nc>=0&&nc<columns&&dsu.p[nr*columns+nc]!=-1&&dsu.join(id,nr*columns+nc))--islands;} } answer.push_back(islands); }
    for(int i=0;i<(int)answer.size();++i)cout<<(i?" ":"")<<answer[i];cout<<'\\n';
}`,
      alignment: { analogousPattern: "Number of Islands II", evidenceWindow: "Targeted DSU consolidation gap", confidence: "High" },
    },
  }),
  problem({
    id: "edge-reversal-launch-costs",
    title: "Edge-Reversal Launch Costs",
    shortTitle: "Reversal Costs",
    difficulty: "Hard",
    recommendedMinutes: 40,
    statement: "n services form a tree, but each connection is directed u → v. For every possible launch service s, report the minimum number of edges that must be reversed so every service is reachable from s by directed paths.",
    inputFormat: ["The first line contains n.", "The next n−1 lines contain a directed edge u v."],
    outputFormat: ["Print n reversal counts for launch services 0 through n−1."],
    constraints: ["1 ≤ n ≤ 200,000", "The underlying undirected graph is a tree."],
    samples: [{ input: "5\n0 1\n2 0\n2 3\n4 2", output: "2 3 1 2 0", explanation: "Launching at 4 needs no reversal; launching at 0 needs to reverse 2→0 and 4→2." }],
    tags: ["tree rerooting", "directed edges", "DP"],
    tests: [
      { name: "sample", input: "5\n0 1\n2 0\n2 3\n4 2\n", expectedOutput: "2 3 1 2 0\n" },
      { name: "outward star", input: "4\n0 1\n0 2\n0 3\n", expectedOutput: "0 1 1 1\n" },
      { name: "inward star", input: "4\n1 0\n2 0\n3 0\n", expectedOutput: "3 2 2 2\n" },
      { name: "single", input: "1\n", expectedOutput: "0\n" },
    ],
    editorial: {
      recognitionSignal: "After computing the answer for one root, moving the root across one edge changes only that edge's desired direction.",
      approach: ["Store each original u→v as cost 0 from u to v and cost 1 from v to u.", "DFS from root 0 to sum its reversal cost.", "Reroot across an edge: add 1 for an originally outward edge, subtract 1 for an originally inward edge."],
      complexity: "O(n) time and O(n) space.",
      edgeCases: ["single node", "all outward", "all inward", "deep tree"],
      referenceCode: `void solve() {
    int n; cin >> n; vector<vector<pair<int,int>>> graph(n); for(int i=1;i<n;++i){int u,v;cin>>u>>v;graph[u].push_back({v,0});graph[v].push_back({u,1});}
    vector<int> parent(n,-1), parentCost(n), order{0}; long long rootCost=0;
    for(int i=0;i<(int)order.size();++i){int node=order[i];for(auto [next,cost]:graph[node])if(next!=parent[node]){parent[next]=node;parentCost[next]=cost;rootCost+=cost;order.push_back(next);}}
    vector<long long> answer(n);answer[0]=rootCost;for(int node:order)if(node)answer[node]=answer[parent[node]]+(parentCost[node]==0?1:-1);
    for(int i=0;i<n;++i)cout<<(i?" ":"")<<answer[i];cout<<'\\n';
}`,
      alignment: { analogousPattern: "Minimum Edge Reversals So Every Node Is Reachable", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
  problem({
    id: "coupon-grid-route",
    title: "Cheapest Grid Route with Waivers",
    shortTitle: "Waiver Route",
    difficulty: "Hard",
    recommendedMinutes: 45,
    statement: "Move four-directionally from the top-left to bottom-right of a non-negative cost grid. Entering a cell normally pays its cost; the starting cell is free. Up to k times, you may enter a cell without paying its cost. Return the minimum total cost.",
    inputFormat: ["The first line contains rows, columns, and k.", "The next rows lines contain cell costs."],
    outputFormat: ["Print the minimum route cost as a 64-bit integer."],
    constraints: ["1 ≤ rows × columns ≤ 200,000", "0 ≤ k ≤ 20", "0 ≤ cost ≤ 10^9", "rows × columns × (k+1) ≤ 2,000,000"],
    samples: [{ input: "3 3 1\n0 9 1\n1 9 1\n1 1 1", output: "3", explanation: "The cheap route already costs 4; one waiver reduces it to 3." }],
    tags: ["Dijkstra", "expanded state", "resource constraint"],
    tests: [
      { name: "sample", input: "3 3 1\n0 9 1\n1 9 1\n1 1 1\n", expectedOutput: "3\n" },
      { name: "waive wall", input: "2 3 1\n0 100 1\n5 5 1\n", expectedOutput: "2\n" },
      { name: "no waiver", input: "2 2 0\n0 4\n2 3\n", expectedOutput: "5\n" },
      { name: "single", input: "1 1 5\n99\n", expectedOutput: "0\n" },
    ],
    editorial: {
      recognitionSignal: "Position alone does not determine future options; the number of waivers used must be part of the shortest-path state.",
      approach: ["Create state (cell, waiversUsed).", "For each move relax a paid transition and, if available, a waived transition.", "Run Dijkstra because cell entry costs are non-negative but unequal."],
      complexity: "O(rows × columns × (k+1) log(rows × columns × (k+1))) time and O(rows × columns × (k+1)) space.",
      edgeCases: ["single cell", "k larger than path", "zero-cost cells", "best route differs by remaining waivers"],
      referenceCode: `void solve() {
    int rows,columns,k;cin>>rows>>columns>>k;int cells=rows*columns;vector<long long>cost(cells);for(auto&x:cost)cin>>x;const long long INF=LLONG_MAX/4;
    vector<vector<long long>>distance(cells,vector<long long>(k+1,INF));using State=tuple<long long,int,int>;priority_queue<State,vector<State>,greater<State>>pq;distance[0][0]=0;pq.push({0,0,0});int dr[4]={1,-1,0,0},dc[4]={0,0,1,-1};
    while(!pq.empty()){auto[d,id,used]=pq.top();pq.pop();if(d!=distance[id][used])continue;if(id==cells-1){cout<<d<<'\\n';return;}int r=id/columns,c=id%columns;for(int z=0;z<4;++z){int nr=r+dr[z],nc=c+dc[z];if(nr<0||nr>=rows||nc<0||nc>=columns)continue;int next=nr*columns+nc;long long paid=d+cost[next];if(paid<distance[next][used]){distance[next][used]=paid;pq.push({paid,next,used});}if(used<k&&d<distance[next][used+1]){distance[next][used+1]=d;pq.push({d,next,used+1});}}}
}`,
      alignment: { analogousPattern: "Constrained shortest path in a weighted grid", evidenceWindow: "Recent Microsoft interview report plus user Dijkstra gap", confidence: "High" },
    },
  }),
];

export const graphMocks: MockDefinition[] = [
  mock("graphs-dsu", "graphs-order-distance", "Graphs 01 · Distance & Order", "Model implicit word edges, then produce a deterministic dependency order with cycle detection.", 1, 65, ["shortest-word-rollout", "lexicographic-build-plan"], ["BFS", "topological sort", "determinism"]),
  mock("graphs-dsu", "graphs-connectivity", "Graphs 02 · Dynamic Connectivity", "Use DSU for transitive identity merging and online grid components, including duplicate updates.", 2, 75, ["merge-identity-accounts", "live-island-counter"], ["DSU", "component aggregation", "online updates"]),
  mock("graphs-dsu", "graphs-pressure", "Graphs 03 · Reroot & State-Space Pressure", "Two unfamiliar Microsoft-style graph problems: reroot every source and preserve a consumable resource inside Dijkstra state.", 3, 90, ["edge-reversal-launch-costs", "coupon-grid-route"], ["reroot DP", "expanded state", "Dijkstra"]),
];
