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
          placeholder="Type a message..."
          className="flex-1 min-h-[44px] max-h-[160px] p-3 bg-zinc-700/50 text-gray-100 placeholder:text-gray-400 rounded-xl resize-none focus:outline-none focus:ring-1 focus:ring-white/20"
        />
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  );
}
