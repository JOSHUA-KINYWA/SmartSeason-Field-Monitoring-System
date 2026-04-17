import { supabaseAdmin } from '../lib/supabase';
import { FieldRecord, Profile } from '../types';

export async function listFields(user: Profile) {
  if (user.role === 'admin') {
    return supabaseAdmin.from('fields').select('*').order('created_at', { ascending: false });
  }

  return supabaseAdmin
    .from('fields')
    .select('*')
    .eq('assigned_agent_id', user.id)
    .order('created_at', { ascending: false });
}

export async function createField(user: Profile, payload: Partial<FieldRecord>) {
  const newField = {
    name: payload.name,
    crop_type: payload.crop_type,
    planting_date: payload.planting_date,
    stage: payload.stage || 'planted',
    status: payload.status || 'active',
    assigned_agent_id: payload.assigned_agent_id || null,
    created_by: user.id,
  };

  return supabaseAdmin.from('fields').insert(newField).select('*').single();
}

export async function updateField(id: string, payload: Partial<FieldRecord>) {
  return supabaseAdmin.from('fields').update(payload).eq('id', id).select('*').single();
}

export async function deleteField(id: string) {
  return supabaseAdmin.from('fields').delete().eq('id', id).select('*').single();
}
