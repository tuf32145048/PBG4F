import { catalog } from "../content/loadContent";
import styles from "../styles/app.module.css";
import { useTermDialog } from "./useTermDialog";

export function TermChip({ termId }: { termId: string }) {
  const openTerm = useTermDialog();
  const term = catalog.termById.get(termId);

  if (!term) {
    return null;
  }

  return (
    <button
      className={styles.chip}
      onClick={() => openTerm(term.id)}
      type="button"
    >
      {term.label}
    </button>
  );
}
