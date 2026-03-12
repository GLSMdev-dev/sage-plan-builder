import api from './api';

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface User {
  id: string;
  nome: string;
  email: string;
  perfil: 'professor' | 'gestor';
}

export interface AuthResponse {
  token: string;
  usuario: User;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    return data;
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
