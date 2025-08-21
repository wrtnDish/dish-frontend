interface ChatStatusProps {
  isError: boolean;
  isConnected: boolean;
  hasMessages: boolean;
  onRetryConnect: () => void;
  isWsUrlConfigured: boolean;
  onSendMessage?: (message: string) => void;
}

export function ChatStatus({
  isError,
  isConnected,
  hasMessages,
  onRetryConnect,
  isWsUrlConfigured,
  onSendMessage
}: ChatStatusProps) {
  if (!isWsUrlConfigured) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <div className="text-yellow-400 text-sm">
          VITE_AGENTICA_WS_URL is not configured
        </div>
        <div className="text-gray-400 text-sm">
          Please set the VITE_AGENTICA_WS_URL environment variable
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <div className="text-red-400 text-sm">
          맛집 추천 서비스에 연결할 수 없습니다
        </div>
        <button
          onClick={onRetryConnect}
          className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300 shadow-md"
        >
          다시 연결하기
        </button>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="h-full flex items-center justify-center text-gray-600 text-sm">
        맛집 추천 서비스에 연결 중입니다...
      </div>
    );
  }

  if (!hasMessages) {
    const suggestedQuestions = [
      "음식 추천해줘",
      "서울 맛집 알려줘",
      "서울 강남 맛집 알려줘",
      "서울 날씨 알려줘",
    ];

    return (
      <div className="h-full flex flex-col items-center justify-center gap-6 text-gray-600 text-sm px-4">
        <div className="text-4xl">🤖 🍽️</div>
        <div className="text-center">
          <p className="text-lg mb-2 text-gray-800">안녕하세요! Wrtn Dish 입니다!</p>
          <p className="text-gray-600">위치, 날씨, 취향을 고려한 맞춤 음식을 추천해드려요</p>
        </div>
        
        {onSendMessage && (
          <div className="w-full max-w-md">
            <p className="text-center text-gray-500 mb-3 text-xs">빠른 질문하기</p>
            <div className="grid grid-cols-2 gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => onSendMessage(question)}
                  className="p-2 text-xs bg-orange-100/80 hover:bg-orange-200/80 text-gray-700 hover:text-gray-800 rounded-lg transition-all duration-200 text-center border border-orange-200/50"
                >
                  💭 {question}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <p className="text-xs text-gray-500 text-center max-w-md">
          또는 직접 메시지를 입력해 보세요!<br />
          예: "음식 추천해줘. 현재 배고픔은 3이고, 지역은 대전이야."
        </p>
      </div>
    );
  }

  return null;
}
