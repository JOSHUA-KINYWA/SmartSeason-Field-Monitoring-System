import type { ReactNode } from 'react';

interface StatusBar {
  label: string;
  value: number;
  colorClass: string;
}

interface StatusProgressChartProps {
  total: number;
  bars: StatusBar[];
  title?: string;
  description?: string;
}

export default function StatusProgressChart({ total, bars, title = 'Progress summary', description }: StatusProgressChartProps) {
  return (
    <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-[var(--muted)]">{title}</p>
          {description ? <p className="mt-2 text-sm text-[var(--muted)]">{description}</p> : null}
        </div>
        <div className="rounded-full bg-slate-950/10 px-3 py-2 text-xs uppercase tracking-[0.3em] text-slate-300">
          {total} fields
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {bars.map((bar) => {
          const percent = total > 0 ? Math.round((bar.value / total) * 100) : 0;
          return (
            <div key={bar.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm text-[var(--muted)]">
                <span>{bar.label}</span>
                <span>{bar.value} ({percent}%)</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-950/10">
                <div className={`${bar.colorClass} h-full rounded-full`} style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
