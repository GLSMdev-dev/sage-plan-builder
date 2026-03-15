import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { SiGoogle } from 'react-icons/si';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !senha.trim()) {
      toast.error('Preencha todos os campos.');
      return;
    }
    setIsLoading(true);
    try {
      await login({ email, senha });
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error('Erro no login: ' + (error.message || 'Credenciais inválidas.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/dashboard',
      },
    });
    if (error) toast.error('Erro ao entrar com Google: ' + error.message);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-sage-gradient px-4">
      <Card className="w-full max-w-md shadow-sage">
        <CardHeader className="text-center space-y-2">
          <img src="/logo.png" alt="SAGE Logo" className="mx-auto mb-4 h-28 object-contain" />
          <CardDescription>
            Sistema de Registro de Planos de Aula Mensais — EEMTI Filgueiras Lima 2026
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={handleGoogleLogin}
            data-testid="button-google-login"
          >
            <SiGoogle className="h-4 w-4" />
            Continuar com Google
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-border" />
            <span className="text-xs text-muted-foreground">ou</span>
            <div className="flex-1 border-t border-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="input-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                data-testid="input-senha"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              data-testid="button-submit-login"
            >
              {isLoading ? 'Entrando...' : 'Entrar com email'}
            </Button>
          </form>

          <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
            <p>login: email institucional (@prof.ce.gov.br)</p>
            <p>senha: primeiros 6 digitos do CPF</p>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Ainda não tem conta?{' '}
            <Link to="/registro" className="text-primary hover:underline font-medium">
              Cadastre-se aqui
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
