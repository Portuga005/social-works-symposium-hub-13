
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './types';

export const createFallbackProfile = (session: Session): UserProfile => {
  return {
    id: session.user.id,
    nome: session.user.user_metadata?.nome || 
          session.user.user_metadata?.full_name || 
          session.user.email?.split('@')[0] || 'Usuário',
    email: session.user.email || '',
    cpf: session.user.user_metadata?.cpf || null,
    instituicao: session.user.user_metadata?.instituicao || null,
    tipo_usuario: 'participante'
  };
};

export const fetchUserProfile = async (userId: string, userSession: Session): Promise<UserProfile> => {
  try {
    console.log('Tentando buscar perfil do usuário:', userId);
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Erro ao buscar perfil:', error);
      console.log('Criando perfil temporário devido ao erro');
      return createFallbackProfile(userSession);
    }

    if (profile) {
      console.log('Perfil encontrado:', profile);
      return profile;
    }

    console.log('Perfil não encontrado - criando perfil temporário');
    return createFallbackProfile(userSession);

  } catch (error) {
    console.error('Erro na função fetchUserProfile:', error);
    console.log('Criando perfil temporário devido à exceção');
    return createFallbackProfile(userSession);
  }
};
