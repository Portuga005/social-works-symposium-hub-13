
import { supabase } from '@/integrations/supabase/client';

export const submitAvaliacao = async (
  trabalhoId: string,
  professorId: string,
  resultado: 'aprovado' | 'rejeitado',
  comentarios?: string
) => {
  try {
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

    return data;
  } catch (error) {
    console.error('Erro no serviço de avaliação:', error);
    throw error;
  }
};
