import { supabase } from '../lib/supabase';
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
    const { data, error } = await supabase
      .from('usuarios')
      .select('*');
    if (error) throw error;
    return data as any;
  },

  salvarProfessor: async (prof: Partial<User & { senha?: string }>): Promise<User> => {
    const { id, ...rest } = prof;
    if (id) {
      const { data, error } = await supabase
        .from('usuarios')
        .update(rest)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as any;
    }
    const { data, error } = await supabase
      .from('usuarios')
      .insert(rest)
      .select()
      .single();
    if (error) throw error;
    return data as any;
  },

  excluirProfessor: async (id: string): Promise<void> => {
    const { error } = await supabase.from('usuarios').delete().eq('id', id);
    if (error) throw error;
  },

  listarDisciplinas: async (): Promise<Disciplina[]> => {
    const { data, error } = await supabase
      .from('disciplinas')
      .select('*');
    if (error) throw error;
    return data as any;
  },

  salvarDisciplina: async (disc: Partial<Disciplina>): Promise<Disciplina> => {
    const { id, ...rest } = disc;
    if (id) {
      const { data, error } = await supabase
        .from('disciplinas')
        .update(rest)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data as any;
    }
    const { data, error } = await supabase
      .from('disciplinas')
      .insert(rest)
      .select()
      .single();
    if (error) throw error;
    return data as any;
  },

  excluirDisciplina: async (id: string): Promise<void> => {
    const { error } = await supabase.from('disciplinas').delete().eq('id', id);
    if (error) throw error;
  },
};
