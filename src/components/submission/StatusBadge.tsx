
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  switch (status) {
    case 'pendente':
      return <Badge className="bg-yellow-100 text-yellow-800">Em Análise</Badge>;
    case 'aprovado':
      return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>;
    case 'rejeitado':
      return <Badge className="bg-red-100 text-red-800">Rejeitado</Badge>;
    default:
      return <Badge variant="secondary">-</Badge>;
  }
};

export default StatusBadge;
