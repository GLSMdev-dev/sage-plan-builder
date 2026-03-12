import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { mockPlanoService, mockGestorService } from '@/services/mockServices';
import { PlanoAula } from '@/services/planoService';
import { Disciplina } from '@/services/mockData';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Save, Check, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const TURMAS = [
  '1ª Série', '2ª Série', '3ª Série'
];

const MESES = [
  { value: '01', label: 'Janeiro' }, { value: '02', label: 'Fevereiro' },
  { value: '03', label: 'Março' }, { value: '04', label: 'Abril' },
  { value: '05', label: 'Maio' }, { value: '06', label: 'Junho' },
  { value: '07', label: 'Julho' }, { value: '08', label: 'Agosto' },
  { value: '09', label: 'Setembro' }, { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' }, { value: '12', label: 'Dezembro' },
];

interface SemanaForm {
  numero: number;
  metodologia: string;
  recursos: string;
}

const PlanoForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [minhasDisciplinas, setMinhasDisciplinas] = useState<Disciplina[]>([]);
  const [disciplina, setDisciplina] = useState('');
  const [turma, setTurma] = useState('');
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState(String(new Date().getFullYear()));
  const [objetivos, setObjetivos] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [avaliacao, setAvaliacao] = useState('');
  const [semanas, setSemanas] = useState<SemanaForm[]>([
    { numero: 1, metodologia: '', recursos: '' },
  ]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    mockGestorService.listarDisciplinas().then(todas => {
      if (usuario?.disciplinasLecionadas) {
        const dProf = todas.filter(d => usuario.disciplinasLecionadas?.includes(d.id));
        setMinhasDisciplinas(dProf);
      }
    });
  }, [usuario]);

  // Carregar plano para edição
  useEffect(() => {
    if (isEditing) {
      setIsLoading(true);
      mockPlanoService.buscarPorId(id).then(plano => {
        if (plano.professorId !== usuario?.id) {
          toast.error('Você não tem permissão para editar este plano.');
          navigate('/dashboard');
          return;
        }
        setDisciplina(plano.disciplina);
        setTurma(plano.turma);
        const [a, m] = plano.mesAno.split('-');
        setAno(a);
        setMes(m);
        setObjetivos(plano.objetivos);
        setConteudo(plano.conteudo);
        setAvaliacao(plano.avaliacao);
        setSemanas(plano.semanas);
      }).catch(() => {
        toast.error('Plano não encontrado.');
        navigate('/dashboard');
      }).finally(() => setIsLoading(false));
    }
  }, [id]);

  // Auto-save no localStorage
  useEffect(() => {
    if (!isEditing && hasChanges) {
      const draft = { disciplina, turma, mes, ano, objetivos, conteudo, avaliacao, semanas };
      localStorage.setItem('sage_draft', JSON.stringify(draft));
    }
  }, [disciplina, turma, mes, ano, objetivos, conteudo, avaliacao, semanas, hasChanges]);

  // Recuperar rascunho
  useEffect(() => {
    if (!isEditing) {
      const draft = localStorage.getItem('sage_draft');
      if (draft) {
        try {
          const d = JSON.parse(draft);
          setDisciplina(d.disciplina || '');
          setTurma(d.turma || '');
          setMes(d.mes || '');
          setAno(d.ano || String(new Date().getFullYear()));
          setObjetivos(d.objetivos || '');
          setConteudo(d.conteudo || '');
          setAvaliacao(d.avaliacao || '');
          if (d.semanas?.length) setSemanas(d.semanas);
        } catch { /* ignore */ }
      }
    }
  }, [isEditing]);

  // Aviso ao sair
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasChanges]);

  const markChanged = () => setHasChanges(true);

  const addSemana = () => {
    if (semanas.length >= 5) {
      toast.error('Máximo de 5 semanas por plano.');
      return;
    }
    setSemanas(prev => [...prev, { numero: prev.length + 1, metodologia: '', recursos: '' }]);
    markChanged();
  };

  const removeSemana = (index: number) => {
    if (semanas.length <= 1) {
      toast.error('O plano deve ter pelo menos 1 semana.');
      return;
    }
    setSemanas(prev => prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, numero: i + 1 })));
    markChanged();
  };

  const updateSemana = (index: number, field: keyof SemanaForm, value: string) => {
    setSemanas(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
    markChanged();
  };

  const validate = (finalizar: boolean): boolean => {
    if (!disciplina.trim()) { toast.error('Informe a disciplina.'); return false; }
    if (!turma) { toast.error('Selecione a turma.'); return false; }
    if (!mes) { toast.error('Selecione o mês.'); return false; }
    if (!ano || isNaN(Number(ano))) { toast.error('Informe o ano.'); return false; }
    if (finalizar) {
      if (!objetivos.trim()) { toast.error('Informe os objetivos.'); return false; }
      if (!conteudo.trim()) { toast.error('Informe o conteúdo.'); return false; }
      if (!avaliacao.trim()) { toast.error('Informe a avaliação.'); return false; }
      for (let i = 0; i < semanas.length; i++) {
        if (!semanas[i].metodologia.trim()) {
          toast.error(`Informe a metodologia da Semana ${i + 1}.`);
          return false;
        }
        if (!semanas[i].recursos.trim()) {
          toast.error(`Informe os recursos da Semana ${i + 1}.`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSave = async (status: 'rascunho' | 'finalizado') => {
    const finalizar = status === 'finalizado';
    if (!validate(finalizar)) return;

    setIsSaving(true);
    const mesAno = `${ano}-${mes}`;
    const planoData = {
      professorId: usuario!.id,
      professorNome: usuario!.nome,
      disciplina: disciplina.trim(),
      turma,
      mesAno,
      objetivos: objetivos.trim(),
      conteudo: conteudo.trim(),
      avaliacao: avaliacao.trim(),
      semanas,
      status,
    };

    try {
      let saved: PlanoAula;
      if (isEditing) {
        saved = await mockPlanoService.atualizar(id, planoData);
        toast.success('Plano atualizado com sucesso!');
      } else {
        saved = await mockPlanoService.criar(planoData);
        localStorage.removeItem('sage_draft');
        toast.success('Plano criado com sucesso!');
      }
      setHasChanges(false);
      navigate(`/planos/${saved._id}`);
    } catch {
      toast.error('Erro ao salvar plano.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl sm:text-2xl font-bold">
            {isEditing ? 'Editar Plano de Aula' : 'Novo Plano de Aula'}
          </h2>
        </div>

        {/* Seção 1 - Informações Básicas */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="disciplina">Disciplina *</Label>
              <Select value={disciplina} onValueChange={v => { setDisciplina(v); markChanged(); }}>
                <SelectTrigger><SelectValue placeholder={minhasDisciplinas.length ? "Selecione a Disciplina" : "Nenhuma disciplina atribuída"} /></SelectTrigger>
                <SelectContent>
                  {minhasDisciplinas.map(d => (
                    <SelectItem key={d.id} value={d.nome}>{d.nome} - {d.cargaHoraria} aulas/sem</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                A disciplina precisará ser atribuída a você pelo Gestor na tela de Configurações, caso não apareça nesta lista.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Turma *</Label>
                <Select value={turma} onValueChange={v => { setTurma(v); markChanged(); }}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {TURMAS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Mês *</Label>
                <Select value={mes} onValueChange={v => { setMes(v); markChanged(); }}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {MESES.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ano">Ano *</Label>
                <Input
                  id="ano"
                  type="number"
                  value={ano}
                  onChange={e => { setAno(e.target.value); markChanged(); }}
                  min={2020}
                  max={2030}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="objetivos">Objetivos</Label>
              <Textarea
                id="objetivos"
                placeholder="Descreva os objetivos de aprendizagem do mês..."
                value={objetivos}
                onChange={e => { setObjetivos(e.target.value); markChanged(); }}
                rows={3}
                maxLength={2000}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="conteudo">Conteúdo</Label>
              <Textarea
                id="conteudo"
                placeholder="Descreva o conteúdo programático do mês..."
                value={conteudo}
                onChange={e => { setConteudo(e.target.value); markChanged(); }}
                rows={3}
                maxLength={2000}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avaliacao">Avaliação</Label>
              <Textarea
                id="avaliacao"
                placeholder="Descreva os métodos de avaliação..."
                value={avaliacao}
                onChange={e => { setAvaliacao(e.target.value); markChanged(); }}
                rows={3}
                maxLength={2000}
              />
            </div>
          </CardContent>
        </Card>

        {/* Seção 2 - Semanas */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Estrutura Semanal — Metodologia e Recursos</CardTitle>
            <Button variant="outline" size="sm" onClick={addSemana} disabled={semanas.length >= 5}>
              <Plus className="mr-1 h-4 w-4" />
              Semana
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {semanas.map((semana, index) => (
              <div key={index} className="rounded-lg border p-4 relative">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-sm">Semana {semana.numero}</h4>
                  {semanas.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => removeSemana(index)}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Metodologia *</Label>
                    <Textarea
                      placeholder="Descreva a metodologia desta semana..."
                      value={semana.metodologia}
                      onChange={e => updateSemana(index, 'metodologia', e.target.value)}
                      rows={3}
                      maxLength={2000}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Recursos *</Label>
                    <Textarea
                      placeholder="Liste os recursos necessários..."
                      value={semana.recursos}
                      onChange={e => updateSemana(index, 'recursos', e.target.value)}
                      rows={2}
                      maxLength={1000}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button variant="outline" onClick={() => navigate('/dashboard')} disabled={isSaving}>
            Cancelar
          </Button>
          <Button variant="secondary" onClick={() => handleSave('rascunho')} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Salvando...' : 'Salvar Rascunho'}
          </Button>
          <Button onClick={() => handleSave('finalizado')} disabled={isSaving}>
            <Check className="mr-2 h-4 w-4" />
            {isSaving ? 'Salvando...' : 'Finalizar Plano'}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default PlanoForm;
