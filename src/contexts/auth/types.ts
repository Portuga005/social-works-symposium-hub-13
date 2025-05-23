
import { User, Session } from '@supabase/supabase-js';

export type UserProfile = {
  id: string;
  nome: string;
  email: string;
  cpf: string | null;
  instituicao: string | null;
  tipo_usuario: 'participante' | 'professor' | 'admin';
};

export type AuthContextType = {
  user: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserInfo: (data: Partial<UserProfile>) => void;
};
