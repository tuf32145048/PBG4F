import { Link, useParams } from "react-router-dom";
import { useProgress } from "../../app/useProgress";
import { MarkdownContent } from "../../components/MarkdownContent";
import { TermChip } from "../../components/TermChip";
import { catalog } from "../../content/loadContent";
import styles from "../../styles/app.module.css";

export function LessonPage() {
  const { lessonSlug } = useParams();
  const { progress, toggleLesson } = useProgress();
  const lesson = lessonSlug ? catalog.lessonBySlug.get(lessonSlug) : undefined;

  if (!lesson) {
    return (
      <div className={styles.emptyState}>
        <h1>教材が見つかりません</h1>
        <Link to="/">ガイド拠点へ戻る</Link>
      </div>
    );
  }

  const problems = catalog.problemsByLessonId.get(lesson.id) ?? [];
  const tips = lesson.tipIds
    .map((id) => catalog.tipById.get(id))
    .filter((tip) => tip !== undefined);
  const isComplete = progress.completedLessonIds.includes(lesson.id);
  const nextLesson = catalog.lessons.find(
    (candidate) => candidate.order === lesson.order + 1,
  );

  return (
    <article className={styles.page}>
      <header className={styles.pageHeader}>
        <p className={styles.eyebrow}>
          CHAPTER {String(lesson.order).padStart(2, "0")}
        </p>
        <h1>{lesson.title}</h1>
        <p>{lesson.summary}</p>
      </header>

      <section className={styles.objectivePanel}>
        <p className={styles.eyebrow}>CLEAR CONDITIONS</p>
        <h2>この章でできるようになること</h2>
        <ul>
          {lesson.objectives.map((objective) => (
            <li key={objective}>{objective}</li>
          ))}
        </ul>
      </section>

      <MarkdownContent>{lesson.body}</MarkdownContent>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>FIELD NOTES</p>
            <h2>関連用語</h2>
          </div>
          <p>クリックすると3段階の説明を確認できます。</p>
        </div>
        <div className={styles.chipList}>
          {lesson.termIds.map((termId) => (
            <TermChip key={termId} termId={termId} />
          ))}
        </div>
      </section>

      <section className={styles.tipGrid}>
        {tips.map((tip) => (
          <aside className={styles.tipCard} key={tip.id}>
            <span>TIP</span>
            <h3>{tip.title}</h3>
            <p>{tip.body}</p>
          </aside>
        ))}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>QUESTS</p>
            <h2>この章の問題</h2>
          </div>
          <p>{problems.length}問の短い問題で確認します。</p>
        </div>
        <div className={styles.problemRows}>
          {problems.map((problem, index) => {
            const completed = progress.completedProblemIds.includes(problem.id);
            return (
              <Link
                className={styles.problemRow}
                key={problem.id}
                to={`/problems/${problem.slug}`}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{problem.title}</strong>
                <span>難易度 {problem.level}</span>
                <span>{completed ? "攻略済み ✓" : "挑戦する →"}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <footer className={styles.chapterFooter}>
        <button
          className={isComplete ? styles.completedButton : styles.primaryButton}
          onClick={() => toggleLesson(lesson.id)}
          type="button"
        >
          {isComplete ? "章の完了を取り消す" : "この章を完了にする"}
        </button>
        {nextLesson && (
          <Link
            className={styles.secondaryButton}
            to={`/lessons/${nextLesson.slug}`}
          >
            次の章: {nextLesson.title}
          </Link>
        )}
      </footer>
    </article>
  );
}
