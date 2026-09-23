import { describe, expect, it } from "vitest";
import { signToken, verifyToken, type AttemptTokenPayload } from "../src/lib/tokens.js";

describe("attempt tokens", () => {
  const payload: AttemptTokenPayload = {
    kind: "attempt",
    mockId: "heap-foundations",
    startedAt: 100,
    deadline: 200,
    nonce: "test-nonce",
  };

  it("round-trips a valid signed token", () => {
    expect(verifyToken<AttemptTokenPayload>(signToken(payload), "attempt")).toEqual(payload);
  });

  it("rejects a modified token", () => {
    const token = signToken(payload);
    expect(() => verifyToken(`${token.slice(0, -1)}x`, "attempt")).toThrow();
  });

  it("rejects a token used for the wrong purpose", () => {
    expect(() => verifyToken(signToken(payload), "review")).toThrow("Unexpected token kind");
  });
});
