
import { Session } from '@supabase/supabase-js';
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
