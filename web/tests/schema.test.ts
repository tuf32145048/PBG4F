import { describe, expect, it } from "vitest";
import { buildCatalog, type RawContent } from "../src/content/schema";

function createValidRawContent(): RawContent {
  return {
    lessons: [
      {
        id: "lesson-one",
        slug: "lesson-one",
        order: 0,
        title: "Lesson One",
        summary: "Summary",
        objectives: ["Learn"],
        prerequisiteIds: [],
        termIds: ["term-one"],
        tipIds: [],
      },
    ],
    lessonBodies: {
      "lesson-one": "# Lesson One\n\nBody",
    },
    problems: [
      {
        id: "problem-one",
        slug: "problem-one",
        lessonId: "lesson-one",
        title: "Problem One",
        level: 1,
        conceptIds: ["term-one"],
        statement: "Solve it.",
        inputFormat: "None.",
        outputFormat: "A value.",
        samples: [{ input: "", output: "1\n" }],
        hints: ["Think."],
        solution: { code: "print(1)", explanation: "Print one." },
        explanationTrace: [{ step: "Read", detail: "Read the problem." }],
        commonMistakes: ["Typing two."],
        reviewChecklist: [{ id: "check-one", label: "Printed one." }],
      },
    ],
    terms: [
      {
        id: "term-one",
        label: "Term",
        aliases: [],
        short: "Short.",
        detail: "Detail.",
        later: "Later.",
        relatedTermIds: [],
      },
    ],
    tips: [],
  };
}

describe("buildCatalog", () => {
  it("builds indexes and inverse references", () => {
    const catalog = buildCatalog(createValidRawContent());

    expect(catalog.lessonBySlug.get("lesson-one")?.id).toBe("lesson-one");
    expect(catalog.problemBySlug.get("problem-one")?.id).toBe("problem-one");
    expect(catalog.problemsByLessonId.get("lesson-one")).toHaveLength(1);
    expect(catalog.problemsByTermId.get("term-one")).toHaveLength(1);
  });

  it("rejects duplicate ids", () => {
    const raw = createValidRawContent();
    raw.problems.push(raw.problems[0]);

    expect(() => buildCatalog(raw)).toThrow("Duplicate problem id");
  });

  it("rejects unknown references", () => {
    const raw = createValidRawContent();
    const problem = raw.problems[0] as Record<string, unknown>;
    problem.lessonId = "missing-lesson";

    expect(() => buildCatalog(raw)).toThrow(
      "references unknown lesson: missing-lesson",
    );
  });

  it("rejects missing lesson markdown", () => {
    const raw = createValidRawContent();
    raw.lessonBodies = {};

    expect(() => buildCatalog(raw)).toThrow();
  });
});
