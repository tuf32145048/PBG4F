import {
  Children,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import styles from "../styles/code-block.module.css";

type CodeBlockVariant = "markdown" | "sample" | "solution";
type CopyStatus = "idle" | "copied" | "error";

interface CodeBlockProps {
  children: ReactNode;
  copyText?: string;
  variant?: CodeBlockVariant;
}

const resetDelay = 2400;

function extractText(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child);
      }
      if (isValidElement<{ children?: ReactNode }>(child)) {
        return extractText(child.props.children);
      }
      return "";
    })
    .join("");
}

function getButtonLabel(status: CopyStatus): string {
  if (status === "copied") {
    return "コードをコピーしました";
  }
  if (status === "error") {
    return "コピーに失敗しました。もう一度試す";
  }
  return "コードをコピー";
}

export function CodeBlock({
  children,
  copyText,
  variant = "markdown",
}: CodeBlockProps) {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const resetTimer = useRef<number | null>(null);
  const text =
    copyText === undefined
      ? extractText(children).replace(/\r?\n$/, "")
      : copyText;
  const statusClass = status === "idle" ? "" : styles[status];

  useEffect(
    () => () => {
      if (resetTimer.current !== null) {
        window.clearTimeout(resetTimer.current);
      }
    },
    [],
  );

  const handleCopy = async () => {
    if (resetTimer.current !== null) {
      window.clearTimeout(resetTimer.current);
    }

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard API is unavailable.");
      }
      await navigator.clipboard.writeText(text);
      setStatus("copied");
    } catch {
      setStatus("error");
    }

    resetTimer.current = window.setTimeout(() => {
      setStatus("idle");
      resetTimer.current = null;
    }, resetDelay);
  };

  return (
    <div className={`${styles.frame} ${styles[variant]}`}>
      <div className={styles.toolbar}>
        <button
          aria-label={getButtonLabel(status)}
          className={`${styles.copyButton} ${statusClass}`.trim()}
          onClick={handleCopy}
          type="button"
        >
          {status === "copied"
            ? "コピー済み"
            : status === "error"
              ? "再試行"
              : "コピー"}
        </button>
      </div>
      <pre>{children}</pre>
      <span className={styles.status} role="status">
        {status === "copied"
          ? "コードをコピーしました。"
          : status === "error"
            ? "コピーできませんでした。ブラウザの設定を確認して、もう一度お試しください。"
            : ""}
      </span>
    </div>
  );
}
