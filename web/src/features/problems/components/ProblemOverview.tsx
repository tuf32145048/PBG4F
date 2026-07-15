import { Link } from "react-router-dom";
import { InlineContent } from "../../../components/MarkdownContent";
import { TermChip } from "../../../components/TermChip";
import type { Lesson, Problem } from "../../../content/schema";
import styles from "../../../styles/app.module.css";

interface ProblemOverviewProps {
  lesson?: Lesson;
  problem: Problem;
  problemNumber: number;
}

export function ProblemOverview({
  lesson,
  problem,
  problemNumber,
}: ProblemOverviewProps) {
  return (
    <>
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
            QUEST {String(problemNumber).padStart(2, "0")}
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
        <p>
          <InlineContent>{problem.statement}</InlineContent>
        </p>
      </section>

      <div className={styles.ioGrid}>
        <section>
          <h2>入力</h2>
          <p>
            <InlineContent>{problem.inputFormat}</InlineContent>
          </p>
        </section>
        <section>
          <h2>出力</h2>
          <p>
            <InlineContent>{problem.outputFormat}</InlineContent>
          </p>
        </section>
      </div>
    </>
  );
}
