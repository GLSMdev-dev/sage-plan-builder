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
    // Safety timeout to ensure app eventually loads even if Supabase hangs
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.warn('Auth initialization timed out. Forcing loading to false.');
        setIsLoading(false);
      }
    }, 5000);

    const fetchProfile = async (email: string, authUser: any) => {
      console.log('Background: Fetching database profile for:', email);
      try {
        const { data: dbUser, error: dbError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('email', email)
          .maybeSingle();

        if (dbError) {
          console.error('Background: Error fetching db profile:', dbError);
          return;
        }

        if (dbUser) {
          console.log('Background: Database profile found:', dbUser.perfil);
          const { data: discs } = await supabase
            .from('professor_disciplinas')
            .select('disciplina_id')
            .eq('professor_id', dbUser.id);

          setUsuario({
            id: String(dbUser.id),
            nome: dbUser.nome || authUser.user_metadata.nome || email.split('@')[0],
            email: email,
            usuario: authUser.user_metadata.usuario || email.split('@')[0],
            perfil: dbUser.perfil || 'professor',
            status: dbUser.status || 'ativo',
            disciplinasLecionadas: discs?.map(d => String(d.disciplina_id)) || [],
          });
        }
      } catch (err) {
        console.error('Background: Unexpected error in fetchProfile:', err);
      }
    };

    // Check current session
    const checkSession = async () => {
      console.log('Checking Supabase session...');
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          console.log('Session found for:', session.user.email);
          const basicUser: User = {
            id: session.user.id,
            nome: session.user.user_metadata.nome || session.user.email?.split('@')[0] || '',
            email: session.user.email || '',
            usuario: session.user.user_metadata.usuario || session.user.email?.split('@')[0] || '',
            perfil: session.user.user_metadata.perfil || 'professor',
            status: 'ativo',
          };
          
          setUsuario(basicUser);
          setIsLoading(false); // Libera o app imediatamente

          if (session.user.email) {
            fetchProfile(session.user.email, session.user);
          }
        } else {
          console.log('No active session.');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Unexpected error in checkSession:', error);
        setIsLoading(false);
      } finally {
        clearTimeout(timeoutId);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, session?.user?.email);
      if (session?.user) {
        const basicUser: User = {
          id: session.user.id,
          nome: session.user.user_metadata.nome || session.user.email?.split('@')[0] || '',
          email: session.user.email || '',
          usuario: session.user.user_metadata.usuario || session.user.email?.split('@')[0] || '',
          perfil: session.user.user_metadata.perfil || 'professor',
          status: 'ativo',
        };
        
        // Só atualiza se o usuário mudou ou se é um evento relevante
        setUsuario(prev => (prev?.email === basicUser.email) ? prev : basicUser);

        if (session.user.email) {
          fetchProfile(session.user.email, session.user);
        }
      } else {
        setUsuario(null);
      }
      setIsLoading(false);
    });

    return () => {
      clearTimeout(timeoutId);
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
