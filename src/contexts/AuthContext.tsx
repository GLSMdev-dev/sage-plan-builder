import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, LoginCredentials, authService } from '@/services/authService';

interface AuthContextType {
  usuario: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  googleAuthError: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: { nome: string; email: string; senha: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [googleAuthError, setGoogleAuthError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('sage_user');
    const storedToken = localStorage.getItem('sage_token');
    if (storedUser && storedToken) {
      setUsuario(JSON.parse(storedUser));
      setIsLoading(false);
      return;
    }

    // Try to exchange an active Google (Replit Auth) session for a SAGE token
    fetch('/api/auth/google-profile', { credentials: 'include' })
      .then(async (res) => {
        if (res.ok) {
          const { token, usuario: user } = await res.json();
          localStorage.setItem('sage_token', token);
          localStorage.setItem('sage_user', JSON.stringify(user));
          setUsuario(user);
        } else if (res.status === 404 || res.status === 403) {
          const data = await res.json().catch(() => ({}));
          setGoogleAuthError(data.message || 'Email não encontrado no sistema. Contate a gestão.');
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const { token, usuario: user } = await authService.login(credentials);
    localStorage.setItem('sage_token', token);
    localStorage.setItem('sage_user', JSON.stringify(user));
    setUsuario(user);
  }, []);

  const register = useCallback(async (data: { nome: string; email: string; senha: string }) => {
    const { token, usuario: user } = await authService.register(data);
    localStorage.setItem('sage_token', token);
    localStorage.setItem('sage_user', JSON.stringify(user));
    setUsuario(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('sage_token');
    localStorage.removeItem('sage_user');
    setUsuario(null);
    // Clear Replit Auth session as well (handles Google login)
    window.location.href = '/api/logout';
  }, []);

  return (
    <AuthContext.Provider
      value={{ usuario, isAuthenticated: !!usuario, isLoading, googleAuthError, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
};
