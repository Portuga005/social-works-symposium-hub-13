
import { supabase } from '@/integrations/supabase/client';

export const submitAvaliacao = async (
  trabalhoId: string,
  professorId: string,
  resultado: 'aprovado' | 'rejeitado',
  comentarios?: string
) => {
  try {
    console.log('Submetendo avaliação:', { trabalhoId, professorId, resultado });
    
    // Atualizar a avaliação na nova estrutura
    const { data, error } = await supabase
      .from('avaliacoes')
      .update({
        recomendacao: resultado,
        comentarios: comentarios || null,
        updated_at: new Date().toISOString()
      })
      .eq('trabalho_id', trabalhoId)
      .eq('professor_id', professorId);

    if (error) {
      console.error('Erro ao submeter avaliação:', error);
      throw error;
    }

    // Atualizar status do trabalho baseado na avaliação
    const { error: updateError } = await supabase
      .from('trabalhos')
      .update({
        status_avaliacao: resultado,
        updated_at: new Date().toISOString()
      })
      .eq('id', trabalhoId);

    if (updateError) {
      console.error('Erro ao atualizar status do trabalho:', updateError);
      throw updateError;
    }

    // Atualizar status da distribuição
    const { error: distribError } = await supabase
      .from('distribuicao_trabalhos')
      .update({
        status: 'concluido'
      })
      .eq('trabalho_id', trabalhoId);

    if (distribError) {
      console.error('Erro ao atualizar distribuição:', distribError);
      throw distribError;
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
      .eq('professor_id', professorId)
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
