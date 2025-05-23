
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
      
      const { data, error } = await supabase.rpc('get_trabalhos_professor', {
        professor_uuid: professorId
      });

      if (error) {
        console.error('Erro ao buscar trabalhos:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!professorId,
  });
};
