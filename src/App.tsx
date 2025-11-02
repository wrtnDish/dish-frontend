import { Chat } from "./components/chat/Chat";
import { Landing } from "./components/Landing";
import { AgenticaRpcProvider } from "./provider/AgenticaRpcProvider";

function App() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Shared Background - 음식 테마 밝은 배경 */}
      <div className="fixed inset-0 bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50" />
      <div className="fixed inset-0 bg-gradient-to-tr from-orange-100/30 via-transparent to-yellow-100/20" />
      <div className="fixed inset-0 opacity-[0.4] bg-[radial-gradient(#f97316_0.5px,transparent_0.5px)] [background-size:20px_20px]" />

      {/* Content - 맥북 최적화: 16:10 비율 고려 */}
      <div className="relative flex w-full h-screen max-w-[1920px] mx-auto">
        {/* Landing - 좌측 40% */}
        <div className="hidden lg:flex lg:w-[40%] xl:w-[45%]">
          <Landing />
        </div>
        {/* Chat - 우측 60% */}
        <AgenticaRpcProvider>
          <div className="flex-1 lg:w-[60%] xl:w-[55%]">
            <Chat />
          </div>
        </AgenticaRpcProvider>
      </div>
    </div>
  );
}

export default App;
