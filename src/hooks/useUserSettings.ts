
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useUserSettings = () => {
  const { user, updateUserInfo, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user?.email) {
      throw new Error('Usuário não autenticado');
    }

    setLoading(true);
    try {
      // Primeiro, verificar a senha atual tentando fazer login
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        throw new Error('Senha atual incorreta');
      }

      // Agora alterar a senha
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw error;
      }

      toast.success('Senha alterada com sucesso!');
      return true;
    } catch (error: any) {
      console.error('Erro ao alterar senha:', error);
      toast.error(error.message || 'Erro ao alterar senha');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    if (!user?.id) {
      throw new Error('Usuário não autenticado');
    }

    setLoading(true);
    try {
      // Deletar o perfil do usuário (cascade vai deletar trabalhos relacionados)
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (profileError) {
        throw profileError;
      }

      // Fazer logout
      await logout();
      toast.success('Conta excluída com sucesso');
      return true;
    } catch (error: any) {
      console.error('Erro ao excluir conta:', error);
      toast.error(error.message || 'Erro ao excluir conta');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const downloadUserData = async () => {
    if (!user?.id) {
      throw new Error('Usuário não autenticado');
    }

    try {
      // Buscar dados do usuário
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      // Buscar trabalhos do usuário
      const { data: trabalhos, error: trabalhosError } = await supabase
        .from('trabalhos')
        .select('*')
        .eq('user_id', user.id);

      if (trabalhosError) {
        throw trabalhosError;
      }

      // Criar objeto com todos os dados
      const userData = {
        perfil: profile,
        trabalhos: trabalhos,
        dataExportacao: new Date().toISOString(),
      };

      // Criar arquivo para download
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `meus-dados-simposio-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Dados baixados com sucesso!');
    } catch (error: any) {
      console.error('Erro ao baixar dados:', error);
      toast.error(error.message || 'Erro ao baixar dados');
    }
  };

  return {
    loading,
    changePassword,
    deleteAccount,
    downloadUserData,
  };
};
