import type { MockDefinition, ProblemDefinition } from "../../types/catalog.js";
import { mock, problem, recentEvidence } from "./helpers.js";

export const dpProblems: ProblemDefinition[] = [
  problem({
    id: "decode-release-token",
    title: "Decode a Release Token",
    shortTitle: "Decode Token",
    difficulty: "Medium",
    recommendedMinutes: 24,
    statement: "Digits map to letters as 1→A through 26→Z. Count how many complete decodings a non-empty digit string has. A zero cannot stand alone, and substrings with a leading zero are invalid. The answer fits signed 64-bit.",
    inputFormat: ["The only line contains a digit string s."],
    outputFormat: ["Print the number of decodings."],
    constraints: ["1 ≤ |s| ≤ 90", "s contains only digits."],
    samples: [{ input: "226", output: "3", explanation: "The valid splits are 2|2|6, 22|6, and 2|26." }],
    tags: ["DP", "string", "zero handling"],
    tests: [
      { name: "sample", input: "226\n", expectedOutput: "3\n" },
      { name: "leading zero", input: "06\n", expectedOutput: "0\n" },
      { name: "embedded zero", input: "2101\n", expectedOutput: "1\n" },
      { name: "many", input: "11106\n", expectedOutput: "2\n" },
    ],
    editorial: {
      recognitionSignal: "A valid decoding ending at position i uses either one valid final digit or one valid final two-digit number.",
      approach: ["Let dp[i] count decodings of the first i characters.", "Add dp[i−1] when the last digit is 1–9.", "Add dp[i−2] when the last two digits form 10–26."],
      complexity: "O(n) time and O(1) space.",
      edgeCases: ["leading zero", "10 and 20", "invalid 30", "zero after a valid pair"],
      referenceCode: `void solve() {
    string s;cin>>s;long long twoBack=1,oneBack=s[0]=='0'?0:1;
    for(int i=1;i<(int)s.size();++i){long long current=0;if(s[i]!='0')current+=oneBack;int value=(s[i-1]-'0')*10+s[i]-'0';if(value>=10&&value<=26)current+=twoBack;twoBack=oneBack;oneBack=current;}
    cout<<oneBack<<'\\n';
}`,
      alignment: { analogousPattern: "Decode Ways", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
  problem({
    id: "segment-api-route",
    title: "Segment an API Route",
    shortTitle: "Route Segmentation",
    difficulty: "Medium",
    recommendedMinutes: 28,
    statement: "Determine whether a lowercase route string can be split into one or more dictionary tokens. A dictionary token may be reused. The entire string must be consumed.",
    inputFormat: ["The first line contains the route string and n.", "The next n lines contain dictionary tokens."],
    outputFormat: ["Print YES or NO."],
    constraints: ["1 ≤ |s| ≤ 5,000", "1 ≤ n ≤ 100,000", "Total dictionary characters ≤ 500,000"],
    samples: [{ input: "leetcode 2\nleet\ncode", output: "YES", explanation: "The route splits as leet | code." }],
    tags: ["DP", "word break", "prefix reachability"],
    tests: [
      { name: "sample", input: "leetcode 2\nleet\ncode\n", expectedOutput: "YES\n" },
      { name: "reuse", input: "applepenapple 2\napple\npen\n", expectedOutput: "YES\n" },
      { name: "near miss", input: "catsandog 5\ncats\ndog\nsand\nand\ncat\n", expectedOutput: "NO\n" },
      { name: "overlap", input: "aaaaaaa 2\naaaa\naaa\n", expectedOutput: "YES\n" },
    ],
    editorial: {
      recognitionSignal: "Only positions that end a valid prefix matter; each dictionary match creates a transition to a later prefix.",
      approach: ["Let reachable[i] mean the first i characters can be segmented.", "From each reachable position, test candidate token lengths or walk a trie.", "Mark the endpoint of every dictionary match."],
      complexity: "O(n × L) expected time with substring hashing, where L is the maximum token length, and O(n + dictionary) space.",
      edgeCases: ["token reuse", "overlapping choices", "near-complete segmentation", "one whole-string token"],
      referenceCode: `void solve() {
    string s;int n;cin>>s>>n;unordered_set<string>dictionary;int longest=0;for(int i=0;i<n;++i){string word;cin>>word;longest=max(longest,(int)word.size());dictionary.insert(word);}
    vector<char>reachable(s.size()+1);reachable[0]=1;for(int end=1;end<=(int)s.size();++end)for(int length=1;length<=longest&&length<=end;++length)if(reachable[end-length]&&dictionary.count(s.substr(end-length,length))){reachable[end]=1;break;}
    cout<<(reachable[s.size()]?"YES":"NO")<<'\\n';
}`,
      alignment: { analogousPattern: "Word Break", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
  problem({
    id: "count-budget-combinations",
    title: "Count Budget Combinations",
    shortTitle: "Budget Combinations",
    difficulty: "Medium",
    recommendedMinutes: 30,
    statement: "Given distinct positive package costs and a target budget, count unordered multisets of packages whose total is exactly target. Each package may be selected any number of times; different orderings of the same multiset count once. The answer fits unsigned 64-bit.",
    inputFormat: ["The first line contains n and target.", "The second line contains n distinct costs."],
    outputFormat: ["Print the number of combinations."],
    constraints: ["1 ≤ n ≤ 300", "0 ≤ target ≤ 20,000", "1 ≤ cost[i] ≤ 20,000"],
    samples: [{ input: "3 5\n1 2 5", output: "4", explanation: "The combinations are five 1s; three 1s and 2; one 1 and two 2s; or one 5." }],
    tags: ["DP", "unbounded knapsack", "loop order"],
    tests: [
      { name: "sample", input: "3 5\n1 2 5\n", expectedOutput: "4\n" },
      { name: "zero target", input: "2 0\n2 3\n", expectedOutput: "1\n" },
      { name: "none", input: "2 3\n2 4\n", expectedOutput: "0\n" },
      { name: "order trap", input: "2 4\n1 2\n", expectedOutput: "3\n" },
    ],
    editorial: {
      recognitionSignal: "The key ambiguity is combinations versus sequences; processing one cost at a time prevents permutations from being recounted.",
      approach: ["Initialize ways[0] = 1.", "For each cost, scan totals upward from cost to target.", "Add ways[sum−cost] into ways[sum]."],
      complexity: "O(n × target) time and O(target) space.",
      edgeCases: ["target zero", "no combination", "cost greater than target", "loop order"],
      referenceCode: `void solve() {
    int n,target;cin>>n>>target;vector<int>cost(n);for(int&x:cost)cin>>x;vector<unsigned long long>ways(target+1);ways[0]=1;
    for(int value:cost)for(int sum=value;sum<=target;++sum)ways[sum]+=ways[sum-value];cout<<ways[target]<<'\\n';
}`,
      alignment: { analogousPattern: "Coin Change II", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
  problem({
    id: "minimum-config-edits",
    title: "Minimum Configuration Edits",
    shortTitle: "Config Edits",
    difficulty: "Hard",
    recommendedMinutes: 38,
    statement: "Transform source into target using insert, delete, or replace operations on single characters, each costing one. Return the minimum cost.",
    inputFormat: ["The first line contains source.", "The second line contains target.", "Use - to represent an empty string."],
    outputFormat: ["Print the minimum edit count."],
    constraints: ["0 ≤ source length, target length ≤ 5,000", "source length × target length ≤ 4,000,000"],
    samples: [{ input: "horse\nros", output: "3", explanation: "Replace h→r, delete the second r, and delete e." }],
    tags: ["DP", "edit distance", "two rows"],
    tests: [
      { name: "sample", input: "horse\nros\n", expectedOutput: "3\n" },
      { name: "classic", input: "intention\nexecution\n", expectedOutput: "5\n" },
      { name: "empty", input: "-\nabc\n", expectedOutput: "3\n" },
      { name: "same", input: "microsoft\nmicrosoft\n", expectedOutput: "0\n" },
    ],
    editorial: {
      recognitionSignal: "The final operation relates a pair of prefixes: remove from source, append to source, or replace their last characters.",
      approach: ["Let dp[i][j] be the distance between source prefix i and target prefix j.", "Matching final characters carry the diagonal value.", "Otherwise take one plus min(delete, insert, replace), retaining only two rows."],
      complexity: "O(nm) time and O(m) space.",
      edgeCases: ["empty string", "identical strings", "all replacements", "highly unequal lengths"],
      referenceCode: `void solve() {
    string source,target;cin>>source>>target;if(source=="-")source="";if(target=="-")target="";vector<int>previous(target.size()+1),current(target.size()+1);iota(previous.begin(),previous.end(),0);
    for(int i=1;i<=(int)source.size();++i){current[0]=i;for(int j=1;j<=(int)target.size();++j)current[j]=source[i-1]==target[j-1]?previous[j-1]:1+min({previous[j],current[j-1],previous[j-1]});swap(previous,current);}cout<<previous[target.size()]<<'\\n';
}`,
      alignment: { analogousPattern: "Edit Distance", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
  problem({
    id: "largest-stable-square",
    title: "Largest Stable Service Square",
    shortTitle: "Stable Square",
    difficulty: "Medium",
    recommendedMinutes: 30,
    statement: "A binary matrix marks stable cells with 1. Return the area of the largest axis-aligned square containing only stable cells.",
    inputFormat: ["The first line contains rows and columns.", "The next rows lines contain binary integers."],
    outputFormat: ["Print the largest square area."],
    constraints: ["1 ≤ rows × columns ≤ 2,000,000"],
    samples: [{ input: "4 5\n1 0 1 0 0\n1 0 1 1 1\n1 1 1 1 1\n1 0 0 1 0", output: "4", explanation: "A 2×2 stable square exists." }],
    tags: ["2D DP", "rolling row", "matrix"],
    tests: [
      { name: "sample", input: "4 5\n1 0 1 0 0\n1 0 1 1 1\n1 1 1 1 1\n1 0 0 1 0\n", expectedOutput: "4\n" },
      { name: "all one", input: "3 3\n1 1 1\n1 1 1\n1 1 1\n", expectedOutput: "9\n" },
      { name: "all zero", input: "2 4\n0 0 0 0\n0 0 0 0\n", expectedOutput: "0\n" },
      { name: "thin", input: "1 5\n1 1 1 1 1\n", expectedOutput: "1\n" },
    ],
    editorial: {
      recognitionSignal: "A square ending at a 1 cell can extend only as far as all three neighboring squares permit.",
      approach: ["Let dp[c] represent the square side ending in the previous/current row.", "For a 1, use 1 + min(top, left, top-left).", "Preserve top-left before overwriting and track the greatest side."],
      complexity: "O(rows × columns) time and O(columns) space.",
      edgeCases: ["all zero", "single row", "all one", "rolling diagonal value"],
      referenceCode: `void solve() {
    int rows,columns;cin>>rows>>columns;vector<int>dp(columns+1);int best=0;
    for(int r=1;r<=rows;++r){int diagonal=0;for(int c=1;c<=columns;++c){int cell;cin>>cell;int top=dp[c];if(cell)dp[c]=1+min({dp[c],dp[c-1],diagonal});else dp[c]=0;diagonal=top;best=max(best,dp[c]);}}
    cout<<1LL*best*best<<'\\n';
}`,
      alignment: { analogousPattern: "Maximal Square", evidenceWindow: "User grid-DP consolidation plan", confidence: "High" },
    },
  }),
  problem({
    id: "two-release-trades",
    title: "Best Profit Across Two Release Trades",
    shortTitle: "Two Trades",
    difficulty: "Hard",
    recommendedMinutes: 38,
    statement: "A daily signal gives one unit's buy/sell price. Complete at most two non-overlapping buy-then-sell transactions; you must sell before buying again. Return the maximum profit, with choosing no transaction allowed.",
    inputFormat: ["The first line contains n.", "The second line contains n prices."],
    outputFormat: ["Print the maximum profit."],
    constraints: ["0 ≤ n ≤ 200,000", "0 ≤ price[i] ≤ 10^9"],
    samples: [{ input: "8\n3 3 5 0 0 3 1 4", output: "6", explanation: "Buy at 0 and sell at 3, then buy at 1 and sell at 4." }],
    tags: ["DP", "state machine", "stock"],
    tests: [
      { name: "sample", input: "8\n3 3 5 0 0 3 1 4\n", expectedOutput: "6\n" },
      { name: "increasing", input: "5\n1 2 3 4 5\n", expectedOutput: "4\n" },
      { name: "decreasing", input: "5\n7 6 4 3 1\n", expectedOutput: "0\n" },
      { name: "two peaks", input: "6\n1 5 2 8 0 4\n", expectedOutput: "11\n" },
    ],
    editorial: {
      recognitionSignal: "With only two transactions, four best-prefix states capture every valid action sequence.",
      approach: ["Track best balance after first buy, first sell, second buy, and second sell.", "Update these states in action order for each price.", "The second-sell state is the answer and never needs to be negative."],
      complexity: "O(n) time and O(1) space.",
      edgeCases: ["empty input", "always decreasing", "one profitable rise", "two separated peaks"],
      referenceCode: `void solve() {
    int n;cin>>n;long long buy1=LLONG_MIN/4,sell1=0,buy2=LLONG_MIN/4,sell2=0;
    for(int i=0;i<n;++i){long long price;cin>>price;buy1=max(buy1,-price);sell1=max(sell1,buy1+price);buy2=max(buy2,sell1-price);sell2=max(sell2,buy2+price);}cout<<sell2<<'\\n';
}`,
      alignment: { analogousPattern: "Best Time to Buy and Sell Stock III", evidenceWindow: "User stock-DP consolidation plan", confidence: "High" },
    },
  }),
];

export const dpMocks: MockDefinition[] = [
  mock("dynamic-programming", "dp-prefix", "DP 01 · Prefix Decisions", "Decode locally constrained digits, then recognize reachable string prefixes under reusable tokens.", 1, 60, ["decode-release-token", "segment-api-route"], ["state meaning", "invalid zero", "prefix reachability"]),
  mock("dynamic-programming", "dp-count-transform", "DP 02 · Count & Transform", "Loop direction controls combination counting; a two-string state captures minimum edits.", 2, 75, ["count-budget-combinations", "minimum-config-edits"], ["unbounded knapsack", "2D recurrence", "space optimization"]),
  mock("dynamic-programming", "dp-grid-state", "DP 03 · Grid & State-Machine Pressure", "Consolidate rolling-grid transitions and compressed multi-transaction state.", 3, 72, ["largest-stable-square", "two-release-trades"], ["grid DP", "rolling state", "transaction machine"]),
];
