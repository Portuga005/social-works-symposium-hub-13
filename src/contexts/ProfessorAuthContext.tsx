
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Professor = {
  id: string;
  nome: string;
  email: string;
  especialidade: string | null;
};

type ProfessorAuthContextType = {
  professor: Professor | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const ProfessorAuthContext = createContext<ProfessorAuthContextType>({} as ProfessorAuthContextType);

export const useProfessorAuth = () => {
  return useContext(ProfessorAuthContext);
};

export const ProfessorAuthProvider = ({ children }: { children: ReactNode }) => {
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const professorData = localStorage.getItem('professor_auth');
      if (professorData) {
        setProfessor(JSON.parse(professorData));
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.rpc('validate_professor_login', {
        prof_email: email,
        prof_password: password
      });

      if (error) throw error;

      if (data && data.length > 0 && data[0].valid) {
        const professorData = {
          id: data[0].id,
          nome: data[0].nome,
          email: data[0].email,
          especialidade: null
        };
        
        setProfessor(professorData);
        localStorage.setItem('professor_auth', JSON.stringify(professorData));
        toast.success('Login realizado com sucesso!');
      } else {
        throw new Error('Credenciais inválidas');
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setProfessor(null);
    localStorage.removeItem('professor_auth');
    toast.info('Logout realizado com sucesso');
  };

  return (
    <ProfessorAuthContext.Provider 
      value={{ 
        professor, 
        loading,
        login,
        logout
      }}
    >
      {children}
    </ProfessorAuthContext.Provider>
  );
};
