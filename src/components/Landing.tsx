import agenticaLogo from "/wrtn-dish.png";
import { LocationIcon } from "./icons/LocationIcon";
import { WeatherIcon } from "./icons/WeatherIcon";
import { AIIcon } from "./icons/AIIcon";

export function Landing() {
  return (
    <section className="flex-1 flex flex-col items-center justify-center p-8 relative">
      <div className="space-y-8">
        {/* 음식 관련 아이콘들과 Agentica 로고 */}
        <div className="flex gap-6 items-center justify-center">
          <div className="text-6xl animate-bounce" style={{ animationDelay: '0s' }}>🍽️</div>
          <div className="text-5xl animate-bounce" style={{ animationDelay: '0.2s' }}>🍕</div>
          <a
            href="https://github.com/wrtnDish"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-all mx-4"
          >
            <img
              src={agenticaLogo}
              alt="Agentica logo"
              className="w-20 h-20 transition-all duration-300 hover:scale-110 hover:filter hover:drop-shadow-[0_0_1.5rem_rgba(255,165,0,0.8)] hover:brightness-110"
            />
          </a>
          <div className="text-5xl animate-bounce" style={{ animationDelay: '0.4s' }}>🍜</div>
          <div className="text-6xl animate-bounce" style={{ animationDelay: '0.6s' }}>🥘</div>
        </div>

        {/* 메인 제목과 설명 */}
        <div className="space-y-6 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-300 via-yellow-400 to-red-400 bg-clip-text text-transparent">
            Wrtn Dish
          </h1>
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-gray-700">
              AI 맛집 추천 서비스
            </h2>
            <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
              당신의 위치, 날씨, 취향을 분석하여<br />
              완벽한 음식과 맛집을 추천해드립니다
            </p>
          </div>
        </div>

                {/* 기능 소개 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 text-center">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-orange-200/50 hover:border-orange-300/70 hover:bg-white/80 transition-all duration-300 group shadow-lg">
            <div className="flex justify-center mb-4">
              <LocationIcon 
                size={32} 
                className="text-orange-600 group-hover:text-orange-700 transition-colors" 
              />
            </div>
            <h3 className="text-sm font-medium text-gray-800 mb-2">위치 기반</h3>
            <p className="text-xs text-gray-600">현재 위치 맛집 추천</p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-yellow-200/50 hover:border-yellow-300/70 hover:bg-white/80 transition-all duration-300 group shadow-lg">
            <div className="flex justify-center mb-4">
              <WeatherIcon 
                size={32} 
                className="text-yellow-600 group-hover:text-yellow-700 transition-colors" 
              />
            </div>
            <h3 className="text-sm font-medium text-gray-800 mb-2">날씨 연동</h3>
            <p className="text-xs text-gray-600">날씨에 맞는 음식 제안</p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-blue-200/50 hover:border-blue-300/70 hover:bg-white/80 transition-all duration-300 group shadow-lg">
            <div className="flex justify-center mb-4">
              <AIIcon 
                size={32} 
                className="text-blue-600 group-hover:text-blue-700 transition-colors" 
              />
            </div>
            <h3 className="text-sm font-medium text-gray-800 mb-2">AI 개인화</h3>
            <p className="text-xs text-gray-600">취향 학습 맞춤 추천</p>
          </div>
        </div>
      </div>
    </section>
  );
}
