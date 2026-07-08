import { useCallback, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { catalog } from "../content/loadContent";
import type { TermCategory } from "../content/schema";
import styles from "../styles/app.module.css";

const termCategoryLabels: Record<TermCategory, string> = {
  "general-concept": "一般概念",
  "programming-concept": "プログラミング全般概念",
  "python-specific": "Pythonの文法・機能・関数・メソッド・予約語",
};

export function TermDialog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const termId = searchParams.get("term");
  const term = termId ? catalog.termById.get(termId) : undefined;

  const close = useCallback(() => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.delete("term");
      return next;
    });
  }, [setSearchParams]);

  useEffect(() => {
    if (!term) {
      return;
    }

    const previousActiveElement = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousActiveElement?.focus();
    };
  }, [close, termId, term]);

  if (!term) {
    return null;
  }

  const relatedLessons = catalog.lessonsByTermId.get(term.id) ?? [];
  const relatedProblems = catalog.problemsByTermId.get(term.id) ?? [];

  return (
    <div
      aria-labelledby="term-dialog-title"
      aria-modal="true"
      className={styles.dialogBackdrop}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          close();
        }
      }}
      role="dialog"
    >
      <section className={styles.dialogPanel} key={term.id}>
        <button
          aria-label="用語説明を閉じる"
          className={styles.dialogClose}
          onClick={close}
          ref={closeButtonRef}
          type="button"
        >
          ×
        </button>
        <p className={styles.eyebrow}>{termCategoryLabels[term.category]}</p>
        <h2 id="term-dialog-title">{term.label}</h2>
        {term.aliases.length > 0 && (
          <p className={styles.aliases}>別名: {term.aliases.join(" / ")}</p>
        )}
        {term.descriptionTargetId !== term.id && (
          <p className={styles.aliases}>
            説明対象: {term.descriptionTargetId}
          </p>
        )}

        <div className={styles.termLevel}>
          <strong>一言</strong>
          <p>{term.short}</p>
        </div>
        <details className={styles.termDisclosure}>
          <summary>もう少し詳しく</summary>
          <p>{term.detail}</p>
        </details>
        <details className={styles.termDisclosure}>
          <summary>後で分かる話</summary>
          <p>{term.later}</p>
        </details>

        {(relatedLessons.length > 0 || relatedProblems.length > 0) && (
          <div className={styles.relatedLinks}>
            <strong>関連コンテンツ</strong>
            {relatedLessons.map((lesson) => (
              <Link
                key={lesson.id}
                onClick={close}
                to={`/lessons/${lesson.slug}`}
              >
                教材: {lesson.title}
              </Link>
            ))}
            {relatedProblems.slice(0, 4).map((problem) => (
              <Link
                key={problem.id}
                onClick={close}
                to={`/problems/${problem.slug}`}
              >
                問題: {problem.title}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
