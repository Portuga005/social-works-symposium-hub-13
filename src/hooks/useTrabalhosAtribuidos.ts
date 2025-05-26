
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

type TrabalhoAtribuido = {
  trabalho_id: string;
  titulo: string;
  area_tematica: string;
  autor_nome: string;
  autor_email: string;
  data_submissao: string;
  status_avaliacao: string;
  arquivo_nome: string;
};

export const useTrabalhosAtribuidos = (professorId: string | null) => {
  return useQuery({
    queryKey: ['trabalhos-atribuidos', professorId],
    queryFn: async (): Promise<TrabalhoAtribuido[]> => {
      if (!professorId) return [];
      
      console.log('Buscando trabalhos atribuídos para professor:', professorId);
      
      const { data, error } = await supabase.rpc('get_trabalhos_professor', {
        professor_uuid: professorId
      });

      if (error) {
        console.error('Erro ao buscar trabalhos:', error);
        throw error;
      }

      console.log('Trabalhos encontrados:', data?.length || 0);
      return data || [];
    },
    enabled: !!professorId,
    refetchInterval: 30000, // Atualiza a cada 30 segundos para capturar novos trabalhos distribuídos
  });
};
