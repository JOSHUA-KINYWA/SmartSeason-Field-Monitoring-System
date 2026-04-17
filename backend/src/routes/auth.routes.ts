import { Router } from 'express';
import { getProfile, getAgents } from '../controllers/auth.controller';

const router = Router();
router.get('/me', getProfile);
router.get('/profile', getProfile);
router.get('/agents', getAgents);

export default router;
