import type { MockDefinition, ProblemDefinition } from "../../types/catalog.js";
import { mock, problem, recentEvidence } from "./helpers.js";

export const stringProblems: ProblemDefinition[] = [
  problem({
    id: "parse-signed-config",
    title: "Parse a Signed Configuration Value",
    shortTitle: "Config Parser",
    difficulty: "Medium",
    recommendedMinutes: 24,
    statement: "Parse one text line as a signed 32-bit integer. Ignore leading spaces, accept one optional sign, consume the longest following digit prefix, and ignore the rest. Return 0 when no digit is consumed and clamp overflow to the 32-bit signed range.",
    inputFormat: ["One line containing arbitrary printable ASCII characters."],
    outputFormat: ["Print the parsed 32-bit integer."],
    constraints: ["0 ≤ line length ≤ 200,000", "Only ordinary space characters count as leading whitespace.", "Clamp before arithmetic overflows."],
    samples: [{ input: "   -0042ms", output: "-42", explanation: "Leading spaces and zeroes are ignored; parsing stops at m." }],
    tags: ["string parser", "overflow", "state machine"],
    tests: [
      { name: "sample", input: "   -0042ms\n", expectedOutput: "-42\n" },
      { name: "positive overflow", input: "91283472332\n", expectedOutput: "2147483647\n" },
      { name: "invalid prefix", input: "words 17\n", expectedOutput: "0\n" },
      { name: "sign only", input: "+\n", expectedOutput: "0\n" },
      { name: "negative boundary", input: "-2147483648 tail\n", expectedOutput: "-2147483648\n" },
    ],
    editorial: {
      recognitionSignal: "This is a contract-heavy parser: phase ordering and pre-overflow checks matter more than data structures.",
      approach: ["Skip leading spaces, then read at most one sign.", "Consume digits while checking whether the next digit would exceed the signed limit.", "Clamp immediately when the relevant limit would be crossed."],
      complexity: "O(n) time and O(1) space.",
      edgeCases: ["empty line", "sign without digits", "leading zeroes", "both overflow directions", "invalid first character"],
      referenceCode: `void solve() {
    string s; getline(cin, s);
    int i = 0, n = s.size(), sign = 1;
    while (i < n && s[i] == ' ') ++i;
    if (i < n && (s[i] == '+' || s[i] == '-')) sign = s[i++] == '-' ? -1 : 1;
    long long value = 0;
    long long limit = sign == 1 ? INT_MAX : -(long long)INT_MIN;
    while (i < n && isdigit((unsigned char)s[i])) {
        int digit = s[i++] - '0';
        if (value > (limit - digit) / 10) { cout << (sign == 1 ? INT_MAX : INT_MIN) << '\\n'; return; }
        value = value * 10 + digit;
    }
    cout << sign * value << '\\n';
}`,
      alignment: { analogousPattern: "String to Integer (atoi)", evidenceWindow: recentEvidence, confidence: "Medium" },
    },
  }),
  problem({
    id: "compact-repeated-statuses",
    title: "Compact Repeated Statuses",
    shortTitle: "Status Compression",
    difficulty: "Medium",
    recommendedMinutes: 24,
    statement: "Compress a status token by replacing each maximal run with its character followed by the decimal run length only when the length exceeds one. Return the resulting token.",
    inputFormat: ["One non-empty token containing letters and digits without spaces."],
    outputFormat: ["Print the compressed token."],
    constraints: ["1 ≤ token length ≤ 200,000", "Run counts may contain multiple digits."],
    samples: [{ input: "aaabbcccccccccc", output: "a3b2c10", explanation: "The final run demonstrates a multi-digit count." }],
    tags: ["two pointers", "write index", "run length"],
    tests: [
      { name: "sample", input: "aaabbcccccccccc\n", expectedOutput: "a3b2c10\n" },
      { name: "unique", input: "abcd\n", expectedOutput: "abcd\n" },
      { name: "single", input: "z\n", expectedOutput: "z\n" },
      { name: "mixed", input: "1112233333333333a\n", expectedOutput: "1322311a\n" },
    ],
    editorial: {
      recognitionSignal: "The output for one run is known only when its right boundary is reached, which suggests read and write pointers.",
      approach: ["Let readStart mark the beginning of a run and advance readEnd to its first different character.", "Write the character once.", "If the run length exceeds one, append every digit of the length."],
      complexity: "O(n) time and O(n) output space.",
      edgeCases: ["single character", "all unique", "one huge run", "multi-digit counts", "digit characters in input"],
      referenceCode: `void solve() {
    string s; cin >> s; string out;
    for (int start = 0; start < (int)s.size();) {
        int end = start + 1;
        while (end < (int)s.size() && s[end] == s[start]) ++end;
        out.push_back(s[start]);
        if (end - start > 1) out += to_string(end - start);
        start = end;
    }
    cout << out << '\\n';
}`,
      alignment: { analogousPattern: "String Compression", evidenceWindow: "Microsoft-style implementation gap selected from prior practice", confidence: "Medium" },
    },
  }),
  problem({
    id: "smallest-policy-coverage-window",
    title: "Smallest Policy Coverage Window",
    shortTitle: "Coverage Window",
    difficulty: "Hard",
    recommendedMinutes: 34,
    statement: "Given a case-sensitive event stream s and a requirement token t, return the shortest contiguous slice of s containing every character of t with at least the required multiplicity. If several shortest slices exist, return the earliest. Print EMPTY if impossible.",
    inputFormat: ["The first line contains s.", "The second line contains t.", "Both are non-empty tokens without spaces."],
    outputFormat: ["Print the required slice or EMPTY."],
    constraints: ["1 ≤ |s|, |t| ≤ 200,000", "Characters are printable ASCII excluding whitespace."],
    samples: [{ input: "ADOBECODEBANC\nABC", output: "BANC", explanation: "BANC is the shortest slice satisfying all multiplicities." }],
    tags: ["variable window", "frequency deficit", "multiplicity"],
    tests: [
      { name: "sample", input: "ADOBECODEBANC\nABC\n", expectedOutput: "BANC\n" },
      { name: "multiplicity", input: "AAABBC\nAABC\n", expectedOutput: "AABBC\n" },
      { name: "impossible", input: "ABC\nAABC\n", expectedOutput: "EMPTY\n" },
      { name: "single", input: "x\nx\n", expectedOutput: "x\n" },
    ],
    editorial: {
      recognitionSignal: "The window becomes valid monotonically as the right side expands, and only required multiplicities determine when the left side can move.",
      approach: ["Store required counts and track how many distinct requirements are currently satisfied.", "Expand right and update the relevant count.", "While all requirements are satisfied, record the answer and shrink left."],
      complexity: "O(|s| + |t|) time and O(alphabet) space.",
      edgeCases: ["repeated required characters", "t longer than s", "multiple equal windows", "case sensitivity"],
      referenceCode: `void solve() {
    string s, t; cin >> s >> t;
    array<int, 256> need{}, have{};
    int required = 0;
    for (unsigned char c : t) if (need[c]++ == 0) ++required;
    int formed = 0, left = 0, bestStart = -1, bestLength = INT_MAX;
    for (int right = 0; right < (int)s.size(); ++right) {
        unsigned char c = s[right];
        if (need[c] && ++have[c] == need[c]) ++formed;
        while (formed == required) {
            if (right - left + 1 < bestLength) { bestLength = right - left + 1; bestStart = left; }
            unsigned char d = s[left++];
            if (need[d] && have[d]-- == need[d]) --formed;
        }
    }
    cout << (bestStart == -1 ? "EMPTY" : s.substr(bestStart, bestLength)) << '\\n';
}`,
      alignment: { analogousPattern: "Minimum Window Substring", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
  problem({
    id: "batched-command-offsets",
    title: "Batched Command Offsets",
    shortTitle: "Command Offsets",
    difficulty: "Hard",
    recommendedMinutes: 38,
    statement: "A log token s may contain a batch formed by concatenating every command word exactly once in any order. All command words have equal length and duplicates are meaningful. Return every zero-based start offset of such a batch in increasing order.",
    inputFormat: ["The first line contains s.", "The second line contains m.", "The third line contains m equal-length command words."],
    outputFormat: ["Print matching offsets in increasing order, or NONE."],
    constraints: ["1 ≤ |s| ≤ 200,000", "1 ≤ m ≤ 5,000", "1 ≤ word length ≤ 30", "All inputs are lowercase tokens."],
    samples: [{ input: "barfoofoobarthefoobarman\n3\nbar foo the", output: "6 9 12", explanation: "Each listed window contains bar, foo, and the once." }],
    tags: ["word-aligned window", "multiset", "offset classes"],
    tests: [
      { name: "sample", input: "barfoofoobarthefoobarman\n3\nbar foo the\n", expectedOutput: "6 9 12\n" },
      { name: "duplicates", input: "wordgoodgoodgoodbestword\n4\nword good best good\n", expectedOutput: "8\n" },
      { name: "none", input: "abcdef\n2\nab xy\n", expectedOutput: "NONE\n" },
      { name: "overlap", input: "aaaaaa\n2\naa aa\n", expectedOutput: "0 1 2\n" },
    ],
    editorial: {
      recognitionSignal: "Every valid boundary is word-aligned, so process each remainder modulo word length with a fixed-count word window.",
      approach: ["Count required words.", "For each starting offset within one word, move right by whole words.", "Reset on unknown words; shrink when a word is overrepresented; record windows containing exactly m words."],
      complexity: "O(|s| + total word characters) expected time and O(m) space.",
      edgeCases: ["duplicate words", "overlapping answers", "unknown word resets", "batch longer than s"],
      referenceCode: `void solve() {
    string s; int m; cin >> s >> m;
    vector<string> words(m); for (auto& word : words) cin >> word;
    int width = words[0].size(), batch = width * m;
    unordered_map<string, int> need;
    for (const string& word : words) ++need[word];
    vector<int> answer;
    for (int offset = 0; offset < width && offset + batch <= (int)s.size(); ++offset) {
        unordered_map<string, int> have;
        int left = offset, used = 0;
        for (int right = offset; right + width <= (int)s.size(); right += width) {
            string word = s.substr(right, width);
            if (!need.count(word)) { have.clear(); used = 0; left = right + width; continue; }
            ++have[word]; ++used;
            while (have[word] > need[word]) { --have[s.substr(left, width)]; --used; left += width; }
            if (used == m) { answer.push_back(left); --have[s.substr(left, width)]; --used; left += width; }
        }
    }
    sort(answer.begin(), answer.end());
    if (answer.empty()) cout << "NONE";
    else for (int i = 0; i < (int)answer.size(); ++i) cout << (i ? " " : "") << answer[i];
    cout << '\\n';
}`,
      alignment: { analogousPattern: "Substring with Concatenation of All Words", evidenceWindow: recentEvidence, confidence: "Medium" },
    },
  }),
  problem({
    id: "first-signature-occurrence",
    title: "First Signature Occurrence",
    shortTitle: "Signature Search",
    difficulty: "Medium",
    recommendedMinutes: 28,
    statement: "Find the first zero-based position where pattern occurs in text. Return −1 if it never occurs. The input may contain long repeated prefixes, so restarting the comparison from scratch at every position is too slow.",
    inputFormat: ["The first line contains text.", "The second line contains a non-empty pattern.", "Both are lowercase tokens."],
    outputFormat: ["Print the first matching index or −1."],
    constraints: ["1 ≤ |text|, |pattern| ≤ 1,000,000"],
    samples: [{ input: "ababcabcabababd\nababd", output: "10", explanation: "The first full pattern begins at index 10." }],
    tags: ["KMP", "prefix function", "fallback state"],
    tests: [
      { name: "sample", input: "ababcabcabababd\nababd\n", expectedOutput: "10\n" },
      { name: "prefix overlap", input: "aaaaab\naaab\n", expectedOutput: "2\n" },
      { name: "missing", input: "abcdef\nghi\n", expectedOutput: "-1\n" },
      { name: "pattern longer", input: "abc\nabcde\n", expectedOutput: "-1\n" },
    ],
    editorial: {
      recognitionSignal: "Long repeated prefixes make naive restart work quadratic; preserve the longest prefix that is also a suffix.",
      approach: ["Build the pattern's prefix-function array.", "Scan text while falling back through prefix links on mismatches.", "When the matched length reaches the pattern length, return the corresponding start."],
      complexity: "O(|text| + |pattern|) time and O(|pattern|) space.",
      edgeCases: ["overlapping prefix", "pattern longer than text", "match at zero", "no match"],
      referenceCode: `void solve() {
    string text, pattern; cin >> text >> pattern;
    vector<int> prefix(pattern.size());
    for (int i = 1, j = 0; i < (int)pattern.size(); ++i) {
        while (j && pattern[i] != pattern[j]) j = prefix[j - 1];
        if (pattern[i] == pattern[j]) ++j;
        prefix[i] = j;
    }
    for (int i = 0, j = 0; i < (int)text.size(); ++i) {
        while (j && text[i] != pattern[j]) j = prefix[j - 1];
        if (text[i] == pattern[j]) ++j;
        if (j == (int)pattern.size()) { cout << i - j + 1 << '\\n'; return; }
    }
    cout << -1 << '\\n';
}`,
      alignment: { analogousPattern: "Find the Index of the First Occurrence / prefix matching", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
  problem({
    id: "group-equivalent-signatures",
    title: "Group Equivalent Signatures",
    shortTitle: "Signature Groups",
    difficulty: "Medium",
    recommendedMinutes: 26,
    statement: "Two lowercase signature tokens are equivalent when one can be rearranged into the other. Group equivalent tokens. Sort tokens inside each group, then sort groups by their first token to make the output deterministic.",
    inputFormat: ["The first line contains n.", "The second line contains n lowercase tokens."],
    outputFormat: ["Print one group per line with space-separated tokens."],
    constraints: ["1 ≤ n ≤ 100,000", "Total token length ≤ 1,000,000"],
    samples: [{ input: "6\neat tea tan ate nat bat", output: "ate eat tea\nbat\nnat tan", explanation: "The prescribed sorting removes hash-map order ambiguity." }],
    tags: ["canonical key", "hash grouping", "deterministic output"],
    tests: [
      { name: "sample", input: "6\neat tea tan ate nat bat\n", expectedOutput: "ate eat tea\nbat\nnat tan\n" },
      { name: "single", input: "1\na\n", expectedOutput: "a\n" },
      { name: "duplicates", input: "5\nab ba ab abc cab\n", expectedOutput: "ab ab ba\nabc cab\n" },
      { name: "different lengths", input: "4\na aa aaa a\n", expectedOutput: "a a\naa\naaa\n" },
    ],
    editorial: {
      recognitionSignal: "All members of a group share a canonical representation independent of character order.",
      approach: ["Sort each token to obtain its canonical key.", "Append the original token to the key's group.", "Sort within groups and then sort the group list by its first token."],
      complexity: "O(total characters × log maximum token length) plus output sorting.",
      edgeCases: ["duplicate tokens", "one-character tokens", "different lengths", "deterministic group order"],
      referenceCode: `void solve() {
    int n; cin >> n;
    unordered_map<string, vector<string>> grouped;
    for (int i = 0; i < n; ++i) { string word, key; cin >> word; key = word; sort(key.begin(), key.end()); grouped[key].push_back(word); }
    vector<vector<string>> groups;
    for (auto& [key, words] : grouped) { sort(words.begin(), words.end()); groups.push_back(words); }
    sort(groups.begin(), groups.end(), [](const auto& a, const auto& b) { return a[0] < b[0]; });
    for (const auto& group : groups) { for (int i = 0; i < (int)group.size(); ++i) cout << (i ? " " : "") << group[i]; cout << '\\n'; }
}`,
      alignment: { analogousPattern: "Group Anagrams", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
];

export const stringMocks: MockDefinition[] = [
  mock("strings", "strings-contracts", "Strings 01 · Contract Precision", "Two implementation-heavy parsers where boundary handling decides the verdict.", 1, 55, ["parse-signed-config", "compact-repeated-statuses"], ["parser state", "write pointer", "overflow"]),
  mock("strings", "strings-window-pressure", "Strings 02 · Window Pressure", "Multiplicity and token alignment with hidden overlap cases.", 2, 75, ["smallest-policy-coverage-window", "batched-command-offsets"], ["frequency deficit", "aligned windows", "duplicates"]),
  mock("strings", "strings-indexing", "Strings 03 · Canonical State", "Prefix fallback and canonical grouping without accidental quadratic work.", 3, 65, ["first-signature-occurrence", "group-equivalent-signatures"], ["prefix invariant", "canonical keys", "determinism"]),
];
