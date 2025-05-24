
import { useState } from 'react';

interface FormData {
  titulo: string;
  tipo: string;
  area_tematica_id: string;
  arquivo: File | null;
}

export const useWorkFormState = (existingWork?: any) => {
  const [formData, setFormData] = useState<FormData>({
    titulo: '',
    tipo: '',
    area_tematica_id: '',
    arquivo: null
  });

  const initializeForm = (work?: any) => {
    if (work) {
      setFormData({
        titulo: work.titulo || '',
        tipo: work.tipo || '',
        area_tematica_id: work.area_tematica_id || '',
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
  };

  const validateForm = (isUpdate: boolean = false) => {
    if (!formData.titulo || !formData.tipo || !formData.area_tematica_id) {
      return 'Todos os campos são obrigatórios';
    }

    if (!isUpdate && !formData.arquivo) {
      return 'Selecione um arquivo para enviar';
    }

    return null;
  };

  return {
    formData,
    setFormData,
    initializeForm,
    validateForm
  };
};
