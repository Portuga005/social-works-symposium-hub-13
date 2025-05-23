
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type AdminUser = {
  id: string;
  email: string;
  nome: string;
  loginTime: string;
};

type AdminAuthContextType = {
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  logout: () => void;
  setAdminUser: (user: AdminUser) => void;
};

const AdminAuthContext = createContext<AdminAuthContextType>({} as AdminAuthContextType);

export const useAdminAuth = () => {
  return useContext(AdminAuthContext);
};

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [adminUser, setAdminUserState] = useState<AdminUser | null>(null);

  useEffect(() => {
    // Verificar se há sessão admin salva no localStorage
    const savedAdminSession = localStorage.getItem('admin_session');
    if (savedAdminSession) {
      try {
        const adminData = JSON.parse(savedAdminSession);
        setAdminUserState(adminData);
      } catch (error) {
        console.error('Erro ao recuperar sessão admin:', error);
        localStorage.removeItem('admin_session');
      }
    }
  }, []);

  const setAdminUser = (user: AdminUser) => {
    setAdminUserState(user);
  };

  const logout = () => {
    localStorage.removeItem('admin_session');
    setAdminUserState(null);
    window.location.href = '/admin/login';
  };

  return (
    <AdminAuthContext.Provider 
      value={{ 
        adminUser,
        isAdminAuthenticated: !!adminUser,
        logout,
        setAdminUser
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
