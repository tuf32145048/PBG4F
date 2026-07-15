import type { Ref } from "react";
import { NavLink } from "react-router-dom";
import { catalog } from "../content/loadContent";
import styles from "../styles/app.module.css";

interface SidebarNavigationProps {
  closeButtonRef: Ref<HTMLButtonElement>;
  completedLessonIds: readonly string[];
  isOpen: boolean;
  onCloseMobile: () => void;
  onNavigate: () => void;
  onToggle: () => void;
}

export function SidebarNavigation({
  closeButtonRef,
  completedLessonIds,
  isOpen,
  onCloseMobile,
  onNavigate,
  onToggle,
}: SidebarNavigationProps) {
  return (
    <>
      <aside
        aria-hidden={!isOpen}
        aria-label="学習メニュー"
        className={styles.sidebar}
        id="learning-menu"
        inert={!isOpen}
      >
        <button
          aria-label="メニューを閉じる"
          className={styles.sidebarCloseButton}
          onClick={onCloseMobile}
          ref={closeButtonRef}
          type="button"
        >
          ×
        </button>
        <NavLink className={styles.brand} onClick={onNavigate} to="/">
          <span className={styles.brandMark}>Py</span>
          <span className={styles.brandName}>Python Beginner Guide</span>
        </NavLink>

        <nav aria-label="メインナビゲーション">
          <NavLink
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`
            }
            end
            onClick={onNavigate}
            to="/"
          >
            ガイド拠点
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`
            }
            onClick={onNavigate}
            to="/problems"
          >
            問題一覧
          </NavLink>
        </nav>

        <div className={styles.chapterNav}>
          <p className={styles.eyebrow}>CHAPTERS</p>
          {catalog.lessons.map((lesson) => {
            const completed = completedLessonIds.includes(lesson.id);
            return (
              <NavLink
                className={({ isActive }) =>
                  `${styles.chapterLink} ${
                    isActive ? styles.chapterLinkActive : ""
                  }`
                }
                key={lesson.id}
                onClick={onNavigate}
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
          読んで、分解して、書いてみる。
        </p>
      </aside>

      <button
        aria-controls="learning-menu"
        aria-expanded={isOpen}
        aria-label={`サイドメニューを${isOpen ? "閉じる" : "開く"}`}
        className={styles.sidebarToggle}
        onClick={onToggle}
        type="button"
      >
        <span aria-hidden="true">{isOpen ? "‹" : "›"}</span>
      </button>

      <button
        aria-hidden="true"
        className={styles.sidebarBackdrop}
        onClick={onCloseMobile}
        tabIndex={-1}
        type="button"
      />
    </>
  );
}
