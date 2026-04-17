import { type Dispatch, type SetStateAction } from 'react';
import FieldCard from '../components/Fields/FieldCard';
import Spinner from '../components/Spinner';
import type { FieldRecord, AgentRecord } from '../types';

interface FieldsPageProps {
  fields: FieldRecord[];
  loading: boolean;
  error: string | null;
  selectedFieldId: string | null;
  showCreateForm: boolean;
  onSelectField: (field: FieldRecord) => void;
  onToggleCreateForm: () => void;
  onCreateField: (payload: { name: string; crop_type: string; planting_date: string; assigned_agent_id: string | null }) => void;
  formState: { name: string; crop_type: string; planting_date: string; assigned_agent_id: string };
  setFormState: Dispatch<SetStateAction<{ name: string; crop_type: string; planting_date: string; assigned_agent_id: string }>>;
  formError: string | null;
  fieldErrors: { name?: string; crop_type?: string; planting_date?: string; assigned_agent_id?: string };
  canSubmit: boolean;
  submitting: boolean;
  role: 'admin' | 'agent' | null;
  agents: AgentRecord[];
  agentsLoading: boolean;
  agentsError: string | null;
}

export default function FieldsPage({
  fields,
  loading,
  error,
  selectedFieldId,
  showCreateForm,
  onSelectField,
  onToggleCreateForm,
  onCreateField,
  formState,
  setFormState,
  formError,
  fieldErrors,
  canSubmit,
  submitting,
  role,
  agents,
  agentsLoading,
  agentsError,
}: FieldsPageProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[var(--muted)]">Field inventory</p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">Active field assignments</h2>
            </div>
            {role === 'admin' ? (
              <button
                type="button"
                onClick={onToggleCreateForm}
                className="inline-flex items-center gap-2 rounded-3xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
              >
                <span className="text-lg">＋</span>
                {showCreateForm ? 'Hide form' : 'New field'}
              </button>
            ) : (
              <span className="rounded-full bg-sky-500/10 px-4 py-2 text-sm text-[var(--text)]">
                Admin only
              </span>
            )}
          </div>

          <div className="mt-6 space-y-4">
            {loading ? (
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-6 text-[var(--muted)]">Loading fields…</div>
            ) : error ? (
              <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-300">{error}</div>
            ) : fields.length === 0 ? (
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-6 text-[var(--muted)]">No fields available yet.</div>
            ) : (
              <div className="grid gap-4">
                {fields.map((field) => {
                  const agentName = agents.find((agent) => agent.id === field.assigned_agent_id)?.full_name ?? null;
                  return (
                    <FieldCard
                      key={field.id}
                      field={field}
                      selected={selectedFieldId === field.id}
                      onSelect={() => onSelectField(field)}
                      agentName={agentName}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.35em] text-[var(--muted)]">Field operations</p>
          <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">Create and assign</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">Admins can add new fields and assign them to agents.</p>

          <div className="mt-6 space-y-4">
            {role !== 'admin' ? (
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-5 text-sm text-[var(--muted)]">
                Field creation is reserved for administrators. If you need a new assignment, contact your admin.
              </div>
            ) : showCreateForm ? (
              <form className="space-y-4" onSubmit={(event) => {
                  event.preventDefault();
                  onCreateField({
                    name: formState.name,
                    crop_type: formState.crop_type,
                    planting_date: formState.planting_date,
                    assigned_agent_id: formState.assigned_agent_id || null,
                  });
                }}>
                <div>
                  <label className="block text-sm font-medium text-[var(--text)]">Field name</label>
                  <input
                    className={`mt-3 w-full rounded-3xl border px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-sky-500 ${fieldErrors.name ? 'border-rose-400 bg-rose-500/5' : 'border-[var(--border)] bg-[var(--surface-soft)]'}`}
                    value={formState.name}
                    onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
                    placeholder="North Block"
                    required
                  />
                  {fieldErrors.name ? <p className="mt-2 text-sm text-rose-300">{fieldErrors.name}</p> : null}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text)]">Crop type</label>
                  <input
                    className={`mt-3 w-full rounded-3xl border px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-sky-500 ${fieldErrors.crop_type ? 'border-rose-400 bg-rose-500/5' : 'border-[var(--border)] bg-[var(--surface-soft)]'}`}
                    value={formState.crop_type}
                    onChange={(event) => setFormState((current) => ({ ...current, crop_type: event.target.value }))}
                    placeholder="Wheat"
                    required
                  />
                  {fieldErrors.crop_type ? <p className="mt-2 text-sm text-rose-300">{fieldErrors.crop_type}</p> : null}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text)]">Planting date</label>
                  <input
                    className={`mt-3 w-full rounded-3xl border px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-sky-500 ${fieldErrors.planting_date ? 'border-rose-400 bg-rose-500/5' : 'border-[var(--border)] bg-[var(--surface-soft)]'}`}
                    type="date"
                    value={formState.planting_date}
                    onChange={(event) => setFormState((current) => ({ ...current, planting_date: event.target.value }))}
                    required
                  />
                  {fieldErrors.planting_date ? <p className="mt-2 text-sm text-rose-300">{fieldErrors.planting_date}</p> : null}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text)]">Assign agent</label>
                  {agentsLoading ? (
                    <div className="mt-3 rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--muted)]">
                      Loading agents…
                    </div>
                  ) : agentsError ? (
                    <div className="mt-3 rounded-3xl border border-rose-400 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                      {agentsError}
                    </div>
                  ) : (
                    <select
                      className={`mt-3 w-full rounded-3xl border px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-sky-500 ${fieldErrors.assigned_agent_id ? 'border-rose-400 bg-rose-500/5' : 'border-[var(--border)] bg-[var(--surface-soft)]'}`}
                      value={formState.assigned_agent_id}
                      onChange={(event) => setFormState((current) => ({ ...current, assigned_agent_id: event.target.value }))}
                    >
                      <option value="">Unassigned</option>
                      {agents.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                          {agent.full_name}
                        </option>
                      ))}
                    </select>
                  )}
                  {fieldErrors.assigned_agent_id ? <p className="mt-2 text-sm text-rose-300">{fieldErrors.assigned_agent_id}</p> : null}
                </div>
                {formError && <p className="text-sm text-rose-400">{formError}</p>}
                <button
                  type="submit"
                  disabled={!canSubmit || submitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? <><Spinner size="w-5 h-5" className="text-slate-950" /> Creating field…</> : 'Create field'}
                </button>
              </form>
            ) : (
              <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-5 text-sm text-[var(--muted)]">
                Tap the button above to open the new field form.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
