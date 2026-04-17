import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiFetch } from '../lib/api';
import type { FieldRecord, FieldUpdateRecord } from '../types';

interface FieldDetailProps {
  field: FieldRecord;
  onBack: () => void;
  onFieldUpdated: () => void;
}

export default function FieldDetail({ field, onBack, onFieldUpdated }: FieldDetailProps) {
  const { profile, session } = useAuth();
  const { addToast } = useToast();
  const [updates, setUpdates] = useState<FieldUpdateRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [stage, setStage] = useState(field.stage);
  const [status, setStatus] = useState<FieldRecord['status']>(field.status);

  const statusLabel = useMemo(() => {
    switch (status) {
      case 'at_risk':
        return 'At risk';
      case 'completed':
        return 'Completed';
      default:
        return 'Active';
    }
  }, [status]);

  useEffect(() => {
    async function loadUpdates() {
      if (!session) {
        return;
      }

      setLoading(true);
      try {
        const data = await apiFetch<FieldUpdateRecord[]>('field-updates', session.access_token);
        setUpdates(data.filter((update) => update.field_id === field.id));
      } catch {
        setUpdates([]);
      } finally {
        setLoading(false);
      }
    }

    loadUpdates();
  }, [field.id, session]);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session) {
      return;
    }

    setSaving(true);
    setFormMessage(null);

    try {
      const patchPayload: Partial<FieldRecord> = {};
      if (stage !== field.stage) {
        patchPayload.stage = stage;
      }
      if (status !== field.status) {
        patchPayload.status = status;
      }

      if (Object.keys(patchPayload).length > 0) {
        await apiFetch<FieldRecord>(`fields/${field.id}`, session.access_token, {
          method: 'PATCH',
          body: JSON.stringify(patchPayload),
        });
      }

      if (notes.trim()) {
        await apiFetch<FieldUpdateRecord>('field-updates', session.access_token, {
          method: 'POST',
          body: JSON.stringify({ field_id: field.id, stage, notes }),
        });
      }

      setFormMessage('Field update saved successfully.');
      setNotes('');
      onFieldUpdated();
      addToast({ title: 'Update saved', description: 'Field details were updated successfully.', type: 'success' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to save field update.';
      setFormMessage(message);
      addToast({ title: 'Update failed', description: message, type: 'error' });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!session || profile?.role !== 'admin') {
      return;
    }

    const confirmed = window.confirm('Delete this field? This action cannot be undone.');
    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setFormMessage(null);

    try {
      await apiFetch<FieldRecord>(`fields/${field.id}`, session.access_token, {
        method: 'DELETE',
      });
      addToast({ title: 'Field deleted', description: 'The field was removed successfully.', type: 'success' });
      onFieldUpdated();
      onBack();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to delete field.';
      setFormMessage(message);
      addToast({ title: 'Delete failed', description: message, type: 'error' });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <button type="button" onClick={onBack} className="text-sm font-semibold text-sky-400 hover:text-sky-300">
        ← Back to fields
      </button>

      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.85fr]">
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-soft">
          <div className="flex flex-col gap-3">
            <p className="text-sm uppercase tracking-[0.35em] text-[var(--muted)]">Field details</p>
            <h2 className="text-3xl font-semibold text-[var(--text)]">{field.name}</h2>
            <p className="text-sm text-[var(--muted)]">{field.crop_type} · Planted on {new Date(field.planting_date).toLocaleDateString()}</p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-[var(--surface-soft)] p-5">
              <p className="text-[0.72rem] uppercase tracking-[0.35em] text-[var(--muted)]">Stage</p>
              <p className="mt-3 text-lg font-semibold text-[var(--text)] capitalize">{field.stage}</p>
            </div>
            <div className="rounded-3xl bg-[var(--surface-soft)] p-5">
              <p className="text-[0.72rem] uppercase tracking-[0.35em] text-[var(--muted)]">Status</p>
              <p className="mt-3 text-lg font-semibold text-[var(--text)]">{statusLabel}</p>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] p-6">
            <h3 className="text-lg font-semibold text-[var(--text)]">Latest updates</h3>
            {loading ? (
              <p className="mt-4 text-[var(--muted)]">Loading updates…</p>
            ) : updates.length === 0 ? (
              <p className="mt-4 text-[var(--muted)]">No updates have been added for this field yet.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {updates.map((update) => (
                  <div key={update.id} className="rounded-3xl bg-[var(--bg)] p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-4 text-sm text-[var(--muted)]">
                      <span>{update.stage}</span>
                      <span>{new Date(update.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="mt-3 text-[var(--text)]">{update.notes || 'No notes provided.'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-[var(--text)]">Update field</h3>
          <p className="mt-2 text-sm text-[var(--muted)]">Change the stage or add quick observations for the growing season.</p>

          <form className="mt-6 space-y-4" onSubmit={handleSave}>
            <div>
              <label className="block text-sm font-medium text-[var(--text)]">Stage</label>
              <select
                value={stage}
                onChange={(event) => setStage(event.target.value as FieldRecord['stage'])}
                className="mt-3 w-full rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-sky-500"
              >
                <option value="planted">Planted</option>
                <option value="growing">Growing</option>
                <option value="ready">Ready</option>
                <option value="harvested">Harvested</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text)]">Status</label>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as FieldRecord['status'])}
                className="mt-3 w-full rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-sky-500"
              >
                <option value="active">Active</option>
                <option value="at_risk">At risk</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text)]">Observation notes</label>
              <textarea
                rows={4}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="mt-3 w-full rounded-3xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm text-[var(--text)] outline-none transition focus:border-sky-500"
                placeholder="Enter a brief note about field progress or issues."
              />
            </div>

            {formMessage && <p className="text-sm text-sky-300">{formMessage}</p>}

            <div className="space-y-3">
              <button
                type="submit"
                className="w-full rounded-3xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={saving || deleting}
              >
                {saving ? 'Saving…' : 'Save update'}
              </button>

              {profile?.role === 'admin' && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="w-full rounded-3xl border border-red-500 bg-transparent px-4 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={deleting || saving}
                >
                  {deleting ? 'Deleting…' : 'Delete field'}
                </button>
              )}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
