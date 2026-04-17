import Logo from '../Logo';

interface SidebarProps {
  activePage: 'overview' | 'fields' | 'detail';
  userEmail: string | null;
  role: 'admin' | 'agent' | null;
  selectedFieldName?: string;
  totalFields: number;
  activeFields: number;
  atRisk: number;
  completed: number;
  onSelectPage: (page: 'overview' | 'fields' | 'detail') => void;
  onSignOut: () => void;
}

const navItems = [
  {
    id: 'overview',
    label: 'Overview',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6h16M4 12h16M4 18h7" />
      </svg>
    ),
  },
  {
    id: 'fields',
    label: 'Fields',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19h16M4 15h16M4 11h16M4 7h16" />
      </svg>
    ),
  },
  {
    id: 'detail',
    label: 'Field details',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l2 2 4-4" />
        <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" />
      </svg>
    ),
  },
];

export default function Sidebar({
  activePage,
  userEmail,
  role,
  selectedFieldName,
  totalFields,
  activeFields,
  atRisk,
  completed,
  onSelectPage,
  onSignOut,
}: SidebarProps) {
  return (
    <aside className="flex min-h-screen flex-col justify-between border-r border-[var(--border)] bg-[var(--surface)] px-5 py-8 shadow-soft lg:px-6">
      <div className="space-y-8">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm leading-6 text-[var(--muted)]">Monitor crop progress, assign work, and track updates in one clean workspace.</p>
        </div>

        <div className="space-y-3 rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
          <div className="text-[0.72rem] uppercase tracking-[0.35em] text-[var(--muted)]">Signed in as</div>
          <div className="space-y-1">
            <p className="font-semibold text-[var(--text)]">{userEmail ?? 'Unknown user'}</p>
            <p className="text-sm text-[var(--muted)]">{role === 'admin' ? 'Admin Coordinator' : 'Field Agent'}</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={item.id === 'detail' && !selectedFieldName}
              onClick={() => onSelectPage(item.id as 'overview' | 'fields' | 'detail')}
              className={`flex w-full items-center justify-between rounded-3xl px-4 py-3 text-left text-sm transition ${
                activePage === item.id
                  ? 'border border-sky-500 bg-slate-950 text-white shadow-soft'
                  : 'text-[var(--muted)] hover:bg-slate-900 hover:text-white'
              } ${item.id === 'detail' && !selectedFieldName ? 'cursor-not-allowed opacity-60' : ''}`}
            >
              <span className="flex items-center gap-3">
                <span className="text-sky-300">{item.icon}</span>
                {item.label}
              </span>
              {item.id === 'detail' && selectedFieldName ? (
                <span className="max-w-[95px] truncate text-[0.72rem] text-slate-400">{selectedFieldName}</span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="grid gap-3">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-4">
            <p className="text-[0.72rem] uppercase tracking-[0.35em] text-[var(--muted)]">Field summary</p>
            <div className="mt-4 space-y-3 text-sm text-[var(--text)]">
              <div className="flex items-center justify-between">
                <span>Total</span>
                <span className="font-semibold">{totalFields}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Active</span>
                <span className="font-semibold">{activeFields}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>At risk</span>
                <span className="font-semibold">{atRisk}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Completed</span>
                <span className="font-semibold">{completed}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onSignOut}
        className="mt-6 inline-flex items-center justify-center rounded-3xl border border-red-500 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/15"
      >
        Sign out
      </button>
    </aside>
  );
}
