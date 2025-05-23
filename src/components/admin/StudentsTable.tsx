
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';

interface Student {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  instituicao: string;
  statusTrabalho: string;
  resultado: string;
  trabalho: any;
}

interface StudentsTableProps {
  alunos?: Student[];
}

const StudentsTable = ({ alunos }: StudentsTableProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Aprovado':
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>;
      case 'Reprovado':
        return <Badge className="bg-red-100 text-red-800">Reprovado</Badge>;
      case 'Em análise':
        return <Badge className="bg-yellow-100 text-yellow-800">Em análise</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  const handleDownloadFile = (aluno: Student) => {
    if (aluno.trabalho?.arquivo_url) {
      window.open(aluno.trabalho.arquivo_url, '_blank');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Alunos Cadastrados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Nome</th>
                <th className="text-left py-3 px-4">CPF</th>
                <th className="text-left py-3 px-4">E-mail</th>
                <th className="text-left py-3 px-4">Instituição</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Resultado</th>
                <th className="text-left py-3 px-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {alunos?.map((aluno) => (
                <tr key={aluno.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{aluno.nome}</td>
                  <td className="py-3 px-4 text-gray-600">{aluno.cpf}</td>
                  <td className="py-3 px-4 text-gray-600">{aluno.email}</td>
                  <td className="py-3 px-4">{aluno.instituicao}</td>
                  <td className="py-3 px-4">
                    <Badge variant={aluno.statusTrabalho === 'Enviado' ? 'default' : 'secondary'}>
                      {aluno.statusTrabalho}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    {getStatusBadge(aluno.resultado)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      {aluno.statusTrabalho === 'Enviado' && aluno.trabalho && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDownloadFile(aluno)}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Baixar
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!alunos || alunos.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              Nenhum aluno cadastrado ainda.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentsTable;
