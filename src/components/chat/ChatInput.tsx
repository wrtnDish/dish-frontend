import { KeyboardEvent, useRef, useState } from "react";
import { useAgenticaRpc } from "../../provider/AgenticaRpcProvider";
import { DEFAULT_LOCATION } from "../../constants/location";

interface ChatInputProps {
  onSendMessage: (content: string, location: { latitude: number | null; longitude: number | null; accuracy: number | null; timestamp: number | null; }) => void;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { location } = useAgenticaRpc();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;
    onSendMessage(message, location);
    setMessage("");
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // 붙여넣기 등으로 인한 프로그래밍 방식의 Enter는 무시
    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      e.nativeEvent.isComposing === false &&
      !e.repeat // 키 반복 입력 방지
    ) {
      e.preventDefault();
      if (!disabled && message.trim()) {
        handleSubmit(e);
      }
    }
  };

  const hasGpsLocation = location.latitude && location.longitude;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2 text-xs lg:text-[13px] text-gray-500 px-1">
        <span>📍</span>
        <span className="font-medium">
          {hasGpsLocation
            ? "메시지와 함께 GPS 위치 정보가 전송됩니다"
            : `메시지와 함께 기본 위치(${DEFAULT_LOCATION.name})가 전송됩니다`
          }
        </span>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2.5 lg:gap-3">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="어떤 음식이 먹고 싶으신가요? 예: 서울 강남 맛집 알려줘"
          className="flex-1 min-h-[48px] lg:min-h-[52px] max-h-[160px] px-4 py-3 lg:px-5 lg:py-3.5 bg-white/80 text-gray-800 text-sm lg:text-base placeholder:text-gray-500 rounded-xl lg:rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-400/60 border border-orange-300/50 transition-all"
        />
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="px-5 lg:px-6 py-3 lg:py-3.5 bg-orange-500 text-white text-sm lg:text-base font-medium rounded-xl lg:rounded-2xl hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-white/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl active:scale-95"
        >
          보내기
        </button>
      </form>
    </div>
  );
}
