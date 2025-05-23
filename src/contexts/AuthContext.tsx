
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

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Buscando perfil do usuário:', userId);
      
      // Primeiro, tentar buscar o perfil existente
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        // Se há erro na consulta, retornar null
        return null;
      }

      if (profile) {
        console.log('Perfil encontrado:', profile);
        return profile;
      }

      // Se não encontrou perfil, tentar criar um novo
      console.log('Perfil não encontrado, criando novo...');
      const { data: authUser } = await supabase.auth.getUser();
      
      if (!authUser.user) {
        console.log('Usuário não autenticado');
        return null;
      }

      const newProfile = {
        id: authUser.user.id,
        nome: authUser.user.user_metadata?.nome || authUser.user.email?.split('@')[0] || '',
        email: authUser.user.email || '',
        cpf: authUser.user.user_metadata?.cpf || null,
        instituicao: authUser.user.user_metadata?.instituicao || null,
        tipo_usuario: 'participante' as const
      };

      const { data: createdProfile, error: createError } = await supabase
        .from('profiles')
        .insert(newProfile)
        .select()
        .single();

      if (createError) {
        console.error('Erro ao criar perfil:', createError);
        return null;
      }

      console.log('Perfil criado com sucesso:', createdProfile);
      return createdProfile;

    } catch (error) {
      console.error('Erro na função fetchUserProfile:', error);
      return null;
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
        setLoading(true);
        
        if (session?.user) {
          // Usar setTimeout para evitar problemas de recursão
          setTimeout(async () => {
            if (!mounted) return;
            const profile = await fetchUserProfile(session.user.id);
            if (mounted) {
              setUser(profile);
              setLoading(false);
            }
          }, 100);
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
          const profile = await fetchUserProfile(session.user.id);
          if (mounted) {
            setUser(profile);
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
