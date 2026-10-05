export function FlameMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path d="M16 2 L24 14 L20 13 L25 24 L16 30 L7 24 L12 13 L8 14 Z" className="fill-primary" />
      <path d="M16 12 L20 20 L16 26 L12 20 Z" className="fill-background" />
    </svg>
  );
}

export function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2">
      <FlameMark className="h-7 w-7 drop-shadow-[0_0_10px_var(--primary)]" />
      <span className="font-display text-lg font-bold tracking-tight">SOUL LIFE</span>
    </a>
  );
}
