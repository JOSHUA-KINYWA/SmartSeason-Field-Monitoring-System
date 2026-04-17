import { Response } from 'express';
import { AuthRequest } from '../types';
import { createUpdate, listUpdates } from '../services/updates.service';

export async function getUpdates(req: AuthRequest, res: Response) {
  const authUser = req.authUser;
  if (!authUser) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { data, error } = await listUpdates(authUser.id, authUser.role);
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(data);
}

export async function postUpdate(req: AuthRequest, res: Response) {
  const authUser = req.authUser;
  if (!authUser) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const payload = req.body;
  const { data, error } = await createUpdate(authUser.id, payload);
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(201).json(data);
}
