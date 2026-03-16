import { supabase } from '../lib/supabase';

export interface SemanaMetodologia {
  numero: number;
  abertura: string;
  desenvolvimento: string;
  fechamento: string;
}

export interface PlanoAula {
  _id?: string;
  professorId: string;
  professorNome: string;
  disciplina: string;
  turma: string;
  mesAno: string;
  tema: string;
  qtdAulas: string;
  objetivos: string;
  conteudo: string;
  semanas: SemanaMetodologia[];
  recursos: string;
  avaliacao: string;
  referencias: string;
  status: 'rascunho' | 'finalizado';
  criadoEm?: string;
  atualizadoEm?: string;
}

interface ExtendedMeta {
  tema: string;
  qtdAulas: string;
  referencias: string;
}

const mapPlano = (p: any): PlanoAula => {
  const rows = p.semanas || [];
  const metaRow = rows.find((s: any) => s.numero === 0);
  let meta: ExtendedMeta = { tema: '', qtdAulas: '', referencias: '' };

  if (metaRow) {
    try { meta = { ...meta, ...JSON.parse(metaRow.metodologia) }; } catch { /* ignore */ }
  }

  // Weekly methodology rows (numero >= 1)
  const semanas: SemanaMetodologia[] = rows
    .filter((s: any) => s.numero >= 1)
    .sort((a: any, b: any) => a.numero - b.numero)
    .map((s: any) => {
      try {
        const parsed = JSON.parse(s.metodologia);
        return { numero: s.numero, abertura: parsed.abertura || '', desenvolvimento: parsed.desenvolvimento || '', fechamento: parsed.fechamento || '' };
      } catch {
        return { numero: s.numero, abertura: s.metodologia || '', desenvolvimento: '', fechamento: '' };
      }
    });

  return {
    _id: String(p.id),
    professorId: p.professor_id,
    professorNome: p.professor_nome,
    disciplina: p.disciplina_nome,
    turma: p.turma,
    mesAno: p.mes_ano,
    tema: meta.tema,
    qtdAulas: meta.qtdAulas,
    objetivos: p.objetivos || '',
    conteudo: p.conteudo || '',
    semanas: semanas.length ? semanas : [{ numero: 1, abertura: '', desenvolvimento: '', fechamento: '' }],
    recursos: metaRow?.recursos || '',
    avaliacao: p.avaliacao || '',
    referencias: meta.referencias,
    status: p.status,
    criadoEm: p.criado_em,
    atualizadoEm: p.atualizado_em,
  };
};

const buildSemanaRows = (plano: Partial<PlanoAula>, planoId: number) => {
  const metaJson: ExtendedMeta = {
    tema: plano.tema || '',
    qtdAulas: plano.qtdAulas || '',
    referencias: plano.referencias || '',
  };

  const rows = [
    { plano_id: planoId, numero: 0, metodologia: JSON.stringify(metaJson), recursos: plano.recursos || '' },
  ];

  (plano.semanas || []).forEach(s => {
    rows.push({
      plano_id: planoId,
      numero: s.numero,
      metodologia: JSON.stringify({ abertura: s.abertura, desenvolvimento: s.desenvolvimento, fechamento: s.fechamento }),
      recursos: '',
    });
  });

  return rows;
};

export const planoService = {
  listar: async (): Promise<PlanoAula[]> => {
    const { data, error } = await supabase
      .from('planos_aula')
      .select('*, semanas:plano_semanas(*)');
    if (error) throw error;
    return (data || []).map(mapPlano);
  },

  buscarPorId: async (id: string): Promise<PlanoAula> => {
    const { data, error } = await supabase
      .from('planos_aula')
      .select('*, semanas:plano_semanas(*)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return mapPlano(data);
  },

  criar: async (plano: Omit<PlanoAula, '_id' | 'criadoEm' | 'atualizadoEm'>): Promise<PlanoAula> => {
    const { data, error } = await supabase
      .from('planos_aula')
      .insert({
        professor_id: plano.professorId,
        professor_nome: plano.professorNome,
        disciplina_nome: plano.disciplina,
        turma: plano.turma,
        mes_ano: plano.mesAno,
        objetivos: plano.objetivos,
        conteudo: plano.conteudo,
        avaliacao: plano.avaliacao,
        status: plano.status,
      })
      .select()
      .single();

    if (error) throw error;

    const semanaRows = buildSemanaRows(plano, data.id);
    const { error: semError } = await supabase.from('plano_semanas').insert(semanaRows);
    if (semError) throw semError;

    return mapPlano({ ...data, semanas: semanaRows });
  },

  atualizar: async (id: string, plano: Partial<PlanoAula>): Promise<PlanoAula> => {
    const updateData: any = {};
    if (plano.disciplina) updateData.disciplina_nome = plano.disciplina;
    if (plano.turma) updateData.turma = plano.turma;
    if (plano.mesAno) updateData.mes_ano = plano.mesAno;
    if (plano.objetivos !== undefined) updateData.objetivos = plano.objetivos;
    if (plano.conteudo !== undefined) updateData.conteudo = plano.conteudo;
    if (plano.avaliacao !== undefined) updateData.avaliacao = plano.avaliacao;
    if (plano.status) updateData.status = plano.status;

    const { data, error } = await supabase
      .from('planos_aula')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Replace all semana rows
    await supabase.from('plano_semanas').delete().eq('plano_id', Number(id));
    const semanaRows = buildSemanaRows(plano, Number(id));
    await supabase.from('plano_semanas').insert(semanaRows);

    return mapPlano({ ...data, semanas: semanaRows });
  },

  excluir: async (id: string): Promise<void> => {
    const { error } = await supabase.from('planos_aula').delete().eq('id', id);
    if (error) throw error;
  },

  duplicar: async (id: string): Promise<PlanoAula> => {
    const original = await planoService.buscarPorId(id);
    const { _id, criadoEm, atualizadoEm, ...paraCopiar } = original;
    return await planoService.criar(paraCopiar);
  },
};
