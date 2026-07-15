import { Link, useParams } from "react-router-dom";
import { useProgress } from "../../app/useProgress";
import { catalog } from "../../content/loadContent";
import styles from "../../styles/app.module.css";
import { ProblemExplanation } from "./components/ProblemExplanation";
import { ProblemFooter } from "./components/ProblemFooter";
import { ProblemHints } from "./components/ProblemHints";
import { ProblemOverview } from "./components/ProblemOverview";
import { ProblemReview } from "./components/ProblemReview";
import { ProblemSamples } from "./components/ProblemSamples";

export function ProblemPage() {
  const { problemSlug } = useParams();
  const { progress, setReviewItem, toggleProblem } = useProgress();
  const problem = problemSlug
    ? catalog.problemBySlug.get(problemSlug)
    : undefined;

  if (!problem) {
    return (
      <div className={styles.emptyState}>
        <h1>問題が見つかりません</h1>
        <Link to="/problems">問題一覧へ戻る</Link>
      </div>
    );
  }

  const lesson = catalog.lessonById.get(problem.lessonId);
  const completed = progress.completedProblemIds.includes(problem.id);
  const checkedItems = progress.reviewChecks[problem.id] ?? [];
  const siblingProblems = catalog.problemsByLessonId.get(problem.lessonId) ?? [];
  const problemIndex = siblingProblems.findIndex(
    (candidate) => candidate.id === problem.id,
  );
  const nextProblem = siblingProblems[problemIndex + 1];

  return (
    <article className={styles.page}>
      <ProblemOverview
        lesson={lesson}
        problem={problem}
        problemNumber={problemIndex + 1}
      />
      <ProblemSamples samples={problem.samples} />
      <ProblemHints key={problem.id} hints={problem.hints} />
      <ProblemExplanation
        explanationTrace={problem.explanationTrace}
        solution={problem.solution}
      />
      <ProblemReview
        checkedItemIds={checkedItems}
        commonMistakes={problem.commonMistakes}
        onSetReviewItem={(itemId, checked) =>
          setReviewItem(problem.id, itemId, checked)
        }
        problemId={problem.id}
        reviewChecklist={problem.reviewChecklist}
      />
      <ProblemFooter
        completed={completed}
        nextProblem={nextProblem}
        onToggleCompleted={() => toggleProblem(problem.id)}
      />
    </article>
  );
}
