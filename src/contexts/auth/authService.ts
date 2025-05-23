
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserProfile } from './types';

export const loginUser = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  toast.success('Login realizado com sucesso!');
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    toast.error('Erro ao fazer logout');
    throw error;
  } else {
    toast.info('Logout realizado com sucesso');
  }
};

export const updateUserProfile = async (user: UserProfile, data: Partial<UserProfile>) => {
  const { error } = await supabase
    .from('profiles')
    .update({
      nome: data.nome,
      cpf: data.cpf,
      instituicao: data.instituicao
    })
    .eq('id', user.id);

  if (error) {
    throw error;
  }

  toast.success('Informações atualizadas com sucesso!');
};
