import { useAgenticaRpc } from "../../provider/AgenticaRpcProvider";
import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";
import { ChatStatus } from "./ChatStatus";
import { LocationInfo } from "../LocationInfo";
import { useEffect, useRef } from "react";

export function Chat() {
  const { messages, conversate, isConnected, isError, tryConnect } =
    useAgenticaRpc();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const hasMessage = messages.length > 0;
  const lastMessage = messages[messages.length - 1];
  const isLastMessageFromUser = lastMessage?.type === "userMessage";

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    try {
      await conversate(content);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 min-w-0">
      <div className="relative w-full h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)]">
        <div className="h-full flex flex-col bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden border border-orange-200/30 shadow-xl">
          <div className="p-4 border-b border-orange-200/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🍴</div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Wrtn Dish</h2>
                  <p className="text-sm text-gray-600">맛집 추천 AI</p>
                </div>
              </div>
              <div className="text-right">
                <LocationInfo />
              </div>
            </div>
          </div>
          
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
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
          </div>

          <div className="p-4">
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={!isConnected || isError || isLastMessageFromUser}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
