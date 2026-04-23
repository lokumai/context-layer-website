"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { StatusPill } from "@/components/marketing/status-pill";

export function WikiMarkdown({ markdown }: { markdown: string }) {
  return (
    <div className="prose-wiki">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-section-heading text-black mb-4 mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-card-heading text-black mb-3 mt-8">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-body-large text-black font-medium mb-2 mt-6">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-body-medium text-black mb-2 mt-4">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <div className="text-body text-[#4e4e4e] mb-4 leading-relaxed">
              {children}
            </div>
          ),
          a: ({ children, href }) => (
            <a href={href} className="text-[#1d4ed8] hover:underline">
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-6 space-y-1 text-body text-[#4e4e4e] mb-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 space-y-1 text-body text-[#4e4e4e] mb-4">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-body text-[#4e4e4e]">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-[#b45309] bg-[#fffbeb] px-4 py-2 my-4 text-body-standard text-[#4e4e4e] italic">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-8 border-t border-[rgba(0,0,0,0.08)]" />,
          table: ({ children }) => (
            <table className="w-full my-4 text-caption border-collapse">
              {children}
            </table>
          ),
          th: ({ children }) => (
            <th className="text-left font-semibold text-black bg-[#f5f5f5] px-3 py-2 border-b border-[rgba(0,0,0,0.08)]">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 border-b border-[rgba(0,0,0,0.05)] text-[#4e4e4e]">
              {children}
            </td>
          ),
          // biome-ignore lint/suspicious/noExplicitAny: react-markdown v10 component prop types are complex; the inline + className shape is runtime-stable
          code: ({ node: _node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";

            if (!inline && language === "mermaid") {
              return (
                <div className="rounded-card bg-[#0a0a0a]/95 text-white px-4 py-3 my-4">
                  <div className="mb-2">
                    <StatusPill tone="warn">MERMAID DIAGRAM</StatusPill>
                  </div>
                  <pre className="whitespace-pre-wrap font-mono text-caption">
                    {String(children).replace(/\n$/, "")}
                  </pre>
                </div>
              );
            }

            if (!inline) {
              return (
                <pre className="rounded-card bg-[#0a0a0a] text-[#e5e5e5] px-4 py-3 overflow-x-auto font-mono text-caption my-4">
                  <code>{children}</code>
                </pre>
              );
            }

            return (
              <code
                className="px-1.5 py-0.5 rounded-subtle bg-[#f5f5f5] text-[#1d4ed8] font-mono text-[0.9em]"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
