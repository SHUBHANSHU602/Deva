import { describe, expect, it } from "vitest";
import { getPublicCatalog, mocks, problems, topics } from "../src/data/catalog.js";

describe("V2 catalog integrity", () => {
  it("ships the complete topic-wise curriculum", () => {
    expect(topics).toHaveLength(12);
    expect(mocks).toHaveLength(36);
    expect(problems).toHaveLength(72);
    expect(new Set(topics.map((topic) => topic.id)).size).toBe(topics.length);
    expect(new Set(mocks.map((mock) => mock.id)).size).toBe(mocks.length);
    expect(new Set(problems.map((problem) => problem.id)).size).toBe(problems.length);
  });

  it("assigns exactly three two-problem mocks to every topic", () => {
    for (const topic of topics) {
      const topicMocks = mocks.filter((mock) => mock.topicId === topic.id);
      expect(topicMocks, topic.id).toHaveLength(3);
      for (const mock of topicMocks) expect(mock.problemIds, mock.id).toHaveLength(2);
    }
  });

  it("assigns every problem exactly once", () => {
    const assignments = mocks.flatMap((mock) => mock.problemIds);
    expect(assignments).toHaveLength(problems.length);
    expect(new Set(assignments).size).toBe(problems.length);
    expect(new Set(assignments)).toEqual(new Set(problems.map((problem) => problem.id)));
  });

  it("keeps tests, tags, and editorials out of the public catalog", () => {
    const publicCatalog = getPublicCatalog();
    expect(publicCatalog).toHaveLength(mocks.length);
    const publicProblem = publicCatalog[0].problems[0] as unknown as Record<string, unknown>;
    expect(publicProblem.tests).toBeUndefined();
    expect(publicProblem.tags).toBeUndefined();
    expect(publicProblem.editorial).toBeUndefined();
  });
});
