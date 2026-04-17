import { FormEvent, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Logo from '../components/Logo';
import Spinner from '../components/Spinner';

export default function Login() {
  const { signIn, loading } = useAuth();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      await signIn(email, password);
      addToast({ title: 'Signed in', description: 'Welcome back to SmartSeason.', type: 'success' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      addToast({ title: 'Sign in failed', description: message, type: 'error' });
    }
  }

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8 flex items-center justify-center bg-[var(--bg)] text-[var(--text)]">
      <div className="w-full max-w-5xl overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] shadow-soft backdrop-blur-xl">
        <div className="grid grid-cols-1 lg:grid-cols-[420px_minmax(0,1fr)]">
          <div className="relative overflow-hidden bg-[var(--surface-soft)] p-10 sm:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.18),_transparent_35%)]" />
            <div className="relative z-10 flex h-full flex-col justify-between gap-8">
              <div>
                <Logo compact className="mb-6" />
                <h1 className="mt-6 text-4xl font-semibold text-[var(--text)]">Field monitoring made simple</h1>
                <p className="mt-4 max-w-sm text-[var(--muted)]">Track crop progress, manage field assignments, and keep your team aligned from a single dashboard.</p>
              </div>
              <div className="space-y-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <p className="text-sm uppercase tracking-[0.28em] text-[var(--muted)]">Demo access</p>
                <div className="text-sm text-[var(--text)]">
                  <p><strong>Admin</strong>: admin@smartseason.com</p>
                  <p><strong>Agent</strong>: agent@smartseason.com</p>
                </div>
                <p className="text-xs text-[var(--muted)]">Password is <strong>Admin1234!</strong> or <strong>Agent1234!</strong></p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--surface)] p-10 sm:p-12">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-8">
                <p className="text-sm uppercase tracking-[0.35em] text-sky-400">Welcome back</p>
                <h2 className="mt-4 text-3xl font-semibold text-[var(--text)]">Sign in to SmartSeason</h2>
                <p className="mt-3 text-sm text-[var(--muted)]">Use your Supabase credentials to access the field dashboard.</p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="text-sm font-medium text-[var(--text)]">Email</label>
                  <input
                    className="mt-3 w-full rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] px-5 py-4 text-sm text-[var(--text)] outline-none transition focus:border-sky-500"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="admin@smartseason.com"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[var(--text)]">Password</label>
                  <input
                    className="mt-3 w-full rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] px-5 py-4 text-sm text-[var(--text)] outline-none transition focus:border-sky-500"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>

                {error && <p className="text-sm text-rose-400">{error}</p>}

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-3 rounded-3xl bg-sky-500 px-5 py-4 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={loading}
                >
                  {loading ? <><Spinner size="w-5 h-5" className="text-slate-950" /> Signing in…</> : 'Sign in'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
