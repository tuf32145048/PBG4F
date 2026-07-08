import { lazy, Suspense } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { ProgressProvider } from "./ProgressContext";

const HomePage = lazy(() =>
  import("../features/home/HomePage").then((module) => ({
    default: module.HomePage,
  })),
);
const LessonPage = lazy(() =>
  import("../features/lessons/LessonPage").then((module) => ({
    default: module.LessonPage,
  })),
);
const ProblemListPage = lazy(() =>
  import("../features/problems/ProblemListPage").then((module) => ({
    default: module.ProblemListPage,
  })),
);
const ProblemPage = lazy(() =>
  import("../features/problems/ProblemPage").then((module) => ({
    default: module.ProblemPage,
  })),
);
const NotFoundPage = lazy(() =>
  import("../features/not-found/NotFoundPage").then((module) => ({
    default: module.NotFoundPage,
  })),
);

export function App() {
  return (
    <HashRouter>
      <ProgressProvider>
        <Suspense fallback={<main aria-busy="true">読み込み中...</main>}>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<HomePage />} />
              <Route path="lessons/:lessonSlug" element={<LessonPage />} />
              <Route path="problems" element={<ProblemListPage />} />
              <Route path="problems/:problemSlug" element={<ProblemPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </ProgressProvider>
    </HashRouter>
  );
}
