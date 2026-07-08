import type { Term } from "./schema";

interface TermCandidate {
  termId: string;
  text: string;
  priority: number;
  requiresWordBoundary: boolean;
}

export interface TermTextSegment {
  termId?: string;
  text: string;
}

interface MarkdownNode {
  type: string;
  value?: string;
  url?: string;
  children?: MarkdownNode[];
}

const excludedMarkdownNodeTypes = new Set([
  "code",
  "definition",
  "html",
  "image",
  "imageReference",
  "inlineCode",
  "link",
  "linkReference",
]);

function isIdentifierCharacter(character: string | undefined): boolean {
  return character !== undefined && /[A-Za-z0-9_]/.test(character);
}

function isStandaloneIdentifier(
  text: string,
  start: number,
  length: number,
): boolean {
  return (
    !isIdentifierCharacter(text[start - 1]) &&
    !isIdentifierCharacter(text[start + length])
  );
}

export function createTermCandidates(terms: Term[]): TermCandidate[] {
  const candidates = new Map<string, TermCandidate>();

  for (const term of terms) {
    if (!term.autoLink) {
      continue;
    }

    const variants = [{ text: term.label, priority: 0 }];

    for (const variant of variants) {
      const existing = candidates.get(variant.text);
      if (existing && existing.priority <= variant.priority) {
        continue;
      }

      candidates.set(variant.text, {
        termId: term.id,
        text: variant.text,
        priority: variant.priority,
        requiresWordBoundary: /^[A-Za-z0-9_]+$/.test(variant.text),
      });
    }
  }

  return [...candidates.values()].sort(
    (left, right) =>
      right.text.length - left.text.length ||
      left.priority - right.priority ||
      left.text.localeCompare(right.text),
  );
}

export function splitTextByTerms(
  text: string,
  candidates: TermCandidate[],
): TermTextSegment[] {
  const segments: TermTextSegment[] = [];
  let plainTextStart = 0;
  let cursor = 0;

  while (cursor < text.length) {
    const candidate = candidates.find((item) => {
      if (!text.startsWith(item.text, cursor)) {
        return false;
      }
      return (
        !item.requiresWordBoundary ||
        isStandaloneIdentifier(text, cursor, item.text.length)
      );
    });

    if (!candidate) {
      cursor += 1;
      continue;
    }

    if (plainTextStart < cursor) {
      segments.push({ text: text.slice(plainTextStart, cursor) });
    }
    segments.push({
      termId: candidate.termId,
      text: text.slice(cursor, cursor + candidate.text.length),
    });
    cursor += candidate.text.length;
    plainTextStart = cursor;
  }

  if (plainTextStart < text.length) {
    segments.push({ text: text.slice(plainTextStart) });
  }

  return segments.length > 0 ? segments : [{ text }];
}

export function autolinkMarkdownTree(
  root: MarkdownNode,
  candidates: TermCandidate[],
): void {
  function transform(node: MarkdownNode): void {
    if (!node.children || excludedMarkdownNodeTypes.has(node.type)) {
      return;
    }

    const nextChildren: MarkdownNode[] = [];
    for (const child of node.children) {
      if (child.type !== "text" || child.value === undefined) {
        transform(child);
        nextChildren.push(child);
        continue;
      }

      const segments = splitTextByTerms(child.value, candidates);
      for (const segment of segments) {
        if (segment.termId) {
          nextChildren.push({
            type: "link",
            url: `term:${segment.termId}`,
            children: [{ type: "text", value: segment.text }],
          });
        } else {
          nextChildren.push({ type: "text", value: segment.text });
        }
      }
    }
    node.children = nextChildren;
  }

  transform(root);
}
