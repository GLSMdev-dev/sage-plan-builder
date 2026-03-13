import api from './api';
import { User } from './authService';

export interface Disciplina {
  id: string;
  nome: string;
  codigo?: string;
  cor?: string;
  serie: string;
  cargaHoraria: number;
  status: 'ativa' | 'inativa';
}

export const gestorService = {
  listarProfessores: async (): Promise<User[]> => {
    const { data } = await api.get<User[]>('/usuarios');
    return data;
  },

  salvarProfessor: async (prof: Partial<User & { senha?: string }>): Promise<User> => {
    if (prof.id) {
      const { data } = await api.put<User>(`/usuarios/${prof.id}`, prof);
      return data;
    }
    const { data } = await api.post<User>('/usuarios', prof);
    return data;
  },

  excluirProfessor: async (id: string): Promise<void> => {
    await api.delete(`/usuarios/${id}`);
  },

  listarDisciplinas: async (): Promise<Disciplina[]> => {
    const { data } = await api.get<Disciplina[]>('/disciplinas');
    return data;
  },

  salvarDisciplina: async (disc: Partial<Disciplina>): Promise<Disciplina> => {
    if (disc.id) {
      const { data } = await api.put<Disciplina>(`/disciplinas/${disc.id}`, disc);
      return data;
    }
    const { data } = await api.post<Disciplina>('/disciplinas', disc);
    return data;
  },

  excluirDisciplina: async (id: string): Promise<void> => {
    await api.delete(`/disciplinas/${id}`);
  },
};
