import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { buildCatalog } from "../src/content/schema";

const projectRoot = path.resolve(import.meta.dirname, "..");
const contentRoot = path.join(projectRoot, "content");

async function readJsonDirectory(directory: string): Promise<unknown[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .sort((left, right) => left.name.localeCompare(right.name));

  const values = await Promise.all(
    files.map(async (entry) => {
      const filePath = path.join(directory, entry.name);
      return JSON.parse(await readFile(filePath, "utf8")) as unknown;
    }),
  );

  return values.flatMap((value) => (Array.isArray(value) ? value : [value]));
}

async function readLessonBodies(): Promise<Record<string, string>> {
  const directory = path.join(contentRoot, "lessons");
  const entries = await readdir(directory, { withFileTypes: true });
  const markdownFiles = entries.filter(
    (entry) => entry.isFile() && entry.name.endsWith(".md"),
  );

  return Object.fromEntries(
    await Promise.all(
      markdownFiles.map(async (entry) => {
        const slug = entry.name.replace(/\.md$/, "");
        const body = await readFile(path.join(directory, entry.name), "utf8");
        return [slug, body];
      }),
    ),
  );
}

async function main(): Promise<void> {
  const catalog = buildCatalog({
    lessons: await readJsonDirectory(path.join(contentRoot, "lessons")),
    lessonBodies: await readLessonBodies(),
    problems: await readJsonDirectory(path.join(contentRoot, "problems")),
    terms: await readJsonDirectory(path.join(contentRoot, "terms")),
    tips: await readJsonDirectory(path.join(contentRoot, "tips")),
  });

  console.log(
    `Validated ${catalog.lessons.length} lessons, ${catalog.problems.length} problems, ${catalog.terms.length} terms, and ${catalog.tips.length} tips.`,
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
