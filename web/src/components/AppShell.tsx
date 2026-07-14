import { NavLink, Outlet } from "react-router-dom";
import { catalog } from "../content/loadContent";
import { useProgress } from "../app/useProgress";
import { TermDialog } from "./TermDialog";
import styles from "../styles/app.module.css";

export function AppShell() {
  const { progress } = useProgress();

  return (
    <div className={styles.appShell}>
      <a
        className={styles.skipLink}
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        本文へ移動
      </a>
      <aside className={styles.sidebar}>
        <NavLink className={styles.brand} to="/">
          <span className={styles.brandMark}>Py</span>
          <span className={styles.brandName}>Python Beginner Guide</span>
        </NavLink>

        <nav aria-label="メインナビゲーション">
          <NavLink
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`
            }
            end
            to="/"
          >
            ガイド拠点
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`
            }
            to="/problems"
          >
            問題一覧
          </NavLink>
        </nav>

        <div className={styles.chapterNav}>
          <p className={styles.eyebrow}>CHAPTERS</p>
          {catalog.lessons.map((lesson) => {
            const completed = progress.completedLessonIds.includes(lesson.id);
            return (
              <NavLink
                className={({ isActive }) =>
                  `${styles.chapterLink} ${
                    isActive ? styles.chapterLinkActive : ""
                  }`
                }
                key={lesson.id}
                to={`/lessons/${lesson.slug}`}
              >
                <span>{String(lesson.order).padStart(2, "0")}</span>
                <span>{lesson.title}</span>
                <span aria-label={completed ? "完了" : "未完了"}>
                  {completed ? "✓" : "·"}
                </span>
              </NavLink>
            );
          })}
        </div>

        <p className={styles.sidebarNote}>
          短い問題を、読んで、分けて、コードにする。
        </p>
      </aside>

      <div className={styles.mainColumn}>
        <header className={styles.mobileHeader}>
          <NavLink className={styles.mobileBrand} to="/">
            Python Beginner Guide
          </NavLink>
          <NavLink to="/problems">問題一覧</NavLink>
        </header>
        <main className={styles.mainContent} id="main-content" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
      <TermDialog />
    </div>
  );
}
