"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ComponentPropsWithoutRef } from "react";
import { Mermaid } from "./mermaid";
import { cn } from "@/lib/cn";

export function MarkdownRenderer({ source, className }: { source: string; className?: string }) {
  return (
    <div className={cn("markdown-body text-airy text-[15.5px] leading-[1.75] text-[var(--color-ink-soft)]", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => <h1 className="font-display text-[36px] tracking-display mt-12 mb-6 text-[var(--color-ink)]" {...props} />,
          h2: (props) => <h2 className="font-display text-[28px] tracking-display mt-10 mb-4 text-[var(--color-ink)]" {...props} />,
          h3: (props) => <h3 className="font-display text-[22px] mt-8 mb-3 text-[var(--color-ink)]" {...props} />,
          h4: (props) => <h4 className="font-medium text-[16px] mt-6 mb-2 text-[var(--color-ink)]" {...props} />,
          p: (props) => <p className="my-4" {...props} />,
          ul: (props) => <ul className="my-4 ml-6 list-disc space-y-2" {...props} />,
          ol: (props) => <ol className="my-4 ml-6 list-decimal space-y-2" {...props} />,
          li: (props) => <li className="leading-[1.7]" {...props} />,
          a: (props) => (
            <a
              className="text-[var(--color-ink)] underline decoration-[var(--color-warm-amber)] decoration-2 underline-offset-[4px] hover:decoration-[var(--color-ink)]"
              {...props}
            />
          ),
          blockquote: (props) => (
            <blockquote
              className="my-6 border-l-2 border-[var(--color-warm-amber)] bg-[var(--color-surface-elevated)] px-6 py-3 font-editorial text-[17px] italic text-[var(--color-ink-soft)]"
              {...props}
            />
          ),
          hr: () => <hr className="my-10 border-0 divider-fade" />,
          table: (props) => (
            <div className="my-6 overflow-hidden rounded-[12px] border border-[var(--color-border)]">
              <table className="w-full text-[13.5px]" {...props} />
            </div>
          ),
          thead: (props) => <thead className="bg-[var(--color-surface-elevated)]" {...props} />,
          th: (props) => (
            <th
              className="px-4 py-2.5 text-left font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--color-ink-whisper)]"
              {...props}
            />
          ),
          td: (props) => <td className="border-t border-[var(--color-border)] px-4 py-2.5" {...props} />,
          code: (props: ComponentPropsWithoutRef<"code"> & { inline?: boolean }) => {
            const { children, className, ...rest } = props;
            const match = /language-(\w+)/.exec(className ?? "");
            const lang = match?.[1];
            const content = String(children ?? "").replace(/\n$/, "");

            if (lang === "mermaid") {
              return <Mermaid source={content} />;
            }

            // Inline code
            if (!match) {
              return (
                <code
                  className="rounded-[4px] bg-[var(--color-surface-elevated)] px-1.5 py-0.5 font-mono text-[90%] text-[var(--color-ink)]"
                  {...rest}
                >
                  {children}
                </code>
              );
            }

            // Block code
            return (
              <pre className="my-6 overflow-x-auto rounded-[14px] bg-[var(--color-ink)] p-5 shadow-lift">
                <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
                  <span>{lang}</span>
                  <span>code</span>
                </div>
                <code className="font-mono text-[13px] leading-[1.75] text-white/85" {...rest}>
                  {children}
                </code>
              </pre>
            );
          },
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
