import { Outlet } from "react-router-dom";
import { useProgress } from "../app/useProgress";
import styles from "../styles/app.module.css";
import { MobileHeader } from "./MobileHeader";
import { SidebarNavigation } from "./SidebarNavigation";
import { TermDialog } from "./TermDialog";
import { useSidebarMenu } from "./useSidebarMenu";

export function AppShell() {
  const { progress } = useProgress();
  const sidebarMenu = useSidebarMenu();

  return (
    <div
      className={`${styles.appShell} ${
        sidebarMenu.isOpen ? styles.sidebarOpen : styles.sidebarClosed
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
      <SidebarNavigation
        closeButtonRef={sidebarMenu.mobileCloseButtonRef}
        completedLessonIds={progress.completedLessonIds}
        isOpen={sidebarMenu.isOpen}
        onCloseMobile={sidebarMenu.closeMobileSidebar}
        onNavigate={sidebarMenu.closeAfterNavigation}
        onToggle={sidebarMenu.toggleSidebar}
      />

      <div className={styles.mainColumn}>
        <MobileHeader
          isSidebarOpen={sidebarMenu.isOpen}
          menuButtonRef={sidebarMenu.mobileMenuButtonRef}
          onOpenSidebar={sidebarMenu.openMobileSidebar}
        />
        <main className={styles.mainContent} id="main-content" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
      <TermDialog />
    </div>
  );
}
