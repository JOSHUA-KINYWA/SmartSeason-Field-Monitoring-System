import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiFetch } from '../lib/api';
import { useFields } from '../hooks/useFields';
import { useAgents } from '../hooks/useAgents';
import Sidebar from '../components/Layout/Sidebar';
import Navbar from '../components/Layout/Navbar';
import StatusProgressChart from '../components/Charts/StatusProgressChart';
import FieldsPage from './Fields';
import FieldDetail from './FieldDetail';
import type { FieldRecord } from '../types';

const defaultFormState = {
  name: '',
  crop_type: '',
  planting_date: '',
  assigned_agent_id: '',
};

export default function Dashboard() {
  const { user, profile, session, signOut, loading } = useAuth();
  const { fields, loading: fieldsLoading, error: fieldsError, setFields, refetch } = useFields();
  const { agents, loading: agentsLoading, error: agentsError } = useAgents();
  const [activePage, setActivePage] = useState<'overview' | 'fields' | 'detail'>('overview');
  const [selectedField, setSelectedField] = useState<FieldRecord | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [form, setForm] = useState(defaultFormState);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; crop_type?: string; planting_date?: string; assigned_agent_id?: string }>({});

  const role = profile?.role ?? 'agent';
  const { addToast } = useToast();

  const summary = useMemo(() => {
    const total = fields.length;
    const active = fields.filter((field) => field.status === 'active').length;
    const atRisk = fields.filter((field) => field.status === 'at_risk').length;
    const completed = fields.filter((field) => field.status === 'completed').length;
    const planted = fields.filter((field) => field.stage === 'planted').length;
    const growing = fields.filter((field) => field.stage === 'growing').length;
    const ready = fields.filter((field) => field.stage === 'ready').length;
    const harvested = fields.filter((field) => field.stage === 'harvested').length;

    return { total, active, atRisk, completed, planted, growing, ready, harvested };
  }, [fields]);

  const canSubmit = useMemo(
    () => form.name.trim() !== '' && form.crop_type.trim() !== '' && form.planting_date.trim() !== '' && Object.keys(fieldErrors).length === 0,
    [form, fieldErrors]
  );

  function validateFieldForm() {
    const errors: { name?: string; crop_type?: string; planting_date?: string; assigned_agent_id?: string } = {};

    if (!form.name.trim()) {
      errors.name = 'Field name is required.';
    }

    if (!form.crop_type.trim()) {
      errors.crop_type = 'Crop type is required.';
    }

    if (!form.planting_date.trim()) {
      errors.planting_date = 'Planting date is required.';
    } else if (Number.isNaN(Date.parse(form.planting_date))) {
      errors.planting_date = 'Planting date must be a valid date.';
    }

    if (form.assigned_agent_id && !agents.find((agent) => agent.id === form.assigned_agent_id)) {
      errors.assigned_agent_id = 'Please select a valid agent from the list.';
    }

    return errors;
  }

  async function createField(payload: { name: string; crop_type: string; planting_date: string; assigned_agent_id: string | null }) {
    if (!session) return;
    const validationErrors = validateFieldForm();
    setFieldErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setFormError('Please fix the highlighted fields before submitting.');
      return;
    }

    if (role !== 'admin') {
      setFormError('Only administrators can create fields.');
      addToast({ title: 'Create failed', description: 'Only administrators may create fields.', type: 'error' });
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      const data = await apiFetch<FieldRecord>('fields', session.access_token, {
        method: 'POST',
        body: JSON.stringify({
          name: payload.name,
          crop_type: payload.crop_type,
          planting_date: payload.planting_date,
          assigned_agent_id: payload.assigned_agent_id || null,
        }),
      });
      setFields((current) => [data, ...current]);
      setForm(defaultFormState);
      setFieldErrors({});
      setShowCreateForm(false);
      setActivePage('fields');
      addToast({ title: 'Field created', description: 'The new field is ready and assigned.', type: 'success' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Could not create field';
      setFormError(message);
      addToast({ title: 'Creation failed', description: message, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  }

  function selectField(field: FieldRecord) {
    setSelectedField(field);
    setActivePage('detail');
  }

  function backToFields() {
    setActivePage('fields');
  }

  async function handleFieldUpdated() {
    const refreshedFields = await refetch();
    if (selectedField && refreshedFields) {
      const refreshed = refreshedFields.find((field) => field.id === selectedField.id) ?? null;
      setSelectedField(refreshed);
      if (!refreshed) {
        setActivePage('fields');
      }
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
        <Sidebar
          activePage={activePage}
          userEmail={user?.email ?? null}
          role={profile?.role ?? null}
          selectedFieldName={selectedField?.name}
          totalFields={summary.total}
          activeFields={summary.active}
          atRisk={summary.atRisk}
          completed={summary.completed}
          onSelectPage={setActivePage}
          onSignOut={signOut}
        />

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Navbar
            pageTitle={
              activePage === 'overview'
                ? 'Dashboard overview'
                : activePage === 'fields'
                ? 'Fields management'
                : 'Field details'
            }
            pageSubtitle={
              activePage === 'overview'
                ? 'Summary metrics and recent work for your role.'
                : activePage === 'fields'
                ? 'Create, review, and assign fields.'
                : 'Inspect a field and log stage notes.'
            }
          />

          {activePage === 'overview' && (
            <section className="space-y-6">
              <div className="grid gap-4 xl:grid-cols-4">
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-soft">
                  <p className="text-sm uppercase tracking-[0.35em] text-[var(--muted)]">Total fields</p>
                  <p className="mt-4 text-4xl font-semibold text-[var(--text)]">{summary.total}</p>
                  <p className="mt-2 text-sm text-[var(--muted)]">Fields visible in your current role.</p>
                </div>
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-soft">
                  <p className="text-sm uppercase tracking-[0.35em] text-[var(--muted)]">Active</p>
                  <p className="mt-4 text-4xl font-semibold text-[var(--text)]">{summary.active}</p>
                  <p className="mt-2 text-sm text-[var(--muted)]">Currently in progress.</p>
                </div>
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-soft">
                  <p className="text-sm uppercase tracking-[0.35em] text-[var(--muted)]">At risk</p>
                  <p className="mt-4 text-4xl font-semibold text-[var(--text)]">{summary.atRisk}</p>
                  <p className="mt-2 text-sm text-[var(--muted)]">Needs immediate attention.</p>
                </div>
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-soft">
                  <p className="text-sm uppercase tracking-[0.35em] text-[var(--muted)]">Completed</p>
                  <p className="mt-4 text-4xl font-semibold text-[var(--text)]">{summary.completed}</p>
                  <p className="mt-2 text-sm text-[var(--muted)]">Harvested fields.</p>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <StatusProgressChart
                  total={summary.total}
                  title="Status progress"
                  description="Chart view of field health across your current scope."
                  bars={[
                    { label: 'Active', value: summary.active, colorClass: 'bg-sky-500' },
                    { label: 'At risk', value: summary.atRisk, colorClass: 'bg-amber-400' },
                    { label: 'Completed', value: summary.completed, colorClass: 'bg-emerald-500' },
                  ]}
                />

                <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                  <StatusProgressChart
                    total={summary.total}
                    title="Stage distribution"
                    description="Track fields by growth stage so the team can prioritize the next steps."
                    bars={[
                      { label: 'Planted', value: summary.planted, colorClass: 'bg-cyan-500' },
                      { label: 'Growing', value: summary.growing, colorClass: 'bg-sky-500' },
                      { label: 'Ready', value: summary.ready, colorClass: 'bg-emerald-500' },
                      { label: 'Harvested', value: summary.harvested, colorClass: 'bg-slate-500' },
                    ]}
                  />
                  <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-soft">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.35em] text-[var(--muted)]">Quick insight</p>
                        <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">Your current workload</h2>
                      </div>
                      <span className="rounded-full bg-slate-950 px-3 py-2 text-xs uppercase tracking-[0.3em] text-slate-300">{role === 'admin' ? 'Admin view' : 'Agent view'}</span>
                    </div>
                    <div className="mt-5 space-y-4">
                      <p className="text-sm leading-6 text-[var(--muted)]">
                        Your fields are filtered to the correct access level. Use the Fields page to assign work and monitor status.
                      </p>
                      <div className="flex items-center justify-between rounded-3xl bg-amber-500/5 border border-amber-500/15 px-4 py-4">
                        <div>
                          <p className="text-sm uppercase tracking-[0.35em] text-amber-300">Risk level</p>
                          <p className="mt-2 text-xl font-semibold text-[var(--text)]">{summary.atRisk > 0 ? 'Critical focus' : 'Healthy'}</p>
                        </div>
                        <div className="rounded-full bg-amber-500/10 px-3 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
                          {summary.atRisk} at risk
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-soft">
                    <p className="text-sm uppercase tracking-[0.35em] text-[var(--muted)]">Top action</p>
                    <h2 className="mt-2 text-2xl font-semibold text-[var(--text)]">Review at-risk fields</h2>
                    <p className="mt-4 text-sm text-[var(--muted)]">{summary.atRisk} field(s) are flagged for review. Open the Fields page to see the latest details.</p>
                  </section>
                </div>
              </div>
            </section>
          )}

          {activePage === 'fields' && (
            <FieldsPage
              fields={fields}
              loading={fieldsLoading}
              error={fieldsError}
              selectedFieldId={selectedField?.id ?? null}
              showCreateForm={showCreateForm}
              onSelectField={selectField}
              onToggleCreateForm={() => setShowCreateForm((current) => !current)}
              onCreateField={createField}
              formState={form}
              setFormState={setForm}
              formError={formError}
              fieldErrors={fieldErrors}
              canSubmit={canSubmit}
              submitting={submitting}
              role={role}
              agents={agents}
              agentsLoading={agentsLoading}
              agentsError={agentsError}
            />
          )}

          {activePage === 'detail' && selectedField ? (
            <FieldDetail field={selectedField} onBack={backToFields} onFieldUpdated={handleFieldUpdated} />
          ) : null}
        </main>
      </div>
    </div>
  );
}
