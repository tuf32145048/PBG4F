import { useSearchParams } from "react-router-dom";
import { catalog } from "../content/loadContent";
import styles from "../styles/app.module.css";

export function TermChip({ termId }: { termId: string }) {
  const [, setSearchParams] = useSearchParams();
  const term = catalog.termById.get(termId);

  if (!term) {
    return null;
  }

  return (
    <button
      className={styles.chip}
      onClick={() => {
        setSearchParams((current) => {
          const next = new URLSearchParams(current);
          next.set("term", term.id);
          return next;
        });
      }}
      type="button"
    >
      {term.label}
    </button>
  );
}
