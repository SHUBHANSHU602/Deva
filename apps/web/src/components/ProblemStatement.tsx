import { ChevronRight } from "lucide-react";
import type { Problem } from "../types";

export function ProblemStatement({ problem }: { problem: Problem }) {
  return (
    <article className="problem-statement">
      <header>
        <div className="problem-kicker">
          <span className={`difficulty difficulty-${problem.difficulty.toLowerCase()}`}>{problem.difficulty}</span>
          <span>{problem.recommendedMinutes} min target</span>
        </div>
        <h1>{problem.title}</h1>
      </header>

      <p className="statement-copy">{problem.statement}</p>

      <section>
        <h2>Input</h2>
        <ul>{problem.inputFormat.map((line) => <li key={line}>{line}</li>)}</ul>
      </section>

      <section>
        <h2>Output</h2>
        <ul>{problem.outputFormat.map((line) => <li key={line}>{line}</li>)}</ul>
      </section>

      <section>
        <h2>Constraints</h2>
        <ul className="constraints">{problem.constraints.map((line) => <li key={line}><ChevronRight size={14} />{line}</li>)}</ul>
      </section>

      {problem.samples.map((sample, index) => (
        <section className="sample" key={`${problem.id}-${index}`}>
          <h2>Sample {index + 1}</h2>
          <div className="sample-grid">
            <div><span>Input</span><pre>{sample.input}</pre></div>
            <div><span>Output</span><pre>{sample.output}</pre></div>
          </div>
          <p>{sample.explanation}</p>
        </section>
      ))}
    </article>
  );
}
