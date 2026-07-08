export const PROGRESS_STORAGE_KEY = "python-beginner-guide:progress";
export const PROGRESS_VERSION = 1 as const;

export interface ProgressData {
  version: typeof PROGRESS_VERSION;
  completedLessonIds: string[];
  completedProblemIds: string[];
  reviewChecks: Record<string, string[]>;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function createEmptyProgress(): ProgressData {
  return {
    version: PROGRESS_VERSION,
    completedLessonIds: [],
    completedProblemIds: [],
    reviewChecks: {},
  };
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}

function parseReviewChecks(value: unknown): Record<string, string[]> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const entries = Object.entries(value);
  if (!entries.every(([, itemIds]) => isStringArray(itemIds))) {
    return null;
  }

  return Object.fromEntries(
    entries.map(([problemId, itemIds]) => [
      problemId,
      Array.from(new Set(itemIds)),
    ]),
  );
}

export function parseProgress(value: unknown): ProgressData | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const candidate = value as Record<string, unknown>;
  const reviewChecks = parseReviewChecks(candidate.reviewChecks);

  if (
    candidate.version !== PROGRESS_VERSION ||
    !isStringArray(candidate.completedLessonIds) ||
    !isStringArray(candidate.completedProblemIds) ||
    !reviewChecks
  ) {
    return null;
  }

  return {
    version: PROGRESS_VERSION,
    completedLessonIds: Array.from(new Set(candidate.completedLessonIds)),
    completedProblemIds: Array.from(new Set(candidate.completedProblemIds)),
    reviewChecks,
  };
}

export function loadProgress(storage: StorageLike): ProgressData {
  try {
    const stored = storage.getItem(PROGRESS_STORAGE_KEY);
    if (!stored) {
      return createEmptyProgress();
    }
    return parseProgress(JSON.parse(stored)) ?? createEmptyProgress();
  } catch {
    return createEmptyProgress();
  }
}

export function saveProgress(
  storage: StorageLike,
  progress: ProgressData,
): void {
  try {
    storage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // The app remains usable when storage is unavailable or full.
  }
}
