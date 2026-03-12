import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PlanoAula } from '@/services/planoService';
import { mockPlanoService } from '@/services/mockServices';
import { formatMesAno, formatDate } from '@/utils/formatters';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Pencil, Printer } from 'lucide-react';
import { toast } from 'sonner';

const PlanoView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [plano, setPlano] = useState<PlanoAula | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    mockPlanoService.buscarPorId(id)
      .then(setPlano)
      .catch(() => {
        toast.error('Plano não encontrado.');
        navigate('/dashboard');
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  // Auto-print se parâmetro print=true
  useEffect(() => {
    if (plano && searchParams.get('print') === 'true') {
      setTimeout(() => window.print(), 500);
    }
  }, [plano, searchParams]);

  const isProfessorDono = usuario?.perfil === 'professor' && usuario.id === plano?.professorId;
  const isGestor = usuario?.perfil === 'gestor';

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

  if (!plano) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-8">
        {/* Ações (escondidas na impressão) */}
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div className="flex gap-2">
            {isProfessorDono && (
              <Button onClick={() => navigate(`/planos/${plano._id}/editar`)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </Button>
            )}
            {(isGestor || isProfessorDono) && (
              <Button variant="outline" onClick={() => window.print()}>
                <Printer className="mr-2 h-4 w-4" />
                Imprimir
              </Button>
            )}
          </div>
        </div>

        {/* Cabeçalho do plano */}
        <div className="mb-8 print:mb-6">
          <div className="print:text-center print:mb-4">
            <h1 className="hidden print:block text-lg font-bold mb-1">
              EEMTI Filgueiras Lima — SAGE
            </h1>
            <p className="hidden print:block text-sm mb-4">Plano de Aula Mensal</p>
          </div>
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold print:text-xl">{plano.disciplina}</h2>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span>{plano.turma}</span>
                <span>•</span>
                <span>{formatMesAno(plano.mesAno)}</span>
                <span>•</span>
                <span>Prof. {plano.professorNome}</span>
              </div>
            </div>
            <Badge
              variant={plano.status === 'finalizado' ? 'default' : 'secondary'}
              className="print:hidden"
            >
              {plano.status === 'finalizado' ? 'Finalizado' : 'Rascunho'}
            </Badge>
          </div>
          {plano.atualizadoEm && (
            <p className="mt-2 text-xs text-muted-foreground">
              Última atualização: {formatDate(plano.atualizadoEm)}
            </p>
          )}
        </div>

        {/* Informações do plano */}
        <div className="space-y-4 mb-8 print:mb-6">
          {plano.objetivos && (
            <Card className="print:shadow-none print:border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Objetivos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{plano.objetivos}</p>
              </CardContent>
            </Card>
          )}
          {plano.conteudo && (
            <Card className="print:shadow-none print:border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Conteúdo Programático</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{plano.conteudo}</p>
              </CardContent>
            </Card>
          )}
          {plano.avaliacao && (
            <Card className="print:shadow-none print:border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Avaliação</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{plano.avaliacao}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Semanas */}
        <h3 className="text-lg font-bold mb-4">Estrutura Semanal</h3>
        <div className="space-y-4">
          {plano.semanas.map((semana, index) => (
            <Card key={index} className="print:shadow-none print:border print:break-inside-avoid">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  Semana {semana.numero}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                    Metodologia
                  </p>
                  <p className="text-sm whitespace-pre-wrap">{semana.metodologia}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                    Recursos
                  </p>
                  <p className="text-sm whitespace-pre-wrap">{semana.recursos}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Rodapé de impressão */}
        <div className="hidden print:block mt-8 pt-4 border-t text-xs text-muted-foreground text-center">
          <p>Impresso em {new Date().toLocaleDateString('pt-BR')} — SAGE • EEMTI Filgueiras Lima</p>
        </div>
      </main>
    </div>
  );
};

export default PlanoView;
