import { describe, expect, it } from "vitest";
import { classifyFailure } from "../src/services/judge.js";
import type { ExecutionResult } from "../src/services/piston.js";

function execution(overrides: Partial<ExecutionResult> = {}): ExecutionResult {
  return {
    stdout: "",
    stderr: "",
    compileOutput: "",
    compileCode: 0,
    exitCode: 0,
    signal: null,
    ...overrides,
  };
}

describe("judge failure classification", () => {
  it("treats compiler warnings as non-fatal when compilation succeeds", () => {
    expect(classifyFailure(execution({ compileOutput: "warning: unused variable" }))).toBeNull();
  });

  it("uses the compile exit code for compilation failures", () => {
    expect(classifyFailure(execution({ compileCode: 1, compileOutput: "error" }))).toBe("compile_error");
  });

  it("does not reject successful output just because the program wrote diagnostics", () => {
    expect(classifyFailure(execution({ stderr: "debug" }))).toBeNull();
  });

  it("classifies killed and non-zero executions", () => {
    expect(classifyFailure(execution({ signal: "SIGXCPU", exitCode: null }))).toBe("time_limit");
    expect(classifyFailure(execution({ exitCode: 1 }))).toBe("runtime_error");
  });
});
