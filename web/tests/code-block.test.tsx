import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CodeBlock } from "../src/components/CodeBlock";
import { MarkdownContent } from "../src/components/MarkdownContent";

let originalClipboard: PropertyDescriptor | undefined;

beforeEach(() => {
  originalClipboard = Object.getOwnPropertyDescriptor(navigator, "clipboard");
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  if (originalClipboard) {
    Object.defineProperty(navigator, "clipboard", originalClipboard);
  } else {
    Reflect.deleteProperty(navigator, "clipboard");
  }
});

function mockClipboard(writeText: ReturnType<typeof vi.fn>) {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
}

describe("code block copying", () => {
  it("copies fenced Markdown without its trailing newline", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    mockClipboard(writeText);
    render(
      <MarkdownContent>{'```python\nprint("Hello")\n```'}</MarkdownContent>,
    );

    await user.click(screen.getByRole("button", { name: "コードをコピー" }));

    expect(writeText).toHaveBeenCalledWith('print("Hello")');
    expect(
      screen.getByRole("button", { name: "コードをコピーしました" }),
    ).toHaveTextContent("コピー済み");
    expect(screen.getByRole("status")).toHaveTextContent(
      "コードをコピーしました。",
    );
  });

  it("copies explicit empty input instead of its placeholder", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    mockClipboard(writeText);
    render(
      <CodeBlock copyText="" variant="sample">
        <code>（入力なし）</code>
      </CodeBlock>,
    );

    await user.click(screen.getByRole("button", { name: "コードをコピー" }));

    expect(writeText).toHaveBeenCalledWith("");
  });

  it("shows a retry state when clipboard access fails", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockRejectedValue(new Error("denied"));
    mockClipboard(writeText);
    render(
      <CodeBlock copyText="print(1)">
        <code>print(1)</code>
      </CodeBlock>,
    );

    await user.click(screen.getByRole("button", { name: "コードをコピー" }));

    await waitFor(() =>
      expect(
        screen.getByRole("button", {
          name: "コピーに失敗しました。もう一度試す",
        }),
      ).toHaveTextContent("再試行"),
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "コピーできませんでした。",
    );
  });
});
