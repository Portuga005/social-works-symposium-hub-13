
import { Button } from '@/components/ui/button';

interface AdminNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminNavigation = ({ activeTab, setActiveTab }: AdminNavigationProps) => {
  return (
    <div className="mb-8">
      <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
        <Button
          variant={activeTab === 'estatisticas' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('estatisticas')}
          className="flex-1"
        >
          Estatísticas
        </Button>
        <Button
          variant={activeTab === 'alunos' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('alunos')}
          className="flex-1"
        >
          Alunos
        </Button>
      </div>
    </div>
  );
};

export default AdminNavigation;
