import { Chat } from "./components/chat/Chat";
import { Landing } from "./components/Landing";
import { AgenticaRpcProvider } from "./provider/AgenticaRpcProvider";

function App() {
  return (
    <div className="relative min-h-screen">
      {/* Shared Background - 음식 테마 밝은 배경 */}
      <div className="fixed inset-0 bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50" />
      <div className="fixed inset-0 bg-gradient-to-tr from-orange-100/30 via-transparent to-yellow-100/20" />
      <div className="fixed inset-0 opacity-[0.4] bg-[radial-gradient(#f97316_0.5px,transparent_0.5px)] [background-size:20px_20px]" />

      {/* Content */}
      <div className="relative flex w-full min-h-screen">
        <div className="hidden lg:flex md:flex-1">
          <Landing />
        </div>
        <AgenticaRpcProvider>
          <Chat />
        </AgenticaRpcProvider>
      </div>
    </div>
  );
}

export default App;
