import type { ProblemDefinition, TestCase } from "../types/catalog.js";
import { normalizeOutput, outputsMatch } from "../lib/output.js";
import { executeCpp } from "./piston.js";

export type Verdict =
  | "accepted"
  | "wrong_answer"
  | "compile_error"
  | "runtime_error"
  | "time_limit"
  | "judge_error";

export interface SampleRunResult {
  verdict: Verdict;
  actualOutput: string;
  expectedOutput: string;
  stderr?: string;
}

export interface SubmissionResult {
  verdict: Verdict;
  passed: number;
  total: number;
  compileOutput?: string;
  stderr?: string;
}

export function classifyFailure(result: Awaited<ReturnType<typeof executeCpp>>): Verdict | null {
  if (result.compileCode !== null && result.compileCode !== 0) return "compile_error";
  if (result.signal?.includes("KILL") || result.signal?.includes("XCPU")) return "time_limit";
  if (result.exitCode !== null && result.exitCode !== 0) return "runtime_error";
  return null;
}

async function executeTest(code: string, test: TestCase) {
  const result = await executeCpp(code, test.input);
  const failure = classifyFailure(result);
  if (failure) return { verdict: failure, result };
  return {
    verdict: outputsMatch(result.stdout, test.expectedOutput) ? ("accepted" as const) : ("wrong_answer" as const),
    result,
  };
}

export async function runSample(
  problem: ProblemDefinition,
  sampleIndex: number,
  code: string,
): Promise<SampleRunResult> {
  const sample = problem.samples[sampleIndex];
  if (!sample) throw new Error("Unknown sample");

  const execution = await executeTest(code, {
    name: `sample-${sampleIndex + 1}`,
    input: sample.input,
    expectedOutput: sample.output,
  });

  return {
    verdict: execution.verdict,
    actualOutput: normalizeOutput(execution.result.stdout),
    expectedOutput: normalizeOutput(sample.output),
    stderr: execution.result.compileOutput || execution.result.stderr || undefined,
  };
}

export async function submitProblem(problem: ProblemDefinition, code: string): Promise<SubmissionResult> {
  let passed = 0;

  for (const test of problem.tests) {
    const execution = await executeTest(code, test);
    if (execution.verdict !== "accepted") {
      return {
        verdict: execution.verdict,
        passed,
        total: problem.tests.length,
        compileOutput: execution.result.compileOutput || undefined,
        stderr: execution.result.stderr || undefined,
      };
    }
    passed += 1;
  }

  return { verdict: "accepted", passed, total: problem.tests.length };
}
