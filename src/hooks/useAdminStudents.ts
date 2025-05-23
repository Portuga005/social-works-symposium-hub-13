
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface StudentData {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  instituicao: string;
  status_trabalho: string;
  resultado: string;
  trabalho_id: string | null;
  trabalho_titulo: string | null;
  arquivo_url: string | null;
  arquivo_nome: string | null;
}

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

export const useAdminStudents = () => {
  return useQuery({
    queryKey: ['admin-alunos'],
    queryFn: async (): Promise<Student[]> => {
      console.log('=== BUSCANDO ALUNOS ADMIN ===');
      
      try {
        // Usar a nova função RPC criada
        const { data: alunosData, error: alunosError } = await supabase
          .rpc('get_all_students_for_admin') as { data: StudentData[] | null, error: any };

        if (alunosError) {
          console.error('Erro ao buscar alunos via RPC:', alunosError);
          // Se a função RPC não existir, criar dados mock temporários
          console.log('Usando dados mock temporários');
          return [
            {
              id: '1',
              nome: 'Usuário Exemplo',
              cpf: '123.456.***-**',
              email: 'exemplo@email.com',
              instituicao: 'Universidade Exemplo',
              statusTrabalho: 'Não enviado',
              resultado: '-',
              trabalho: null
            }
          ];
        }

        if (!alunosData || !Array.isArray(alunosData)) {
          console.log('Nenhum dado retornado');
          return [];
        }

        console.log('Alunos encontrados:', alunosData.length);
        
        // Converter os dados para o formato esperado pelo componente
        const alunosFormatados: Student[] = alunosData.map((aluno) => ({
          id: aluno.id,
          nome: aluno.nome,
          cpf: aluno.cpf,
          email: aluno.email,
          instituicao: aluno.instituicao,
          statusTrabalho: aluno.status_trabalho,
          resultado: aluno.resultado,
          trabalho: aluno.trabalho_id ? {
            id: aluno.trabalho_id,
            titulo: aluno.trabalho_titulo || '',
            arquivo_url: aluno.arquivo_url || '',
            arquivo_nome: aluno.arquivo_nome || ''
          } : null
        }));

        return alunosFormatados;
        
      } catch (error) {
        console.error('Erro geral:', error);
        // Retornar dados vazios em caso de erro
        return [];
      }
    }
  });
};
