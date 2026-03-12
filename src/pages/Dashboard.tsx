import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Plus, FileText } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">S</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold">SAGE</h1>
              <p className="text-xs text-muted-foreground">EEMTI Filgueiras Lima</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {usuario?.nome} • <span className="capitalize">{usuario?.perfil}</span>
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Planos de Aula</h2>
            <p className="text-muted-foreground">
              {usuario?.perfil === 'professor'
                ? 'Gerencie seus planos de aula mensais'
                : 'Visualize os planos de aula dos professores'}
            </p>
          </div>
          {usuario?.perfil === 'professor' && (
            <Button onClick={() => navigate('/planos/novo')}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Plano
            </Button>
          )}
        </div>

        {/* Placeholder - será substituído pela lista real */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-muted-foreground">
              <FileText className="h-5 w-5" />
              Nenhum plano encontrado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {usuario?.perfil === 'professor'
                ? 'Clique em "Novo Plano" para criar seu primeiro plano de aula.'
                : 'Nenhum plano de aula foi criado ainda.'}
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
