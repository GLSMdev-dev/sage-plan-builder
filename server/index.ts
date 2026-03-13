import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import usuariosRoutes from './routes/usuarios';
import disciplinasRoutes from './routes/disciplinas';
import planosRoutes from './routes/planos';
import { db } from './db';
import { sql } from 'drizzle-orm';
import { setupAuth, registerAuthRoutes } from './replit_integrations/auth';

const app = express();
const PORT = process.env.API_PORT || 3001;

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());

async function start() {
  try {
    await db.execute(sql`SELECT 1`);
    console.log('✅ Banco de dados conectado');

    await setupAuth(app);
    registerAuthRoutes(app);

    app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
    app.use('/api/auth', authRoutes);
    app.use('/api/usuarios', usuariosRoutes);
    app.use('/api/disciplinas', disciplinasRoutes);
    app.use('/api/planos', planosRoutes);

    app.listen(PORT, () => {
      console.log(`🚀 API rodando em http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Falha ao conectar ao banco:', err);
    process.exit(1);
  }
}

start();
