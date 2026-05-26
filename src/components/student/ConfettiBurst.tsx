const COLORS = ["#f59e0b", "#a78bfa", "#22d3ee", "#f472b6", "#34d399"];

export function ConfettiBurst({ count = 18 }: { count?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const left = (i * 100) / count + (Math.random() * 6 - 3);
        const delay = (i % 6) * 0.12;
        const color = COLORS[i % COLORS.length];
        const size = 4 + (i % 3) * 2;
        return (
          <span
            key={i}
            className="absolute top-0 block animate-[confetti_2.4s_ease-in_infinite]"
            style={{
              left: `${left}%`,
              width: size,
              height: size * 1.6,
              background: color,
              borderRadius: 1,
              transform: `rotate(${i * 27}deg)`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
      <style>{`@keyframes confetti { 0% { transform: translateY(-20%) rotate(0); opacity: 0;} 10%{opacity:1} 100% { transform: translateY(420%) rotate(720deg); opacity: 0;} }`}</style>
    </div>
  );
}
