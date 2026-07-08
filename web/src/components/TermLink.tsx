import type { ReactNode } from "react";
import styles from "../styles/app.module.css";
import { useTermDialog } from "./useTermDialog";

export function TermLink({
  children,
  termId,
}: {
  children: ReactNode;
  termId: string;
}) {
  const openTerm = useTermDialog();

  return (
    <button
      className={styles.termLink}
      onClick={() => openTerm(termId)}
      type="button"
    >
      {children}
    </button>
  );
}
