import { Router } from 'express';
import { getUpdates, postUpdate } from '../controllers/updates.controller';

const router = Router();
router.get('/', getUpdates);
router.post('/', postUpdate);

export default router;
