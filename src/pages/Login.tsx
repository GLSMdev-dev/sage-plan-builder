import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

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
            Sistema de Registro de Planos de Aula Mensais— EEMTI Filgueiras Lima 2026
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Não tem conta?{' '}
            <Link to="/registro" className="text-primary hover:underline font-medium">
              Cadastre-se
            </Link>
          </div>
          <div className="mt-4 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
            <p className="font-medium mb-1">Contas de teste:</p>
            <p>Professor: professor@sage.com / 123456</p>
            <p>Gestor: gestor@sage.com / 123456</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
