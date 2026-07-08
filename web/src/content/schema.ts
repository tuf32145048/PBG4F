import { z } from "zod";

const idSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase kebab-case.");

const nonEmptyText = z.string().trim().min(1);

export const termCategorySchema = z.enum([
  "general-concept",
  "programming-concept",
  "python-specific",
]);

export const lessonMetadataSchema = z.object({
  id: idSchema,
  slug: idSchema,
  order: z.number().int().nonnegative(),
  title: nonEmptyText,
  summary: nonEmptyText,
  objectives: z.array(nonEmptyText).min(1),
  prerequisiteIds: z.array(idSchema),
  termIds: z.array(idSchema),
  tipIds: z.array(idSchema),
});

export const lessonSchema = lessonMetadataSchema.extend({
  body: nonEmptyText,
});

export const problemSchema = z.object({
  id: idSchema,
  slug: idSchema,
  lessonId: idSchema,
  title: nonEmptyText,
  level: z.number().int().min(1).max(3),
  conceptIds: z.array(idSchema).min(1),
  statement: nonEmptyText,
  inputFormat: nonEmptyText,
  outputFormat: nonEmptyText,
  samples: z
    .array(
      z.object({
        input: z.string(),
        output: z.string(),
        explanation: z.string().optional(),
      }),
    )
    .min(1),
  hints: z.array(nonEmptyText).min(1),
  solution: z.object({
    code: nonEmptyText,
    explanation: nonEmptyText,
  }),
  explanationTrace: z
    .array(
      z.object({
        step: nonEmptyText,
        detail: nonEmptyText,
      }),
    )
    .min(1),
  commonMistakes: z.array(nonEmptyText).min(1),
  reviewChecklist: z
    .array(
      z.object({
        id: idSchema,
        label: nonEmptyText,
      }),
    )
    .min(1),
});

export const termSchema = z.object({
  id: idSchema,
  label: nonEmptyText,
  aliases: z.array(nonEmptyText),
  category: termCategorySchema,
  descriptionTargetId: idSchema,
  autoLink: z.boolean(),
  short: nonEmptyText,
  detail: nonEmptyText,
  later: nonEmptyText,
  relatedTermIds: z.array(idSchema),
});

export const tipSchema = z.object({
  id: idSchema,
  title: nonEmptyText,
  body: nonEmptyText,
  lessonIds: z.array(idSchema),
  termIds: z.array(idSchema),
});

export type LessonMetadata = z.infer<typeof lessonMetadataSchema>;
export type Lesson = z.infer<typeof lessonSchema>;
export type Problem = z.infer<typeof problemSchema>;
export type TermCategory = z.infer<typeof termCategorySchema>;
export type Term = z.infer<typeof termSchema>;
export type Tip = z.infer<typeof tipSchema>;

export interface RawContent {
  lessons: unknown[];
  lessonBodies: Record<string, string>;
  problems: unknown[];
  terms: unknown[];
  tips: unknown[];
}

export interface ContentCatalog {
  lessons: Lesson[];
  problems: Problem[];
  terms: Term[];
  tips: Tip[];
  lessonById: Map<string, Lesson>;
  lessonBySlug: Map<string, Lesson>;
  problemById: Map<string, Problem>;
  problemBySlug: Map<string, Problem>;
  termById: Map<string, Term>;
  tipById: Map<string, Tip>;
  problemsByLessonId: Map<string, Problem[]>;
  lessonsByTermId: Map<string, Lesson[]>;
  problemsByTermId: Map<string, Problem[]>;
}

function uniqueBy<T>(
  items: T[],
  key: (item: T) => string,
  label: string,
): void {
  const seen = new Set<string>();
  for (const item of items) {
    const value = key(item);
    if (seen.has(value)) {
      throw new Error(`Duplicate ${label}: ${value}`);
    }
    seen.add(value);
  }
}

function ensureReferences(
  source: string,
  ids: string[],
  targets: Map<string, unknown>,
  targetLabel: string,
): void {
  for (const id of ids) {
    if (!targets.has(id)) {
      throw new Error(`${source} references unknown ${targetLabel}: ${id}`);
    }
  }
}

function appendToMap<T>(map: Map<string, T[]>, key: string, value: T): void {
  const existing = map.get(key) ?? [];
  existing.push(value);
  map.set(key, existing);
}

export function buildCatalog(raw: RawContent): ContentCatalog {
  const metadata = z.array(lessonMetadataSchema).parse(raw.lessons);
  const lessons = metadata.map((lesson) =>
    lessonSchema.parse({
      ...lesson,
      body: raw.lessonBodies[lesson.slug],
    }),
  );
  const problems = z.array(problemSchema).parse(raw.problems);
  const terms = z.array(termSchema).parse(raw.terms);
  const tips = z.array(tipSchema).parse(raw.tips);

  uniqueBy(lessons, (item) => item.id, "lesson id");
  uniqueBy(lessons, (item) => item.slug, "lesson slug");
  uniqueBy(lessons, (item) => String(item.order), "lesson order");
  uniqueBy(problems, (item) => item.id, "problem id");
  uniqueBy(problems, (item) => item.slug, "problem slug");
  uniqueBy(terms, (item) => item.id, "term id");
  uniqueBy(tips, (item) => item.id, "tip id");

  const lessonById = new Map(lessons.map((item) => [item.id, item]));
  const lessonBySlug = new Map(lessons.map((item) => [item.slug, item]));
  const problemById = new Map(problems.map((item) => [item.id, item]));
  const problemBySlug = new Map(problems.map((item) => [item.slug, item]));
  const termById = new Map(terms.map((item) => [item.id, item]));
  const tipById = new Map(tips.map((item) => [item.id, item]));

  for (const lesson of lessons) {
    ensureReferences(
      `lesson ${lesson.id}`,
      lesson.prerequisiteIds,
      lessonById,
      "lesson",
    );
    ensureReferences(`lesson ${lesson.id}`, lesson.termIds, termById, "term");
    ensureReferences(`lesson ${lesson.id}`, lesson.tipIds, tipById, "tip");
  }

  for (const problem of problems) {
    ensureReferences(
      `problem ${problem.id}`,
      [problem.lessonId],
      lessonById,
      "lesson",
    );
    ensureReferences(
      `problem ${problem.id}`,
      problem.conceptIds,
      termById,
      "term",
    );
    uniqueBy(
      problem.reviewChecklist,
      (item) => item.id,
      `review item id in problem ${problem.id}`,
    );
  }

  for (const term of terms) {
    ensureReferences(
      `term ${term.id}`,
      [term.descriptionTargetId],
      termById,
      "description target",
    );
    ensureReferences(
      `term ${term.id}`,
      term.relatedTermIds,
      termById,
      "term",
    );
  }

  for (const tip of tips) {
    ensureReferences(`tip ${tip.id}`, tip.lessonIds, lessonById, "lesson");
    ensureReferences(`tip ${tip.id}`, tip.termIds, termById, "term");
  }

  const problemsByLessonId = new Map<string, Problem[]>();
  const lessonsByTermId = new Map<string, Lesson[]>();
  const problemsByTermId = new Map<string, Problem[]>();

  for (const lesson of lessons) {
    for (const termId of lesson.termIds) {
      appendToMap(lessonsByTermId, termId, lesson);
    }
  }
  for (const problem of problems) {
    appendToMap(problemsByLessonId, problem.lessonId, problem);
    for (const termId of problem.conceptIds) {
      appendToMap(problemsByTermId, termId, problem);
    }
  }

  return {
    lessons: lessons.sort((left, right) => left.order - right.order),
    problems,
    terms,
    tips,
    lessonById,
    lessonBySlug,
    problemById,
    problemBySlug,
    termById,
    tipById,
    problemsByLessonId,
    lessonsByTermId,
    problemsByTermId,
  };
}
