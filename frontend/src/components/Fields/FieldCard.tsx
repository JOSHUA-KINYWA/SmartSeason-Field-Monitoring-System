import type { FieldRecord } from '../../types';

interface FieldCardProps {
  field: FieldRecord;
  onSelect?: () => void;
  selected?: boolean;
  agentName?: string | null;
}

const statusMap: Record<string, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-emerald-600/10 text-emerald-300' },
  at_risk: { label: 'At risk', className: 'bg-amber-600/20 text-amber-200 ring-1 ring-amber-500/40' },
  completed: { label: 'Completed', className: 'bg-sky-600/10 text-sky-300' },
};

const stageMap: Record<string, { label: string; className: string }> = {
  planted: { label: 'Planted', className: 'bg-slate-700 text-slate-200' },
  growing: { label: 'Growing', className: 'bg-emerald-500 text-white' },
  ready: { label: 'Ready', className: 'bg-amber-500 text-white' },
  harvested: { label: 'Harvested', className: 'bg-sky-500 text-white' },
};

function getStageWidth(stage: string) {
  switch (stage) {
    case 'planted':
      return 'w-1/5';
    case 'growing':
      return 'w-1/2';
    case 'ready':
      return 'w-4/5';
    case 'harvested':
      return 'w-full';
    default:
      return 'w-1/5';
  }
}

export default function FieldCard({ field, onSelect, selected, agentName }: FieldCardProps) {
  const status = statusMap[field.status] ?? statusMap.active;
  const stage = stageMap[field.stage] ?? stageMap.planted;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group w-full text-left rounded-3xl border p-5 transition ${selected ? 'border-sky-500 shadow-[0_0_0_1px_rgba(56,189,248,0.25)]' : 'border-slate-800 hover:border-slate-600'} bg-slate-950 ${onSelect ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{field.name}</h3>
          <p className="mt-1 text-sm text-slate-400">{field.crop_type}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${stage.className}`}>
          {stage.label}
        </span>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-slate-400">
        <div className="flex items-center justify-between text-slate-400">
          <span>Planting</span>
          <span>{new Date(field.planting_date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>Status</span>
          <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${status.className}`}>{status.label}</span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>Agent</span>
          <span>{agentName ?? field.assigned_agent_id ?? 'Unassigned'}</span>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-full bg-slate-800 px-0.5 py-1">
        <div className={`h-2 rounded-full bg-slate-300 ${getStageWidth(field.stage)}`} />
      </div>
    </button>
  );
}
