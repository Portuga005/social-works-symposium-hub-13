
import { supabase } from '@/integrations/supabase/client';

export const submitAvaliacao = async (
  trabalhoId: string,
  professorId: string,
  resultado: 'aprovado' | 'rejeitado',
  comentarios?: string
) => {
  try {
    console.log('Submetendo avaliação:', { trabalhoId, professorId, resultado });
    
    // Usar a função RPC existente
    const { data, error } = await supabase.rpc('submit_avaliacao', {
      trabalho_uuid: trabalhoId,
      professor_uuid: professorId,
      resultado_avaliacao: resultado,
      comentarios_texto: comentarios || null
    });

    if (error) {
      console.error('Erro ao submeter avaliação:', error);
      throw error;
    }

    console.log('Avaliação submetida com sucesso');
    return data;
  } catch (error) {
    console.error('Erro no serviço de avaliação:', error);
    throw error;
  }
};

export const getAvaliacaoStatus = async (trabalhoId: string, professorId: string) => {
  try {
    const { data, error } = await supabase
      .from('avaliacoes')
      .select('recomendacao, comentarios, created_at')
      .eq('trabalho_id', trabalhoId)
      .eq('avaliador_id', professorId)
      .maybeSingle();

    if (error) {
      console.error('Erro ao buscar status da avaliação:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar status da avaliação:', error);
    throw error;
  }
};
