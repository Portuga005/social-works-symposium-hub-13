
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
      
      // Buscar trabalhos atribuídos através da nova estrutura
      const { data, error } = await supabase
        .from('trabalhos')
        .select(`
          id,
          titulo,
          arquivo_nome,
          data_submissao,
          status_avaliacao,
          area_tematica_id,
          areas_tematicas!inner(nome),
          usuarios!inner(nome, email),
          distribuicao_trabalhos!inner(professor_id)
        `)
        .eq('distribuicao_trabalhos.professor_id', professorId)
        .eq('distribuicao_trabalhos.status', 'ativo');

      if (error) {
        console.error('Erro ao buscar trabalhos:', error);
        throw error;
      }

      console.log('Trabalhos encontrados:', data?.length || 0);
      
      // Transformar dados para o formato esperado
      const trabalhos = data?.map(trabalho => ({
        trabalho_id: trabalho.id,
        titulo: trabalho.titulo,
        area_tematica: trabalho.areas_tematicas?.nome || '',
        autor_nome: trabalho.usuarios?.nome || '',
        autor_email: trabalho.usuarios?.email || '',
        data_submissao: trabalho.data_submissao || '',
        status_avaliacao: trabalho.status_avaliacao || '',
        arquivo_nome: trabalho.arquivo_nome || ''
      })) || [];

      return trabalhos;
    },
    enabled: !!professorId,
    refetchInterval: 30000, // Atualiza a cada 30 segundos para capturar novos trabalhos distribuídos
  });
};
