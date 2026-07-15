import { Link } from "react-router-dom";
import type { Problem } from "../../../content/schema";
import styles from "../../../styles/app.module.css";

interface ProblemFooterProps {
  completed: boolean;
  nextProblem?: Problem;
  onToggleCompleted: () => void;
}

export function ProblemFooter({
  completed,
  nextProblem,
  onToggleCompleted,
}: ProblemFooterProps) {
  return (
    <footer className={styles.chapterFooter}>
      <button
        className={completed ? styles.completedButton : styles.primaryButton}
        onClick={onToggleCompleted}
        type="button"
      >
        {completed ? "攻略済みを取り消す" : "この問題を攻略済みにする"}
      </button>
      {nextProblem ? (
        <Link
          className={styles.secondaryButton}
          to={`/problems/${nextProblem.slug}`}
        >
          次の問題: {nextProblem.title}
        </Link>
      ) : (
        <Link className={styles.secondaryButton} to="/problems">
          問題一覧へ戻る
        </Link>
      )}
    </footer>
  );
}
