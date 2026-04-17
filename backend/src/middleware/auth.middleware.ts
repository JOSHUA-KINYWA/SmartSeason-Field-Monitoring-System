import { NextFunction, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase';
import { AuthRequest } from '../types';

export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;
  const token = authorization?.replace('Bearer ', '').trim();

  if (!token) {
    return res.status(401).json({ error: 'Missing authorization header' });
  }

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
  if (userError || !userData?.user) {
    return res.status(401).json({ error: 'Invalid access token' });
  }

  const user = userData.user;
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return res.status(403).json({ error: 'Profile not found' });
  }

  req.authUser = {
    id: user.id,
    email: user.email,
    role: profile.role,
  } as AuthRequest['authUser'];

  return next();
}
