import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, LoginCredentials, authService } from '@/services/authService';
import { supabase } from '@/lib/supabase';

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
    // Check current session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const user: User = {
          id: session.user.id,
          nome: session.user.user_metadata.nome || session.user.email?.split('@')[0] || '',
          email: session.user.email || '',
          usuario: session.user.user_metadata.usuario || session.user.email?.split('@')[0] || '',
          perfil: session.user.user_metadata.perfil || 'professor',
          status: 'ativo',
        };
        setUsuario(user);
      }
      setIsLoading(false);
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const user: User = {
          id: session.user.id,
          nome: session.user.user_metadata.nome || session.user.email?.split('@')[0] || '',
          email: session.user.email || '',
          usuario: session.user.user_metadata.usuario || session.user.email?.split('@')[0] || '',
          perfil: session.user.user_metadata.perfil || 'professor',
          status: 'ativo',
        };
        setUsuario(user);
      } else {
        setUsuario(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
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

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('sage_token');
    localStorage.removeItem('sage_user');
    setUsuario(null);
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
