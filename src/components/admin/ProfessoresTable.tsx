
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useUpdateProfessorStatus } from '@/hooks/useAdminProfessores';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Professor {
  id: string;
  nome: string;
  email: string;
  especialidade: string | null;
  ativo: boolean;
  created_at: string;
}

interface ProfessoresTableProps {
  professores: Professor[] | undefined;
}

const ProfessoresTable = ({ professores }: ProfessoresTableProps) => {
  const updateStatus = useUpdateProfessorStatus();

  const handleStatusChange = async (id: string, ativo: boolean) => {
    try {
      await updateStatus.mutateAsync({ id, ativo });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  if (!professores || professores.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum professor cadastrado ainda.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Especialidade</TableHead>
            <TableHead>Data de Cadastro</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {professores.map((professor) => (
            <TableRow key={professor.id}>
              <TableCell className="font-medium">{professor.nome}</TableCell>
              <TableCell>{professor.email}</TableCell>
              <TableCell>{professor.especialidade || '-'}</TableCell>
              <TableCell>
                {format(new Date(professor.created_at), 'dd/MM/yyyy', { locale: ptBR })}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={professor.ativo}
                    onCheckedChange={(checked) => handleStatusChange(professor.id, checked)}
                    disabled={updateStatus.isPending}
                  />
                  <span className={professor.ativo ? 'text-green-600' : 'text-red-600'}>
                    {professor.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProfessoresTable;
