import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { usuarios } from '../../shared/schema';
import { eq } from 'drizzle-orm';
import { isAuthenticated } from '../replit_integrations/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'sage_secret_key';

function buildUsuarioResponse(user: typeof usuarios.$inferSelect) {
  const { senhaHash, ...userData } = user;
  return { ...userData, id: String(userData.id), dataCadastro: userData.dataCadastro.toISOString() };
}

router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ message: 'Email e senha obrigatórios' });

    const [user] = await db.select().from(usuarios).where(eq(usuarios.email, email));
    if (!user) return res.status(401).json({ message: 'Credenciais inválidas' });
    if (user.status === 'inativo') return res.status(403).json({ message: 'Conta desativada. Contate a gestão.' });

    const valid = await bcrypt.compare(senha, user.senhaHash);
    if (!valid) return res.status(401).json({ message: 'Credenciais inválidas' });

    const token = jwt.sign({ id: user.id, perfil: user.perfil }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, usuario: buildUsuarioResponse(user) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha, cpf } = req.body;
    if (!nome || !email || !senha) return res.status(400).json({ message: 'Campos obrigatórios faltando' });

    const [existing] = await db.select().from(usuarios).where(eq(usuarios.email, email));
    if (existing) return res.status(409).json({ message: 'Email já cadastrado' });

    const senhaHash = await bcrypt.hash(senha, 10);
    const [newUser] = await db.insert(usuarios).values({ nome, email, cpf, senhaHash, perfil: 'professor', status: 'ativo' }).returning();

    const token = jwt.sign({ id: newUser.id, perfil: newUser.perfil }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(201).json({ token, usuario: buildUsuarioResponse(newUser) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Exchange Replit Auth (Google) session for a SAGE JWT
// Called after the user completes the Google OAuth flow
router.get('/google-profile', isAuthenticated, async (req: any, res) => {
  try {
    const email = req.user?.claims?.email;
    if (!email) return res.status(400).json({ message: 'Email não disponível na sessão Google' });

    const [user] = await db.select().from(usuarios).where(eq(usuarios.email, email));
    if (!user) return res.status(404).json({ message: 'Email não encontrado no sistema. Contate a gestão.' });
    if (user.status === 'inativo') return res.status(403).json({ message: 'Conta desativada. Contate a gestão.' });

    const token = jwt.sign({ id: user.id, perfil: user.perfil }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, usuario: buildUsuarioResponse(user) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router;
