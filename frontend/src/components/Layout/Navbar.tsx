import Logo from '../Logo';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  pageTitle: string;
  pageSubtitle: string;
}

export default function Navbar({ pageTitle, pageSubtitle }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="mb-6 flex flex-col gap-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-4">
        <Logo compact className="!mb-0" />
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-[var(--muted)]">Workspace</p>
          <h1 className="mt-2 text-3xl font-semibold text-[var(--text)]">{pageTitle}</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">{pageSubtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text)] shadow-sm">
        <span className="uppercase tracking-[0.35em] text-[var(--muted)]">Theme</span>
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-full border border-[var(--border)] bg-[var(--bg)] px-4 py-2 text-sm font-semibold transition hover:bg-slate-900/60"
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        </button>
      </div>
    </header>
  );
}
