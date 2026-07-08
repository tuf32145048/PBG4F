import { buildCatalog, type ContentCatalog } from "./schema";

const lessonModules = import.meta.glob("../../content/lessons/*.json", {
  eager: true,
  import: "default",
}) as Record<string, unknown>;

const lessonBodyModules = import.meta.glob("../../content/lessons/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>;

const problemModules = import.meta.glob("../../content/problems/*.json", {
  eager: true,
  import: "default",
}) as Record<string, unknown>;

const termModules = import.meta.glob("../../content/terms/*.json", {
  eager: true,
  import: "default",
}) as Record<string, unknown>;

const tipModules = import.meta.glob("../../content/tips/*.json", {
  eager: true,
  import: "default",
}) as Record<string, unknown>;

function flattenArrayModules(modules: Record<string, unknown>): unknown[] {
  return Object.values(modules).flatMap((value) =>
    Array.isArray(value) ? value : [value],
  );
}

function fileStem(path: string): string {
  const filename = path.split("/").at(-1);
  if (!filename) {
    throw new Error(`Could not determine file name for ${path}`);
  }
  return filename.replace(/\.[^.]+$/, "");
}

const lessonBodies = Object.fromEntries(
  Object.entries(lessonBodyModules).map(([path, body]) => [
    fileStem(path),
    body,
  ]),
);

export const catalog: ContentCatalog = buildCatalog({
  lessons: flattenArrayModules(lessonModules),
  lessonBodies,
  problems: flattenArrayModules(problemModules),
  terms: flattenArrayModules(termModules),
  tips: flattenArrayModules(tipModules),
});
