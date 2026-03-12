import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlanoAula } from '@/services/planoService';
import { mockPlanoService } from '@/services/mockServices';
import { MOCK_USERS } from '@/services/mockData';
import Navbar from '@/components/Navbar';
import StatCard from '@/components/StatCard';
import PlanoCard from '@/components/PlanoCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Calendar, Users, Search, Settings } from 'lucide-react';
import { toast } from 'sonner';

const DashboardGestor: React.FC = () => {
  const navigate = useNavigate();
  const [planos, setPlanos] = useState<PlanoAula[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroProfessor, setFiltroProfessor] = useState('todos');
  const [filtroTurma, setFiltroTurma] = useState('todas');
  const [filtroMes, setFiltroMes] = useState('todos');
  const [filtroStatus, setFiltroStatus] = useState('todos');

  useEffect(() => {
    const carregar = async () => {
      try {
        const data = await mockPlanoService.listar();
        setPlanos(data);
      } catch {
        toast.error('Erro ao carregar planos.');
      } finally {
        setIsLoading(false);
      }
    };
    carregar();
  }, []);

  const mesAtual = new Date().toISOString().slice(0, 7);
  const totalPlanos = planos.length;
  const planosMesAtual = planos.filter(p => p.mesAno === mesAtual).length;
  const professoresAtivos = new Set(planos.map(p => p.professorId)).size;

  const professores = MOCK_USERS.filter(u => u.perfil === 'professor');
  const turmas = [...new Set(planos.map(p => p.turma))].sort();
  const meses = [...new Set(planos.map(p => p.mesAno))].sort().reverse();

  const planosFiltrados = planos.filter(p => {
    const matchBusca = !busca ||
      p.disciplina.toLowerCase().includes(busca.toLowerCase()) ||
      p.professorNome.toLowerCase().includes(busca.toLowerCase()) ||
      p.turma.toLowerCase().includes(busca.toLowerCase());
    const matchProf = filtroProfessor === 'todos' || p.professorId === filtroProfessor;
    const matchTurma = filtroTurma === 'todas' || p.turma === filtroTurma;
    const matchMes = filtroMes === 'todos' || p.mesAno === filtroMes;
    const matchStatus = filtroStatus === 'todos' || p.status === filtroStatus;
    return matchBusca && matchProf && matchTurma && matchMes && matchStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard titulo="Total de Planos" valor={totalPlanos} icone={FileText} />
          <StatCard titulo="Planos do Mês" valor={planosMesAtual} icone={Calendar} descricao="Mês atual" />
          <StatCard titulo="Professores Ativos" valor={professoresAtivos} icone={Users} />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Todos os Planos de Aula</h2>
            <p className="text-sm text-muted-foreground">Visualize os planos de todos os professores</p>
          </div>
          <Button onClick={() => navigate('/configuracoes')} className="gap-2 shrink-0">
            <Settings className="h-4 w-4" />
            Configurações
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filtroProfessor} onValueChange={setFiltroProfessor}>
            <SelectTrigger><SelectValue placeholder="Professor" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os professores</SelectItem>
              {professores.map(p => <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>)}
            </SelectContent>
          </Select>
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
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="rascunho">Rascunho</SelectItem>
              <SelectItem value="finalizado">Finalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : planosFiltrados.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="mx-auto h-12 w-12 mb-3 opacity-50" />
            <p className="font-medium">Nenhum plano encontrado</p>
            <p className="text-sm mt-1">Tente alterar os filtros de busca.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {planosFiltrados.map(plano => (
              <PlanoCard key={plano._id} plano={plano} mostrarProfessor />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardGestor;
