
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const fetchAreasTemáticas = async () => {
  try {
    const { data, error } = await supabase
      .from('areas_tematicas')
      .select('*')
      .eq('ativo', true)  // Corrigido de 'ativa' para 'ativo'
      .order('nome');

    if (error) {
      console.error('Erro ao buscar áreas temáticas:', error);
      toast.error('Erro ao carregar áreas temáticas');
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Erro na função fetchAreasTemáticas:', error);
    toast.error('Erro ao carregar áreas temáticas');
    return [];
  }
};
