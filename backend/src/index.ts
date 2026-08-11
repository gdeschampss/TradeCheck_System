import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check endpoints
app.get('/health', (req, res) => res.json({ status: 'ok', environment: process.env.VERCEL ? 'vercel' : 'local' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', environment: process.env.VERCEL ? 'vercel' : 'local' }));

// Support both /api and root routes for Vercel multi-service rewrites
app.use('/api', apiRoutes);
app.use('/', apiRoutes);

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
