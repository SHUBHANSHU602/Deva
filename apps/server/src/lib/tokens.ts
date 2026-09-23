import { createHmac, timingSafeEqual } from "node:crypto";

type TokenKind = "attempt" | "review";

export interface AttemptTokenPayload {
  kind: "attempt";
  mockId: string;
  startedAt: number;
  deadline: number;
  nonce: string;
}

export interface ReviewTokenPayload {
  kind: "review";
  mockId: string;
  completedAt: number;
  nonce: string;
}

type TokenPayload = AttemptTokenPayload | ReviewTokenPayload;

const secret = process.env.ATTEMPT_TOKEN_SECRET || "deva-local-development-secret";

function signature(encodedPayload: string): string {
  return createHmac("sha256", secret).update(encodedPayload).digest("base64url");
}

export function signToken(payload: TokenPayload): string {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encodedPayload}.${signature(encodedPayload)}`;
}

export function verifyToken<T extends TokenPayload>(token: string, kind: TokenKind): T {
  const [encodedPayload, receivedSignature] = token.split(".");
  if (!encodedPayload || !receivedSignature) throw new Error("Malformed token");

  const expectedSignature = signature(encodedPayload);
  const received = Buffer.from(receivedSignature);
  const expected = Buffer.from(expectedSignature);
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
    throw new Error("Invalid token signature");
  }

  const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as TokenPayload;
  if (payload.kind !== kind) throw new Error("Unexpected token kind");
  return payload as T;
}
