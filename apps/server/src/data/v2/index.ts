import type { MockDefinition, ProblemDefinition, TopicDefinition } from "../../types/catalog.js";
import { arrayMocks, arrayProblems } from "./arrays.js";
import { backtrackingMocks, backtrackingProblems } from "./backtracking.js";
import { binarySearchMocks, binarySearchProblems } from "./binarySearch.js";
import { bitMathMocks, bitMathProblems } from "./bitMath.js";
import { dpMocks, dpProblems } from "./dp.js";
import { graphMocks, graphProblems } from "./graphs.js";
import { greedyMocks, greedyProblems } from "./greedy.js";
import { linkedListMocks, linkedListProblems } from "./linkedLists.js";
import { stackMocks, stackProblems } from "./stacks.js";
import { stringMocks, stringProblems } from "./strings.js";
import { treeMocks, treeProblems } from "./trees.js";

export const v2Topics: TopicDefinition[] = [
  {
    id: "arrays",
    title: "Arrays, Hashing & Matrix",
    shortTitle: "Arrays",
    description: "Counting, prefix/suffix invariants, permutations, and in-place matrix contracts.",
    order: 2,
    priority: "Core",
  },
  {
    id: "strings",
    title: "Strings & Sliding Windows",
    shortTitle: "Strings",
    description: "Parsing, coverage windows, pattern indexing, compression, and canonical grouping.",
    order: 3,
    priority: "Core",
  },
  {
    id: "binary-search",
    title: "Binary Search",
    shortTitle: "Binary Search",
    description: "Sorted structure, rotated ambiguity, and monotone answer-space search.",
    order: 4,
    priority: "Core",
  },
  {
    id: "stack-queue",
    title: "Stack, Queue & Monotonic State",
    shortTitle: "Stack",
    description: "Pending-index invariants, span boundaries, histogram reduction, and stack design.",
    order: 5,
    priority: "Targeted gap",
  },
  {
    id: "linked-list-design",
    title: "Linked Lists & Stateful Design",
    shortTitle: "Linked List",
    description: "Pointer rewiring, deep copy, stable partitioning, and hash-plus-list cache design.",
    order: 6,
    priority: "Targeted gap",
  },
  {
    id: "greedy-intervals",
    title: "Greedy & Intervals",
    shortTitle: "Greedy",
    description: "Reach frontiers, exchange arguments, directional constraints, and endpoint semantics.",
    order: 7,
    priority: "Targeted gap",
  },
  {
    id: "trees-bst",
    title: "Trees & BST",
    shortTitle: "Trees",
    description: "Construction, recursive state, serialization, parent links, and coordinate traversal.",
    order: 8,
    priority: "Targeted gap",
  },
  {
    id: "graphs-dsu",
    title: "Graphs, Shortest Paths & DSU",
    shortTitle: "Graphs",
    description: "BFS, deterministic topological order, connectivity, rerooting, and constrained Dijkstra.",
    order: 9,
    priority: "Targeted gap",
  },
  {
    id: "dynamic-programming",
    title: "Dynamic Programming",
    shortTitle: "DP",
    description: "Prefix states, unbounded counting, string transforms, grid rolls, and stock machines.",
    order: 10,
    priority: "Targeted gap",
  },
  {
    id: "backtracking-trie",
    title: "Backtracking & Trie",
    shortTitle: "Backtracking",
    description: "Constrained enumeration, reversible search, bitmask pruning, and mutable prefix data.",
    order: 11,
    priority: "Targeted gap",
  },
  {
    id: "bit-math",
    title: "Bit Manipulation, Math & Recurrence",
    shortTitle: "Bit & Math",
    description: "Representation, logarithmic implicit structure, bit-greedy carries, and sieve boundaries.",
    order: 12,
    priority: "Targeted gap",
  },
];

export const v2Problems: ProblemDefinition[] = [
  ...arrayProblems,
  ...stringProblems,
  ...binarySearchProblems,
  ...stackProblems,
  ...linkedListProblems,
  ...greedyProblems,
  ...treeProblems,
  ...graphProblems,
  ...dpProblems,
  ...backtrackingProblems,
  ...bitMathProblems,
];

export const v2Mocks: MockDefinition[] = [
  ...arrayMocks,
  ...stringMocks,
  ...binarySearchMocks,
  ...stackMocks,
  ...linkedListMocks,
  ...greedyMocks,
  ...treeMocks,
  ...graphMocks,
  ...dpMocks,
  ...backtrackingMocks,
  ...bitMathMocks,
];
