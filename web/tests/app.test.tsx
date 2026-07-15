import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { App } from "../src/app/App";

const routeLoadTimeout = { timeout: 5000 };

beforeEach(() => {
  window.localStorage.clear();
  window.location.hash = "";
});

afterEach(() => {
  cleanup();
});

describe("application routes and interactions", () => {
  it("opens and closes the sidebar navigation", async () => {
    const user = userEvent.setup();
    render(<App />);

    const menu = await screen.findByRole(
      "complementary",
      { name: "学習メニュー" },
      routeLoadTimeout,
    );
    const toggle = screen.getByRole("button", {
      name: "サイドメニューを閉じる",
    });

    expect(menu).toHaveAttribute("aria-hidden", "false");
    expect(menu).not.toHaveAttribute("inert");

    await user.click(toggle);

    expect(menu).toHaveAttribute("aria-hidden", "true");
    expect(menu).toHaveAttribute("inert");
    expect(toggle).toHaveAccessibleName("サイドメニューを開く");

    await user.click(toggle);

    expect(menu).toHaveAttribute("aria-hidden", "false");
    expect(menu).not.toHaveAttribute("inert");
  });

  it("opens a lesson directly from a hash URL", async () => {
    window.location.hash = "#/lessons/getting-started";
    render(<App />);

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "コードを書いて動かす",
      }, routeLoadTimeout),
    ).toBeInTheDocument();
  });

  it("opens and closes a term dialog from markdown", async () => {
    const user = userEvent.setup();
    window.location.hash = "#/lessons/getting-started";
    render(<App />);

    const printButtons = await screen.findAllByRole(
      "button",
      {
        name: "print()",
      },
      routeLoadTimeout,
    );
    await user.click(printButtons[0]!);

    expect(
      screen.getByRole("dialog", { name: "print()" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("値を標準出力へ送るための関数です。"),
    ).toBeVisible();
    expect(
      screen.getByText("もう少し詳しく").closest("details"),
    ).not.toHaveAttribute("open");
    expect(
      screen.getByText("後で分かる話").closest("details"),
    ).not.toHaveAttribute("open");

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
      }, routeLoadTimeout),
    ).toBeInTheDocument();
    expect(screen.queryByText("HINT 1")).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "ヒントを1つ開く" }),
    );

    const hint = screen.getByText("HINT 1").parentElement;
    expect(hint).not.toBeNull();
    expect(hint).toHaveTextContent("表示にはprint()を使います。");
    expect(
      within(hint!).getByRole("button", { name: "print()" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("HINT 2")).not.toBeInTheDocument();
  });

  it("resets revealed hints after moving to the next problem", async () => {
    const user = userEvent.setup();
    window.location.hash = "#/problems/hello-python";
    render(<App />);

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "最初のあいさつ",
      }, routeLoadTimeout),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "ヒントを1つ開く" }),
    );
    expect(screen.getByText("HINT 1")).toBeInTheDocument();

    await user.click(
      screen.getByRole("link", { name: "次の問題: 朝のメッセージ" }),
    );

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "朝のメッセージ",
      }, routeLoadTimeout),
    ).toBeInTheDocument();
    expect(screen.queryByText("HINT 1")).not.toBeInTheDocument();
  });

  it("updates a problem review checklist item", async () => {
    const user = userEvent.setup();
    window.location.hash = "#/problems/hello-python";
    render(<App />);

    const checkbox = await screen.findByRole(
      "checkbox",
      { name: "大文字・小文字と記号が一致している" },
      routeLoadTimeout,
    );
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  it("expands optional term explanations on demand", async () => {
    const user = userEvent.setup();
    window.location.hash = "#/lessons/getting-started";
    render(<App />);

    const printButtons = await screen.findAllByRole(
      "button",
      {
        name: "print()",
      },
      routeLoadTimeout,
    );
    await user.click(printButtons[0]!);

    const detailSummary = screen.getByText("もう少し詳しく");
    await user.click(detailSummary);

    expect(detailSummary.closest("details")).toHaveAttribute("open");
  });

  it("starts with the solution details closed", async () => {
    window.location.hash = "#/problems/hello-python";
    render(<App />);

    const summary = await screen.findByText(
      "解答例を見る",
      {},
      routeLoadTimeout,
    );
    expect(summary.closest("details")).not.toHaveAttribute("open");
  });
});
