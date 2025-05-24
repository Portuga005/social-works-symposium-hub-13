
import { supabase } from '@/integrations/supabase/client';

export const createStorageBucket = async () => {
  try {
    // Verificar se o bucket já existe
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Erro ao listar buckets:', listError);
      return false;
    }

    const bucketExists = buckets?.some(bucket => bucket.name === 'trabalhos');
    
    if (!bucketExists) {
      // Criar o bucket se não existir
      const { error: createError } = await supabase.storage.createBucket('trabalhos', {
        public: false,
        allowedMimeTypes: [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/msword'
        ],
        fileSizeLimit: 10485760 // 10MB
      });

      if (createError) {
        console.error('Erro ao criar bucket:', createError);
        return false;
      }

      console.log('Bucket "trabalhos" criado com sucesso');
    }

    return true;
  } catch (error) {
    console.error('Erro na função createStorageBucket:', error);
    return false;
  }
};
