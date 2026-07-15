import { useState } from "react";
import { InlineContent } from "../../../components/MarkdownContent";
import type { Problem } from "../../../content/schema";
import styles from "../../../styles/app.module.css";

interface ProblemHintsProps {
  hints: Problem["hints"];
}

export function ProblemHints({ hints }: ProblemHintsProps) {
  const [visibleHintCount, setVisibleHintCount] = useState(0);

  return (
    <section className={styles.hintPanel}>
      <p className={styles.eyebrow}>HINTS</p>
      <h2>段階ヒント</h2>
      {hints.slice(0, visibleHintCount).map((hint, index) => (
        <div className={styles.hintItem} key={`${index}-${hint}`}>
          <span>HINT {index + 1}</span>
          <p>
            <InlineContent>{hint}</InlineContent>
          </p>
        </div>
      ))}
      {visibleHintCount < hints.length ? (
        <button
          className={styles.secondaryButton}
          onClick={() => setVisibleHintCount((count) => count + 1)}
          type="button"
        >
          ヒントを1つ開く
        </button>
      ) : (
        <p className={styles.mutedText}>すべてのヒントを表示しました。</p>
      )}
    </section>
  );
}
