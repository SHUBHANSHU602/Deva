import type { MockDefinition, ProblemDefinition } from "../../types/catalog.js";
import { mock, problem, recentEvidence } from "./helpers.js";

export const bitMathProblems: ProblemDefinition[] = [
  problem({
    id: "add-binary-counters",
    title: "Add Two Binary Counters",
    shortTitle: "Binary Counters",
    difficulty: "Easy",
    recommendedMinutes: 20,
    statement: "Add two non-empty binary strings and print their canonical binary sum. Inputs have no leading zeroes except the value 0.",
    inputFormat: ["The first line contains a.", "The second line contains b."],
    outputFormat: ["Print a + b in binary."],
    constraints: ["1 ≤ |a|, |b| ≤ 200,000"],
    samples: [{ input: "1010\n1011", output: "10101", explanation: "Ten plus eleven equals twenty-one." }],
    tags: ["binary", "carry", "string"],
    tests: [
      { name: "sample", input: "1010\n1011\n", expectedOutput: "10101\n" },
      { name: "carry chain", input: "1111\n1\n", expectedOutput: "10000\n" },
      { name: "zero", input: "0\n0\n", expectedOutput: "0\n" },
      { name: "unequal", input: "1\n100000\n", expectedOutput: "100001\n" },
    ],
    editorial: {
      recognitionSignal: "Decimal conversion is unsafe at this length, but grade-school addition needs only two indices and a carry.",
      approach: ["Walk both strings from right to left.", "Append sum mod 2 and keep sum / 2 as carry.", "Reverse the accumulated result."],
      complexity: "O(max(|a|, |b|)) time and output space.",
      edgeCases: ["both zero", "final carry", "unequal lengths", "long carry chain"],
      referenceCode: `void solve(){
    string a,b;cin>>a>>b;int i=a.size()-1,j=b.size()-1,carry=0;string answer;while(i>=0||j>=0||carry){int sum=carry+(i>=0?a[i--]-'0':0)+(j>=0?b[j--]-'0':0);answer.push_back(char('0'+sum%2));carry=sum/2;}reverse(answer.begin(),answer.end());cout<<answer<<'\\n';
}`,
      alignment: { analogousPattern: "Add Binary", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
  problem({
    id: "unique-triplicate-signal",
    title: "Recover the Non-Triplicated Signal",
    shortTitle: "Unique Signal",
    difficulty: "Medium",
    recommendedMinutes: 26,
    statement: "Every signed 32-bit signal appears exactly three times except one signal that appears once. Recover the unique signal using constant extra space.",
    inputFormat: ["The first line contains n.", "The second line contains n integers."],
    outputFormat: ["Print the unique signal."],
    constraints: ["1 ≤ n ≤ 300,001", "n mod 3 = 1"],
    samples: [{ input: "7\n2 2 3 2 9 9 9", output: "3", explanation: "All bits contributed by triplicates vanish modulo three." }],
    tags: ["bit counting", "modulo", "signed integer"],
    tests: [
      { name: "sample", input: "7\n2 2 3 2 9 9 9\n", expectedOutput: "3\n" },
      { name: "negative unique", input: "4\n5 5 5 -7\n", expectedOutput: "-7\n" },
      { name: "zero unique", input: "7\n-1 -1 -1 6 6 6 0\n", expectedOutput: "0\n" },
      { name: "one", input: "1\n-2147483648\n", expectedOutput: "-2147483648\n" },
    ],
    editorial: {
      recognitionSignal: "At each bit independently, contributions from values appearing three times are multiples of three.",
      approach: ["Count set bits at each of 32 positions using unsigned representation.", "Set a result bit when its count mod 3 is one.", "Interpret the resulting 32-bit pattern as signed."],
      complexity: "O(32n) time and O(1) space.",
      edgeCases: ["negative unique value", "sign bit", "zero", "minimum 32-bit integer"],
      referenceCode: `void solve(){
    int n;cin>>n;array<int,32>count{};for(int i=0;i<n;++i){int32_t value;cin>>value;uint32_t bits=static_cast<uint32_t>(value);for(int bit=0;bit<32;++bit)count[bit]+=(bits>>bit)&1u;}uint32_t bits=0;for(int bit=0;bit<32;++bit)if(count[bit]%3)bits|=1u<<bit;cout<<static_cast<int32_t>(bits)<<'\\n';
}`,
      alignment: { analogousPattern: "Single Number II", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
  problem({
    id: "fast-scaling-power",
    title: "Compute a Fast Scaling Power",
    shortTitle: "Fast Power",
    difficulty: "Medium",
    recommendedMinutes: 25,
    statement: "Compute base raised to a signed integer exponent using exponentiation by squaring. Print exactly six digits after the decimal point. Test data never requires division by zero and stays within finite double range.",
    inputFormat: ["The only line contains base and exponent."],
    outputFormat: ["Print base^exponent with six decimal places."],
    constraints: ["−100 ≤ base ≤ 100", "−2^31 ≤ exponent ≤ 2^31−1"],
    samples: [{ input: "2.0 -2", output: "0.250000", explanation: "A negative exponent takes the reciprocal of 2²." }],
    tags: ["math", "binary exponentiation", "overflow-safe exponent"],
    tests: [
      { name: "sample", input: "2.0 -2\n", expectedOutput: "0.250000\n" },
      { name: "zero exponent", input: "-7.5 0\n", expectedOutput: "1.000000\n" },
      { name: "negative base", input: "-2 5\n", expectedOutput: "-32.000000\n" },
      { name: "fraction", input: "0.5 3\n", expectedOutput: "0.125000\n" },
    ],
    editorial: {
      recognitionSignal: "The exponent's binary representation selects powers x, x², x⁴, …, reducing linear multiplication to logarithmic.",
      approach: ["Promote the exponent to 64-bit before negating INT_MIN.", "For a negative exponent, invert the base and make the exponent positive.", "Multiply the answer for set bits while repeatedly squaring the base."],
      complexity: "O(log |exponent|) time and O(1) space.",
      edgeCases: ["zero exponent", "negative exponent", "INT_MIN exponent", "negative base parity"],
      referenceCode: `void solve(){
    double base;long long exponent;cin>>base>>exponent;if(exponent<0){base=1.0/base;exponent=-exponent;}double answer=1.0;while(exponent){if(exponent&1)answer*=base;base*=base;exponent>>=1;}cout<<fixed<<setprecision(6)<<answer<<'\\n';
}`,
      alignment: { analogousPattern: "Pow(x, n)", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
  problem({
    id: "kth-recursive-grammar-bit",
    title: "K-th Recursive Grammar Bit",
    shortTitle: "Grammar Bit",
    difficulty: "Medium",
    recommendedMinutes: 28,
    statement: "Row 1 is 0. Each later row replaces every 0 with 01 and every 1 with 10. Given row n and one-based position k, print that bit without constructing the row.",
    inputFormat: ["The only line contains n and k."],
    outputFormat: ["Print 0 or 1."],
    constraints: ["1 ≤ n ≤ 60", "1 ≤ k ≤ 2^(n−1)"],
    samples: [{ input: "4 5", output: "1", explanation: "Row 4 is 01101001; its fifth bit is 1." }],
    tags: ["recursion", "bit parity", "implicit sequence"],
    tests: [
      { name: "sample", input: "4 5\n", expectedOutput: "1\n" },
      { name: "first", input: "60 1\n", expectedOutput: "0\n" },
      { name: "row two", input: "2 2\n", expectedOutput: "1\n" },
      { name: "last row four", input: "4 8\n", expectedOutput: "1\n" },
    ],
    editorial: {
      recognitionSignal: "A child's bit equals its parent for a left child and is flipped for a right child; those flips match set bits in k−1.",
      approach: ["Convert k to zero-based k−1.", "Count how many right-child choices occur, equal to popcount(k−1).", "Even parity yields 0; odd parity yields 1."],
      complexity: "O(1) machine-word time and O(1) space.",
      edgeCases: ["first position", "last position", "large row", "one-based k"],
      referenceCode: `void solve(){
    int n;unsigned long long k;cin>>n>>k;cout<<(__builtin_popcountll(k-1)&1)<<'\\n';
}`,
      alignment: { analogousPattern: "K-th Symbol in Grammar", evidenceWindow: recentEvidence, confidence: "High" },
    },
  }),
  problem({
    id: "minimum-power-adjustments",
    title: "Minimum Power-of-Two Adjustments",
    shortTitle: "Power Adjustments",
    difficulty: "Hard",
    recommendedMinutes: 32,
    statement: "Starting from positive integer n, one operation may add or subtract any positive power of two. Return the minimum operations needed to reach zero.",
    inputFormat: ["The only line contains n."],
    outputFormat: ["Print the minimum operation count."],
    constraints: ["1 ≤ n ≤ 10^9"],
    samples: [{ input: "39", output: "3", explanation: "39 + 1 = 40, 40 − 8 = 32, and 32 − 32 = 0." }],
    tags: ["bit greedy", "carry", "power of two"],
    tests: [
      { name: "sample", input: "39\n", expectedOutput: "3\n" },
      { name: "power", input: "1024\n", expectedOutput: "1\n" },
      { name: "run of ones", input: "15\n", expectedOutput: "2\n" },
      { name: "alternating", input: "10\n", expectedOutput: "2\n" },
    ],
    editorial: {
      recognitionSignal: "An isolated low 1 is cheapest to subtract, but a run ending in binary 11 is compressed by adding one and carrying through the run.",
      approach: ["Remove trailing zeroes before choosing; scaling every remaining power down does not change the operation count.", "If the reduced value is one, one final subtraction finishes.", "Otherwise add one when the last two bits are 11, or subtract one when they are 01."],
      complexity: "O(log n) time and O(1) space.",
      edgeCases: ["power of two", "long run of ones", "isolated bits", "carry beyond highest bit"],
      referenceCode: `void solve(){
    long long n;cin>>n;int operations=0;while(n){while(!(n&1))n>>=1;if(n==1){++operations;break;}if((n&3)==3)++n;else --n;++operations;}cout<<operations<<'\\n';
}`,
      alignment: { analogousPattern: "Minimum Operations to Reduce an Integer to 0", evidenceWindow: "Targeted bit-greedy gap", confidence: "High" },
    },
  }),
  problem({
    id: "count-prime-service-ids",
    title: "Count Prime Service IDs",
    shortTitle: "Prime IDs",
    difficulty: "Medium",
    recommendedMinutes: 24,
    statement: "Count prime integers strictly smaller than n. A prime is an integer greater than one with exactly two positive divisors.",
    inputFormat: ["The only line contains n."],
    outputFormat: ["Print the prime count."],
    constraints: ["0 ≤ n ≤ 20,000,000"],
    samples: [{ input: "10", output: "4", explanation: "The primes below 10 are 2, 3, 5, and 7." }],
    tags: ["number theory", "sieve", "overflow boundary"],
    tests: [
      { name: "sample", input: "10\n", expectedOutput: "4\n" },
      { name: "small", input: "2\n", expectedOutput: "0\n" },
      { name: "three", input: "3\n", expectedOutput: "1\n" },
      { name: "hundred", input: "100\n", expectedOutput: "25\n" },
    ],
    editorial: {
      recognitionSignal: "Instead of testing every number independently, mark multiples in bulk beginning at p² because smaller multiples were handled earlier.",
      approach: ["Initialize all values from 2 as potentially prime.", "For each unmarked p with p² < n, mark p², p²+p, …", "Count remaining candidates."],
      complexity: "O(n log log n) time and O(n) space.",
      edgeCases: ["n at most 2", "strictly below n", "start marking at p²", "64-bit multiplication for p²"],
      referenceCode: `void solve(){
    int n;cin>>n;if(n<=2){cout<<0<<'\\n';return;}vector<bool>prime(n,true);prime[0]=prime[1]=false;for(long long p=2;p*p<n;++p)if(prime[p])for(long long multiple=p*p;multiple<n;multiple+=p)prime[multiple]=false;cout<<count(prime.begin(),prime.end(),true)<<'\\n';
}`,
      alignment: { analogousPattern: "Count Primes", evidenceWindow: recentEvidence, confidence: "Medium" },
    },
  }),
];

export const bitMathMocks: MockDefinition[] = [
  mock("bit-math", "bit-representation", "Bit & Math 01 · Representation", "Handle carries on unbounded binary strings, then reconstruct a signed value from per-bit modular evidence.", 1, 55, ["add-binary-counters", "unique-triplicate-signal"], ["carry", "bit counts", "sign bit"]),
  mock("bit-math", "bit-recursion", "Bit & Math 02 · Logarithmic Structure", "Two huge implicit computations collapse through exponent bits and recursive flip parity.", 2, 58, ["fast-scaling-power", "kth-recursive-grammar-bit"], ["binary exponentiation", "implicit recursion", "overflow-safe conversion"]),
  mock("bit-math", "bit-greedy-number", "Bit & Math 03 · Greedy & Number Theory", "Compress runs of set bits optimally, then respect strict bounds and marking invariants in a sieve.", 3, 60, ["minimum-power-adjustments", "count-prime-service-ids"], ["bit greedy", "carry runs", "sieve boundaries"]),
];
