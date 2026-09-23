import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { problems } from "../src/data/catalog.js";
import { normalizeOutput } from "../src/lib/output.js";

const temporaryDirectory = mkdtempSync(path.join(tmpdir(), "deva-reference-"));

afterAll(() => {
  rmSync(temporaryDirectory, { recursive: true, force: true });
});

describe("reference solutions", () => {
  for (const problem of problems) {
    it(`${problem.id} passes every curated test`, () => {
      const mainStart = problem.starterCode.indexOf("int main()");
      expect(mainStart).toBeGreaterThan(0);
      const source = [
        "#include <bits/stdc++.h>",
        "using namespace std;",
        problem.editorial.referenceCode,
        problem.starterCode.slice(mainStart),
      ].join("\n\n");

      const sourcePath = path.join(temporaryDirectory, `${problem.id}.cpp`);
      const executablePath = path.join(temporaryDirectory, problem.id);
      writeFileSync(sourcePath, source, "utf8");
      execFileSync("g++", ["-std=c++17", "-O2", sourcePath, "-o", executablePath]);

      for (const test of problem.tests) {
        const execution = spawnSync(executablePath, [], {
          input: test.input,
          encoding: "utf8",
          timeout: 3_000,
        });
        expect(execution.status, `${test.name}: ${execution.stderr}`).toBe(0);
        expect(normalizeOutput(execution.stdout), test.name).toBe(normalizeOutput(test.expectedOutput));
      }
    }, 15_000);
  }
});
