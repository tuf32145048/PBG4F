import { describe, expect, it } from "vitest";
import type { Term } from "../src/content/schema";
import {
  autolinkMarkdownTree,
  createTermCandidates,
  splitTextByTerms,
} from "../src/content/termAutolink";

function createTerm(
  id: string,
  label: string,
  aliases: string[] = [],
  autoLink = true,
): Term {
  return {
    id,
    label,
    aliases,
    category: "programming-concept",
    descriptionTargetId: id,
    autoLink,
    short: "Short",
    detail: "Detail",
    later: "Later",
    relatedTermIds: [],
  };
}

describe("term autolinking", () => {
  it("prefers longer Japanese terms", () => {
    const candidates = createTermCandidates([
      createTerm("value", "値"),
      createTerm("number", "数値"),
    ]);

    expect(splitTextByTerms("数値と値", candidates)).toEqual([
      { termId: "number", text: "数値" },
      { text: "と" },
      { termId: "value", text: "値" },
    ]);
  });

  it("matches English identifiers only at word boundaries", () => {
    const candidates = createTermCandidates([
      createTerm("print", "print"),
      createTerm("int", "int"),
      createTerm("in", "in"),
    ]);

    const matches = splitTextByTerms(
      "sprint print printing int in input",
      candidates,
    ).filter((segment) => segment.termId);

    expect(matches).toEqual([
      { termId: "print", text: "print" },
      { termId: "int", text: "int" },
      { termId: "in", text: "in" },
    ]);
  });

  it("does not use aliases as automatic link text", () => {
    const candidates = createTermCandidates([createTerm("string", "文字列", ["str"])]);

    expect(splitTextByTerms("str 文字列", candidates)).toEqual([
      { text: "str " },
      { termId: "string", text: "文字列" },
    ]);
  });

  it("skips terms that disable automatic links", () => {
    const candidates = createTermCandidates([
      createTerm("value", "値", [], false),
      createTerm("string", "文字列"),
    ]);

    expect(splitTextByTerms("値と文字列", candidates)).toEqual([
      { text: "値と" },
      { termId: "string", text: "文字列" },
    ]);
  });

  it("skips code, inline code, and existing links", () => {
    const candidates = createTermCandidates([createTerm("print", "print")]);
    const tree = {
      type: "root",
      children: [
        {
          type: "paragraph",
          children: [
            { type: "text", value: "print " },
            { type: "inlineCode", value: "print" },
            { type: "text", value: " " },
            {
              type: "link",
              url: "https://example.com",
              children: [{ type: "text", value: "print" }],
            },
          ],
        },
        { type: "code", value: "print" },
      ],
    };

    autolinkMarkdownTree(tree, candidates);

    const paragraph = tree.children[0];
    if (!paragraph) {
      throw new Error("Expected a paragraph node.");
    }
    expect(paragraph.children?.[0]).toMatchObject({
      type: "link",
      url: "term:print",
    });
    expect(paragraph.children?.[1]).toEqual({
      type: "text",
      value: " ",
    });
    expect(paragraph.children?.[2]).toEqual({
      type: "inlineCode",
      value: "print",
    });
    expect(paragraph.children?.[4]).toMatchObject({
      type: "link",
      url: "https://example.com",
      children: [{ type: "text", value: "print" }],
    });
    expect(tree.children[1]).toEqual({ type: "code", value: "print" });
  });
});
