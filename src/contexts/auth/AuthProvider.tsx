
import { useState, ReactNode, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { seedAreasTemáticas } from '@/utils/seedData';
import { AuthContext } from './AuthContext';
import { UserProfile } from './types';
import { loginUser, logoutUser, updateUserProfile } from './authService';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Seed áreas temáticas quando o app inicializar
    seedAreasTemáticas();

    let mounted = true;

    const createUserFromSession = (session: Session): UserProfile => {
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

    const handleAuthChange = async (event: string, session: Session | null) => {
      console.log('Auth state change:', event, session?.user?.id);
      
      if (!mounted) {
        console.log('Componente desmontado, ignorando auth change');
        return;
      }

      try {
        setSession(session);
        
        if (session?.user) {
          console.log('Usuário logado, criando perfil');
          const userProfile = createUserFromSession(session);
          setUser(userProfile);
          console.log('Perfil criado:', userProfile.nome);
        } else {
          console.log('Usuário deslogado');
          setUser(null);
        }
      } catch (error) {
        console.error('Erro no handleAuthChange:', error);
        if (session?.user) {
          // Em caso de erro, ainda criar um perfil básico
          const fallbackProfile = createUserFromSession(session);
          setUser(fallbackProfile);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro ao obter sessão:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        console.log('Sessão inicial:', session?.user?.id);
        
        if (session?.user && mounted) {
          const userProfile = createUserFromSession(session);
          setSession(session);
          setUser(userProfile);
          console.log('Sessão restaurada:', userProfile.nome);
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
      await loginUser(email, password);
      // O estado será atualizado automaticamente pelo onAuthStateChange
    } catch (error: any) {
      console.error('Erro no login:', error);
      toast.error(error.message || 'Erro ao fazer login. Verifique suas credenciais.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setSession(null);
    } catch (error: any) {
      console.error('Erro no logout:', error);
    }
  };

  const updateUserInfo = async (data: Partial<UserProfile>) => {
    if (!user) return;

    try {
      await updateUserProfile(user, data);
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
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
