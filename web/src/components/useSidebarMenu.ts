import { useEffect, useRef, useState } from "react";

const narrowViewportQuery = "(max-width: 760px)";

function isSidebarOpenByDefault() {
  return (
    typeof window.matchMedia !== "function" ||
    !window.matchMedia(narrowViewportQuery).matches
  );
}

export function useSidebarMenu() {
  const [isOpen, setIsOpen] = useState(isSidebarOpenByDefault);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileCloseButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia(narrowViewportQuery);
    const handleViewportChange = (event: MediaQueryListEvent) => {
      setIsOpen(!event.matches);
    };

    mediaQuery.addEventListener("change", handleViewportChange);
    return () => mediaQuery.removeEventListener("change", handleViewportChange);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
        typeof window.matchMedia === "function" &&
        window.matchMedia(narrowViewportQuery).matches
      ) {
        setIsOpen(false);
        mobileMenuButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const closeAfterNavigation = () => {
    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia(narrowViewportQuery).matches
    ) {
      setIsOpen(false);
    }
  };

  const openMobileSidebar = () => {
    setIsOpen(true);
    window.requestAnimationFrame(() => mobileCloseButtonRef.current?.focus());
  };

  const closeMobileSidebar = () => {
    setIsOpen(false);
    mobileMenuButtonRef.current?.focus();
  };

  const toggleSidebar = () => setIsOpen((isOpen) => !isOpen);

  return {
    closeAfterNavigation,
    closeMobileSidebar,
    isOpen,
    mobileCloseButtonRef,
    mobileMenuButtonRef,
    openMobileSidebar,
    toggleSidebar,
  };
}
