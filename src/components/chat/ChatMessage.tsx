import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { markdownComponents } from "./MarkdownComponents";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  // 사용자 메시지에서 JSON 형태인지 확인하고 content 필드만 추출
  const getDisplayContent = (content: string): string => {
    if (isUser) {
      try {
        const parsed = JSON.parse(content);
        if (parsed.content && typeof parsed.content === 'string') {
          return parsed.content;
        }
      } catch (e) {
        // JSON이 아니면 원본 내용 그대로 사용
      }
    }
    return content;
  };

  const displayContent = getDisplayContent(message.content);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[85%] rounded-2xl px-5 py-3.5 shadow-md ${
          isUser
            ? "bg-gradient-to-br from-orange-500 to-red-500 text-white border border-orange-400/50"
            : "bg-white/90 backdrop-blur-sm text-gray-800 border border-orange-200/50"
        }`}
      >
        {isUser ? (
          <p className="text-base leading-normal whitespace-pre-wrap break-words">
            {displayContent}
          </p>
        ) : (
          <div className="prose prose-sm max-w-none [&_pre]:!p-0 [&_pre]:!m-0 [&_pre]:!bg-transparent [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={markdownComponents}
            >
              {displayContent}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
