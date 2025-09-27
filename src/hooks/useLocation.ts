import { useEffect, useState } from "react";

export interface LocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  timestamp: number | null;
}

export interface LocationError {
  code: number;
  message: string;
}

export interface UseLocationResult {
  location: LocationState;
  error: LocationError | null;
  isLoading: boolean;
  requestLocation: () => void;
}

export function useLocation(): UseLocationResult {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    timestamp: null,
  });
  const [error, setError] = useState<LocationError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getErrorMessage = (code: number): string => {
    switch (code) {
      case GeolocationPositionError.PERMISSION_DENIED:
        return '위치 접근 권한이 거부되었습니다.';
      case GeolocationPositionError.POSITION_UNAVAILABLE:
        return '위치 정보를 사용할 수 없습니다.';
      case GeolocationPositionError.TIMEOUT:
        return '위치 정보 요청이 시간 초과되었습니다.';
      default:
        return '알 수 없는 오류가 발생했습니다.';
    }
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError({
        code: -1,
        message: '이 브라우저는 Geolocation을 지원하지 않습니다.',
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
        setIsLoading(false);
      },
      (positionError) => {
        setError({
          code: positionError.code,
          message: getErrorMessage(positionError.code),
        });
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };

  useEffect(() => {
    // 페이지 로드 시 자동으로 위치 정보 요청
    requestLocation();
  }, []);

  return {
    location,
    error,
    isLoading,
    requestLocation,
  };
}