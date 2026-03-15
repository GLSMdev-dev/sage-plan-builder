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

export const planoService = {
  listar: async (): Promise<PlanoAula[]> => {
    const { data, error } = await supabase
      .from('planos_aula')
      .select('*, semanas:plano_semanas(*)');
    
    if (error) throw error;
    
    // Mapear snake_case para camelCase se necessário, mas aqui vamos focar no _id
    return (data || []).map(p => ({
      ...p,
      _id: String(p.id),
      disciplina: p.disciplina_nome, // Mapeio campo se necessário
    })) as any;
  },

  buscarPorId: async (id: string): Promise<PlanoAula> => {
    const { data, error } = await supabase
      .from('planos_aula')
      .select('*, semanas:plano_semanas(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { ...data, _id: String(data.id), disciplina: data.disciplina_nome } as any;
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
        .insert(semanas.map(s => ({ ...s, plano_id: data.id })));
      if (semError) throw semError;
    }

    return { ...data, _id: String(data.id), semanas } as any;
  },

  atualizar: async (id: string, plano: Partial<PlanoAula>): Promise<PlanoAula> => {
    const { semanas, ...rest } = plano;
    const updateData: any = {};
    if (rest.disciplina) updateData.disciplina_nome = rest.disciplina;
    if (rest.turma) updateData.turma = rest.turma;
    // ... outros campos seriam mapeados aqui

    const { data, error } = await supabase
      .from('planos_aula')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { ...data, _id: String(data.id) } as any;
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
