import { IAgenticaEventJson } from "@agentica/core";
import { IAgenticaRpcListener, IAgenticaRpcService } from "@agentica/rpc";
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";
import { Driver, WebSocketConnector } from "tgrid";
import { LocationError, LocationState, useLocation } from "../hooks/useLocation";

/**
 * 확장된 RPC 리스너: 스트리밍 청크 이벤트 추가
 */
interface IExtendedAgenticaRpcListener extends IAgenticaRpcListener {
  /**
   * Assistant 메시지의 스트리밍 청크
   */
  assistantMessageChunk?: (chunk: string) => Promise<void>;
}

interface AgenticaRpcContextType {
  messages: IAgenticaEventJson[];
  conversate: (payload: { content: string; location: LocationState }) => Promise<void>;
  isConnected: boolean;
  isError: boolean;
  location: LocationState;
  locationError: LocationError | null;
  isLocationLoading: boolean;
  requestLocation: () => void;
  tryConnect: () => Promise<
    | WebSocketConnector<
        null,
        IExtendedAgenticaRpcListener,
        IAgenticaRpcService<"chatgpt">
      >
    | undefined
  >;
}

const AgenticaRpcContext = createContext<AgenticaRpcContextType | null>(null);

export function AgenticaRpcProvider({ children }: PropsWithChildren) {
  const [messages, setMessages] = useState<IAgenticaEventJson[]>([]);
  const [isError, setIsError] = useState(false);
  const [driver, setDriver] =
    useState<Driver<IAgenticaRpcService<"chatgpt">, false>>();

  const { location, error: locationError, isLoading: isLocationLoading, requestLocation } = useLocation();

  // Describe 메시지 처리 (assistantMessage와 유사)
  const handleDescribe = useCallback(
    async (message: IAgenticaEventJson.IDescribe) => {
      // 빈 describe는 무시
      if (!message.text || message.text.trim() === "") {
        return;
      }

      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];

        // 마지막 메시지가 스트리밍 중이었다면 isStreaming 플래그만 제거
        if (
          (lastMessage?.type === "describe" || lastMessage?.type === "assistantMessage") &&
          (lastMessage as any).isStreaming
        ) {
          return [
            ...prev.slice(0, -1),
            {
              ...lastMessage,
              type: "describe" as const,
              isStreaming: false,
            } as any,
          ];
        } else {
          // 스트리밍 없이 바로 완성된 describe
          return [...prev, message];
        }
      });
    },
    []
  );

  const pushMessage = useCallback(
    async (message: IAgenticaEventJson) => {
      // userMessage만 추가 (describe는 handleDescribe로 처리)
      if (message.type === "userMessage") {
        setMessages((prev) => [...prev, message]);
      }
    },
    []
  );

  // 스트리밍 청크를 처리하는 핸들러
  const handleAssistantMessageChunk = useCallback(
    async (chunk: string) => {
      // 빈 청크는 무시
      if (!chunk || chunk === "") {
        return;
      }

      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];

        // 마지막 메시지가 스트리밍 중인 assistantMessage인지 확인
        if (
          lastMessage?.type === "assistantMessage" &&
          (lastMessage as any).isStreaming
        ) {
          // 기존 메시지에 청크 추가
          return [
            ...prev.slice(0, -1),
            {
              ...lastMessage,
              text: lastMessage.text + chunk,
            },
          ];
        } else {
          // 새로운 스트리밍 메시지 시작
          return [
            ...prev,
            {
              type: "assistantMessage" as const,
              text: chunk,
              isStreaming: true, // 스트리밍 중임을 표시
            } as any,
          ];
        }
      });
    },
    []
  );

  // 최종 메시지 처리 (스트리밍 완료)
  const handleAssistantMessage = useCallback(
    async (message: IAgenticaEventJson.IAssistantMessage) => {
      // Function calling의 경우 assistantMessage가 빈 내용일 수 있음 → 무시
      if (!message.text || message.text.trim() === "") {
        return;
      }

      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];

        // 마지막 메시지가 스트리밍 중이었다면 isStreaming 플래그만 제거
        if (
          lastMessage?.type === "assistantMessage" &&
          (lastMessage as any).isStreaming
        ) {
          // 중요: 스트리밍된 텍스트를 유지하고 플래그만 제거
          return [
            ...prev.slice(0, -1),
            {
              ...lastMessage,
              isStreaming: false,
            } as any,
          ];
        } else {
          // 스트리밍 없이 바로 완성된 메시지가 온 경우 (폴백)
          return [...prev, message];
        }
      });
    },
    []
  );

  const tryConnect = useCallback(async () => {
    try {
      setIsError(false);
      const connector: WebSocketConnector<
        null,
        IExtendedAgenticaRpcListener,
        IAgenticaRpcService<"chatgpt">
      > = new WebSocketConnector<
        null,
        IExtendedAgenticaRpcListener,
        IAgenticaRpcService<"chatgpt">
      >(null, {
        assistantMessage: handleAssistantMessage,
        assistantMessageChunk: handleAssistantMessageChunk,
        describe: handleDescribe, // describe 전용 핸들러
        userMessage: pushMessage
      });
      await connector.connect(import.meta.env.VITE_AGENTICA_WS_URL);
      const driver = connector.getDriver();
      setDriver(driver);
      return connector;
    } catch (e) {
      console.error(e);
      setIsError(true);
    }
  }, [pushMessage, handleAssistantMessage, handleAssistantMessageChunk, handleDescribe]);

  const conversate = useCallback(
    async (payload: { content: string; location: LocationState }) => {
      if (!driver) return;
      try {
        await driver.conversate(JSON.stringify(payload));
      } catch (e) {
        throw e;
      }
    },
    [driver]
  );

  useEffect(() => {
    let isMounted = true;
    let connector: WebSocketConnector<
      null,
      IExtendedAgenticaRpcListener,
      IAgenticaRpcService<"chatgpt">
    > | undefined;

    (async () => {
      if (isMounted) {
        connector = await tryConnect();
      }
    })();

    return () => {
      isMounted = false;
      connector?.close();
      setDriver(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 빈 배열: 마운트 시 1번만 실행

  const isConnected = !!driver;

  return (
    <AgenticaRpcContext.Provider
      value={{ 
        messages, 
        conversate, 
        isConnected, 
        isError, 
        location, 
        locationError, 
        isLocationLoading, 
        requestLocation, 
        tryConnect 
      }}
    >
      {children}
    </AgenticaRpcContext.Provider>
  );
}

export function useAgenticaRpc() {
  const context = useContext(AgenticaRpcContext);
  if (!context) {
    throw new Error("useAgenticaRpc must be used within AgenticaRpcProvider");
  }
  return context;
}
