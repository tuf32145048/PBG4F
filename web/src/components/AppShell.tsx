import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { catalog } from "../content/loadContent";
import { useProgress } from "../app/useProgress";
import { TermDialog } from "./TermDialog";
import styles from "../styles/app.module.css";

const narrowViewportQuery = "(max-width: 760px)";

function isSidebarOpenByDefault() {
  return (
    typeof window.matchMedia !== "function" ||
    !window.matchMedia(narrowViewportQuery).matches
  );
}

export function AppShell() {
  const { progress } = useProgress();
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    isSidebarOpenByDefault,
  );
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileCloseButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia(narrowViewportQuery);
    const handleViewportChange = (event: MediaQueryListEvent) => {
      setIsSidebarOpen(!event.matches);
    };

    mediaQuery.addEventListener("change", handleViewportChange);
    return () => mediaQuery.removeEventListener("change", handleViewportChange);
  }, []);

  useEffect(() => {
    if (!isSidebarOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
        typeof window.matchMedia === "function" &&
        window.matchMedia(narrowViewportQuery).matches
      ) {
        setIsSidebarOpen(false);
        mobileMenuButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isSidebarOpen]);

  const closeAfterNavigation = () => {
    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia(narrowViewportQuery).matches
    ) {
      setIsSidebarOpen(false);
    }
  };

  const openMobileSidebar = () => {
    setIsSidebarOpen(true);
    window.requestAnimationFrame(() => mobileCloseButtonRef.current?.focus());
  };

  const closeMobileSidebar = () => {
    setIsSidebarOpen(false);
    mobileMenuButtonRef.current?.focus();
  };

  return (
    <div
      className={`${styles.appShell} ${
        isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
      }`}
    >
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
      <aside
        aria-hidden={!isSidebarOpen}
        aria-label="学習メニュー"
        className={styles.sidebar}
        id="learning-menu"
        inert={!isSidebarOpen}
      >
        <button
          aria-label="メニューを閉じる"
          className={styles.sidebarCloseButton}
          onClick={closeMobileSidebar}
          ref={mobileCloseButtonRef}
          type="button"
        >
          ×
        </button>
        <NavLink className={styles.brand} onClick={closeAfterNavigation} to="/">
          <span className={styles.brandMark}>Py</span>
          <span className={styles.brandName}>Python Beginner Guide</span>
        </NavLink>

        <nav aria-label="メインナビゲーション">
          <NavLink
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`
            }
            end
            onClick={closeAfterNavigation}
            to="/"
          >
            ガイド拠点
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`
            }
            onClick={closeAfterNavigation}
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
                onClick={closeAfterNavigation}
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
        aria-expanded={isSidebarOpen}
        aria-label={`サイドメニューを${isSidebarOpen ? "閉じる" : "開く"}`}
        className={styles.sidebarToggle}
        onClick={() => setIsSidebarOpen((isOpen) => !isOpen)}
        type="button"
      >
        <span aria-hidden="true">{isSidebarOpen ? "‹" : "›"}</span>
      </button>

      <button
        aria-hidden="true"
        className={styles.sidebarBackdrop}
        onClick={closeMobileSidebar}
        tabIndex={-1}
        type="button"
      />

      <div className={styles.mainColumn}>
        <header className={styles.mobileHeader}>
          <button
            aria-controls="learning-menu"
            aria-expanded={isSidebarOpen}
            className={styles.mobileMenuButton}
            onClick={openMobileSidebar}
            ref={mobileMenuButtonRef}
            type="button"
          >
            <span aria-hidden="true">☰</span>
            メニュー
          </button>
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
