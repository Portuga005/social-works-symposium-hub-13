
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';

type User = {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  instituicao: string;
  trabalhosSubmetidos: boolean;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserInfo: (data: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se o usuário está armazenado no localStorage
    const storedUser = localStorage.getItem('@simpUnespar:user');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // Simulação de login - em produção isso seria uma chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Usuário mockado para demonstração
      const mockUser: User = {
        id: '1',
        nome: 'Usuário Teste',
        email: email,
        cpf: '123.456.789-00',
        instituicao: 'UNESPAR',
        trabalhosSubmetidos: false
      };
      
      setUser(mockUser);
      localStorage.setItem('@simpUnespar:user', JSON.stringify(mockUser));
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao fazer login. Verifique suas credenciais.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('@simpUnespar:user');
    toast.info('Logout realizado com sucesso');
  };

  const updateUserInfo = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('@simpUnespar:user', JSON.stringify(updatedUser));
      toast.success('Informações atualizadas com sucesso!');
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user,
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
