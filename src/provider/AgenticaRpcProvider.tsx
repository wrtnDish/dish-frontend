import { IAgenticaEventJson } from "@agentica/core";
import { IAgenticaRpcListener, IAgenticaRpcService } from "@agentica/rpc";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";
import { Driver, WebSocketConnector } from "tgrid";
import { useLocation, LocationState, LocationError } from "../hooks/useLocation";
import { DEFAULT_LOCATION } from "../constants/location";

interface AgenticaRpcContextType {
  messages: IAgenticaEventJson[];
  conversate: (message: string) => Promise<void>;
  isConnected: boolean;
  isError: boolean;
  location: LocationState;
  locationError: LocationError | null;
  isLocationLoading: boolean;
  requestLocation: () => void;
  tryConnect: () => Promise<
    | WebSocketConnector<
        null,
        IAgenticaRpcListener,
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

  const pushMessage = useCallback(
    async (message: IAgenticaEventJson) =>
      setMessages((prev) => [...prev, message]),
    []
  );

  const tryConnect = useCallback(async () => {
    try {
      setIsError(false);
      const connector: WebSocketConnector<
        null,
        IAgenticaRpcListener,
        IAgenticaRpcService<"chatgpt">
      > = new WebSocketConnector<
        null,
        IAgenticaRpcListener,
        IAgenticaRpcService<"chatgpt">
      >(null, {
        assistantMessage: pushMessage,
        describe: pushMessage,
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
  }, [pushMessage]);

  const conversate = useCallback(
    async (message: string, includeLocation: boolean = true) => {
      if (!driver) {
        console.error("Driver is not connected. Please connect to the server.");
        return;
      }
      try {
        if (includeLocation) {
          // 위치 정보 설정 (GPS 정보가 있으면 사용, 없으면 서울 기본값 사용)
          const lat = location.latitude || DEFAULT_LOCATION.latitude;
          const lng = location.longitude || DEFAULT_LOCATION.longitude;
          const isDefaultLocation = !location.latitude || !location.longitude;
          
          // 위치 정보를 별도 객체로 준비
          const locationData = {
            latitude: lat,
            longitude: lng,
            accuracy: location.accuracy,
            isDefault: isDefaultLocation,
            defaultLocationName: isDefaultLocation ? DEFAULT_LOCATION.name : undefined
          };
          
          // 백엔드에 메시지와 위치 정보를 함께 전달
          // Agentica가 structured data를 지원한다면 이렇게 전달
          const payload = {
            message: message,
            location: locationData,
            timestamp: Date.now()
          };
          
          // 우선 JSON 문자열로 전달 (백엔드에서 파싱 가능)
          await driver.conversate(JSON.stringify(payload));
        } else {
          // 위치 정보 없이 메시지만 전달
          await driver.conversate(message);
        }
      } catch (e) {
        console.error(e);
        setIsError(true);
      }
    },
    [driver, location]
  );

  useEffect(() => {
    (async () => {
      const connector = await tryConnect();
      return () => {
        connector?.close();
        setDriver(undefined);
      };
    })();
  }, [tryConnect]);

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
