interface Props {
  value: number; // 0-100
  size?: number;
  stroke?: number;
  label?: React.ReactNode;
  trackClassName?: string;
  className?: string;
}

export function ProgressRing({ value, size = 96, stroke = 8, label, trackClassName = "stroke-muted", className = "stroke-primary" }: Props) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.max(0, Math.min(100, value)) / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className={trackClassName} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className={`transition-[stroke-dashoffset] duration-700 ease-out ${className}`}
        />
      </svg>
      {label !== undefined && (
        <div className="absolute inset-0 grid place-items-center text-center text-xs font-bold">{label}</div>
      )}
    </div>
  );
}
