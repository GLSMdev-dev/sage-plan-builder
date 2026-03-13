import { Router } from 'express';
import { db } from '../db';
import { planosAula, planoSemanas, usuarios } from '../../shared/schema';
import { eq, and } from 'drizzle-orm';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate);

const formatPlano = (plano: typeof planosAula.$inferSelect, semanas: typeof planoSemanas.$inferSelect[]) => ({
  _id: String(plano.id),
  professorId: String(plano.professorId),
  professorNome: plano.professorNome,
  disciplina: plano.disciplinaNome,
  turma: plano.turma,
  mesAno: plano.mesAno,
  objetivos: plano.objetivos,
  conteudo: plano.conteudo,
  avaliacao: plano.avaliacao,
  status: plano.status,
  criadoEm: plano.criadoEm.toISOString(),
  atualizadoEm: plano.atualizadoEm.toISOString(),
  semanas: semanas.sort((a, b) => a.numero - b.numero).map(s => ({
    numero: s.numero,
    metodologia: s.metodologia,
    recursos: s.recursos,
  })),
});

router.get('/', async (req: AuthRequest, res) => {
  try {
    let query;
    if (req.userPerfil === 'professor') {
      query = db.select().from(planosAula).where(eq(planosAula.professorId, req.userId!));
    } else {
      query = db.select().from(planosAula);
    }
    const planos = await query;
    const semanas = await db.select().from(planoSemanas);
    const result = planos.map(p => formatPlano(p, semanas.filter(s => s.planoId === p.id)));
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao listar planos' });
  }
});

router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    const [plano] = await db.select().from(planosAula).where(eq(planosAula.id, id));
    if (!plano) return res.status(404).json({ message: 'Plano não encontrado' });

    if (req.userPerfil === 'professor' && plano.professorId !== req.userId) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const semanas = await db.select().from(planoSemanas).where(eq(planoSemanas.planoId, id));
    return res.json(formatPlano(plano, semanas));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao buscar plano' });
  }
});

router.post('/', async (req: AuthRequest, res) => {
  try {
    const { professorId, professorNome, disciplina, turma, mesAno, objetivos, conteudo, avaliacao, status, semanas } = req.body;
    const profId = req.userPerfil === 'professor' ? req.userId! : Number(professorId);

    const [prof] = await db.select().from(usuarios).where(eq(usuarios.id, profId));
    const nome = professorNome || prof?.nome || '';

    const [novo] = await db.insert(planosAula).values({
      professorId: profId,
      professorNome: nome,
      disciplinaNome: disciplina,
      turma, mesAno, objetivos, conteudo, avaliacao,
      status: status || 'rascunho',
    }).returning();

    if (semanas?.length) {
      await db.insert(planoSemanas).values(semanas.map((s: { numero: number; metodologia: string; recursos: string }) => ({
        planoId: novo.id,
        numero: s.numero,
        metodologia: s.metodologia,
        recursos: s.recursos,
      })));
    }

    const semanasDb = await db.select().from(planoSemanas).where(eq(planoSemanas.planoId, novo.id));
    return res.status(201).json(formatPlano(novo, semanasDb));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao criar plano' });
  }
});

router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    const [existing] = await db.select().from(planosAula).where(eq(planosAula.id, id));
    if (!existing) return res.status(404).json({ message: 'Plano não encontrado' });

    if (req.userPerfil === 'professor' && existing.professorId !== req.userId) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const { disciplina, turma, mesAno, objetivos, conteudo, avaliacao, status, semanas } = req.body;
    const updateData: Record<string, unknown> = { atualizadoEm: new Date() };
    if (disciplina) updateData.disciplinaNome = disciplina;
    if (turma) updateData.turma = turma;
    if (mesAno) updateData.mesAno = mesAno;
    if (objetivos) updateData.objetivos = objetivos;
    if (conteudo) updateData.conteudo = conteudo;
    if (avaliacao) updateData.avaliacao = avaliacao;
    if (status) updateData.status = status;

    const [updated] = await db.update(planosAula).set(updateData).where(eq(planosAula.id, id)).returning();

    if (semanas !== undefined) {
      await db.delete(planoSemanas).where(eq(planoSemanas.planoId, id));
      if (semanas.length) {
        await db.insert(planoSemanas).values(semanas.map((s: { numero: number; metodologia: string; recursos: string }) => ({
          planoId: id,
          numero: s.numero,
          metodologia: s.metodologia,
          recursos: s.recursos,
        })));
      }
    }

    const semanasDb = await db.select().from(planoSemanas).where(eq(planoSemanas.planoId, id));
    return res.json(formatPlano(updated, semanasDb));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao atualizar plano' });
  }
});

router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    const [existing] = await db.select().from(planosAula).where(eq(planosAula.id, id));
    if (!existing) return res.status(404).json({ message: 'Plano não encontrado' });

    if (req.userPerfil === 'professor' && existing.professorId !== req.userId) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    await db.delete(planosAula).where(eq(planosAula.id, id));
    return res.json({ message: 'Plano excluído com sucesso' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao excluir plano' });
  }
});

router.post('/:id/duplicar', async (req: AuthRequest, res) => {
  try {
    const id = Number(req.params.id);
    const [original] = await db.select().from(planosAula).where(eq(planosAula.id, id));
    if (!original) return res.status(404).json({ message: 'Plano não encontrado' });

    const [prof] = await db.select().from(usuarios).where(eq(usuarios.id, req.userId!));
    const [copia] = await db.insert(planosAula).values({
      professorId: req.userId!,
      professorNome: prof?.nome || original.professorNome,
      disciplinaNome: original.disciplinaNome,
      turma: original.turma,
      mesAno: original.mesAno,
      objetivos: original.objetivos,
      conteudo: original.conteudo,
      avaliacao: original.avaliacao,
      status: 'rascunho',
    }).returning();

    const semanasOriginais = await db.select().from(planoSemanas).where(eq(planoSemanas.planoId, id));
    if (semanasOriginais.length) {
      await db.insert(planoSemanas).values(semanasOriginais.map(s => ({ planoId: copia.id, numero: s.numero, metodologia: s.metodologia, recursos: s.recursos })));
    }

    const semanasDb = await db.select().from(planoSemanas).where(eq(planoSemanas.planoId, copia.id));
    return res.status(201).json(formatPlano(copia, semanasDb));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro ao duplicar plano' });
  }
});

export default router;
