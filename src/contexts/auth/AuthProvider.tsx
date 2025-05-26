
import { useState, ReactNode, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { seedAreasTemáticas } from '@/utils/seedData';
import { AuthContext } from './AuthContext';
import { UserProfile } from './types';
import { loginUser, logoutUser, updateUserProfile } from './authService';
import { createFallbackProfile } from './profileService';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Seed áreas temáticas quando o app inicializar
    seedAreasTemáticas();

    let mounted = true;

    // Função simples para atualizar estado sem queries
    const handleAuthStateChange = (event: string, session: Session | null) => {
      console.log('Auth state change:', event, session?.user?.id);
      
      if (!mounted) return;

      setSession(session);
      
      if (session?.user) {
        // Criar perfil básico imediatamente sem consultas
        const fallbackProfile = createFallbackProfile(session);
        setUser(fallbackProfile);
        console.log('Perfil temporário criado:', fallbackProfile.nome);
        
        // Buscar perfil real de forma assíncrona sem bloquear
        fetchUserProfileAsync(session.user.id);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    };

    // Função separada para buscar perfil sem interferir com auth state
    const fetchUserProfileAsync = async (userId: string) => {
      try {
        const { data: existingProfile, error } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (existingProfile && mounted) {
          console.log('Perfil existente encontrado:', existingProfile.nome);
          setUser({
            id: existingProfile.id,
            nome: existingProfile.nome,
            email: existingProfile.email,
            cpf: existingProfile.cpf,
            instituicao: existingProfile.instituicao,
            tipo_usuario: existingProfile.tipo_usuario as 'participante' | 'professor' | 'admin'
          });
        } else if (error) {
          console.error('Erro ao buscar perfil:', error);
          // Manter o perfil fallback em caso de erro
        }
      } catch (error) {
        console.error('Erro na busca do perfil:', error);
        // Manter o perfil fallback em caso de erro
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro ao obter sessão:', error);
          if (mounted) setLoading(false);
          return;
        }

        console.log('Sessão inicial:', session?.user?.id);
        
        if (session?.user && mounted) {
          handleAuthStateChange('INITIAL_SESSION', session);
        } else if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Erro na inicialização da auth:', error);
        if (mounted) setLoading(false);
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
