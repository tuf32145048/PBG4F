import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createEmptyProgress,
  loadProgress,
  saveProgress,
  type ProgressData,
} from "../lib/progress";
import { ProgressContext } from "./progress-context";

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressData>(() =>
    typeof window === "undefined"
      ? createEmptyProgress()
      : loadProgress(window.localStorage),
  );

  useEffect(() => {
    saveProgress(window.localStorage, progress);
  }, [progress]);

  const toggleLesson = useCallback((lessonId: string) => {
    setProgress((current) => ({
      ...current,
      completedLessonIds: current.completedLessonIds.includes(lessonId)
        ? current.completedLessonIds.filter((id) => id !== lessonId)
        : [...current.completedLessonIds, lessonId],
    }));
  }, []);

  const toggleProblem = useCallback((problemId: string) => {
    setProgress((current) => ({
      ...current,
      completedProblemIds: current.completedProblemIds.includes(problemId)
        ? current.completedProblemIds.filter((id) => id !== problemId)
        : [...current.completedProblemIds, problemId],
    }));
  }, []);

  const setReviewItem = useCallback(
    (problemId: string, itemId: string, checked: boolean) => {
      setProgress((current) => {
        const existing = current.reviewChecks[problemId] ?? [];
        const nextItems = checked
          ? Array.from(new Set([...existing, itemId]))
          : existing.filter((id) => id !== itemId);

        return {
          ...current,
          reviewChecks: {
            ...current.reviewChecks,
            [problemId]: nextItems,
          },
        };
      });
    },
    [],
  );

  const value = useMemo(
    () => ({ progress, toggleLesson, toggleProblem, setReviewItem }),
    [progress, setReviewItem, toggleLesson, toggleProblem],
  );

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}
