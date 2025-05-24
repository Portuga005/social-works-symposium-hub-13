
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
          
          // Primeiro, tentar buscar o perfil existente
          const { data: existingProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (fetchError) {
            console.error('Erro ao buscar perfil:', fetchError);
          }

          if (existingProfile) {
            console.log('Perfil existente encontrado:', existingProfile.nome);
            setUser(existingProfile);
          } else {
            console.log('Criando novo perfil para usuário:', session.user.id);
            
            // Criar perfil fallback
            const fallbackProfile = createFallbackProfile(session);
            
            // Tentar inserir no banco de dados
            const { data: newProfile, error: insertError } = await supabase
              .from('profiles')
              .insert([{
                id: fallbackProfile.id,
                nome: fallbackProfile.nome,
                email: fallbackProfile.email,
                cpf: fallbackProfile.cpf,
                instituicao: fallbackProfile.instituicao,
                tipo_usuario: fallbackProfile.tipo_usuario
              }])
              .select()
              .single();

            if (insertError) {
              console.error('Erro ao inserir perfil:', insertError);
              // Em caso de erro, usar o perfil fallback
              setUser(fallbackProfile);
            } else {
              console.log('Perfil criado com sucesso:', newProfile.nome);
              setUser(newProfile);
            }
          }
        } else {
          console.log('Usuário deslogado');
          setUser(null);
        }
      } catch (error) {
        console.error('Erro no handleAuthChange:', error);
        if (session?.user) {
          // Em caso de erro, ainda criar um perfil básico
          const fallbackProfile = createFallbackProfile(session);
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
          await handleAuthChange('INITIAL_SESSION', session);
        } else if (mounted) {
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
