
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import storageService, { User } from '@/services/storageService';

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
    // Initialize storage with default data
    storageService.initializeStorage();
    
    // Check if user is already logged in
    const storedUser = storageService.getCurrentUser();
    
    if (storedUser) {
      setUser(storedUser);
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For simplicity, we'll hardcode admin and professor logins
      // Admin login
      if (email === 'admin@unespar.edu.br' && password === 'admin123') {
        const adminUser = storageService.getUsers().find(u => u.email === email);
        
        if (adminUser) {
          setUser(adminUser);
          storageService.updateCurrentUser(adminUser);
          toast.success('Login administrativo realizado com sucesso!');
          return;
        }
      }
      
      // Professor login
      if (email === 'profa@unespar.edu.br' && password === 'prof123') {
        const professorUser = storageService.getUsers().find(u => u.email === email);
        
        if (professorUser) {
          setUser(professorUser);
          storageService.updateCurrentUser(professorUser);
          toast.success('Login de professor realizado com sucesso!');
          return;
        }
      }
      
      throw new Error('Credenciais inválidas');
    } catch (error) {
      toast.error('Erro ao fazer login. Verifique suas credenciais.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    storageService.updateCurrentUser(null);
    toast.info('Logout realizado com sucesso');
  };

  const updateUserInfo = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      storageService.updateCurrentUser(updatedUser);
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
