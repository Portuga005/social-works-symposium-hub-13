
import { useState, ReactNode, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { seedAreasTemáticas } from '@/utils/seedData';
import { AuthContext } from './AuthContext';
import { UserProfile } from './types';
import { fetchUserProfile } from './profileService';
import { loginUser, logoutUser, updateUserProfile } from './authService';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileFetched, setProfileFetched] = useState(false);

  useEffect(() => {
    // Seed áreas temáticas quando o app inicializar
    seedAreasTemáticas();

    let mounted = true;
    let isProcessing = false;

    const handleAuthChange = async (event: string, session: Session | null) => {
      console.log('Auth state change:', event, session?.user?.id);
      
      if (!mounted || isProcessing) {
        console.log('Ignorando mudança de auth - componente desmontado ou processando');
        return;
      }

      isProcessing = true;
      
      try {
        setSession(session);
        
        if (session?.user && !profileFetched) {
          console.log('Processando novo usuário logado');
          setLoading(true);
          
          try {
            const profile = await fetchUserProfile(session.user.id, session);
            
            if (mounted) {
              setUser(profile);
              setProfileFetched(true);
              console.log('Usuário autenticado com sucesso:', profile?.nome);
            }
          } catch (error) {
            console.error('Erro ao processar perfil, criando perfil mínimo:', error);
            if (mounted) {
              const { createFallbackProfile } = await import('./profileService');
              const fallbackProfile = createFallbackProfile(session);
              setUser(fallbackProfile);
              setProfileFetched(true);
            }
          }
        } else if (!session) {
          console.log('Usuário deslogado');
          setUser(null);
          setProfileFetched(false);
        }
        
        if (mounted) {
          setLoading(false);
        }
      } finally {
        isProcessing = false;
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

        console.log('Sessão existente encontrada:', session?.user?.id);
        
        if (session?.user && mounted) {
          try {
            const profile = await fetchUserProfile(session.user.id, session);
            if (mounted) {
              setSession(session);
              setUser(profile);
              setProfileFetched(true);
              console.log('Sessão restaurada com sucesso:', profile?.nome);
            }
          } catch (error) {
            console.error('Erro ao buscar perfil na inicialização:', error);
            if (mounted) {
              const { createFallbackProfile } = await import('./profileService');
              const fallbackProfile = createFallbackProfile(session);
              setSession(session);
              setUser(fallbackProfile);
              setProfileFetched(true);
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
      await loginUser(email, password);
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
      setProfileFetched(false);
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
