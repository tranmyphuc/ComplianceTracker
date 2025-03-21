interface CircularProgressIndicatorProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  bgColor?: string;
  progressColor?: string;
  className?: string;
}

export function CircularProgressIndicator({
  value,
  size = 36,
  strokeWidth = 2,
  bgColor = "#e2e8f0",
  progressColor = "#0284c7",
  className,
}: CircularProgressIndicatorProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  
  return (
    <div className={`relative h-full w-full ${className}`}>
      <svg className="h-full w-full" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
        {value}%
      </div>
    </div>
  );
}
