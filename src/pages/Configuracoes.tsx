import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/services/authService';
import { gestorService, Disciplina } from '@/services/gestorService';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Pencil, Trash2, ArrowLeft, Search, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Configuracoes() {
  const navigate = useNavigate();
  const [professores, setProfessores] = useState<User[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // States de Filtro
  const [buscaProf, setBuscaProf] = useState('');
  const [filtroStatusProf, setFiltroStatusProf] = useState('todos');
  const [buscaDisc, setBuscaDisc] = useState('');

  // States de Professor
  const [isProfModalOpen, setIsProfModalOpen] = useState(false);
  const [profEditando, setProfEditando] = useState<Partial<User & { senha?: string }> | null>(null);

  // States de Disciplina
  const [isDiscModalOpen, setIsDiscModalOpen] = useState(false);
  const [discEditando, setDiscEditando] = useState<Partial<Disciplina> | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setIsLoading(true);
    try {
      const [profs, discs] = await Promise.all([
        gestorService.listarProfessores(),
        gestorService.listarDisciplinas(),
      ]);
      setProfessores(profs);
      setDisciplinas(discs);
    } catch {
      toast.error('Erro ao carregar dados.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Funções Professor ---
  const handleProfSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profEditando?.nome || !profEditando?.email) {
      toast.error('Preencha os campos obrigatórios.');
      return;
    }
    try {
      await gestorService.salvarProfessor(profEditando);
      toast.success('Professor salvo com sucesso!');
      setIsProfModalOpen(false);
      carregarDados();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar professor.');
    }
  };

  const handleExcluirProf = async (id: string, statusAtual: string) => {
    const acao = statusAtual === 'ativo' ? 'inativar' : 'reativar';
    if (!window.confirm(`Tem certeza que deseja ${acao} este professor?`)) return;
    try {
      await gestorService.excluirProfessor(id);
      toast.success(`Professor ${statusAtual === 'ativo' ? 'inativado' : 'reativado'} com sucesso!`);
      carregarDados();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao alterar status do professor.');
    }
  };

  // --- Funções Disciplina ---
  const handleDiscSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!discEditando?.nome || !discEditando?.cargaHoraria) {
      toast.error('Preencha os campos obrigatórios.');
      return;
    }
    try {
      await gestorService.salvarDisciplina(discEditando);
      toast.success('Disciplina salva com sucesso!');
      setIsDiscModalOpen(false);
      carregarDados();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar disciplina.');
    }
  };

  const handleExcluirDisc = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja inativar ou excluir esta disciplina?')) return;
    try {
      await gestorService.excluirDisciplina(id);
      toast.success('Disciplina inativada/excluída!');
      carregarDados();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao excluir disciplina.');
    }
  };

  // --- Computed ---
  const profsFiltrados = professores.filter(p => {
    const busca = buscaProf.toLowerCase();
    const matchBusca = p.nome.toLowerCase().includes(busca) || 
                       p.email.toLowerCase().includes(busca) || 
                       (p.cpf && p.cpf.includes(busca));
    const matchStatus = filtroStatusProf === 'todos' || p.status === filtroStatusProf;
    return matchBusca && matchStatus;
  });

  const discFiltradas = disciplinas.filter(d => {
    const busca = buscaDisc.toLowerCase();
    return d.nome.toLowerCase().includes(busca) || 
           (d.codigo && d.codigo.toLowerCase().includes(busca));
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Configurações do Sistema</h2>
            <p className="text-muted-foreground">Gerencie os professores, disciplinas e vínculos da escola.</p>
          </div>
        </div>

        <Tabs defaultValue="professores">
          <TabsList className="mb-4">
            <TabsTrigger value="professores">Gestão de Professores</TabsTrigger>
            <TabsTrigger value="disciplinas">Gestão de Disciplinas</TabsTrigger>
          </TabsList>

          {/* ABA: PROFESSORES */}
          <TabsContent value="professores">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Corpo Docente</CardTitle>
                  <CardDescription>Adicionar, editar e gerenciar professores e vínculos.</CardDescription>
                </div>
                <Button onClick={() => { setProfEditando({ disciplinasLecionadas: [] }); setIsProfModalOpen(true); }}>
                  <Plus className="mr-2 h-4 w-4" /> Novo Professor
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar por nome, email ou CPF..." value={buscaProf} onChange={e => setBuscaProf(e.target.value)} className="pl-9" />
                  </div>
                  <Select value={filtroStatusProf} onValueChange={setFiltroStatusProf}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os Status</SelectItem>
                      <SelectItem value="ativo">Ativos</SelectItem>
                      <SelectItem value="inativo">Inativos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {isLoading ? (
                  <div className="h-20 flex items-center justify-center">Carregando...</div>
                ) : (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>E-mail & CPF</TableHead>
                          <TableHead>Vínculos (Disciplinas)</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {profsFiltrados.map(p => (
                          <TableRow key={p.id}>
                            <TableCell className="font-medium">{p.nome}</TableCell>
                            <TableCell>
                              <div className="text-sm">{p.email}</div>
                              <div className="text-xs text-muted-foreground">{p.cpf || 'Sem CPF'}</div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {p.disciplinasLecionadas?.length ? `${p.disciplinasLecionadas.length} atribuídas` : 'Nenhuma'}
                              </div>
                            </TableCell>
                            <TableCell>
                              {p.status === 'inativo' ? (
                                <Badge variant="secondary">Inativo</Badge>
                              ) : (
                                <Badge variant="default" className="bg-green-600 hover:bg-green-700">Ativo</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right space-x-2 whitespace-nowrap">
                              <Button variant="ghost" size="icon" onClick={() => { setProfEditando(p); setIsProfModalOpen(true); }} title="Editar Professor">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleExcluirProf(p.id, p.status || 'ativo')} title={p.status === 'ativo' ? 'Inativar Professor' : 'Reativar Professor'}>
                                {p.status === 'ativo' ? <XCircle className="h-4 w-4 text-destructive" /> : <CheckCircle className="h-4 w-4 text-green-600" />}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        {profsFiltrados.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">Nenhum professor encontrado com os filtros atuais.</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ABA: DISCIPLINAS */}
          <TabsContent value="disciplinas">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Gestão de Disciplinas</CardTitle>
                  <CardDescription>Cadastre disciplinas, códigos e suas cargas horárias semanais.</CardDescription>
                </div>
                <Button onClick={() => { setDiscEditando({}); setIsDiscModalOpen(true); }}>
                  <Plus className="mr-2 h-4 w-4" /> Nova Disciplina
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar por nome ou código..." value={buscaDisc} onChange={e => setBuscaDisc(e.target.value)} className="pl-9" />
                </div>

                {isLoading ? (
                  <div className="h-20 flex items-center justify-center">Carregando...</div>
                ) : (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cor</TableHead>
                          <TableHead>Disciplina & Código</TableHead>
                          <TableHead>Série</TableHead>
                          <TableHead>Carga Horária Semanal</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {discFiltradas.map(d => (
                          <TableRow key={d.id} className={d.status === 'inativa' ? 'opacity-50' : ''}>
                            <TableCell>
                              <div className="w-6 h-6 rounded-full" style={{ backgroundColor: d.cor || '#3b82f6' }} />
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{d.nome}</div>
                              <div className="text-xs text-muted-foreground">{d.codigo || 'S/ Código'}</div>
                            </TableCell>
                            <TableCell>{d.serie}</TableCell>
                            <TableCell>{d.cargaHoraria} aulas</TableCell>
                            <TableCell>
                              {d.status === 'inativa' ? <Badge variant="secondary">Inativa</Badge> : <Badge variant="outline">Ativa</Badge>}
                            </TableCell>
                            <TableCell className="text-right space-x-2 whitespace-nowrap">
                              <Button variant="ghost" size="icon" onClick={() => { setDiscEditando(d); setIsDiscModalOpen(true); }}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleExcluirDisc(d.id)} disabled={d.status === 'inativa'}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        {discFiltradas.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">Nenhuma disciplina cadastrada.</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* MODAL: PROFESSOR */}
      <Dialog open={isProfModalOpen} onOpenChange={setIsProfModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleProfSubmit}>
            <DialogHeader>
              <DialogTitle>{profEditando?.id ? 'Editar Professor' : 'Novo Professor'}</DialogTitle>
              <DialogDescription>
                Os professores utilizam o e-mail como login de acesso.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              <div className="space-y-2 col-span-2">
                <Label>Nome Completo</Label>
                <Input required value={profEditando?.nome || ''} onChange={e => setProfEditando({ ...profEditando, nome: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input type="email" required value={profEditando?.email || ''} onChange={e => setProfEditando({ ...profEditando, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>CPF</Label>
                <Input 
                  value={profEditando?.cpf || ''} 
                  placeholder="000.000.000-00" 
                  onChange={e => {
                    let v = e.target.value.replace(/\D/g, '');
                    if (v.length > 11) v = v.substring(0, 11);
                    v = v.replace(/(\d{3})(\d)/, '$1.$2');
                    v = v.replace(/(\d{3})(\d)/, '$1.$2');
                    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                    setProfEditando({ ...profEditando, cpf: v })
                  }} 
                />
              </div>
              {!profEditando?.id && (
                <div className="space-y-2 col-span-2">
                  <Label>Senha Inicial (Temporária)</Label>
                  <Input type="password" required={!profEditando?.id} value={profEditando?.senha || ''} onChange={e => setProfEditando({ ...profEditando, senha: e.target.value })} />
                </div>
              )}
              <div className="space-y-2 col-span-2 pt-4 border-t">
                <Label className="text-base font-semibold">Vínculos de Disciplina</Label>
                <p className="text-xs text-muted-foreground mb-4">Escolha as disciplinas que este professor leciona na escola.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[200px] overflow-y-auto p-1">
                  {disciplinas.filter(d => d.status === 'ativa').map(d => (
                    <div key={d.id} className="flex items-start space-x-2">
                      <Checkbox 
                        id={`disc-${d.id}`} 
                        checked={profEditando?.disciplinasLecionadas?.includes(d.id)}
                        onCheckedChange={(checked) => {
                          const atual = profEditando?.disciplinasLecionadas || [];
                          if (checked) {
                            setProfEditando({ ...profEditando, disciplinasLecionadas: [...atual, d.id] });
                          } else {
                            setProfEditando({ ...profEditando, disciplinasLecionadas: atual.filter(id => id !== d.id) });
                          }
                        }}
                      />
                      <Label htmlFor={`disc-${d.id}`} className="text-sm font-normal leading-tight cursor-pointer">
                        <span className="font-medium">{d.nome}</span> <span className="text-muted-foreground">({d.serie})</span>
                        <br />
                        <span className="text-xs text-muted-foreground">{d.cargaHoraria} aulas/sem</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsProfModalOpen(false)}>Cancelar</Button>
              <Button type="submit">Salvar Professor</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL: DISCIPLINA */}
      <Dialog open={isDiscModalOpen} onOpenChange={setIsDiscModalOpen}>
        <DialogContent>
          <form onSubmit={handleDiscSubmit}>
            <DialogHeader>
              <DialogTitle>{discEditando?.id ? 'Editar Disciplina' : 'Nova Disciplina'}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              <div className="space-y-2 col-span-2">
                <Label>Nome da Disciplina</Label>
                <Input required value={discEditando?.nome || ''} onChange={e => setDiscEditando({ ...discEditando, nome: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Código (Opcional)</Label>
                <Input placeholder="Ex: MAT01" value={discEditando?.codigo || ''} onChange={e => setDiscEditando({ ...discEditando, codigo: e.target.value.toUpperCase() })} />
              </div>
              <div className="space-y-2">
                <Label>Cor de Identificação</Label>
                <div className="flex gap-2">
                  <Input type="color" className="w-14 p-1 h-10" value={discEditando?.cor || '#3b82f6'} onChange={e => setDiscEditando({ ...discEditando, cor: e.target.value })} />
                  <Input type="text" className="flex-1" readOnly value={discEditando?.cor || '#3b82f6'} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Série do Ensino Médio</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={discEditando?.serie || '1ª Série'} 
                  onChange={e => setDiscEditando({ ...discEditando, serie: e.target.value })}
                >
                  <option value="1ª Série">1ª Série</option>
                  <option value="2ª Série">2ª Série</option>
                  <option value="3ª Série">3ª Série</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Carga Horária Semanal (aulas)</Label>
                <Input type="number" min="1" max="20" required value={discEditando?.cargaHoraria || ''} onChange={e => setDiscEditando({ ...discEditando, cargaHoraria: Number(e.target.value) })} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDiscModalOpen(false)}>Cancelar</Button>
              <Button type="submit">Salvar Disciplina</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
