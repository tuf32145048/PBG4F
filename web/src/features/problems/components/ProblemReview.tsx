import { InlineContent } from "../../../components/MarkdownContent";
import type { Problem } from "../../../content/schema";
import styles from "../../../styles/app.module.css";

interface ProblemReviewProps {
  checkedItemIds: string[];
  commonMistakes: Problem["commonMistakes"];
  onSetReviewItem: (itemId: string, checked: boolean) => void;
  problemId: string;
  reviewChecklist: Problem["reviewChecklist"];
}

export function ProblemReview({
  checkedItemIds,
  commonMistakes,
  onSetReviewItem,
  problemId,
  reviewChecklist,
}: ProblemReviewProps) {
  return (
    <div className={styles.reviewGrid}>
      <section className={styles.mistakePanel}>
        <p className={styles.eyebrow}>COMMON MISTAKES</p>
        <h2>間違えやすい点</h2>
        <ul>
          {commonMistakes.map((mistake) => (
            <li key={mistake}>
              <InlineContent>{mistake}</InlineContent>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.checklistPanel}>
        <p className={styles.eyebrow}>FINAL CHECK</p>
        <h2>見直しポイント</h2>
        {reviewChecklist.map((item) => {
          const checked = checkedItemIds.includes(item.id);
          const labelId = `${problemId}-${item.id}-label`;

          return (
            <div
              className={styles.checklistItem}
              key={item.id}
              onClick={(event) => {
                if ((event.target as HTMLElement).closest("button, input")) {
                  return;
                }
                onSetReviewItem(item.id, !checked);
              }}
            >
              <input
                aria-labelledby={labelId}
                checked={checked}
                onChange={(event) =>
                  onSetReviewItem(item.id, event.target.checked)
                }
                type="checkbox"
              />
              <span id={labelId}>
                <InlineContent>{item.label}</InlineContent>
              </span>
            </div>
          );
        })}
      </section>
    </div>
  );
}
