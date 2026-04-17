interface LogoProps {
  compact?: boolean;
  className?: string;
}

export default function Logo({ compact = false, className = '' }: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <span className="flex h-11 w-11 items-center justify-center rounded-3xl bg-sky-500/10 text-sky-500 shadow-soft">
        <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 4c4.418 0 8 3.582 8 8 0 4.418-3.582 8-8 8s-8-3.582-8-8c0-4.418 3.582-8 8-8z" />
          <path d="M19 13c0-1.657-1.343-3-3-3s-3 1.343-3 3c0 1.475 2.065 5.029 3 6 0.935-0.971 3-4.525 3-6z" />
          <path d="M16 14v10" />
        </svg>
      </span>

      <div className="space-y-0.5">
        <p className="text-lg font-semibold text-[var(--text)]">SmartSeason</p>
        {!compact && <p className="text-sm text-[var(--muted)]">Field monitoring made simple</p>}
      </div>
    </div>
  );
}
