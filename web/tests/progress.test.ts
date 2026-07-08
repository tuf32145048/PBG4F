import { describe, expect, it } from "vitest";
import {
  createEmptyProgress,
  loadProgress,
  parseProgress,
  PROGRESS_STORAGE_KEY,
  saveProgress,
  type StorageLike,
} from "../src/lib/progress";

class MemoryStorage implements StorageLike {
  private values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}

describe("progress storage", () => {
  it("round-trips valid progress", () => {
    const storage = new MemoryStorage();
    const progress = {
      ...createEmptyProgress(),
      completedProblemIds: ["problem-one"],
      reviewChecks: { "problem-one": ["check-one"] },
    };

    saveProgress(storage, progress);

    expect(loadProgress(storage)).toEqual(progress);
  });

  it("falls back when JSON is broken", () => {
    const storage = new MemoryStorage();
    storage.setItem(PROGRESS_STORAGE_KEY, "{broken");

    expect(loadProgress(storage)).toEqual(createEmptyProgress());
  });

  it("rejects unknown storage versions", () => {
    expect(
      parseProgress({
        version: 2,
        completedLessonIds: [],
        completedProblemIds: [],
        reviewChecks: {},
      }),
    ).toBeNull();
  });

  it("deduplicates stored ids", () => {
    expect(
      parseProgress({
        version: 1,
        completedLessonIds: ["lesson-one", "lesson-one"],
        completedProblemIds: [],
        reviewChecks: {},
      })?.completedLessonIds,
    ).toEqual(["lesson-one"]);
  });
});
