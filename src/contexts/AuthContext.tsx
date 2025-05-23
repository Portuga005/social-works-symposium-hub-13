
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type UserProfile = {
  id: string;
  nome: string;
  email: string;
  cpf: string | null;
  instituicao: string | null;
  tipo_usuario: 'participante' | 'professor' | 'admin';
  trabalhosSubmetidos: boolean;
};

type AuthContextType = {
  user: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserInfo: (data: Partial<UserProfile>) => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      // Check if user has submitted works
      const { data: trabalhos } = await supabase
        .from('trabalhos')
        .select('id')
        .eq('user_id', userId);

      return {
        ...profile,
        trabalhosSubmetidos: (trabalhos?.length || 0) > 0
      };
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Defer profile fetching to avoid blocking auth state change
          setTimeout(async () => {
            const profile = await fetchUserProfile(session.user.id);
            setUser(profile);
            setLoading(false);
          }, 0);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id).then(profile => {
          setUser(profile);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast.success('Login realizado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login. Verifique suas credenciais.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Erro ao fazer logout');
    } else {
      setUser(null);
      setSession(null);
      toast.info('Logout realizado com sucesso');
    }
  };

  const updateUserInfo = async (data: Partial<UserProfile>) => {
    if (!user) return;

    try {
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

      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      toast.success('Informações atualizadas com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao atualizar informações: ' + error.message);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        session,
        isAuthenticated: !!session,
        loading,
        login,
        logout,
        updateUserInfo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
