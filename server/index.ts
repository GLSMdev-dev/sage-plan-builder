import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import usuariosRoutes from './routes/usuarios';
import disciplinasRoutes from './routes/disciplinas';
import planosRoutes from './routes/planos';
import { db } from './db';
import { sql } from 'drizzle-orm';

const app = express();
const PORT = process.env.API_PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/disciplinas', disciplinasRoutes);
app.use('/api/planos', planosRoutes);

async function start() {
  try {
    await db.execute(sql`SELECT 1`);
    console.log('✅ Banco de dados conectado');
    app.listen(PORT, () => {
      console.log(`🚀 API rodando em http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Falha ao conectar ao banco:', err);
    process.exit(1);
  }
}

start();
