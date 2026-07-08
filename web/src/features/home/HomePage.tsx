import { Link } from "react-router-dom";
import { useProgress } from "../../app/useProgress";
import { catalog } from "../../content/loadContent";
import styles from "../../styles/app.module.css";

export function HomePage() {
  const { progress } = useProgress();
  const completedProblems = progress.completedProblemIds.length;
  const problemPercent = Math.round(
    (completedProblems / catalog.problems.length) * 100,
  );

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>PYTHON BEGINNER FIELD GUIDE</p>
          <h1>
            読める。
            <br />
            分けられる。
            <br />
            コードにできる。
          </h1>
          <p className={styles.heroLead}>
            5〜10分の小さな問題を攻略しながら、Pythonの基礎と問題文の読み方を身につけるガイドです。
          </p>
          <div className={styles.heroActions}>
            <Link
              className={styles.primaryButton}
              to={`/lessons/${catalog.lessons[0]?.slug ?? ""}`}
            >
              最初の章へ
            </Link>
            <Link className={styles.secondaryButton} to="/problems">
              問題を選ぶ
            </Link>
          </div>
        </div>

        <aside className={styles.statusCard}>
          <p className={styles.eyebrow}>CURRENT STATUS</p>
          <strong className={styles.progressNumber}>{problemPercent}%</strong>
          <div
            aria-label={`問題進捗 ${completedProblems}/${catalog.problems.length}`}
            className={styles.progressTrack}
            role="progressbar"
            aria-valuemax={catalog.problems.length}
            aria-valuemin={0}
            aria-valuenow={completedProblems}
          >
            <span style={{ width: `${problemPercent}%` }} />
          </div>
          <p>
            攻略済み問題 {completedProblems} / {catalog.problems.length}
          </p>
          <p>
            完了した章 {progress.completedLessonIds.length} /{" "}
            {catalog.lessons.length}
          </p>
        </aside>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>ROUTE MAP</p>
            <h2>基礎ルート</h2>
          </div>
          <p>上から順に進めると、新しい概念が少しずつ増えます。</p>
        </div>

        <div className={styles.cardGrid}>
          {catalog.lessons.map((lesson) => {
            const problemCount =
              catalog.problemsByLessonId.get(lesson.id)?.length ?? 0;
            const isComplete = progress.completedLessonIds.includes(lesson.id);
            return (
              <Link
                className={styles.lessonCard}
                key={lesson.id}
                to={`/lessons/${lesson.slug}`}
              >
                <span className={styles.cardNumber}>
                  {String(lesson.order).padStart(2, "0")}
                </span>
                <div>
                  <p className={styles.cardMeta}>
                    {isComplete ? "CLEAR" : "NEW"} / {problemCount} QUESTS
                  </p>
                  <h3>{lesson.title}</h3>
                  <p>{lesson.summary}</p>
                </div>
                <span className={styles.cardArrow}>→</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className={styles.guidePanel}>
        <p className={styles.eyebrow}>HOW TO USE</p>
        <h2>迷ったら、この順番で確認</h2>
        <ol className={styles.stepList}>
          <li>
            <span>01</span>
            <div>
              <strong>入力と出力を分ける</strong>
              <p>何が与えられ、最終的に何を表示するかを先に確認します。</p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <strong>手でサンプルを試す</strong>
              <p>コードを書く前に、少ない値で結果までの流れを追います。</p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <strong>小さな処理へ分ける</strong>
              <p>入力、変換、計算、出力を別々の行として考えます。</p>
            </div>
          </li>
        </ol>
      </section>
    </div>
  );
}
