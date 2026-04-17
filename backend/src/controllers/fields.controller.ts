import { Response } from 'express';
import { AuthRequest, Profile } from '../types';
import { createField, deleteField, listFields, updateField } from '../services/fields.service';

export async function getFields(req: AuthRequest, res: Response) {
  const authUser = req.authUser;
  if (!authUser) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { data, error } = await listFields(authUser as Profile);
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json(data);
}

export async function postField(req: AuthRequest, res: Response) {
  const authUser = req.authUser;
  if (!authUser) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const payload = req.body;
  const { data, error } = await createField(authUser as Profile, payload);
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(201).json(data);
}

export async function patchField(req: AuthRequest, res: Response) {
  const authUser = req.authUser;
  if (!authUser) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const fieldId = req.params.id;
  const payload = req.body;
  const { data, error } = await updateField(fieldId, payload);
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.json(data);
}

export async function deleteFieldController(req: AuthRequest, res: Response) {
  const authUser = req.authUser;
  if (!authUser) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (authUser.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const fieldId = req.params.id;
  const { data, error } = await deleteField(fieldId);
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.json(data);
}
