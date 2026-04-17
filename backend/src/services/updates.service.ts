import { supabaseAdmin } from '../lib/supabase';
import { FieldUpdateRecord } from '../types';

export async function listUpdates(agentId: string, role: 'admin' | 'agent') {
  const query = supabaseAdmin.from('field_updates').select('*').order('created_at', { ascending: false });
  if (role === 'agent') {
    return query.eq('agent_id', agentId);
  }
  return query;
}

export async function createUpdate(agentId: string, payload: Partial<FieldUpdateRecord>) {
  const newUpdate = {
    field_id: payload.field_id,
    agent_id: agentId,
    stage: payload.stage,
    notes: payload.notes || null,
  };

  return supabaseAdmin.from('field_updates').insert(newUpdate).select('*').single();
}
