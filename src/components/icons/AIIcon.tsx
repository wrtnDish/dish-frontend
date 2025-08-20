interface IconProps {
  className?: string;
  size?: number;
}

export function AIIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 로봇 머리 */}
      <rect x="6" y="6" width="12" height="10" rx="2" fill="currentColor" opacity="0.9" />
      
      {/* 안테나 */}
      <path d="M12 6V4M10 4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="3" r="1" fill="currentColor" />
      
      {/* 눈 */}
      <circle cx="9.5" cy="10" r="1.5" fill="white" />
      <circle cx="14.5" cy="10" r="1.5" fill="white" />
      <circle cx="9.5" cy="10" r="0.8" fill="currentColor" opacity="0.7" />
      <circle cx="14.5" cy="10" r="0.8" fill="currentColor" opacity="0.7" />
      
      {/* 입 */}
      <rect x="10" y="13" width="4" height="1" rx="0.5" fill="white" />
      
      {/* 몸통 */}
      <rect x="8" y="16" width="8" height="6" rx="1" fill="currentColor" opacity="0.8" />
      
      {/* 팔 */}
      <rect x="4" y="18" width="2" height="3" rx="1" fill="currentColor" opacity="0.7" />
      <rect x="18" y="18" width="2" height="3" rx="1" fill="currentColor" opacity="0.7" />
    </svg>
  );
}
