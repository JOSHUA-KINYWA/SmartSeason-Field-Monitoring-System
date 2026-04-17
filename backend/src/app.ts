import express from 'express';
import cors from 'cors';
import { authMiddleware } from './middleware/auth.middleware';
import authRoutes from './routes/auth.routes';
import fieldsRoutes from './routes/fields.routes';
import updatesRoutes from './routes/updates.routes';

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authMiddleware, authRoutes);
app.use('/api/fields', authMiddleware, fieldsRoutes);
app.use('/api/field-updates', authMiddleware, updatesRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

export default app;
