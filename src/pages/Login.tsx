import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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
    } catch {
      toast.error('Credenciais inválidas. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email ou Usuário</Label>
              <Input
                id="email"
                type="text"
                placeholder="nome.sobrenome ou seu@email.com"
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
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground">
            <p>login: nome de usuário ou e-mail institucional</p>
            <p>senha: primeiros 6 digitos do CPF</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
