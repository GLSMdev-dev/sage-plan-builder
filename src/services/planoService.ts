import api from './api';

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
    const { data } = await api.get<PlanoAula[]>('/planos');
    return data;
  },

  buscarPorId: async (id: string): Promise<PlanoAula> => {
    const { data } = await api.get<PlanoAula>(`/planos/${id}`);
    return data;
  },

  criar: async (plano: Omit<PlanoAula, '_id' | 'criadoEm' | 'atualizadoEm'>): Promise<PlanoAula> => {
    const { data } = await api.post<PlanoAula>('/planos', plano);
    return data;
  },

  atualizar: async (id: string, plano: Partial<PlanoAula>): Promise<PlanoAula> => {
    const { data } = await api.put<PlanoAula>(`/planos/${id}`, plano);
    return data;
  },

  excluir: async (id: string): Promise<void> => {
    await api.delete(`/planos/${id}`);
  },

  duplicar: async (id: string): Promise<PlanoAula> => {
    const { data } = await api.post<PlanoAula>(`/planos/${id}/duplicar`, {});
    return data;
  },
};
