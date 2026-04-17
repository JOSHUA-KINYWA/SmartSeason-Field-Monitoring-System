import { Response } from 'express';
import { supabaseAdmin } from '../lib/supabase';
import { AuthRequest } from '../types';

export async function getProfile(req: AuthRequest, res: Response) {
  const authUser = req.authUser;
  if (!authUser) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name, role')
    .eq('id', authUser.id)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: 'Profile not found' });
  }

  return res.json(data);
}

export async function getAgents(req: AuthRequest, res: Response) {
  const authUser = req.authUser;
  if (!authUser) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (authUser.role !== 'admin') {
    return res.status(403).json({ error: 'Only admin users can list agents' });
  }

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name')
    .eq('role', 'agent');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(data);
}
