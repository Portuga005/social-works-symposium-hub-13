
import { useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminNavigation from '@/components/admin/AdminNavigation';
import StatisticsCards from '@/components/admin/StatisticsCards';
import SystemSummary from '@/components/admin/SystemSummary';
import StudentsTable from '@/components/admin/StudentsTable';
import ProfessoresSection from '@/components/admin/ProfessoresSection';
import { useAdminStats } from '@/hooks/useAdminStats';
import { useAdminStudents } from '@/hooks/useAdminStudents';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('estatisticas');
  const { data: stats, isLoading: statsLoading, error: statsError } = useAdminStats();
  const { data: alunos, isLoading: alunosLoading, error: alunosError } = useAdminStudents();

  console.log('=== ADMIN DASHBOARD ===');
  console.log('Stats:', stats);
  console.log('Stats loading:', statsLoading);
  console.log('Stats error:', statsError);
  console.log('Alunos:', alunos);
  console.log('Alunos loading:', alunosLoading);
  console.log('Alunos error:', alunosError);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="container mx-auto px-4 py-8">
        <AdminNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'estatisticas' && (
          <div className="space-y-8">
            {statsLoading && <div className="text-center">Carregando estatísticas...</div>}
            {statsError && <div className="text-center text-red-500">Erro ao carregar estatísticas: {statsError.message}</div>}
            <StatisticsCards stats={stats} />
            <SystemSummary />
          </div>
        )}

        {activeTab === 'alunos' && (
          <div className="space-y-6">
            {alunosLoading && <div className="text-center">Carregando alunos...</div>}
            {alunosError && <div className="text-center text-red-500">Erro ao carregar alunos: {alunosError.message}</div>}
            <StudentsTable alunos={alunos} />
          </div>
        )}

        {activeTab === 'professores' && (
          <ProfessoresSection />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
