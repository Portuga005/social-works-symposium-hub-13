
import { supabase } from '@/integrations/supabase/client';

interface UploadResult {
  filePath: string;
  fileName: string;
}

export const uploadWorkFile = async (file: File, workId: string, userId: string): Promise<UploadResult> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${workId}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    console.log('Iniciando upload do arquivo:', fileName);

    const { error: uploadError } = await supabase.storage
      .from('trabalhos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('Erro no upload:', uploadError);
      throw new Error(`Erro no upload: ${uploadError.message}`);
    }

    console.log('Upload realizado com sucesso:', filePath);
    return { filePath, fileName: file.name };
  } catch (error) {
    console.error('Erro na função uploadFile:', error);
    throw error;
  }
};
