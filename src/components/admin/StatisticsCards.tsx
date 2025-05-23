
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, CheckCircle, Clock } from 'lucide-react';

interface StatisticsCardsProps {
  stats?: {
    totalAlunos: number;
    trabalhoEnviados: number;
    trabalhosAprovados: number;
    trabalhosPendentes: number;
    trabalhosReprovados: number;
  };
}

const StatisticsCards = ({ stats }: StatisticsCardsProps) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalAlunos || 0}</div>
          <p className="text-xs text-muted-foreground">Cadastrados no sistema</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Trabalhos Enviados</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.trabalhoEnviados || 0}</div>
          <p className="text-xs text-muted-foreground">Total de submissões</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats?.trabalhosAprovados || 0}</div>
          <p className="text-xs text-muted-foreground">Trabalhos aprovados</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Em Análise</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{stats?.trabalhosPendentes || 0}</div>
          <p className="text-xs text-muted-foreground">Aguardando avaliação</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsCards;
