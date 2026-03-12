import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockGestorService } from '@/services/mockServices';
import { User } from '@/services/authService';
import { Disciplina } from '@/services/mockData';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function Configuracoes() {
  const navigate = useNavigate();
  const [professores, setProfessores] = useState<User[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        mockGestorService.listarProfessores(),
        mockGestorService.listarDisciplinas(),
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
      await mockGestorService.salvarProfessor(profEditando);
      toast.success('Professor salvo com sucesso!');
      setIsProfModalOpen(false);
      carregarDados();
    } catch {
      toast.error('Erro ao salvar professor.');
    }
  };

  const handleExcluirProf = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este professor?')) return;
    try {
      await mockGestorService.excluirProfessor(id);
      toast.success('Professor excluído!');
      carregarDados();
    } catch {
      toast.error('Erro ao excluir professor.');
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
      await mockGestorService.salvarDisciplina(discEditando as Disciplina);
      toast.success('Disciplina salva com sucesso!');
      setIsDiscModalOpen(false);
      carregarDados();
    } catch {
      toast.error('Erro ao salvar disciplina.');
    }
  };

  const handleExcluirDisc = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta disciplina?')) return;
    try {
      await mockGestorService.excluirDisciplina(id);
      toast.success('Disciplina excluída!');
      carregarDados();
    } catch {
      toast.error('Erro ao excluir disciplina.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
            <p className="text-muted-foreground">Gerencie os professores e as disciplinas da escola.</p>
          </div>
        </div>

        <Tabs defaultValue="professores">
          <TabsList className="mb-4">
            <TabsTrigger value="professores">Professores</TabsTrigger>
            <TabsTrigger value="disciplinas">Disciplinas</TabsTrigger>
          </TabsList>

          <TabsContent value="professores">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Corpo Docente</CardTitle>
                  <CardDescription>Gerencie os professores que têm acesso ao sistema.</CardDescription>
                </div>
                <Button onClick={() => { setProfEditando({}); setIsProfModalOpen(true); }}>
                  <Plus className="mr-2 h-4 w-4" /> Novo Professor
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-20 flex items-center justify-center">Carregando...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>E-mail</TableHead>
                        <TableHead>CPF</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {professores.map(p => (
                        <TableRow key={p.id}>
                          <TableCell className="font-medium">{p.nome}</TableCell>
                          <TableCell>{p.email}</TableCell>
                          <TableCell>{p.cpf || '-'}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => { setProfEditando(p); setIsProfModalOpen(true); }}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleExcluirProf(p.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {professores.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">Nenhum professor cadastrado.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="disciplinas">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Disciplinas</CardTitle>
                  <CardDescription>Cadastre as disciplinas e suas cargas horárias semanais.</CardDescription>
                </div>
                <Button onClick={() => { setDiscEditando({}); setIsDiscModalOpen(true); }}>
                  <Plus className="mr-2 h-4 w-4" /> Nova Disciplina
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-20 flex items-center justify-center">Carregando...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome da Disciplina</TableHead>
                        <TableHead>Carga Horária Semanal</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {disciplinas.map(d => (
                        <TableRow key={d.id}>
                          <TableCell className="font-medium">{d.nome}</TableCell>
                          <TableCell>{d.cargaHoraria} aulas</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => { setDiscEditando(d); setIsDiscModalOpen(true); }}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleExcluirDisc(d.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {disciplinas.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">Nenhuma disciplina cadastrada.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Modal Professor */}
      <Dialog open={isProfModalOpen} onOpenChange={setIsProfModalOpen}>
        <DialogContent>
          <form onSubmit={handleProfSubmit}>
            <DialogHeader>
              <DialogTitle>{profEditando?.id ? 'Editar Professor' : 'Novo Professor'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input required value={profEditando?.nome || ''} onChange={e => setProfEditando({ ...profEditando, nome: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input type="email" required value={profEditando?.email || ''} onChange={e => setProfEditando({ ...profEditando, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>CPF</Label>
                <Input value={profEditando?.cpf || ''} placeholder="000.000.000-00" onChange={e => setProfEditando({ ...profEditando, cpf: e.target.value })} />
              </div>
              {!profEditando?.id && (
                <div className="space-y-2">
                  <Label>Senha Temporária</Label>
                  <Input type="password" required={!profEditando?.id} value={profEditando?.senha || ''} onChange={e => setProfEditando({ ...profEditando, senha: e.target.value })} />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsProfModalOpen(false)}>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Disciplina */}
      <Dialog open={isDiscModalOpen} onOpenChange={setIsDiscModalOpen}>
        <DialogContent>
          <form onSubmit={handleDiscSubmit}>
            <DialogHeader>
              <DialogTitle>{discEditando?.id ? 'Editar Disciplina' : 'Nova Disciplina'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nome da Disciplina</Label>
                <Input required value={discEditando?.nome || ''} onChange={e => setDiscEditando({ ...discEditando, nome: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Carga Horária Semanal (aulas)</Label>
                <Input type="number" min="1" required value={discEditando?.cargaHoraria || ''} onChange={e => setDiscEditando({ ...discEditando, cargaHoraria: Number(e.target.value) })} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDiscModalOpen(false)}>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
