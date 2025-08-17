import { useAgenticaRpc } from "../provider/AgenticaRpcProvider";
import { DEFAULT_LOCATION } from "../constants/location";

export function LocationInfo() {
  const { location, locationError, isLocationLoading, requestLocation } = useAgenticaRpc();

  if (isLocationLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
        위치 정보를 가져오는 중...
      </div>
    );
  }

  if (locationError) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <div className="text-red-400">⚠️ {locationError.message}</div>
        <button
          onClick={requestLocation}
          className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          재시도
        </button>
      </div>
    );
  }

  // GPS 위치 정보가 있는 경우
  if (location.latitude && location.longitude) {
    return (
      <div className="text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <span>📍</span>
          <span>
            위도: {location.latitude.toFixed(6)}, 경도: {location.longitude.toFixed(6)} (GPS)
          </span>
          <button
            onClick={requestLocation}
            className="px-2 py-1 text-xs bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
          >
            새로고침
          </button>
        </div>
        {location.accuracy && (
          <div className="text-xs text-gray-500 mt-1">
            정확도: ±{Math.round(location.accuracy)}m
          </div>
        )}
      </div>
    );
  }

  // GPS 정보가 없는 경우 - 기본값(서울) 표시
  return (
    <div className="text-sm text-gray-400">
      <div className="flex items-center gap-2">
        <span>📍</span>
        <span>
          위도: {DEFAULT_LOCATION.latitude}, 경도: {DEFAULT_LOCATION.longitude} (기본값: {DEFAULT_LOCATION.name})
        </span>
        <button
          onClick={requestLocation}
          className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          GPS 허용
        </button>
      </div>
      {locationError && (
        <div className="text-xs text-red-400 mt-1">
          {locationError.message}
        </div>
      )}
    </div>
  );
}