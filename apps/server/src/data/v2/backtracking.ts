import type { MockDefinition, ProblemDefinition } from "../../types/catalog.js";
import { mock, problem, recentEvidence } from "./helpers.js";

export const backtrackingProblems: ProblemDefinition[] = [
  problem({
    id: "balanced-session-plans",
    title: "Enumerate Balanced Session Plans",
    shortTitle: "Balanced Plans",
    difficulty: "Medium",
    recommendedMinutes: 25,
    statement: "Generate every well-formed sequence containing exactly n opening and n closing parentheses. Print sequences in lexicographic order, where '(' comes before ')'.",
    inputFormat: ["The only line contains n."],
    outputFormat: ["Print the sequence count, then one sequence per line."],
    constraints: ["0 ≤ n ≤ 10"],
    samples: [{ input: "3", output: "5\n((()))\n(()())\n(())()\n()(())\n()()()", explanation: "Every prefix has at least as many openings as closings." }],
    tags: ["backtracking", "prefix invariant", "generation"],
    tests: [
      { name: "sample", input: "3\n", expectedOutput: "5\n((()))\n(()())\n(())()\n()(())\n()()()\n" },
      { name: "zero", input: "0\n", expectedOutput: "1\nEMPTY\n" },
      { name: "one", input: "1\n", expectedOutput: "1\n()\n" },
      { name: "two", input: "2\n", expectedOutput: "2\n(())\n()()\n" },
    ],
    editorial: {
      recognitionSignal: "Validity is a prefix invariant, so invalid partial strings can be rejected before they become complete.",
      approach: ["Add '(' while fewer than n openings are used.", "Add ')' only when closings used are fewer than openings.", "Explore '(' first to obtain lexicographic order."],
      complexity: "O(Cn × n) output-sensitive time and O(n) recursion space, where Cn is the nth Catalan number.",
      edgeCases: ["n equals zero", "lexicographic order", "never close early", "exact output count"],
      referenceCode: `void solve() {
    int n;cin>>n;vector<string>answer;string current;function<void(int,int)>search=[&](int open,int close){if(open==n&&close==n){answer.push_back(current);return;}if(open<n){current.push_back('(');search(open+1,close);current.pop_back();}if(close<open){current.push_back(')');search(open,close+1);current.pop_back();}};search(0,0);
    cout<<answer.size()<<'\\n';for(auto&s:answer)cout<<(s.empty()?"EMPTY":s)<<'\\n';
}`,
      alignment: { analogousPattern: "Generate Parentheses", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
  problem({
    id: "reusable-capacity-bundles",
    title: "Enumerate Reusable Capacity Bundles",
    shortTitle: "Capacity Bundles",
    difficulty: "Medium",
    recommendedMinutes: 30,
    statement: "Given distinct positive capacities and a target, enumerate every non-decreasing multiset whose sum is target. A capacity may be reused. Sort bundles lexicographically.",
    inputFormat: ["The first line contains n and target.", "The second line contains n distinct capacities."],
    outputFormat: ["Print the bundle count. Each following line contains its length and values."],
    constraints: ["1 ≤ n ≤ 30", "1 ≤ target ≤ 100", "1 ≤ capacity[i] ≤ 100"],
    samples: [{ input: "4 7\n2 3 6 7", output: "2\n3 2 2 3\n1 7", explanation: "The two non-decreasing bundles sum to 7." }],
    tags: ["backtracking", "combination sum", "reuse"],
    tests: [
      { name: "sample", input: "4 7\n2 3 6 7\n", expectedOutput: "2\n3 2 2 3\n1 7\n" },
      { name: "none", input: "2 1\n2 3\n", expectedOutput: "0\n" },
      { name: "reuse", input: "3 8\n2 3 5\n", expectedOutput: "3\n4 2 2 2 2\n3 2 3 3\n2 3 5\n" },
      { name: "unsorted", input: "3 6\n6 2 4\n", expectedOutput: "3\n3 2 2 2\n2 2 4\n1 6\n" },
    ],
    editorial: {
      recognitionSignal: "Non-decreasing choices remove permutation duplicates; reuse means recursion remains at the chosen index.",
      approach: ["Sort capacities.", "At each depth try candidates from the current index onward.", "Stop when the next capacity exceeds the remaining target; recurse with the same index after choosing."],
      complexity: "Output-sensitive exponential time and O(target/minCapacity) recursion space.",
      edgeCases: ["no solution", "reuse one value", "unsorted input", "candidate equal to remaining target"],
      referenceCode: `void solve() {
    int n,target;cin>>n>>target;vector<int>capacity(n);for(int&x:capacity)cin>>x;sort(capacity.begin(),capacity.end());vector<vector<int>>answer;vector<int>current;
    function<void(int,int)>search=[&](int start,int remaining){if(!remaining){answer.push_back(current);return;}for(int i=start;i<n&&capacity[i]<=remaining;++i){current.push_back(capacity[i]);search(i,remaining-capacity[i]);current.pop_back();}};search(0,target);
    cout<<answer.size()<<'\\n';for(auto&bundle:answer){cout<<bundle.size();for(int x:bundle)cout<<' '<<x;cout<<'\\n';}
}`,
      alignment: { analogousPattern: "Combination Sum", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
  problem({
    id: "trace-board-command",
    title: "Trace a Command Through a Board",
    shortTitle: "Board Command",
    difficulty: "Medium",
    recommendedMinutes: 30,
    statement: "Determine whether a word can be traced in a character board using horizontally or vertically adjacent cells. A cell may be used at most once in the trace.",
    inputFormat: ["The first line contains rows and columns.", "The next rows lines contain strings of length columns.", "The final line contains the target word."],
    outputFormat: ["Print YES or NO."],
    constraints: ["1 ≤ rows × columns ≤ 100", "1 ≤ word length ≤ rows × columns"],
    samples: [{ input: "3 4\nABCE\nSFCS\nADEE\nABCCED", output: "YES", explanation: "The path turns through adjacent cells without reusing one." }],
    tags: ["backtracking", "grid", "visited state"],
    tests: [
      { name: "sample", input: "3 4\nABCE\nSFCS\nADEE\nABCCED\n", expectedOutput: "YES\n" },
      { name: "second", input: "3 4\nABCE\nSFCS\nADEE\nSEE\n", expectedOutput: "YES\n" },
      { name: "reuse forbidden", input: "3 4\nABCE\nSFCS\nADEE\nABCB\n", expectedOutput: "NO\n" },
      { name: "single", input: "1 1\nZ\nZ\n", expectedOutput: "YES\n" },
    ],
    editorial: {
      recognitionSignal: "The path choice branches, but a mismatch or revisited cell invalidates a prefix immediately.",
      approach: ["Try each matching cell as a start.", "Temporarily mark a chosen cell before exploring four neighbors.", "Restore it on return so another branch may use it."],
      complexity: "O(rows × columns × 3^L) worst-case time and O(L) recursion space.",
      edgeCases: ["cell reuse", "single cell", "many repeated characters", "restore state after failure"],
      referenceCode: `void solve() {
    int rows,columns;cin>>rows>>columns;vector<string>board(rows);for(auto&s:board)cin>>s;string word;cin>>word;int dr[4]={1,-1,0,0},dc[4]={0,0,1,-1};
    function<bool(int,int,int)>search=[&](int r,int c,int index){if(index==(int)word.size())return true;if(r<0||r>=rows||c<0||c>=columns||board[r][c]!=word[index])return false;char saved=board[r][c];board[r][c]='#';for(int d=0;d<4;++d)if(search(r+dr[d],c+dc[d],index+1)){board[r][c]=saved;return true;}board[r][c]=saved;return false;};
    for(int r=0;r<rows;++r)for(int c=0;c<columns;++c)if(search(r,c,0)){cout<<"YES\\n";return;}cout<<"NO\\n";
}`,
      alignment: { analogousPattern: "Word Search", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
  problem({
    id: "count-palindrome-splits",
    title: "Count Palindromic Message Splits",
    shortTitle: "Palindrome Splits",
    difficulty: "Hard",
    recommendedMinutes: 34,
    statement: "Count the ways to split a non-empty string into contiguous non-empty pieces where every piece is a palindrome. Split positions distinguish ways. The answer fits unsigned 64-bit.",
    inputFormat: ["The only line contains s."],
    outputFormat: ["Print the number of valid partitions."],
    constraints: ["1 ≤ |s| ≤ 60", "The answer fits unsigned 64-bit."],
    samples: [{ input: "aab", output: "2", explanation: "The partitions are a|a|b and aa|b." }],
    tags: ["backtracking", "palindrome table", "memoization"],
    tests: [
      { name: "sample", input: "aab\n", expectedOutput: "2\n" },
      { name: "single", input: "z\n", expectedOutput: "1\n" },
      { name: "all same", input: "aaaa\n", expectedOutput: "8\n" },
      { name: "none long", input: "abc\n", expectedOutput: "1\n" },
    ],
    editorial: {
      recognitionSignal: "At each start position, every palindromic prefix is a valid first piece followed by the same problem on a suffix.",
      approach: ["Precompute whether every substring is a palindrome.", "Memoize the number of partitions beginning at each index.", "Sum suffix counts over palindromic ending positions."],
      complexity: "O(n²) time and O(n²) space.",
      edgeCases: ["single character", "all equal characters", "only singleton pieces", "64-bit count"],
      referenceCode: `void solve() {
    string s;cin>>s;int n=s.size();vector<vector<char>>palindrome(n,vector<char>(n));for(int left=n-1;left>=0;--left)for(int right=left;right<n;++right)palindrome[left][right]=s[left]==s[right]&&(right-left<2||palindrome[left+1][right-1]);
    vector<unsigned long long>ways(n+1);ways[n]=1;for(int left=n-1;left>=0;--left)for(int right=left;right<n;++right)if(palindrome[left][right])ways[left]+=ways[right+1];cout<<ways[0]<<'\\n';
}`,
      alignment: { analogousPattern: "Palindrome Partitioning count variant", evidenceWindow: "Targeted backtracking and string-DP gap", confidence: "High" },
    },
  }),
  problem({
    id: "count-safe-queen-layouts",
    title: "Count Safe Queen Layouts",
    shortTitle: "Queen Layouts",
    difficulty: "Hard",
    recommendedMinutes: 40,
    statement: "Place n queens on an n×n board so no two share a row, column, or diagonal. Return the number of distinct layouts; rotations and reflections count separately.",
    inputFormat: ["The only line contains n."],
    outputFormat: ["Print the number of layouts."],
    constraints: ["1 ≤ n ≤ 14"],
    samples: [{ input: "4", output: "2", explanation: "There are two distinct four-queen layouts." }],
    tags: ["backtracking", "bitmask", "N-Queens"],
    tests: [
      { name: "sample", input: "4\n", expectedOutput: "2\n" },
      { name: "one", input: "1\n", expectedOutput: "1\n" },
      { name: "impossible two", input: "2\n", expectedOutput: "0\n" },
      { name: "eight", input: "8\n", expectedOutput: "92\n" },
    ],
    editorial: {
      recognitionSignal: "Placing exactly one queen per row reduces the remaining conflicts to three sets of attacked columns.",
      approach: ["Represent occupied columns and diagonals as bitmasks.", "The available positions are fullMask minus their union.", "Try each lowest available bit and shift diagonal masks for the next row."],
      complexity: "Exponential backtracking with O(n) recursion depth; bitmasks make each conflict check O(1).",
      edgeCases: ["n equals 1", "n equals 2 or 3", "mask width", "symmetries count separately"],
      referenceCode: `void solve() {
    int n;cin>>n;unsigned full=(1u<<n)-1;unsigned long long answer=0;function<void(unsigned,unsigned,unsigned)>search=[&](unsigned columns,unsigned downLeft,unsigned downRight){if(columns==full){++answer;return;}unsigned available=full&~(columns|downLeft|downRight);while(available){unsigned bit=available&-available;available-=bit;search(columns|bit,((downLeft|bit)<<1)&full,(downRight|bit)>>1);}};search(0,0,0);cout<<answer<<'\\n';
}`,
      alignment: { analogousPattern: "N-Queens II", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
  problem({
    id: "mutable-prefix-registry",
    title: "Mutable Prefix Registry",
    shortTitle: "Prefix Registry",
    difficulty: "Hard",
    recommendedMinutes: 38,
    statement: "Maintain a multiset of lowercase words. INSERT adds one occurrence; ERASE removes one occurrence and is guaranteed valid. SEARCH asks whether the exact word exists. PREFIX asks how many stored word occurrences begin with the prefix. Print answers for SEARCH and PREFIX.",
    inputFormat: ["The first line contains q.", "The next q lines contain a command and word."],
    outputFormat: ["SEARCH prints YES or NO; PREFIX prints a count."],
    constraints: ["1 ≤ q ≤ 200,000", "Total command characters ≤ 2,000,000"],
    samples: [{ input: "8\nINSERT apple\nINSERT app\nINSERT apple\nPREFIX app\nSEARCH apple\nERASE apple\nPREFIX apple\nSEARCH apex", output: "3\nYES\n1\nNO", explanation: "Prefix counts include duplicate occurrences." }],
    tags: ["trie", "multiset counts", "mutable design"],
    tests: [
      { name: "sample", input: "8\nINSERT apple\nINSERT app\nINSERT apple\nPREFIX app\nSEARCH apple\nERASE apple\nPREFIX apple\nSEARCH apex\n", expectedOutput: "3\nYES\n1\nNO\n" },
      { name: "erase final", input: "5\nINSERT a\nSEARCH a\nERASE a\nSEARCH a\nPREFIX a\n", expectedOutput: "YES\nNO\n0\n" },
      { name: "shared", input: "6\nINSERT car\nINSERT cart\nINSERT cat\nPREFIX ca\nPREFIX car\nSEARCH ca\n", expectedOutput: "3\n2\nNO\n" },
      { name: "duplicates", input: "5\nINSERT x\nINSERT x\nPREFIX x\nERASE x\nSEARCH x\n", expectedOutput: "2\nYES\n" },
    ],
    editorial: {
      recognitionSignal: "Exact membership and aggregate prefix counts share the same character path, so each trie node stores both pass-through and terminal multiplicity.",
      approach: ["On insert, increment pass counts along the path and the final terminal count.", "On erase, decrement the same counts; physical node deletion is unnecessary.", "SEARCH reads terminal count and PREFIX reads pass count at the prefix node."],
      complexity: "O(length) time per command and O(total inserted characters) nodes.",
      edgeCases: ["duplicate words", "erase one occurrence", "word is another word's prefix", "absent query path"],
      referenceCode: `struct Node{array<int,26>next;int pass=0,end=0;Node(){next.fill(-1);}};
void solve(){
    int q;cin>>q;vector<Node>trie(1);auto locate=[&](const string&word){int node=0;for(char c:word){int edge=c-'a';if(trie[node].next[edge]==-1)return -1;node=trie[node].next[edge];}return node;};
    while(q--){string command,word;cin>>command>>word;if(command=="INSERT"){int node=0;++trie[node].pass;for(char c:word){int edge=c-'a';if(trie[node].next[edge]==-1){trie[node].next[edge]=trie.size();trie.emplace_back();}node=trie[node].next[edge];++trie[node].pass;}++trie[node].end;}else if(command=="ERASE"){int node=0;--trie[node].pass;for(char c:word){node=trie[node].next[c-'a'];--trie[node].pass;}--trie[node].end;}else{int node=locate(word);if(command=="SEARCH")cout<<(node!=-1&&trie[node].end?"YES":"NO")<<'\\n';else cout<<(node==-1?0:trie[node].pass)<<'\\n';}}
}`,
      alignment: { analogousPattern: "Implement Trie with counted erase", evidenceWindow: "Targeted trie gap", confidence: "High" },
    },
  }),
];

export const backtrackingMocks: MockDefinition[] = [
  mock("backtracking-trie", "backtracking-generation", "Backtracking 01 · Constrained Generation", "Preserve prefix validity and canonical choice order while enumerating exact outputs.", 1, 60, ["balanced-session-plans", "reusable-capacity-bundles"], ["choose/explore/unchoose", "pruning", "deduplication"]),
  mock("backtracking-trie", "backtracking-search", "Backtracking 02 · Search & Partition", "Restore mutable board state correctly, then replace exponential repeated suffix work with memoized partition counting.", 2, 68, ["trace-board-command", "count-palindrome-splits"], ["visited restoration", "palindrome precompute", "suffix state"]),
  mock("backtracking-trie", "backtracking-structure-pressure", "Backtracking 03 · Bitmasks & Trie Design", "Two unfamiliar structures test compressed constraint state and mutable prefix invariants.", 3, 80, ["count-safe-queen-layouts", "mutable-prefix-registry"], ["bitmask recursion", "trie counts", "state invariants"]),
];
