
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminStudents = () => {
  return useQuery({
    queryKey: ['admin-alunos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          trabalhos(
            id,
            titulo,
            status_avaliacao,
            arquivo_url,
            arquivo_nome
          )
        `);

      if (error) throw error;

      return data?.map(profile => ({
        id: profile.id,
        nome: profile.nome,
        cpf: profile.cpf ? `${profile.cpf.slice(0, 3)}.${profile.cpf.slice(3, 6)}.***-**` : 'Não informado',
        email: profile.email,
        instituicao: profile.instituicao || 'Não informada',
        statusTrabalho: profile.trabalhos?.length > 0 ? 'Enviado' : 'Não enviado',
        resultado: profile.trabalhos?.length > 0 ? 
          (profile.trabalhos[0].status_avaliacao === 'aprovado' ? 'Aprovado' :
           profile.trabalhos[0].status_avaliacao === 'rejeitado' ? 'Reprovado' : 'Em análise') : '-',
        trabalho: profile.trabalhos?.[0] || null
      })) || [];
    }
  });
};
