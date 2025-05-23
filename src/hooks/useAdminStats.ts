
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [profilesResult, trabalhosResult] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('trabalhos').select('*, profiles(nome, email, instituicao), areas_tematicas(nome)')
      ]);

      const totalAlunos = profilesResult.data?.length || 0;
      const trabalhos = trabalhosResult.data || [];
      const trabalhoEnviados = trabalhos.length;
      const trabalhosAprovados = trabalhos.filter(t => t.status_avaliacao === 'aprovado').length;
      const trabalhosPendentes = trabalhos.filter(t => t.status_avaliacao === 'pendente').length;
      const trabalhosReprovados = trabalhos.filter(t => t.status_avaliacao === 'rejeitado').length;

      return {
        totalAlunos,
        trabalhoEnviados,
        trabalhosAprovados,
        trabalhosPendentes,
        trabalhosReprovados
      };
    }
  });
};
