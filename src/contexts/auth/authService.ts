
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserProfile } from './types';

export const loginUser = async (email: string, password: string) => {
  console.log('Tentando login para:', email);
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Erro no login:', error);
    throw error;
  }

  console.log('Login realizado com sucesso');
  toast.success('Login realizado com sucesso!');
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Erro no logout:', error);
    toast.error('Erro ao fazer logout');
    throw error;
  } else {
    console.log('Logout realizado');
    toast.info('Logout realizado com sucesso');
  }
};

export const updateUserProfile = async (user: UserProfile, data: Partial<UserProfile>) => {
  const { error } = await supabase
    .from('profiles')
    .update({
      nome: data.nome,
      cpf: data.cpf,
      instituicao: data.instituicao,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id);

  if (error) {
    console.error('Erro ao atualizar perfil:', error);
    throw error;
  }

  console.log('Perfil atualizado com sucesso');
  toast.success('Informações atualizadas com sucesso!');
};
