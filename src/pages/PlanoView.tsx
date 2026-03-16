import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PlanoAula, planoService } from '@/services/planoService';
import { formatMesAno } from '@/utils/formatters';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Pencil, Printer } from 'lucide-react';
import { toast } from 'sonner';

const Section: React.FC<{ number: number; title: string; children: React.ReactNode }> = ({ number, title, children }) => (
  <div className="mb-4 print:mb-2 print:break-inside-avoid">
    <h4 className="text-base font-bold print:text-[9pt] print:leading-tight mb-1 border-b border-muted pb-1 print:border-black">
      {number}. {title}
    </h4>
    <div className="text-sm print:text-[9pt] whitespace-pre-wrap">{children}</div>
  </div>
);

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
      .catch(() => { toast.error('Plano não encontrado.'); navigate('/dashboard'); })
      .finally(() => setIsLoading(false));
  }, [id]);

  useEffect(() => {
    if (plano && searchParams.get('print') === 'true') setTimeout(() => window.print(), 500);
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
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-8 print:px-0 print:py-0 print:max-w-none">
        {/* Ações */}
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
          <div className="flex gap-2">
            {isProfessorDono && (
              <Button onClick={() => navigate(`/planos/${plano._id}/editar`)}>
                <Pencil className="mr-2 h-4 w-4" /> Editar
              </Button>
            )}
            {(isGestor || isProfessorDono) && (
              <Button variant="outline" onClick={() => window.print()}>
                <Printer className="mr-2 h-4 w-4" /> Imprimir
              </Button>
            )}
          </div>
        </div>

        {/* Cabeçalho Institucional */}
        <div className="mb-6 pt-4 text-center border-b pb-4 print:border-none print:pt-4">
          <img src="/logo-escola.png" alt="Logo Escola" className="w-full h-auto max-h-20 object-contain mx-auto mb-2" />
          <div className="space-y-0 text-[8pt] font-semibold uppercase leading-tight text-muted-foreground print:text-black">
            <p>Coordenadoria Regional de Desenvolvimento da Educação – CREDE 16</p>
            <p>Escola de Ensino Médio em Tempo Integral Filgueiras Lima – INEP: 23142804</p>
          </div>
          <h1 className="mt-2 text-[10pt] font-bold border-y-2 border-black py-1 print:text-[8pt] print:py-0.5">
            PLANO DE AULA MENSAL
          </h1>
        </div>

        {/* Status */}
        <div className="mb-6 flex justify-end print:hidden">
          <Badge variant={plano.status === 'finalizado' ? 'default' : 'secondary'}>
            {plano.status === 'finalizado' ? 'Finalizado' : 'Rascunho'}
          </Badge>
        </div>

        {/* 1. Identificação */}
        <Section number={1} title="Identificação da Aula">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm print:text-[8pt]">
            <div className="flex gap-1">
              <span className="font-bold whitespace-nowrap">Componente Curricular:</span>
              <span className="uppercase">{plano.disciplina}</span>
            </div>
            <div className="flex gap-1">
              <span className="font-bold whitespace-nowrap">Série/Turma(s):</span>
              <span className="uppercase">{plano.turma}</span>
            </div>
            <div className="flex gap-1">
              <span className="font-bold whitespace-nowrap">Mês/Ano:</span>
              <span className="uppercase">{formatMesAno(plano.mesAno)}</span>
            </div>
            <div className="flex gap-1">
              <span className="font-bold whitespace-nowrap">Professor(a):</span>
              <span className="uppercase">{plano.professorNome}</span>
            </div>
            {plano.qtdAulas && (
              <div className="flex gap-1">
                <span className="font-bold whitespace-nowrap">Qtd. Aulas / Tempo:</span>
                <span>{plano.qtdAulas}</span>
              </div>
            )}
            {plano.tema && (
              <div className="flex gap-1 col-span-2">
                <span className="font-bold whitespace-nowrap">Tema da Aula:</span>
                <span>{plano.tema}</span>
              </div>
            )}
          </div>
        </Section>

        {/* 2. Objetivos */}
        {plano.objetivos && <Section number={2} title="Objetivos da Aula">{plano.objetivos}</Section>}

        {/* 3. Conteúdo */}
        {plano.conteudo && <Section number={3} title="Conteúdo(s) Programático(s)">{plano.conteudo}</Section>}

        {/* 4. Metodologia — Semanal */}
        {plano.semanas.length > 0 && (
          <Section number={4} title="Metodologia">
            <div className="space-y-4">
              {plano.semanas.map((semana, index) => (
                <div key={index} className="rounded-lg border p-3 print:border-black print:p-2 print:break-inside-avoid">
                  <h5 className="font-bold text-sm mb-2 print:text-[8pt]">Semana {semana.numero}</h5>
                  <div className="space-y-2">
                    {semana.abertura && (
                      <div>
                        <p className="font-semibold text-xs uppercase tracking-wide text-muted-foreground print:text-black mb-0.5">Abertura</p>
                        <p>{semana.abertura}</p>
                      </div>
                    )}
                    {semana.desenvolvimento && (
                      <div>
                        <p className="font-semibold text-xs uppercase tracking-wide text-muted-foreground print:text-black mb-0.5">Desenvolvimento</p>
                        <p>{semana.desenvolvimento}</p>
                      </div>
                    )}
                    {semana.fechamento && (
                      <div>
                        <p className="font-semibold text-xs uppercase tracking-wide text-muted-foreground print:text-black mb-0.5">Fechamento</p>
                        <p>{semana.fechamento}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* 5. Recursos */}
        {plano.recursos && <Section number={5} title="Recursos Didáticos">{plano.recursos}</Section>}

        {/* 6. Avaliação */}
        {plano.avaliacao && <Section number={6} title="Avaliação">{plano.avaliacao}</Section>}

        {/* 7. Referências */}
        {plano.referencias && <Section number={7} title="Referências">{plano.referencias}</Section>}

        {/* Assinaturas */}
        <div className="hidden print:block mt-24 mb-12">
          <div className="grid grid-cols-2 gap-16 mb-20">
            <div className="text-center"><div className="border-t border-black pt-1 text-[10pt] font-medium">Assinatura do Professor</div></div>
            <div className="text-center"><div className="border-t border-black pt-1 text-[10pt] font-medium">Assinatura da Coordenação</div></div>
          </div>
          <div className="print:fixed print:bottom-1 print:left-0 print:right-0 pt-1 border-t border-black text-[8pt] text-center space-y-0.5 font-medium bg-white">
            <p>Rua Vereador Nelson de Sousa Alencar, sn – Veneza | Iguatu – Ceará | CEP: 63.504-356 - Fone: (88) 3581.9463</p>
            <p>E-mail: filgueiraslimacrede16@escola.ce.gov.br | Instagram: @filgueiraslimaiguatu</p>
            <p className="text-[7pt] italic">Documento gerado em {new Date().toLocaleDateString('pt-BR')} via SAGE</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlanoView;
