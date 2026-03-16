import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PlanoAula, planoService } from '@/services/planoService';
import { gestorService, Disciplina } from '@/services/gestorService';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Check, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const MESES = [
  { value: '01', label: 'Janeiro' }, { value: '02', label: 'Fevereiro' },
  { value: '03', label: 'Março' }, { value: '04', label: 'Abril' },
  { value: '05', label: 'Maio' }, { value: '06', label: 'Junho' },
  { value: '07', label: 'Julho' }, { value: '08', label: 'Agosto' },
  { value: '09', label: 'Setembro' }, { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' }, { value: '12', label: 'Dezembro' },
];

const PlanoForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [minhasDisciplinas, setMinhasDisciplinas] = useState<Disciplina[]>([]);

  // 1. Identificação
  const [disciplina, setDisciplina] = useState('');
  const [turma, setTurma] = useState('');
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState(String(new Date().getFullYear()));
  const [tema, setTema] = useState('');
  const [qtdAulas, setQtdAulas] = useState('');

  // 2-7. Conteúdo do plano
  const [objetivos, setObjetivos] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [metodologiaAbertura, setMetodologiaAbertura] = useState('');
  const [metodologiaDesenvolvimento, setMetodologiaDesenvolvimento] = useState('');
  const [metodologiaFechamento, setMetodologiaFechamento] = useState('');
  const [recursos, setRecursos] = useState('');
  const [avaliacao, setAvaliacao] = useState('');
  const [referencias, setReferencias] = useState('');

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    gestorService.listarDisciplinas().then(todas => {
      if (usuario?.disciplinasLecionadas) {
        const dProf = todas.filter(d => usuario.disciplinasLecionadas?.includes(String(d.id)));
        setMinhasDisciplinas(dProf);
      }
    });
  }, [usuario]);

  useEffect(() => {
    if (isEditing) {
      setIsLoading(true);
      planoService.buscarPorId(id).then(plano => {
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
        setTema(plano.tema || '');
        setQtdAulas(plano.qtdAulas || '');
        setObjetivos(plano.objetivos);
        setConteudo(plano.conteudo);
        setMetodologiaAbertura(plano.metodologiaAbertura || '');
        setMetodologiaDesenvolvimento(plano.metodologiaDesenvolvimento || '');
        setMetodologiaFechamento(plano.metodologiaFechamento || '');
        setRecursos(plano.recursos || '');
        setAvaliacao(plano.avaliacao);
        setReferencias(plano.referencias || '');
      }).catch(() => {
        toast.error('Plano não encontrado.');
        navigate('/dashboard');
      }).finally(() => setIsLoading(false));
    }
  }, [id]);

  // Auto-save draft
  useEffect(() => {
    if (!isEditing && hasChanges) {
      const draft = { disciplina, turma, mes, ano, tema, qtdAulas, objetivos, conteudo, metodologiaAbertura, metodologiaDesenvolvimento, metodologiaFechamento, recursos, avaliacao, referencias };
      localStorage.setItem('sage_draft', JSON.stringify(draft));
    }
  }, [disciplina, turma, mes, ano, tema, qtdAulas, objetivos, conteudo, metodologiaAbertura, metodologiaDesenvolvimento, metodologiaFechamento, recursos, avaliacao, referencias, hasChanges]);

  // Recover draft
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
          setTema(d.tema || '');
          setQtdAulas(d.qtdAulas || '');
          setObjetivos(d.objetivos || '');
          setConteudo(d.conteudo || '');
          setMetodologiaAbertura(d.metodologiaAbertura || '');
          setMetodologiaDesenvolvimento(d.metodologiaDesenvolvimento || '');
          setMetodologiaFechamento(d.metodologiaFechamento || '');
          setRecursos(d.recursos || '');
          setAvaliacao(d.avaliacao || '');
          setReferencias(d.referencias || '');
        } catch { /* ignore */ }
      }
    }
  }, [isEditing]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasChanges) { e.preventDefault(); e.returnValue = ''; }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasChanges]);

  const markChanged = () => setHasChanges(true);

  const validate = (finalizar: boolean): boolean => {
    if (!disciplina.trim()) { toast.error('Informe o componente curricular.'); return false; }
    if (!turma) { toast.error('Selecione a série/turma.'); return false; }
    if (!mes) { toast.error('Selecione o mês.'); return false; }
    if (!ano || isNaN(Number(ano))) { toast.error('Informe o ano.'); return false; }
    if (finalizar) {
      if (!tema.trim()) { toast.error('Informe o tema da aula.'); return false; }
      if (!qtdAulas.trim()) { toast.error('Informe a quantidade de aulas.'); return false; }
      if (!objetivos.trim()) { toast.error('Informe os objetivos.'); return false; }
      if (!conteudo.trim()) { toast.error('Informe o conteúdo programático.'); return false; }
      if (!metodologiaAbertura.trim()) { toast.error('Informe a metodologia de abertura.'); return false; }
      if (!metodologiaDesenvolvimento.trim()) { toast.error('Informe a metodologia de desenvolvimento.'); return false; }
      if (!metodologiaFechamento.trim()) { toast.error('Informe a metodologia de fechamento.'); return false; }
      if (!recursos.trim()) { toast.error('Informe os recursos didáticos.'); return false; }
      if (!avaliacao.trim()) { toast.error('Informe a avaliação.'); return false; }
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
      tema: tema.trim(),
      qtdAulas: qtdAulas.trim(),
      objetivos: objetivos.trim(),
      conteudo: conteudo.trim(),
      metodologiaAbertura: metodologiaAbertura.trim(),
      metodologiaDesenvolvimento: metodologiaDesenvolvimento.trim(),
      metodologiaFechamento: metodologiaFechamento.trim(),
      recursos: recursos.trim(),
      avaliacao: avaliacao.trim(),
      referencias: referencias.trim(),
      status,
    };

    try {
      let saved: PlanoAula;
      if (isEditing) {
        saved = await planoService.atualizar(id, planoData);
        toast.success('Plano atualizado com sucesso!');
      } else {
        saved = await planoService.criar(planoData);
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

  const seriesDisponiveis = [...new Set(minhasDisciplinas.map(d => d.serie))].sort();
  const disciplinasFiltradas = minhasDisciplinas.filter(d => d.serie === turma || d.serie === 'Todas');

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

        {/* 1. Identificação da Aula */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">1. Identificação da Aula</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Série / Turma(s) *</Label>
                <Select value={turma} onValueChange={v => { setTurma(v); setDisciplina(''); markChanged(); }}>
                  <SelectTrigger><SelectValue placeholder={seriesDisponiveis.length ? "Selecione a Série" : "Nenhuma série disponível"} /></SelectTrigger>
                  <SelectContent>
                    {seriesDisponiveis.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Componente Curricular *</Label>
                <Select value={disciplina} onValueChange={v => { setDisciplina(v); markChanged(); }} disabled={!turma}>
                  <SelectTrigger><SelectValue placeholder={!turma ? "Aguardando Série..." : (disciplinasFiltradas.length ? "Selecione" : "Sem disciplinas")} /></SelectTrigger>
                  <SelectContent>
                    {disciplinasFiltradas.map(d => (
                      <SelectItem key={d.id} value={d.nome}>{d.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mês *</Label>
                <Select value={mes} onValueChange={v => { setMes(v); markChanged(); }}>
                  <SelectTrigger><SelectValue placeholder="Selecione o Mês" /></SelectTrigger>
                  <SelectContent>
                    {MESES.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Ano *</Label>
                <Input type="number" value={ano} onChange={e => { setAno(e.target.value); markChanged(); }} min={2020} max={2030} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Qtd. de Aulas / Tempo Total *</Label>
              <Input
                placeholder="Ex.: 08 aulas / 400 minutos"
                value={qtdAulas}
                onChange={e => { setQtdAulas(e.target.value); markChanged(); }}
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label>Tema da Aula *</Label>
              <Input
                placeholder="Título claro e objetivo da aula"
                value={tema}
                onChange={e => { setTema(e.target.value); markChanged(); }}
                maxLength={500}
              />
            </div>
          </CardContent>
        </Card>

        {/* 2. Objetivos da Aula */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">2. Objetivos da Aula</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="O que se espera que os alunos aprendam ou desenvolvam ao final da aula..."
              value={objetivos}
              onChange={e => { setObjetivos(e.target.value); markChanged(); }}
              rows={4}
              maxLength={2000}
            />
          </CardContent>
        </Card>

        {/* 3. Conteúdo(s) Programático(s) */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">3. Conteúdo(s) Programático(s)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Conceitos ou temas que serão abordados durante a aula (um por linha)..."
              value={conteudo}
              onChange={e => { setConteudo(e.target.value); markChanged(); }}
              rows={4}
              maxLength={2000}
            />
          </CardContent>
        </Card>

        {/* 4. Metodologia */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">4. Metodologia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="font-semibold">Abertura</Label>
              <Textarea
                placeholder="Ex.: Roda de conversa, pergunta disparadora..."
                value={metodologiaAbertura}
                onChange={e => { setMetodologiaAbertura(e.target.value); markChanged(); }}
                rows={3}
                maxLength={2000}
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Desenvolvimento</Label>
              <Textarea
                placeholder="Ex.: Exposição dialogada, atividade prática em duplas, resolução de problemas..."
                value={metodologiaDesenvolvimento}
                onChange={e => { setMetodologiaDesenvolvimento(e.target.value); markChanged(); }}
                rows={4}
                maxLength={2000}
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Fechamento</Label>
              <Textarea
                placeholder="Ex.: Socialização das respostas, síntese dos conceitos, proposta de atividade..."
                value={metodologiaFechamento}
                onChange={e => { setMetodologiaFechamento(e.target.value); markChanged(); }}
                rows={3}
                maxLength={2000}
              />
            </div>
          </CardContent>
        </Card>

        {/* 5. Recursos Didáticos */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">5. Recursos Didáticos</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Materiais e tecnologias utilizadas (um por linha)..."
              value={recursos}
              onChange={e => { setRecursos(e.target.value); markChanged(); }}
              rows={4}
              maxLength={2000}
            />
          </CardContent>
        </Card>

        {/* 6. Avaliação */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">6. Avaliação</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Como será verificado se os alunos alcançaram os objetivos (formativa, processual, registro)..."
              value={avaliacao}
              onChange={e => { setAvaliacao(e.target.value); markChanged(); }}
              rows={4}
              maxLength={2000}
            />
          </CardContent>
        </Card>

        {/* 7. Referências */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">7. Referências</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Fontes consultadas para a elaboração da aula (BNCC, livro didático, sites...)..."
              value={referencias}
              onChange={e => { setReferencias(e.target.value); markChanged(); }}
              rows={3}
              maxLength={2000}
            />
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
