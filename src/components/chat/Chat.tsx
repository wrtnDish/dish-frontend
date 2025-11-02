import { useAgenticaRpc } from "../../provider/AgenticaRpcProvider";
import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";
import { ChatStatus } from "./ChatStatus";
import { LocationInfo } from "../LocationInfo";
import { useEffect, useRef, useState } from "react";

export function Chat() {
  const { messages, conversate, isConnected, isError, tryConnect } =
    useAgenticaRpc();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const hasMessage = messages.length > 0;
  const [autoScroll, setAutoScroll] = useState(true);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  // 사용자가 스크롤 위치를 변경했는지 감지
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 50;

    setAutoScroll(isAtBottom);
  };

  useEffect(() => {
    if (autoScroll) {
      scrollToBottom();
    }
  }, [messages, autoScroll]);

  const handleSendMessage = async (content: string, location: { latitude: number | null; longitude: number | null; accuracy: number | null; timestamp: number | null; }) => {
    try {
      await conversate({ content, location });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen p-6 lg:p-8 xl:p-10">
      <div className="relative w-full h-full max-w-4xl mx-auto">
        <div className="h-full flex flex-col bg-white/85 backdrop-blur-xl rounded-2xl lg:rounded-3xl overflow-hidden border border-orange-200/40 shadow-2xl">
          {/* Header - macOS 스타일 */}
          <div className="px-5 py-4 lg:px-6 lg:py-5 border-b border-orange-200/30 bg-white/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="text-2xl lg:text-3xl">🍴</div>
                <div>
                  <h2 className="text-base lg:text-lg font-semibold text-gray-800 tracking-tight">Wrtn Dish</h2>
                  <p className="text-xs lg:text-sm text-gray-600">맛집 추천 AI</p>
                </div>
              </div>
              <div className="text-right">
                <LocationInfo />
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-5 py-6 lg:px-8 lg:py-8 space-y-4 lg:space-y-5 scroll-smooth relative"
          >
            {hasMessage && <ChatMessages messages={messages} />}
            <ChatStatus
              isError={isError}
              isConnected={isConnected}
              hasMessages={hasMessage}
              onRetryConnect={tryConnect}
              isWsUrlConfigured={import.meta.env.VITE_AGENTICA_WS_URL !== ""}
              onSendMessage={handleSendMessage}
            />

            {/* 맨 아래로 버튼 - macOS 스타일 */}
            {!autoScroll && hasMessage && (
              <button
                onClick={scrollToBottom}
                className="sticky bottom-4 left-1/2 -translate-x-1/2 bg-orange-500/90 hover:bg-orange-600/90 backdrop-blur-sm text-white px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2 transition-all hover:scale-105"
              >
                <span className="text-sm">↓</span>
                <span className="text-sm font-medium">새 메시지</span>
              </button>
            )}
          </div>

          {/* Input - macOS 스타일 */}
          <div className="px-5 py-4 lg:px-6 lg:py-5 border-t border-orange-200/30 bg-white/50">
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={!isConnected}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
