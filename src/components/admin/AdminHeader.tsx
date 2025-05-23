
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

const AdminHeader = () => {
  const { adminUser, logout } = useAdminAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-unespar-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-unespar-blue">Painel Administrativo</h1>
              <p className="text-sm text-gray-600">
                Bem-vindo, {adminUser?.nome} | II Simpósio de Serviço Social
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={logout}>
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
