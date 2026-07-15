import { CodeBlock } from "../../../components/CodeBlock";
import { InlineContent } from "../../../components/MarkdownContent";
import type { Problem } from "../../../content/schema";
import styles from "../../../styles/app.module.css";

interface ProblemSamplesProps {
  samples: Problem["samples"];
}

export function ProblemSamples({ samples }: ProblemSamplesProps) {
  return (
    <section className={styles.section}>
      <p className={styles.eyebrow}>SAMPLES</p>
      <h2>入出力例</h2>
      {samples.map((sample, index) => (
        <div className={styles.sampleGrid} key={`${sample.input}-${index}`}>
          <div>
            <strong>入力例 {index + 1}</strong>
            <CodeBlock copyText={sample.input} variant="sample">
              <code>{sample.input || "（入力なし）"}</code>
            </CodeBlock>
          </div>
          <div>
            <strong>出力例 {index + 1}</strong>
            <CodeBlock copyText={sample.output} variant="sample">
              <code>{sample.output}</code>
            </CodeBlock>
          </div>
          {sample.explanation && (
            <p>
              <InlineContent>{sample.explanation}</InlineContent>
            </p>
          )}
        </div>
      ))}
    </section>
  );
}
