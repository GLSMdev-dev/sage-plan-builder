import { Router } from 'express';
import { db } from '../db';
import { disciplinas, professorDisciplinas } from '../../shared/schema';
import { eq, ne, and } from 'drizzle-orm';
import { authenticate, requireGestor } from '../middleware/auth';

const router = Router();
router.use(authenticate, requireGestor);

router.get('/', async (_req, res) => {
  try {
    const all = await db.select().from(disciplinas);
    return res.json(all.map(d => ({ ...d, id: String(d.id) })));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao listar disciplinas' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nome, codigo, cor, serie, cargaHoraria, status } = req.body;
    if (!nome || !serie) return res.status(400).json({ message: 'Nome e série obrigatórios' });

    if (codigo) {
      const [codigoExist] = await db.select().from(disciplinas).where(eq(disciplinas.codigo, codigo));
      if (codigoExist) return res.status(409).json({ message: 'Código já cadastrado em outra disciplina.' });
    }

    const [nova] = await db.insert(disciplinas).values({ nome, codigo, cor: cor || '#3b82f6', serie, cargaHoraria: cargaHoraria || 0, status: status || 'ativa' }).returning();
    return res.status(201).json({ ...nova, id: String(nova.id) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao criar disciplina' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nome, codigo, cor, serie, cargaHoraria, status } = req.body;

    if (codigo) {
      const [codigoExist] = await db.select().from(disciplinas).where(and(eq(disciplinas.codigo, codigo), ne(disciplinas.id, id)));
      if (codigoExist) return res.status(409).json({ message: 'Código já cadastrado em outra disciplina.' });
    }

    const [updated] = await db.update(disciplinas).set({ nome, codigo, cor, serie, cargaHoraria, status }).where(eq(disciplinas.id, id)).returning();
    if (!updated) return res.status(404).json({ message: 'Disciplina não encontrada' });
    return res.json({ ...updated, id: String(updated.id) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao atualizar disciplina' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const hasProfs = await db.select().from(professorDisciplinas).where(eq(professorDisciplinas.disciplinaId, id));

    if (hasProfs.length > 0) {
      await db.update(disciplinas).set({ status: 'inativa' }).where(eq(disciplinas.id, id));
      return res.status(409).json({ message: 'Disciplina inativada (já possui vínculos de planos ou professores).' });
    }

    await db.delete(disciplinas).where(eq(disciplinas.id, id));
    return res.json({ message: 'Disciplina excluída com sucesso' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao excluir disciplina' });
  }
});

export default router;
