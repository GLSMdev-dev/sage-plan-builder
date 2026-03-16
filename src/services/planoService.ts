import { supabase } from '../lib/supabase';

export interface PlanoAula {
  _id?: string;
  professorId: string;
  professorNome: string;
  disciplina: string;       // Componente Curricular
  turma: string;            // Série/Turma(s)
  mesAno: string;
  tema: string;             // Tema da aula
  qtdAulas: string;         // Ex: "08 aulas / 400 minutos"
  objetivos: string;        // Objetivos da Aula
  conteudo: string;         // Conteúdo(s) Programático(s)
  metodologiaAbertura: string;
  metodologiaDesenvolvimento: string;
  metodologiaFechamento: string;
  recursos: string;         // Recursos Didáticos
  avaliacao: string;        // Avaliação
  referencias: string;      // Referências
  status: 'rascunho' | 'finalizado';
  criadoEm?: string;
  atualizadoEm?: string;
}

// Extended metadata stored in plano_semanas row (numero=0)
interface ExtendedMeta {
  tema: string;
  qtdAulas: string;
  metodologiaAbertura: string;
  metodologiaDesenvolvimento: string;
  metodologiaFechamento: string;
  referencias: string;
}

const mapPlano = (p: any): PlanoAula => {
  // Extract extended metadata from semanas (row with numero=0)
  const metaRow = (p.semanas || []).find((s: any) => s.numero === 0);
  let meta: ExtendedMeta = {
    tema: '',
    qtdAulas: '',
    metodologiaAbertura: '',
    metodologiaDesenvolvimento: '',
    metodologiaFechamento: '',
    referencias: '',
  };

  if (metaRow) {
    try {
      meta = { ...meta, ...JSON.parse(metaRow.metodologia) };
    } catch { /* ignore */ }
  }

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
    metodologiaAbertura: meta.metodologiaAbertura,
    metodologiaDesenvolvimento: meta.metodologiaDesenvolvimento,
    metodologiaFechamento: meta.metodologiaFechamento,
    recursos: metaRow?.recursos || '',
    avaliacao: p.avaliacao || '',
    referencias: meta.referencias,
    status: p.status,
    criadoEm: p.criado_em,
    atualizadoEm: p.atualizado_em,
  };
};

const buildMetaRow = (plano: Partial<PlanoAula>, planoId: number) => {
  const metaJson: ExtendedMeta = {
    tema: plano.tema || '',
    qtdAulas: plano.qtdAulas || '',
    metodologiaAbertura: plano.metodologiaAbertura || '',
    metodologiaDesenvolvimento: plano.metodologiaDesenvolvimento || '',
    metodologiaFechamento: plano.metodologiaFechamento || '',
    referencias: plano.referencias || '',
  };
  return {
    plano_id: planoId,
    numero: 0,
    metodologia: JSON.stringify(metaJson),
    recursos: plano.recursos || '',
  };
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

    // Store extended metadata as a plano_semana row with numero=0
    const metaRow = buildMetaRow(plano, data.id);
    const { error: metaError } = await supabase
      .from('plano_semanas')
      .insert(metaRow);
    if (metaError) throw metaError;

    return mapPlano({ ...data, semanas: [metaRow] });
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

    // Update extended metadata: delete old row and insert new
    await supabase.from('plano_semanas').delete().eq('plano_id', Number(id)).eq('numero', 0);
    const metaRow = buildMetaRow(plano, Number(id));
    await supabase.from('plano_semanas').insert(metaRow);

    return mapPlano({ ...data, semanas: [metaRow] });
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
