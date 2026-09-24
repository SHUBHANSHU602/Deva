export type Difficulty = "Easy" | "Medium" | "Hard";

export interface SampleCase {
  input: string;
  output: string;
  explanation: string;
}

export interface TestCase {
  name: string;
  input: string;
  expectedOutput: string;
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

export interface ProblemDefinition {
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
  tags: string[];
  tests: TestCase[];
  editorial: Editorial;
}

export interface MockDefinition {
  id: string;
  topicId: string;
  title: string;
  subtitle: string;
  level: 1 | 2 | 3;
  durationMinutes: number;
  problemIds: string[];
  focus: string[];
}

export interface TopicDefinition {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  order: number;
  priority: "Core" | "Targeted gap";
}

export type PublicProblem = Omit<ProblemDefinition, "tests" | "editorial" | "tags">;

export interface PublicMock extends Omit<MockDefinition, "problemIds"> {
  problems: PublicProblem[];
}
