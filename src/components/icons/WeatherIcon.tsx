interface IconProps {
  className?: string;
  size?: number;
}

export function WeatherIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 태양 */}
      <circle cx="17" cy="7" r="3" fill="currentColor" opacity="0.8" />
      <path
        d="M17 2v1.5M17 11.5V13M21.5 7h1.5M11.5 7H13M19.77 4.23l1.06-1.06M15.17 8.83l1.06-1.06M19.77 9.77l1.06 1.06M15.17 5.17l1.06 1.06"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      
      {/* 구름 */}
      <path
        d="M7 16a4 4 0 0 1-2.4-7.2A5.5 5.5 0 0 1 15.5 11H18a3 3 0 0 1 0 6H7z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}
