import Markdown, { defaultUrlTransform } from "react-markdown";
import { useSearchParams } from "react-router-dom";
import remarkGfm from "remark-gfm";
import styles from "../styles/app.module.css";

export function MarkdownContent({ children }: { children: string }) {
  const [, setSearchParams] = useSearchParams();

  return (
    <div className={styles.markdown}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        urlTransform={(url) =>
          url.startsWith("term:") ? url : defaultUrlTransform(url)
        }
        components={{
          a({ href, children: linkChildren, ...props }) {
            if (href?.startsWith("term:")) {
              const termId = href.slice("term:".length);
              return (
                <button
                  className={styles.termLink}
                  onClick={() => {
                    setSearchParams((current) => {
                      const next = new URLSearchParams(current);
                      next.set("term", termId);
                      return next;
                    });
                  }}
                  type="button"
                >
                  {linkChildren}
                </button>
              );
            }
            return (
              <a href={href} {...props}>
                {linkChildren}
              </a>
            );
          },
        }}
      >
        {children}
      </Markdown>
    </div>
  );
}
