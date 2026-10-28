/**
 * Application Bootstrap and Server Entry Point.
 * Minimal Express server with health check for initial scaffolding.
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

export const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'OK' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Backend] Server listening on http://localhost:${PORT}`);
  });
}

export default app;
