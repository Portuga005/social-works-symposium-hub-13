
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      console.log('=== BUSCANDO ESTATÍSTICAS ADMIN ===');
      
      const [profilesResult, trabalhosResult] = await Promise.all([
        supabase.from('profiles').select('id'),
        supabase.from('trabalhos').select(`
          id,
          status_avaliacao,
          profiles!trabalhos_user_id_fkey(nome, email, instituicao),
          areas_tematicas(nome)
        `)
      ]);

      console.log('Resultado profiles:', profilesResult);
      console.log('Resultado trabalhos:', trabalhosResult);

      if (profilesResult.error) {
        console.error('Erro ao buscar profiles:', profilesResult.error);
        throw profilesResult.error;
      }

      if (trabalhosResult.error) {
        console.error('Erro ao buscar trabalhos:', trabalhosResult.error);
        throw trabalhosResult.error;
      }

      const totalAlunos = profilesResult.data?.length || 0;
      const trabalhos = trabalhosResult.data || [];
      const trabalhoEnviados = trabalhos.length;
      const trabalhosAprovados = trabalhos.filter(t => t.status_avaliacao === 'aprovado').length;
      const trabalhosPendentes = trabalhos.filter(t => t.status_avaliacao === 'pendente').length;
      const trabalhosReprovados = trabalhos.filter(t => t.status_avaliacao === 'rejeitado').length;

      const stats = {
        totalAlunos,
        trabalhoEnviados,
        trabalhosAprovados,
        trabalhosPendentes,
        trabalhosReprovados
      };

      console.log('Estatísticas calculadas:', stats);
      return stats;
    }
  });
};
