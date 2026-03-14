import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { usuarios } from '../../shared/schema';
import { eq, or } from 'drizzle-orm';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'sage_secret_key';

function buildUsuarioResponse(user: typeof usuarios.$inferSelect) {
  const { senhaHash, ...userData } = user;
  return { ...userData, id: String(userData.id), dataCadastro: userData.dataCadastro.toISOString() };
}

router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ message: 'Email/Usuário e senha obrigatórios' });

    // Busca por email OU nome de usuário
    const [user] = await db.select().from(usuarios).where(
      or(
        eq(usuarios.email, email),
        eq(usuarios.usuario, email)
      )
    );

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

    // Gerar nome de usuário a partir do e-mail (parte antes do @)
    const usuario = email.split('@')[0];
    
    // Verificar se o nome de usuário gerado já existe (raro, mas possível com e-mails diferentes que geram mesmo prefixo de domínios diferentes)
    const [existingUser] = await db.select().from(usuarios).where(eq(usuarios.usuario, usuario));
    if (existingUser) return res.status(409).json({ message: 'Nome de usuário derivado do e-mail já está em uso' });

    const senhaHash = await bcrypt.hash(senha, 10);
    const [newUser] = await db.insert(usuarios).values({ 
      nome, 
      email, 
      usuario,
      cpf, 
      senhaHash, 
      perfil: 'professor', 
      status: 'ativo' 
    }).returning();

    const token = jwt.sign({ id: newUser.id, perfil: newUser.perfil }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(201).json({ token, usuario: buildUsuarioResponse(newUser) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
});


export default router;
