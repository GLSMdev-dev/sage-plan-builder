import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PlanoAula } from '@/services/planoService';
import { mockPlanoService } from '@/services/mockServices';
import Navbar from '@/components/Navbar';
import StatCard from '@/components/StatCard';
import PlanoCard from '@/components/PlanoCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Plus, Calendar, FileEdit, Search } from 'lucide-react';
import { toast } from 'sonner';

const DashboardProfessor: React.FC = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [planos, setPlanos] = useState<PlanoAula[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroTurma, setFiltroTurma] = useState('todas');
  const [filtroMes, setFiltroMes] = useState('todos');
  const [filtroStatus, setFiltroStatus] = useState('todos');

  const carregarPlanos = async () => {
    try {
      const data = await mockPlanoService.listar(usuario?.id);
      setPlanos(data);
    } catch {
      toast.error('Erro ao carregar planos.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarPlanos();
  }, [usuario]);

  const handleExcluir = async (id: string) => {
    try {
      await mockPlanoService.excluir(id);
      setPlanos(prev => prev.filter(p => p._id !== id));
      toast.success('Plano excluído com sucesso!');
    } catch {
      toast.error('Erro ao excluir plano.');
    }
  };

  const handleDuplicar = async (id: string) => {
    try {
      const novo = await mockPlanoService.duplicar(id, usuario!.id, usuario!.nome);
      setPlanos(prev => [...prev, novo]);
      toast.success('Plano duplicado como rascunho!');
    } catch {
      toast.error('Erro ao duplicar plano.');
    }
  };

  const mesAtual = new Date().toISOString().slice(0, 7);
  const totalPlanos = planos.length;
  const planosMesAtual = planos.filter(p => p.mesAno === mesAtual).length;
  const rascunhos = planos.filter(p => p.status === 'rascunho').length;

  // Turmas únicas para filtro
  const turmas = [...new Set(planos.map(p => p.turma))].sort();
  const meses = [...new Set(planos.map(p => p.mesAno))].sort().reverse();

  const planosFiltrados = planos.filter(p => {
    const matchBusca = !busca || 
      p.disciplina.toLowerCase().includes(busca.toLowerCase()) ||
      p.turma.toLowerCase().includes(busca.toLowerCase());
    const matchTurma = filtroTurma === 'todas' || p.turma === filtroTurma;
    const matchMes = filtroMes === 'todos' || p.mesAno === filtroMes;
    const matchStatus = filtroStatus === 'todos' || p.status === filtroStatus;
    return matchBusca && matchTurma && matchMes && matchStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard titulo="Total de Planos" valor={totalPlanos} icone={FileText} />
          <StatCard titulo="Planos do Mês" valor={planosMesAtual} icone={Calendar} descricao="Mês atual" />
          <StatCard titulo="Rascunhos" valor={rascunhos} icone={FileEdit} descricao="Pendentes" />
        </div>

        {/* Header + Novo */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Meus Planos de Aula</h2>
            <p className="text-sm text-muted-foreground">Gerencie seus planos de aula mensais</p>
          </div>
          <Button onClick={() => navigate('/planos/novo')}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Plano
          </Button>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar disciplina ou turma..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filtroTurma} onValueChange={setFiltroTurma}>
            <SelectTrigger><SelectValue placeholder="Turma" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as turmas</SelectItem>
              {turmas.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filtroMes} onValueChange={setFiltroMes}>
            <SelectTrigger><SelectValue placeholder="Mês" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os meses</SelectItem>
              {meses.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filtroStatus} onValueChange={setFiltroStatus}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="rascunho">Rascunho</SelectItem>
              <SelectItem value="finalizado">Finalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lista */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : planosFiltrados.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="mx-auto h-12 w-12 mb-3 opacity-50" />
            <p className="font-medium">Nenhum plano encontrado</p>
            <p className="text-sm mt-1">
              {planos.length === 0
                ? 'Clique em "Novo Plano" para criar seu primeiro plano.'
                : 'Tente alterar os filtros de busca.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {planosFiltrados.map(plano => (
              <PlanoCard
                key={plano._id}
                plano={plano}
                onExcluir={handleExcluir}
                onDuplicar={handleDuplicar}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardProfessor;
