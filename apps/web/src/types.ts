export type Difficulty = "Easy" | "Medium" | "Hard";

export interface SampleCase {
  input: string;
  output: string;
  explanation: string;
}

export interface Problem {
  id: string;
  title: string;
  shortTitle: string;
  difficulty: Difficulty;
  recommendedMinutes: number;
  statement: string;
  inputFormat: string[];
  outputFormat: string[];
  constraints: string[];
  samples: SampleCase[];
  starterCode: string;
}

export interface Mock {
  id: string;
  topicId: string;
  title: string;
  subtitle: string;
  level: 1 | 2 | 3;
  durationMinutes: number;
  focus: string[];
  problems: Problem[];
}

export interface Topic {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  order: number;
  priority: "Core" | "Targeted gap";
}

export interface Catalog {
  topics: Topic[];
  mocks: Mock[];
}

export type Verdict =
  | "accepted"
  | "wrong_answer"
  | "compile_error"
  | "runtime_error"
  | "time_limit"
  | "judge_error";

export interface SubmissionResult {
  verdict: Verdict;
  passed: number;
  total: number;
  compileOutput?: string;
  stderr?: string;
}

export interface SampleRunResult {
  verdict: Verdict;
  actualOutput: string;
  expectedOutput: string;
  stderr?: string;
}

export interface Editorial {
  recognitionSignal: string;
  approach: string[];
  complexity: string;
  edgeCases: string[];
  referenceCode: string;
  alignment: {
    analogousPattern: string;
    evidenceWindow: string;
    confidence: "Medium" | "High";
  };
}

export type ReflectionTag = "recognition" | "implementation" | "edge_cases" | "complexity" | "time";

export interface AttemptResult extends SubmissionResult {
  submittedAt: number;
}

export interface LocalAttempt {
  id: string;
  mockId: string;
  attemptToken: string;
  reviewToken?: string;
  startedAt: number;
  deadline: number;
  completedAt?: number;
  status: "active" | "completed" | "timed_out";
  codeByProblem: Record<string, string>;
  resultsByProblem: Record<string, AttemptResult>;
  runCountByProblem: Record<string, number>;
  reflectionTags: ReflectionTag[];
}
