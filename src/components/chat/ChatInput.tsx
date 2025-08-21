import { useState, KeyboardEvent, useRef } from "react";
import { useAgenticaRpc } from "../../provider/AgenticaRpcProvider";
import { DEFAULT_LOCATION } from "../../constants/location";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { location } = useAgenticaRpc();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;
    onSendMessage(message);
    setMessage("");
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      e.nativeEvent.isComposing === false
    ) {
      e.preventDefault();
      if (!disabled) {
        handleSubmit(e);
      }
    }
  };

  const hasGpsLocation = location.latitude && location.longitude;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs text-gray-400 px-1">
        <span>📍</span>
        <span>
          {hasGpsLocation 
            ? "메시지와 함께 GPS 위치 정보가 전송됩니다" 
            : `메시지와 함께 기본 위치(${DEFAULT_LOCATION.name})가 전송됩니다`
          }
        </span>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="어떤 음식이 먹고 싶으신가요? 예: 서울 강남 맛집 알려줘"
          className="flex-1 min-h-[44px] max-h-[160px] p-3 bg-white/70 text-gray-800 placeholder:text-gray-500 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-300/50 border border-orange-300/60"
        />
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
        >
          보내기
        </button>
      </form>
    </div>
  );
}
