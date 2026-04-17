import './setupEnv';
import express from 'express';
import cors from 'cors';
import { authMiddleware } from './middleware/auth.middleware';
import authRoutes from './routes/auth.routes';
import fieldsRoutes from './routes/fields.routes';
import updatesRoutes from './routes/updates.routes';

const app = express();
const PORT = process.env.PORT || 5000;

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

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
