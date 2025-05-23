
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { seedAreasTemáticas } from '@/utils/seedData';

type UserProfile = {
  id: string;
  nome: string;
  email: string;
  cpf: string | null;
  instituicao: string | null;
  tipo_usuario: 'participante' | 'professor' | 'admin';
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

  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log('Buscando perfil do usuário:', userId);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        
        // Se há erro de política RLS, vamos criar um perfil temporário baseado na sessão
        if (error.code === '42P17' || error.message.includes('infinite recursion')) {
          console.log('Erro de RLS detectado, criando perfil temporário baseado na sessão');
          return {
            id: userId,
            nome: session?.user?.user_metadata?.nome || session?.user?.email?.split('@')[0] || 'Usuário',
            email: session?.user?.email || '',
            cpf: session?.user?.user_metadata?.cpf || null,
            instituicao: session?.user?.user_metadata?.instituicao || null,
            tipo_usuario: 'participante'
          };
        }
        
        return null;
      }

      if (profile) {
        console.log('Perfil encontrado:', profile);
        return profile;
      }

      console.log('Perfil não encontrado - criando perfil temporário');
      // Se não encontrou perfil, criar um temporário
      return {
        id: userId,
        nome: session?.user?.user_metadata?.nome || session?.user?.email?.split('@')[0] || 'Usuário',
        email: session?.user?.email || '',
        cpf: session?.user?.user_metadata?.cpf || null,
        instituicao: session?.user?.user_metadata?.instituicao || null,
        tipo_usuario: 'participante'
      };

    } catch (error) {
      console.error('Erro na função fetchUserProfile:', error);
      // Em caso de erro, criar perfil temporário para não bloquear o login
      return {
        id: userId,
        nome: session?.user?.user_metadata?.nome || session?.user?.email?.split('@')[0] || 'Usuário',
        email: session?.user?.email || '',
        cpf: session?.user?.user_metadata?.cpf || null,
        instituicao: session?.user?.user_metadata?.instituicao || null,
        tipo_usuario: 'participante'
      };
    }
  };

  useEffect(() => {
    // Seed áreas temáticas quando o app inicializar
    seedAreasTemáticas();

    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        if (!mounted) return;
        
        setSession(session);
        
        if (session?.user) {
          setLoading(true);
          
          try {
            const profile = await fetchUserProfile(session.user.id);
            
            if (mounted) {
              setUser(profile);
              setLoading(false);
              console.log('Usuário autenticado com sucesso:', profile?.nome);
            }
          } catch (error) {
            console.error('Erro ao processar autenticação:', error);
            if (mounted) {
              // Mesmo com erro, criar um perfil mínimo para não bloquear o acesso
              setUser({
                id: session.user.id,
                nome: session.user.user_metadata?.nome || session.user.email?.split('@')[0] || 'Usuário',
                email: session.user.email || '',
                cpf: session.user.user_metadata?.cpf || null,
                instituicao: session.user.user_metadata?.instituicao || null,
                tipo_usuario: 'participante'
              });
              setLoading(false);
            }
          }
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro ao obter sessão:', error);
          setLoading(false);
          return;
        }

        console.log('Sessão existente:', session?.user?.id);
        
        if (!mounted) return;
        
        setSession(session);
        
        if (session?.user) {
          try {
            const profile = await fetchUserProfile(session.user.id);
            if (mounted) {
              setUser(profile);
              console.log('Sessão restaurada com sucesso:', profile?.nome);
            }
          } catch (error) {
            console.error('Erro ao buscar perfil na inicialização:', error);
            if (mounted) {
              // Criar perfil mínimo mesmo com erro
              setUser({
                id: session.user.id,
                nome: session.user.user_metadata?.nome || session.user.email?.split('@')[0] || 'Usuário',
                email: session.user.email || '',
                cpf: session.user.user_metadata?.cpf || null,
                instituicao: session.user.user_metadata?.instituicao || null,
                tipo_usuario: 'participante'
              });
            }
          }
        }
        
        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Erro na inicialização da auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
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
      console.error('Erro no login:', error);
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
      console.error('Erro ao atualizar informações:', error);
      toast.error('Erro ao atualizar informações: ' + error.message);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        session,
        isAuthenticated: !!session && !!user,
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
