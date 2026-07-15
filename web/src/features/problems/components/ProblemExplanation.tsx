import { CodeBlock } from "../../../components/CodeBlock";
import { InlineContent } from "../../../components/MarkdownContent";
import type { Problem } from "../../../content/schema";
import styles from "../../../styles/app.module.css";

interface ProblemExplanationProps {
  explanationTrace: Problem["explanationTrace"];
  solution: Problem["solution"];
}

export function ProblemExplanation({
  explanationTrace,
  solution,
}: ProblemExplanationProps) {
  return (
    <>
      <section className={styles.section}>
        <p className={styles.eyebrow}>THINKING TRACE</p>
        <h2>答えまでの考え方</h2>
        <ol className={styles.traceList}>
          {explanationTrace.map((trace, index) => (
            <li key={trace.step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <strong>
                  <InlineContent>{trace.step}</InlineContent>
                </strong>
                <p>
                  <InlineContent>{trace.detail}</InlineContent>
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <details className={styles.solutionPanel}>
        <summary>解答例を見る</summary>
        <CodeBlock copyText={solution.code} variant="solution">
          <code>{solution.code}</code>
        </CodeBlock>
        <p>
          <InlineContent>{solution.explanation}</InlineContent>
        </p>
      </details>
    </>
  );
}
