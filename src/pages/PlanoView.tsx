import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PlanoAula, planoService } from '@/services/planoService';
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
    planoService.buscarPorId(id)
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

        {/* Cabeçalho de Impressão (exclusivo para print) */}
        <div className="hidden print:block mb-4 -mt-6 text-center">
          <img src="/logo-escola.png" alt="Logo Escola" className="mx-auto mb-2 h-16 object-contain" />
          <div className="space-y-0 text-[10pt] font-semibold uppercase leading-tight">
            <p>Coordenadoria Regional de Desenvolvimento da Educação – CREDE 16</p>
            <p>Escola de Ensino Médio em Tempo Integral Filgueiras Lima – INEP: 23142804</p>
          </div>
          <h1 className="mt-2 text-[12pt] font-bold border-y-2 border-black py-1">
            PLANO DE AULA MENSAL
          </h1>
          
          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-left text-[10pt]">
            <div className="flex gap-2">
              <span className="font-bold">DISCIPLINA:</span>
              <span className="uppercase">{plano.disciplina}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold">SÉRIE:</span>
              <span className="uppercase">{plano.turma}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold">MÊS:</span>
              <span className="uppercase">{formatMesAno(plano.mesAno)}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold">PROFESSOR:</span>
              <span className="uppercase">{plano.professorNome}</span>
            </div>
          </div>
        </div>

        {/* Cabeçalho da Tela (escondido na impressão) */}
        <div className="mb-8 print:hidden">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">{plano.disciplina}</h2>
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
        <div className="space-y-3 mb-6 print:mb-4 print:space-y-2">
          {plano.objetivos && (
            <Card className="print:shadow-none print:border print:rounded-none">
              <CardHeader className="pb-1 pt-2 print:pt-1">
                <CardTitle className="text-base print:text-[11pt]">Objetivos</CardTitle>
              </CardHeader>
              <CardContent className="print:pb-1">
                <p className="text-sm print:text-[10pt] whitespace-pre-wrap">{plano.objetivos}</p>
              </CardContent>
            </Card>
          )}
          {plano.conteudo && (
            <Card className="print:shadow-none print:border print:rounded-none">
              <CardHeader className="pb-1 pt-2 print:pt-1">
                <CardTitle className="text-base print:text-[11pt]">Conteúdo Programático</CardTitle>
              </CardHeader>
              <CardContent className="print:pb-1">
                <p className="text-sm print:text-[10pt] whitespace-pre-wrap">{plano.conteudo}</p>
              </CardContent>
            </Card>
          )}
          {plano.avaliacao && (
            <Card className="print:shadow-none print:border print:rounded-none">
              <CardHeader className="pb-1 pt-2 print:pt-1">
                <CardTitle className="text-base print:text-[11pt]">Avaliação</CardTitle>
              </CardHeader>
              <CardContent className="print:pb-1">
                <p className="text-sm print:text-[10pt] whitespace-pre-wrap">{plano.avaliacao}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Semanas */}
        <h3 className="text-lg font-bold mb-4 print:text-[12pt] print:mb-2">Estrutura Semanal</h3>
        <div className="space-y-4 print:space-y-2">
          {plano.semanas.map((semana, index) => (
            <Card key={index} className="print:shadow-none print:border print:rounded-none print:break-inside-avoid">
              <CardHeader className="pb-1 pt-2 print:pt-1">
                <CardTitle className="text-base print:text-[11pt]">
                  Semana {semana.numero}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 print:space-y-1 print:pb-2">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 print:text-[8pt] print:mb-0">
                    Metodologia
                  </p>
                  <p className="text-sm print:text-[10pt] whitespace-pre-wrap">{semana.metodologia}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 print:text-[8pt] print:mb-0">
                    Recursos
                  </p>
                  <p className="text-sm print:text-[10pt] whitespace-pre-wrap">{semana.recursos}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Assinaturas e Rodapé de Impressão */}
        <div className="hidden print:block mt-8">
          {/* Espaço para Assinaturas */}
          <div className="grid grid-cols-2 gap-12 mb-8">
            <div className="text-center">
              <div className="border-t border-black pt-1 text-[10pt] font-medium">
                Assinatura do Professor
              </div>
            </div>
            <div className="text-center">
              <div className="border-t border-black pt-1 text-[10pt] font-medium">
                Assinatura da Coordenação
              </div>
            </div>
          </div>

          {/* Informações Institucionais - Posicionado no rodapé da página */}
          <div className="print:fixed print:bottom-4 print:left-0 print:right-0 pt-2 border-t border-black text-[8pt] text-center space-y-0.5 font-medium bg-white">
            <p>
              Rua Vereador Nelson de Sousa Alencar, sn – Veneza | Iguatu – Ceará | CEP: 63.504-356 - Fone: (88) 3581.9463
            </p>
            <p>
              E-mail: filgueiraslimacrede16@escola.ce.gov.br | Instagram: @filgueiraslimaiguatu
            </p>
            <p className="text-[7pt] italic">
              Documento gerado em {new Date().toLocaleDateString('pt-BR')} via SAGE
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlanoView;
