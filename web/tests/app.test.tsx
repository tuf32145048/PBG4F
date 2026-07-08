import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { App } from "../src/app/App";

beforeEach(() => {
  window.localStorage.clear();
  window.location.hash = "";
});

afterEach(() => {
  cleanup();
});

describe("application routes and interactions", () => {
  it("opens a lesson directly from a hash URL", async () => {
    window.location.hash = "#/lessons/getting-started";
    render(<App />);

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "コードを書いて動かす",
      }),
    ).toBeInTheDocument();
  });

  it("opens and closes a term dialog from markdown", async () => {
    const user = userEvent.setup();
    window.location.hash = "#/lessons/getting-started";
    render(<App />);

    const printButtons = await screen.findAllByRole("button", {
      name: "print",
    });
    await user.click(printButtons[0]!);

    expect(
      screen.getByRole("dialog", { name: "print" }),
    ).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("reveals problem hints one at a time", async () => {
    const user = userEvent.setup();
    window.location.hash = "#/problems/hello-python";
    render(<App />);

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "最初のあいさつ",
      }),
    ).toBeInTheDocument();
    expect(screen.queryByText("表示にはprintを使います。")).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "ヒントを1つ開く" }),
    );

    expect(screen.getByText("表示にはprintを使います。")).toBeInTheDocument();
    expect(screen.queryByText("表示する文字列を引用符で囲みます。")).not.toBeInTheDocument();
  });

  it("starts with the solution details closed", async () => {
    window.location.hash = "#/problems/hello-python";
    render(<App />);

    const summary = await screen.findByText("解答例を見る");
    expect(summary.closest("details")).not.toHaveAttribute("open");
  });
});
