import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import authRoutes from './routes/auth';
import usuariosRoutes from './routes/usuarios';
import disciplinasRoutes from './routes/disciplinas';
import planosRoutes from './routes/planos';
import { db } from './db';
import { sql } from 'drizzle-orm';
import { setupAuth, registerAuthRoutes } from './replit_integrations/auth';

const app = express();
const isProd = process.env.NODE_ENV === 'production';
const PORT = isProd ? (process.env.PORT || 5000) : (process.env.API_PORT || 3001);

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

    // In production, serve the built frontend and handle SPA routing
    if (isProd) {
      const distPath = path.join(process.cwd(), 'dist');
      if (fs.existsSync(distPath)) {
        app.use(express.static(distPath));
        app.use((_req, res) => {
          res.sendFile(path.join(distPath, 'index.html'));
        });
      }
    }

    app.listen(PORT, () => {
      console.log(`🚀 API rodando em http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Falha ao conectar ao banco:', err);
    process.exit(1);
  }
}

start();
