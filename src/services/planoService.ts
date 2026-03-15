import { supabase } from '../lib/supabase';

export interface Semana {
  numero: number;
  metodologia: string;
  recursos: string;
}

export interface PlanoAula {
  _id?: string;
  professorId: string;
  professorNome: string;
  disciplina: string;
  turma: string;
  mesAno: string;
  objetivos: string;
  conteudo: string;
  avaliacao: string;
  semanas: Semana[];
  status: 'rascunho' | 'finalizado';
  criadoEm?: string;
  atualizadoEm?: string;
}

const mapPlano = (p: any): PlanoAula => ({
  _id: String(p.id),
  professorId: p.professor_id,
  professorNome: p.professor_nome,
  disciplina: p.disciplina_nome,
  turma: p.turma,
  mesAno: p.mes_ano,
  objetivos: p.objetivos || '',
  conteudo: p.conteudo || '',
  avaliacao: p.avaliacao || '',
  semanas: p.semanas || [],
  status: p.status,
  criadoEm: p.criado_em,
  atualizadoEm: p.atualizado_em,
});

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
    const { semanas, ...rest } = plano;
    const { data, error } = await supabase
      .from('planos_aula')
      .insert({
        professor_id: rest.professorId,
        professor_nome: rest.professorNome,
        disciplina_nome: rest.disciplina,
        turma: rest.turma,
        mes_ano: rest.mesAno,
        objetivos: rest.objetivos,
        conteudo: rest.conteudo,
        avaliacao: rest.avaliacao,
        status: rest.status,
      })
      .select()
      .single();

    if (error) throw error;

    if (semanas?.length) {
      const { error: semError } = await supabase
        .from('plano_semanas')
        .insert(semanas.map(s => ({
          numero: s.numero,
          metodologia: s.metodologia,
          recursos: s.recursos,
          plano_id: data.id 
        })));
      if (semError) throw semError;
    }

    return mapPlano({ ...data, semanas });
  },

  atualizar: async (id: string, plano: Partial<PlanoAula>): Promise<PlanoAula> => {
    const { semanas, ...rest } = plano;
    const updateData: any = {};
    if (rest.disciplina) updateData.disciplina_nome = rest.disciplina;
    if (rest.turma) updateData.turma = rest.turma;
    if (rest.mesAno) updateData.mes_ano = rest.mesAno;
    if (rest.objetivos !== undefined) updateData.objetivos = rest.objetivos;
    if (rest.conteudo !== undefined) updateData.conteudo = rest.conteudo;
    if (rest.avaliacao !== undefined) updateData.avaliacao = rest.avaliacao;
    if (rest.status) updateData.status = rest.status;

    const { data, error } = await supabase
      .from('planos_aula')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    // Simplificando: em uma atualização de plano completo, poderíamos deletar e reinserir semanas
    // ou fazer um upsert. Para este fix, focamos na correção do mapeamento de leitura.
    return mapPlano(data);
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
