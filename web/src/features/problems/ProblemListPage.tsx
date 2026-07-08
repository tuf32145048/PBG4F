import { Link } from "react-router-dom";
import { useProgress } from "../../app/useProgress";
import { catalog } from "../../content/loadContent";
import styles from "../../styles/app.module.css";

export function ProblemListPage() {
  const { progress } = useProgress();

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <p className={styles.eyebrow}>QUEST BOARD</p>
        <h1>問題一覧</h1>
        <p>
          1問5〜10分が目安です。分からないときは、ヒントを1段階ずつ開いてください。
        </p>
      </header>

      {catalog.lessons.map((lesson) => {
        const problems = catalog.problemsByLessonId.get(lesson.id) ?? [];
        const completedCount = problems.filter((problem) =>
          progress.completedProblemIds.includes(problem.id),
        ).length;

        return (
          <section className={styles.problemGroup} key={lesson.id}>
            <div className={styles.sectionHeading}>
              <div>
                <p className={styles.eyebrow}>
                  CHAPTER {String(lesson.order).padStart(2, "0")}
                </p>
                <h2>{lesson.title}</h2>
              </div>
              <p>
                {completedCount} / {problems.length} 攻略済み
              </p>
            </div>
            <div className={styles.cardGrid}>
              {problems.map((problem) => {
                const completed = progress.completedProblemIds.includes(
                  problem.id,
                );
                return (
                  <Link
                    className={styles.questCard}
                    key={problem.id}
                    to={`/problems/${problem.slug}`}
                  >
                    <span className={styles.levelBadge}>
                      LV.{problem.level}
                    </span>
                    <h3>{problem.title}</h3>
                    <p>{problem.statement}</p>
                    <span className={styles.questStatus}>
                      {completed ? "CLEAR ✓" : "OPEN →"}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
