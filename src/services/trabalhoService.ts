
import { supabase } from '@/integrations/supabase/client';

export interface WorkData {
  titulo: string;
  tipo: 'resumo_expandido' | 'artigo_completo' | 'relato_experiencia';
  area_tematica_id: string;
  usuario_id: string;
  data_submissao: string;
  status_avaliacao: 'pendente' | 'aprovado' | 'rejeitado';
}

export const createWork = async (workData: WorkData) => {
  console.log('Criando novo trabalho');
  
  const { data: newWork, error: insertError } = await supabase
    .from('trabalhos')
    .insert({
      titulo: workData.titulo,
      tipo: workData.tipo,
      area_tematica_id: workData.area_tematica_id,
      usuario_id: workData.usuario_id,
      data_submissao: workData.data_submissao,
      status_avaliacao: workData.status_avaliacao
    })
    .select()
    .single();

  if (insertError) {
    console.error('Erro ao inserir trabalho:', insertError);
    throw insertError;
  }
  
  console.log('Novo trabalho criado com ID:', newWork.id);
  return newWork;
};

export const updateWork = async (workId: string, workData: Partial<WorkData>, userId: string) => {
  console.log('Atualizando trabalho existente:', workId);
  
  const { error: updateError } = await supabase
    .from('trabalhos')
    .update({
      titulo: workData.titulo,
      tipo: workData.tipo,
      area_tematica_id: workData.area_tematica_id,
      updated_at: new Date().toISOString()
    })
    .eq('id', workId)
    .eq('usuario_id', userId);

  if (updateError) {
    console.error('Erro ao atualizar trabalho:', updateError);
    throw updateError;
  }
  
  return workId;
};

export const updateWorkFileInfo = async (workId: string, filePath: string, fileName: string) => {
  const { error: updateFileError } = await supabase
    .from('trabalhos')
    .update({
      arquivo_path: filePath,
      arquivo_nome: fileName,
      updated_at: new Date().toISOString()
    })
    .eq('id', workId);

  if (updateFileError) {
    console.error('Erro ao atualizar informações do arquivo:', updateFileError);
    throw updateFileError;
  }
  
  console.log('Informações do arquivo atualizadas no banco');
};
