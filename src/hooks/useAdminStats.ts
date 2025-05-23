
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminStats = () => {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      console.log('=== BUSCANDO ESTATÍSTICAS ADMIN ===');
      
      // Usar a função existente do banco que já está funcionando
      const { data: statsData, error: statsError } = await supabase.rpc('get_admin_statistics');
      
      if (statsError) {
        console.error('Erro ao buscar estatísticas:', statsError);
        throw statsError;
      }

      const stats = statsData && statsData.length > 0 ? statsData[0] : {
        total_participantes: 0,
        total_trabalhos: 0,
        trabalhos_pendentes: 0,
        trabalhos_aprovados: 0,
        trabalhos_rejeitados: 0,
        total_professores: 0
      };

      // Converter para o formato esperado pelo componente
      const result = {
        totalAlunos: Number(stats.total_participantes),
        trabalhoEnviados: Number(stats.total_trabalhos),
        trabalhosAprovados: Number(stats.trabalhos_aprovados),
        trabalhosPendentes: Number(stats.trabalhos_pendentes),
        trabalhosReprovados: Number(stats.trabalhos_rejeitados)
      };

      console.log('Estatísticas calculadas:', result);
      return result;
    }
  });
};
