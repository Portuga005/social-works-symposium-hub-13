
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminStudents = () => {
  return useQuery({
    queryKey: ['admin-alunos'],
    queryFn: async () => {
      console.log('=== BUSCANDO ALUNOS ADMIN ===');
      
      // Primeiro, buscar todos os profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) {
        console.error('Erro ao buscar profiles:', profilesError);
        throw profilesError;
      }

      // Depois, buscar todos os trabalhos com as informações necessárias
      const { data: trabalhos, error: trabalhosError } = await supabase
        .from('trabalhos')
        .select(`
          id,
          titulo,
          status_avaliacao,
          arquivo_url,
          arquivo_nome,
          user_id
        `);

      if (trabalhosError) {
        console.error('Erro ao buscar trabalhos:', trabalhosError);
        throw trabalhosError;
      }

      console.log('Profiles encontrados:', profiles?.length || 0);
      console.log('Trabalhos encontrados:', trabalhos?.length || 0);

      // Combinar os dados manualmente
      const alunosProcessados = profiles?.map(profile => {
        const trabalhoDoAluno = trabalhos?.find(t => t.user_id === profile.id);
        
        return {
          id: profile.id,
          nome: profile.nome,
          cpf: profile.cpf ? `${profile.cpf.slice(0, 3)}.${profile.cpf.slice(3, 6)}.***-**` : 'Não informado',
          email: profile.email,
          instituicao: profile.instituicao || 'Não informada',
          statusTrabalho: trabalhoDoAluno ? 'Enviado' : 'Não enviado',
          resultado: trabalhoDoAluno ? 
            (trabalhoDoAluno.status_avaliacao === 'aprovado' ? 'Aprovado' :
             trabalhoDoAluno.status_avaliacao === 'rejeitado' ? 'Reprovado' : 'Em análise') : '-',
          trabalho: trabalhoDoAluno || null
        };
      }) || [];

      console.log('Alunos processados:', alunosProcessados.length);
      return alunosProcessados;
    }
  });
};
