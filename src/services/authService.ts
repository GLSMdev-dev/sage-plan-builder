import { supabase } from '../lib/supabase';

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface User {
  id: string;
  nome: string;
  email: string;
  usuario: string;
  cpf?: string;
  perfil: 'professor' | 'gestor';
  status?: 'ativo' | 'inativo';
  dataCadastro?: string;
  disciplinasLecionadas?: string[];
}

export interface AuthResponse {
  token: string;
  usuario: User;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.senha,
    });

    if (error) throw error;
    if (!data.user) throw new Error('Falha no login');

    // Mapear metadados do Supabase para o nosso objeto User
    const user: User = {
      id: data.user.id,
      nome: data.user.user_metadata.nome || data.user.email?.split('@')[0] || '',
      email: data.user.email || '',
      usuario: data.user.user_metadata.usuario || data.user.email?.split('@')[0] || '',
      perfil: data.user.user_metadata.perfil || 'professor',
      status: 'ativo',
    };

    return { token: data.session?.access_token || '', usuario: user };
  },

  register: async (data: { nome: string; email: string; senha: string; cpf?: string }): Promise<AuthResponse> => {
    const { data: response, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.senha,
      options: {
        data: {
          nome: data.nome,
          usuario: data.email.split('@')[0],
          perfil: 'professor',
        },
      },
    });

    if (error) throw error;
    if (!response.user) throw new Error('Falha no registro');

    const user: User = {
      id: response.user.id,
      nome: data.nome,
      email: data.email,
      usuario: data.email.split('@')[0],
      perfil: 'professor',
      status: 'ativo',
    };

    return { token: response.session?.access_token || '', usuario: user };
  },

  logout: () => {
    localStorage.removeItem('sage_token');
    localStorage.removeItem('sage_user');
  },

  getStoredUser: (): User | null => {
    const user = localStorage.getItem('sage_user');
    return user ? JSON.parse(user) : null;
  },

  getStoredToken: (): string | null => {
    return localStorage.getItem('sage_token');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('sage_token');
  },
};
