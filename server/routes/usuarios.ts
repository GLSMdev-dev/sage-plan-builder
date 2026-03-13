import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db';
import { usuarios, professorDisciplinas } from '../../shared/schema';
import { eq, ne, and } from 'drizzle-orm';
import { authenticate, requireGestor, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate, requireGestor);

const formatUser = (u: typeof usuarios.$inferSelect, disciplinaIds: number[]) => ({
  id: String(u.id),
  nome: u.nome,
  email: u.email,
  cpf: u.cpf ?? undefined,
  perfil: u.perfil,
  status: u.status,
  dataCadastro: u.dataCadastro.toISOString(),
  disciplinasLecionadas: disciplinaIds.map(String),
});

router.get('/', async (_req, res) => {
  try {
    const profs = await db.select().from(usuarios).where(eq(usuarios.perfil, 'professor'));
    const vincs = await db.select().from(professorDisciplinas);
    const result = profs.map(p => formatUser(p, vincs.filter(v => v.professorId === p.id).map(v => v.disciplinaId)));
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao listar professores' });
  }
});

router.post('/', async (req: AuthRequest, res) => {
  try {
    const { nome, email, cpf, senha, status, disciplinasLecionadas } = req.body;
    if (!nome || !email) return res.status(400).json({ message: 'Nome e email obrigatórios' });

    const [emailExist] = await db.select().from(usuarios).where(eq(usuarios.email, email));
    if (emailExist) return res.status(409).json({ message: 'E-mail já está em uso por outro usuário.' });

    if (cpf) {
      const [cpfExist] = await db.select().from(usuarios).where(eq(usuarios.cpf, cpf));
      if (cpfExist) return res.status(409).json({ message: 'CPF já cadastrado.' });
    }

    const senhaHash = await bcrypt.hash(senha || '123456', 10);
    const [newUser] = await db.insert(usuarios).values({ nome, email, cpf, senhaHash, perfil: 'professor', status: status || 'ativo' }).returning();

    if (disciplinasLecionadas?.length) {
      await db.insert(professorDisciplinas).values(disciplinasLecionadas.map((dId: string) => ({ professorId: newUser.id, disciplinaId: Number(dId) })));
    }

    const vinculos = disciplinasLecionadas?.map(Number) ?? [];
    return res.status(201).json(formatUser(newUser, vinculos));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao criar professor' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nome, email, cpf, senha, status, disciplinasLecionadas } = req.body;

    if (email) {
      const [emailExist] = await db.select().from(usuarios).where(and(eq(usuarios.email, email), ne(usuarios.id, id)));
      if (emailExist) return res.status(409).json({ message: 'E-mail já está em uso por outro usuário.' });
    }
    if (cpf) {
      const [cpfExist] = await db.select().from(usuarios).where(and(eq(usuarios.cpf, cpf), ne(usuarios.id, id)));
      if (cpfExist) return res.status(409).json({ message: 'CPF já cadastrado.' });
    }

    const updateData: Record<string, unknown> = {};
    if (nome) updateData.nome = nome;
    if (email) updateData.email = email;
    if (cpf !== undefined) updateData.cpf = cpf;
    if (status) updateData.status = status;
    if (senha) updateData.senhaHash = await bcrypt.hash(senha, 10);

    const [updated] = await db.update(usuarios).set(updateData).where(eq(usuarios.id, id)).returning();
    if (!updated) return res.status(404).json({ message: 'Professor não encontrado' });

    if (disciplinasLecionadas !== undefined) {
      await db.delete(professorDisciplinas).where(eq(professorDisciplinas.professorId, id));
      if (disciplinasLecionadas.length) {
        await db.insert(professorDisciplinas).values(disciplinasLecionadas.map((dId: string) => ({ professorId: id, disciplinaId: Number(dId) })));
      }
    }

    const vincs = await db.select().from(professorDisciplinas).where(eq(professorDisciplinas.professorId, id));
    return res.json(formatUser(updated, vincs.map(v => v.disciplinaId)));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao atualizar professor' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [user] = await db.select().from(usuarios).where(eq(usuarios.id, id));
    if (!user) return res.status(404).json({ message: 'Professor não encontrado' });

    const newStatus = user.status === 'inativo' ? 'ativo' : 'inativo';
    await db.update(usuarios).set({ status: newStatus }).where(eq(usuarios.id, id));
    return res.json({ message: `Professor ${newStatus === 'inativo' ? 'inativado' : 'ativado'} com sucesso` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao alterar status do professor' });
  }
});

export default router;
