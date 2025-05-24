
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { createStorageBucket } from '@/utils/createStorageBucket';
import { fetchAreasTemáticas } from '@/services/areasTemáticasService';
import { uploadWorkFile } from '@/services/fileUploadService';
import { createWork, updateWork, updateWorkFileInfo, type WorkData } from '@/services/trabalhoService';
import { useWorkFormState } from '@/hooks/useWorkFormState';

interface UseSubmitWorkModalProps {
  open: boolean;
  existingWork?: any;
  onSuccess: () => void;
}

export const useSubmitWorkModal = ({ open, existingWork, onSuccess }: UseSubmitWorkModalProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [areasTemáticas, setAreasTemáticas] = useState<any[]>([]);
  
  const { formData, setFormData, initializeForm, validateForm } = useWorkFormState(existingWork);

  useEffect(() => {
    if (open) {
      createStorageBucket();
      loadAreasTemáticas();
      initializeForm(existingWork);
    }
  }, [open, existingWork]);

  const loadAreasTemáticas = async () => {
    const areas = await fetchAreasTemáticas();
    setAreasTemáticas(areas);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Iniciando submissão do trabalho');
    
    if (!user?.id) {
      console.error('Usuário não autenticado');
      toast.error('Usuário não autenticado');
      return;
    }

    const validationError = validateForm(!!existingWork);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setLoading(true);

    try {
      const workData: WorkData = {
        titulo: formData.titulo,
        tipo: formData.tipo as 'resumo_expandido' | 'artigo_completo' | 'relato_experiencia',
        area_tematica_id: formData.area_tematica_id,
        user_id: user.id,
        data_submissao: new Date().toISOString(),
        status_avaliacao: 'pendente' as 'pendente' | 'aprovado' | 'rejeitado'
      };

      let workId: string;

      if (existingWork) {
        workId = await updateWork(existingWork.id, workData, user.id);
      } else {
        const newWork = await createWork(workData);
        workId = newWork.id;
      }

      if (formData.arquivo) {
        console.log('Fazendo upload do arquivo...');
        const { filePath, fileName } = await uploadWorkFile(formData.arquivo, workId, user.id);
        await updateWorkFileInfo(workId, filePath, fileName);
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
