import type { Ref } from "react";
import { NavLink } from "react-router-dom";
import styles from "../styles/app.module.css";

interface MobileHeaderProps {
  isSidebarOpen: boolean;
  menuButtonRef: Ref<HTMLButtonElement>;
  onOpenSidebar: () => void;
}

export function MobileHeader({
  isSidebarOpen,
  menuButtonRef,
  onOpenSidebar,
}: MobileHeaderProps) {
  return (
    <header className={styles.mobileHeader}>
      <button
        aria-controls="learning-menu"
        aria-expanded={isSidebarOpen}
        className={styles.mobileMenuButton}
        onClick={onOpenSidebar}
        ref={menuButtonRef}
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
  );
}
