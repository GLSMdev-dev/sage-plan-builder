import { supabase } from '../lib/supabase';

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface User {
  id: string;
  nome: string;
  email: string;
  usuario?: string;
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
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.senha,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Falha no login');

    // Mapear básico. O Context atualizará o perfil real em background
    const user: User = {
      id: authData.user.id,
      nome: authData.user.user_metadata.nome || authData.user.email?.split('@')[0] || '',
      email: authData.user.email || '',
      usuario: authData.user.user_metadata.usuario || authData.user.email?.split('@')[0] || '',
      perfil: authData.user.user_metadata.perfil || 'professor',
      status: 'ativo',
    };

    return { token: authData.session?.access_token || '', usuario: user };
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

    // Criar registro no banco de dados se não existir
    const { data: existingUser } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', data.email)
      .maybeSingle();

    let dbId = response.user.id;

    if (!existingUser) {
      const { data: newUser, error: createError } = await supabase
        .from('usuarios')
        .insert({
          nome: data.nome,
          email: data.email,
          senha_hash: 'managed_by_supabase',
          perfil: 'professor',
          status: 'ativo'
        })
        .select()
        .single();
      
      if (!createError && newUser) {
        dbId = String(newUser.id);
      }
    } else {
      dbId = String(existingUser.id);
    }

    const user: User = {
      id: dbId,
      nome: data.nome,
      email: data.email,
      usuario: data.email.split('@')[0],
      perfil: existingUser?.perfil || 'professor',
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
