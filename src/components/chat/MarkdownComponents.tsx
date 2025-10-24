import type { Components } from "react-markdown";
import { useState } from "react";

export const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4 mt-6 first:mt-0 break-words tracking-tight">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-5 first:mt-0 break-words tracking-tight border-l-4 border-orange-500 pl-3">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-semibold text-orange-700 mb-2 mt-4 first:mt-0 break-words tracking-tight">
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => {
    // 텍스트에서 "🥇 N위:" 패턴을 감지하여 강조
    const processRankings = (content: any): any => {
      if (typeof content === 'string') {
        // "🥇 1위: 회/해물" 같은 전체 순위 항목을 카드 형태로 강조
        const parts = content.split(/([🥇🥈🥉🏅]\s*\d+위:[^\n,]*)/g);
        return parts.map((part, index) => {
          if (/[🥇🥈🥉🏅]\s*\d+위:/.test(part)) {
            // 이모지와 텍스트 분리
            const match = part.match(/([🥇🥈🥉🏅])\s*(\d+위:)\s*(.*)/);
            if (match) {
              const [, emoji, rank, food] = match;
              return (
                <span key={index} className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-500 px-4 py-3 my-2 rounded-r-lg shadow-sm">
                  <span className="text-3xl">{emoji}</span>
                  <span className="font-bold text-orange-700 text-lg">{rank}</span>
                  <span className="font-bold text-gray-900 text-xl">{food}</span>
                </span>
              );
            }
            return (
              <span key={index} className="font-bold text-orange-600 text-xl block my-2">
                {part}
              </span>
            );
          }
          return part;
        });
      }
      return content;
    };

    return (
      <p {...props} className="text-base leading-normal text-gray-700 mb-3 last:mb-0 break-words tracking-tight">
        {processRankings(children)}
      </p>
    );
  },
  strong: ({ children }) => (
    <strong className="font-bold text-gray-900">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-gray-600">{children}</em>
  ),
  a: ({ children, ...props }) => (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className="text-orange-600 hover:text-orange-700 transition-colors underline underline-offset-2 break-words font-medium"
    >
      {children}
    </a>
  ),
  code: ({ className, children, ...props }) => {
    const isInline = !className;

    if (isInline) {
      return (
        <code className="bg-orange-100 px-1.5 py-0.5 rounded text-orange-800 text-[0.95em] font-mono">
          {children}
        </code>
      );
    }

    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : "plaintext";

    const CodeBlock = () => {
      const [copied, setCopied] = useState(false);

      const handleCopy = () => {
        const codeText = String(children).replace(/\n$/, "");
        navigator.clipboard.writeText(codeText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      };

      return (
        <div className="relative group rounded-lg overflow-hidden bg-gray-50 my-4 border border-gray-200">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-200">
            <span className="text-sm text-gray-600 uppercase font-mono font-semibold">
              {language}
            </span>
            <button
              onClick={handleCopy}
              className="text-sm px-2.5 py-1 rounded bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200"
              title="Copy code"
            >
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>
          <pre className="!mt-0 !mb-0 overflow-x-auto p-4 bg-white">
            <code {...props} className={`text-base font-mono ${className}`}>
              {children}
            </code>
          </pre>
        </div>
      );
    };

    return <CodeBlock />;
  },
  ul: ({ children, ...props }) => (
    <ul {...props} className="space-y-1 mb-4 last:mb-0 pl-1">
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol
      {...props}
      className="list-none space-y-1 mb-4 last:mb-0 pl-0"
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => {
    const { ordered, ...restProps } = props as any;

    // 텍스트에서 "🥇 N위:" 패턴을 감지하여 강조
    const processRankings = (content: any): any => {
      if (typeof content === 'string') {
        // "🥇 1위: 회/해물" 같은 전체 항목을 카드 형태로 강조
        const match = content.match(/([🥇🥈🥉🏅])\s*(\d+위:)\s*(.*)/);
        if (match) {
          const [, emoji, rank, food] = match;
          return (
            <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-500 px-4 py-3 my-1 rounded-r-lg shadow-sm">
              <span className="text-3xl flex-shrink-0">{emoji}</span>
              <div className="flex flex-col">
                <span className="font-bold text-orange-700 text-sm">{rank}</span>
                <span className="font-bold text-gray-900 text-xl">{food}</span>
              </div>
            </div>
          );
        }
      }
      return content;
    };

    if (ordered) {
      return (
        <li {...restProps} className="text-base leading-normal text-gray-700 break-words pl-1 tracking-tight mb-2">
          {processRankings(children)}
        </li>
      );
    }

    return (
      <li {...restProps} className="text-base leading-normal text-gray-700 flex items-start gap-3 break-words tracking-tight mb-2">
        <span className="text-orange-500 text-lg mt-0.5 flex-shrink-0">•</span>
        <span className="flex-1">{processRankings(children)}</span>
      </li>
    );
  },
  blockquote: ({ children, ...props }) => (
    <blockquote
      {...props}
      className="border-l-4 border-orange-400 pl-4 py-2 my-4 bg-orange-50 rounded-r italic text-gray-700 tracking-tight"
    >
      {children}
    </blockquote>
  ),
  hr: () => (
    <hr className="my-6 border-t border-gray-300" />
  ),
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto my-4">
      <table {...props} className="min-w-full border-collapse border border-gray-300">
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead {...props} className="bg-orange-100">
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }) => (
    <tbody {...props} className="bg-white">
      {children}
    </tbody>
  ),
  tr: ({ children, ...props }) => (
    <tr {...props} className="border-b border-gray-200">
      {children}
    </tr>
  ),
  th: ({ children, ...props }) => (
    <th {...props} className="px-4 py-2 text-left text-base font-semibold text-gray-900 border border-gray-300 tracking-tight">
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td {...props} className="px-4 py-2 text-base text-gray-700 border border-gray-300 tracking-tight">
      {children}
    </td>
  ),
};
