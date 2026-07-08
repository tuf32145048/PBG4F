import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useProgress } from "../../app/useProgress";
import { TermChip } from "../../components/TermChip";
import { catalog } from "../../content/loadContent";
import styles from "../../styles/app.module.css";

export function ProblemPage() {
  const { problemSlug } = useParams();
  const { progress, setReviewItem, toggleProblem } = useProgress();
  const [visibleHintCount, setVisibleHintCount] = useState(0);
  const problem = problemSlug
    ? catalog.problemBySlug.get(problemSlug)
    : undefined;

  if (!problem) {
    return (
      <div className={styles.emptyState}>
        <h1>問題が見つかりません</h1>
        <Link to="/problems">問題一覧へ戻る</Link>
      </div>
    );
  }

  const lesson = catalog.lessonById.get(problem.lessonId);
  const completed = progress.completedProblemIds.includes(problem.id);
  const checkedItems = progress.reviewChecks[problem.id] ?? [];
  const siblingProblems = catalog.problemsByLessonId.get(problem.lessonId) ?? [];
  const problemIndex = siblingProblems.findIndex(
    (candidate) => candidate.id === problem.id,
  );
  const nextProblem = siblingProblems[problemIndex + 1];

  return (
    <article className={styles.page}>
      <nav aria-label="パンくず" className={styles.breadcrumbs}>
        <Link to="/problems">問題一覧</Link>
        <span>/</span>
        {lesson && (
          <Link to={`/lessons/${lesson.slug}`}>{lesson.title}</Link>
        )}
      </nav>

      <header className={styles.problemHeader}>
        <div>
          <p className={styles.eyebrow}>
            QUEST {String(problemIndex + 1).padStart(2, "0")}
          </p>
          <h1>{problem.title}</h1>
        </div>
        <span className={styles.largeLevelBadge}>LEVEL {problem.level}</span>
      </header>

      <div className={styles.chipList}>
        {problem.conceptIds.map((termId) => (
          <TermChip key={termId} termId={termId} />
        ))}
      </div>

      <section className={styles.problemStatement}>
        <p className={styles.eyebrow}>MISSION</p>
        <p>{problem.statement}</p>
      </section>

      <div className={styles.ioGrid}>
        <section>
          <h2>入力</h2>
          <p>{problem.inputFormat}</p>
        </section>
        <section>
          <h2>出力</h2>
          <p>{problem.outputFormat}</p>
        </section>
      </div>

      <section className={styles.section}>
        <p className={styles.eyebrow}>SAMPLES</p>
        <h2>入出力例</h2>
        {problem.samples.map((sample, index) => (
          <div className={styles.sampleGrid} key={`${sample.input}-${index}`}>
            <div>
              <strong>入力例 {index + 1}</strong>
              <pre>
                <code>{sample.input || "（入力なし）"}</code>
              </pre>
            </div>
            <div>
              <strong>出力例 {index + 1}</strong>
              <pre>
                <code>{sample.output}</code>
              </pre>
            </div>
            {sample.explanation && <p>{sample.explanation}</p>}
          </div>
        ))}
      </section>

      <section className={styles.hintPanel}>
        <p className={styles.eyebrow}>HINTS</p>
        <h2>段階ヒント</h2>
        {problem.hints.slice(0, visibleHintCount).map((hint, index) => (
          <div className={styles.hintItem} key={hint}>
            <span>HINT {index + 1}</span>
            <p>{hint}</p>
          </div>
        ))}
        {visibleHintCount < problem.hints.length ? (
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

      <section className={styles.section}>
        <p className={styles.eyebrow}>THINKING TRACE</p>
        <h2>答えまでの考え方</h2>
        <ol className={styles.traceList}>
          {problem.explanationTrace.map((trace, index) => (
            <li key={trace.step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <strong>{trace.step}</strong>
                <p>{trace.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <details className={styles.solutionPanel}>
        <summary>解答例を見る</summary>
        <pre>
          <code>{problem.solution.code}</code>
        </pre>
        <p>{problem.solution.explanation}</p>
      </details>

      <div className={styles.reviewGrid}>
        <section className={styles.mistakePanel}>
          <p className={styles.eyebrow}>COMMON MISTAKES</p>
          <h2>間違えやすい点</h2>
          <ul>
            {problem.commonMistakes.map((mistake) => (
              <li key={mistake}>{mistake}</li>
            ))}
          </ul>
        </section>

        <section className={styles.checklistPanel}>
          <p className={styles.eyebrow}>FINAL CHECK</p>
          <h2>見直しポイント</h2>
          {problem.reviewChecklist.map((item) => (
            <label key={item.id}>
              <input
                checked={checkedItems.includes(item.id)}
                onChange={(event) =>
                  setReviewItem(problem.id, item.id, event.target.checked)
                }
                type="checkbox"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </section>
      </div>

      <footer className={styles.chapterFooter}>
        <button
          className={completed ? styles.completedButton : styles.primaryButton}
          onClick={() => toggleProblem(problem.id)}
          type="button"
        >
          {completed ? "攻略済みを取り消す" : "この問題を攻略済みにする"}
        </button>
        {nextProblem ? (
          <Link
            className={styles.secondaryButton}
            to={`/problems/${nextProblem.slug}`}
          >
            次の問題: {nextProblem.title}
          </Link>
        ) : (
          <Link className={styles.secondaryButton} to="/problems">
            問題一覧へ戻る
          </Link>
        )}
      </footer>
    </article>
  );
}
