
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
    // Initialize storage with only admin and professor users
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
      console.log('Attempting login with:', email, password);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const users = storageService.getUsers();
      console.log('Available users:', users);
      
      const foundUser = users.find(u => u.email === email && u.password === password);
      console.log('Found user?', foundUser);
      
      if (foundUser) {
        // Create a copy without the password field for security
        const { password: _, ...userWithoutPassword } = foundUser;
        
        setUser(userWithoutPassword as User);
        storageService.updateCurrentUser(userWithoutPassword as User);
        
        // Show success message based on role
        if (foundUser.role === 'admin') {
          toast.success('Login administrativo realizado com sucesso!');
        } else if (foundUser.role === 'professor') {
          toast.success('Login de professor realizado com sucesso!');
        } else {
          toast.success('Login realizado com sucesso!');
        }
        return;
      }
      
      throw new Error('Credenciais inválidas');
    } catch (error) {
      toast.error('Erro ao fazer login. Verifique suas credenciais.');
      console.error(error);
      throw error; // Re-throw to allow catching in the login component
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
