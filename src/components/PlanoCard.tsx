import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlanoAula } from '@/services/planoService';
import { useAuth } from '@/contexts/AuthContext';
import { formatMesAno, formatDate } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Pencil, Copy, Trash2, Printer } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface PlanoCardProps {
  plano: PlanoAula;
  onExcluir?: (id: string) => void;
  onDuplicar?: (id: string) => void;
  mostrarProfessor?: boolean;
}

const PlanoCard: React.FC<PlanoCardProps> = ({
  plano,
  onExcluir,
  onDuplicar,
  mostrarProfessor = false,
}) => {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const isProfessorDono = usuario?.perfil === 'professor' && usuario.id === plano.professorId;
  const isGestor = usuario?.perfil === 'gestor';

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold truncate">{plano.disciplina}</h3>
              <Badge
                variant={plano.status === 'finalizado' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {plano.status === 'finalizado' ? 'Finalizado' : 'Rascunho'}
              </Badge>
            </div>
            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span>{plano.turma}</span>
              <span>•</span>
              <span>{formatMesAno(plano.mesAno)}</span>
              {mostrarProfessor && (
                <>
                  <span>•</span>
                  <span>{plano.professorNome}</span>
                </>
              )}
            </div>
            {plano.atualizadoEm && (
              <p className="mt-1 text-xs text-muted-foreground">
                Atualizado em {formatDate(plano.atualizadoEm)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/planos/${plano._id}`)}
              title="Visualizar"
            >
              <Eye className="h-4 w-4" />
            </Button>

            {isProfessorDono && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/planos/${plano._id}/editar`)}
                  title="Editar"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                {onDuplicar && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDuplicar(plano._id!)}
                    title="Duplicar"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
                {onExcluir && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" title="Excluir">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir plano</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir o plano de {plano.disciplina} ({plano.turma} - {formatMesAno(plano.mesAno)})? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onExcluir(plano._id!)}>
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </>
            )}

            {isGestor && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(`/planos/${plano._id}?print=true`)}
                title="Imprimir"
              >
                <Printer className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanoCard;
