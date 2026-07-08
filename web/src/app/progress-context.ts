import { createContext } from "react";
import type { ProgressData } from "../lib/progress";

export interface ProgressContextValue {
  progress: ProgressData;
  toggleLesson: (lessonId: string) => void;
  toggleProblem: (problemId: string) => void;
  setReviewItem: (problemId: string, itemId: string, checked: boolean) => void;
}

export const ProgressContext = createContext<ProgressContextValue | null>(null);
