
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { createStorageBucket } from '@/utils/createStorageBucket';

interface UseSubmitWorkModalProps {
  open: boolean;
  existingWork?: any;
  onSuccess: () => void;
}

export const useSubmitWorkModal = ({ open, existingWork, onSuccess }: UseSubmitWorkModalProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [areasTemáticas, setAreasTemáticas] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: '',
    area_tematica_id: '',
    arquivo: null as File | null
  });

  useEffect(() => {
    if (open) {
      createStorageBucket();
      
      fetchAreasTemáticas();
      if (existingWork) {
        setFormData({
          titulo: existingWork.titulo || '',
          tipo: existingWork.tipo || '',
          area_tematica_id: existingWork.area_tematica_id || '',
          arquivo: null
        });
      } else {
        setFormData({
          titulo: '',
          tipo: '',
          area_tematica_id: '',
          arquivo: null
        });
      }
    }
  }, [open, existingWork]);

  const fetchAreasTemáticas = async () => {
    try {
      const { data, error } = await supabase
        .from('areas_tematicas')
        .select('*')
        .eq('ativa', true)
        .order('nome');

      if (error) {
        console.error('Erro ao buscar áreas temáticas:', error);
        toast.error('Erro ao carregar áreas temáticas');
        return;
      }
      
      setAreasTemáticas(data || []);
    } catch (error) {
      console.error('Erro na função fetchAreasTemáticas:', error);
      toast.error('Erro ao carregar áreas temáticas');
    }
  };

  const uploadFile = async (file: File, workId: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${workId}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Iniciando submissão do trabalho');
    
    if (!user?.id) {
      console.error('Usuário não autenticado');
      toast.error('Usuário não autenticado');
      return;
    }

    if (!formData.titulo || !formData.tipo || !formData.area_tematica_id) {
      toast.error('Todos os campos são obrigatórios');
      return;
    }

    if (!existingWork && !formData.arquivo) {
      toast.error('Selecione um arquivo para enviar');
      return;
    }

    setLoading(true);

    try {
      const workData = {
        titulo: formData.titulo,
        tipo: formData.tipo as 'resumo_expandido' | 'artigo_completo' | 'relato_experiencia',
        area_tematica_id: formData.area_tematica_id,
        user_id: user.id,
        data_submissao: new Date().toISOString(),
        status_avaliacao: 'pendente' as 'pendente' | 'aprovado' | 'rejeitado'
      };

      let workId: string;

      if (existingWork) {
        console.log('Atualizando trabalho existente:', existingWork.id);
        
        const { error: updateError } = await supabase
          .from('trabalhos')
          .update(workData)
          .eq('id', existingWork.id)
          .eq('user_id', user.id);

        if (updateError) {
          console.error('Erro ao atualizar trabalho:', updateError);
          throw updateError;
        }
        
        workId = existingWork.id;
      } else {
        console.log('Criando novo trabalho');
        
        const { data: newWork, error: insertError } = await supabase
          .from('trabalhos')
          .insert(workData)
          .select()
          .single();

        if (insertError) {
          console.error('Erro ao inserir trabalho:', insertError);
          throw insertError;
        }
        
        workId = newWork.id;
        console.log('Novo trabalho criado com ID:', workId);
      }

      if (formData.arquivo) {
        console.log('Fazendo upload do arquivo...');
        
        const { filePath, fileName } = await uploadFile(formData.arquivo, workId);

        const { error: updateFileError } = await supabase
          .from('trabalhos')
          .update({
            arquivo_storage_path: filePath,
            arquivo_nome: fileName
          })
          .eq('id', workId);

        if (updateFileError) {
          console.error('Erro ao atualizar informações do arquivo:', updateFileError);
          throw updateFileError;
        }
        
        console.log('Informações do arquivo atualizadas no banco');
      }

      console.log('Trabalho submetido com sucesso');
      toast.success(existingWork ? 'Trabalho atualizado com sucesso!' : 'Trabalho enviado com sucesso!');
      onSuccess();

    } catch (error: any) {
      console.error('Erro ao submeter trabalho:', error);
      toast.error('Erro ao enviar trabalho: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    areasTemáticas,
    formData,
    setFormData,
    handleSubmit
  };
};
