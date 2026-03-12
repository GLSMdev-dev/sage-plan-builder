import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  titulo: string;
  valor: number;
  icone: LucideIcon;
  descricao?: string;
}

const StatCard: React.FC<StatCardProps> = ({ titulo, valor, icone: Icon, descricao }) => {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{titulo}</p>
            <p className="text-2xl sm:text-3xl font-bold mt-1">{valor}</p>
            {descricao && (
              <p className="text-xs text-muted-foreground mt-1">{descricao}</p>
            )}
          </div>
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-primary/10">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
