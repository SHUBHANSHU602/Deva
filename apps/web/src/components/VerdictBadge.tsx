import { CheckCircle2, CircleAlert, Clock3, Code2, XCircle } from "lucide-react";
import type { Verdict } from "../types";

const labels: Record<Verdict, string> = {
  accepted: "Accepted",
  wrong_answer: "Wrong answer",
  compile_error: "Compile error",
  runtime_error: "Runtime error",
  time_limit: "Time limit",
  judge_error: "Judge error",
};

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const Icon = verdict === "accepted"
    ? CheckCircle2
    : verdict === "time_limit"
      ? Clock3
      : verdict === "compile_error"
        ? Code2
        : verdict === "judge_error"
          ? CircleAlert
          : XCircle;
  return (
    <span className={`verdict verdict-${verdict}`}>
      <Icon size={15} /> {labels[verdict]}
    </span>
  );
}
