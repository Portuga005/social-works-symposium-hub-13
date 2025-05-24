
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { createStorageBucket } from '@/utils/createStorageBucket';

export const useSubmission = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [trabalho, setTrabalho] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [deletingWork, setDeletingWork] = useState(false);

  useEffect(() => {
    createStorageBucket();
    
    if (isAuthenticated && user?.id && !authLoading) {
      fetchUserWork();
    }
  }, [isAuthenticated, user?.id, authLoading]);

  const fetchUserWork = async () => {
    if (!user?.id) {
      console.log('ID do usuário não disponível');
      return;
    }

    setLoading(true);
    try {
      console.log('Buscando trabalho para usuário:', user.id);
      
      const { data, error } = await supabase
        .from('trabalhos')
        .select(`
          *,
          areas_tematicas (nome)
        `)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar trabalho:', error);
        setTrabalho(null);
        if (error.code !== 'PGRST116') {
          toast.error('Erro ao carregar trabalho');
        }
      } else {
        console.log('Trabalho encontrado:', data);
        setTrabalho(data);
      }
    } catch (error: any) {
      console.error('Erro na função fetchUserWork:', error);
      setTrabalho(null);
      toast.error('Erro ao carregar trabalho');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWork = async () => {
    if (!trabalho?.id || !user?.id) return;

    const confirmed = window.confirm(
      'Tem certeza que deseja cancelar a submissão? Esta ação não pode ser desfeita.'
    );

    if (!confirmed) return;

    setDeletingWork(true);
    try {
      console.log('Deletando trabalho:', trabalho.id);
      
      if (trabalho.arquivo_storage_path) {
        console.log('Deletando arquivo do storage:', trabalho.arquivo_storage_path);
        
        const { error: storageError } = await supabase.storage
          .from('trabalhos')
          .remove([trabalho.arquivo_storage_path]);

        if (storageError) {
          console.error('Erro ao deletar arquivo:', storageError);
        } else {
          console.log('Arquivo deletado do storage com sucesso');
        }
      }

      const { error } = await supabase
        .from('trabalhos')
        .delete()
        .eq('id', trabalho.id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao deletar trabalho do banco:', error);
        throw error;
      }

      console.log('Trabalho deletado com sucesso');
      setTrabalho(null);
      toast.success('Submissão cancelada com sucesso');

    } catch (error: any) {
      console.error('Erro ao deletar trabalho:', error);
      toast.error('Erro ao cancelar submissão: ' + error.message);
    } finally {
      setDeletingWork(false);
    }
  };

  return {
    trabalho,
    loading,
    deletingWork,
    authLoading,
    isAuthenticated,
    fetchUserWork,
    handleDeleteWork
  };
};
