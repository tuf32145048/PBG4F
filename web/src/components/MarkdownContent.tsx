import Markdown, {
  defaultUrlTransform,
  type Components,
} from "react-markdown";
import remarkGfm from "remark-gfm";
import { catalog } from "../content/loadContent";
import {
  autolinkMarkdownTree,
  createTermCandidates,
} from "../content/termAutolink";
import styles from "../styles/app.module.css";
import { TermLink } from "./TermLink";

const termCandidates = createTermCandidates(catalog.terms);

function remarkTermAutolink() {
  return (tree: Parameters<typeof autolinkMarkdownTree>[0]) => {
    autolinkMarkdownTree(tree, termCandidates);
  };
}

const sharedComponents: Components = {
  a({ href, children, ...props }) {
    if (href?.startsWith("term:")) {
      return <TermLink termId={href.slice("term:".length)}>{children}</TermLink>;
    }
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  },
};

const inlineComponents: Components = {
  ...sharedComponents,
  p({ children }) {
    return <>{children}</>;
  },
};

function urlTransform(url: string): string {
  return url.startsWith("term:") ? url : defaultUrlTransform(url);
}

export function MarkdownContent({ children }: { children: string }) {
  return (
    <div className={styles.markdown}>
      <Markdown
        components={sharedComponents}
        remarkPlugins={[remarkGfm, remarkTermAutolink]}
        urlTransform={urlTransform}
      >
        {children}
      </Markdown>
    </div>
  );
}

export function InlineContent({ children }: { children: string }) {
  return (
    <Markdown
      components={inlineComponents}
      remarkPlugins={[remarkGfm, remarkTermAutolink]}
      urlTransform={urlTransform}
    >
      {children}
    </Markdown>
  );
}
