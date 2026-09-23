import { describe, expect, it } from "vitest";
import { normalizeOutput, outputsMatch } from "../src/lib/output.js";

describe("output comparison", () => {
  it("ignores trailing spaces and final newlines", () => {
    expect(outputsMatch("1 2 3  \n\n", "1 2 3\n")).toBe(true);
  });

  it("preserves meaningful line boundaries", () => {
    expect(outputsMatch("1 2\n3", "1\n2 3")).toBe(false);
  });

  it("normalizes Windows line endings", () => {
    expect(normalizeOutput("a\r\nb\r\n")).toBe("a\nb");
  });
});
