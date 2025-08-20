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

  // 사용자 메시지에서 JSON 형태인지 확인하고 message 필드만 추출
  const getDisplayContent = (content: string): string => {
    if (isUser) {
      try {
        const parsed = JSON.parse(content);
        if (parsed.message && typeof parsed.message === 'string') {
          return parsed.message;
        }
      } catch (e) {
        // JSON이 아니면 원본 내용 그대로 사용
      }
    }
    return content;
  };

  const displayContent = getDisplayContent(message.content);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className="max-w-[80%] rounded-2xl px-4 py-3 bg-zinc-800 text-gray-100"
      >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap break-all">
            {displayContent}
          </p>
        ) : (
          <div className="prose prose-sm prose-invert max-w-none [&_pre]:!p-0 [&_pre]:!m-0 [&_pre]:!bg-transparent">
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
