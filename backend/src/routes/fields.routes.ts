import { Router } from 'express';
import { deleteFieldController, getFields, postField, patchField } from '../controllers/fields.controller';

const router = Router();
router.get('/', getFields);
router.post('/', postField);
router.patch('/:id', patchField);
router.delete('/:id', deleteFieldController);

export default router;
