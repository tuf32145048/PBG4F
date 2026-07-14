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
          <p className={styles.eyebrow}>Python Beginner Guide</p>
          <h1>
            読んで、
            <br />
            分解して、
            <br />
            書いてみる。
          </h1>
          <p className={styles.heroLead}>
            1日5〜10分の小さなクエストで、Pythonの基礎を少しずつ攻略しましょう。
          </p>
          <p className={styles.heroSupport}>
            座学で習ったはずなのに、いざコードを書こうとすると手が止まる。そんな人のための実践ガイドです。
            <br />
            小さな問題をパズルのように解きながら、「プログラミングの考え方」を身につけましょう。
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
        <h2>迷ったら、この3ステップ！</h2>
        <ol className={styles.stepList}>
          <li>
            <span>01</span>
            <div>
              <strong>ゴールを確認する</strong>
              <p>
                何を受け取って、最後に何を表示すればクリアなのかを確認します。
              </p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <strong>シミュレーションする</strong>
              <p>
                いきなりコードを書かず、まずは手元で簡単な例の答えを出してみます。
              </p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <strong>細かく分解する</strong>
              <p>
                「受け取る」「計算する」「表示する」など、1行ずつ別々の処理として考えます。
              </p>
            </div>
          </li>
        </ol>
      </section>
    </div>
  );
}
