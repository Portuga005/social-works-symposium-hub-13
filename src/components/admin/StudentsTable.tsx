
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Student {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  instituicao: string;
  statusTrabalho: string;
  resultado: string;
  trabalho: {
    id: string;
    titulo: string;
    arquivo_url: string;
    arquivo_nome: string;
  } | null;
}

interface StudentsTableProps {
  alunos?: Student[];
}

const StudentsTable = ({ alunos }: StudentsTableProps) => {
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(new Set());

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

  const handleDownloadFile = async (aluno: Student) => {
    if (!aluno.trabalho?.arquivo_nome || !aluno.trabalho?.id) {
      toast.error('Arquivo não encontrado.');
      return;
    }

    const fileId = aluno.trabalho.id;
    setDownloadingFiles(prev => new Set(prev).add(fileId));
    
    try {
      // Buscar informações completas do trabalho
      const { data: trabalho, error } = await supabase
        .from('trabalhos')
        .select('user_id, arquivo_storage_path, arquivo_nome')
        .eq('id', aluno.trabalho.id)
        .single();

      if (error || !trabalho) {
        throw new Error('Trabalho não encontrado');
      }

      const filePath = trabalho.arquivo_storage_path || `${trabalho.user_id}/${trabalho.arquivo_nome}`;

      // Download do arquivo do Supabase Storage
      const { data, error: downloadError } = await supabase.storage
        .from('trabalhos')
        .download(filePath);

      if (downloadError) {
        throw new Error('Erro ao baixar arquivo: ' + downloadError.message);
      }

      // Criar URL para download
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = aluno.trabalho.arquivo_nome;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Download iniciado com sucesso!');

    } catch (error: any) {
      console.error('Error downloading file:', error);
      toast.error('Erro ao baixar arquivo: ' + error.message);
    } finally {
      setDownloadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
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
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDownloadFile(aluno)}
                          disabled={downloadingFiles.has(aluno.trabalho!.id)}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          {downloadingFiles.has(aluno.trabalho!.id) ? 'Baixando...' : 'Baixar'}
                        </Button>
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
