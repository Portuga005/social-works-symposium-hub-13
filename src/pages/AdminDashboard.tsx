
import { useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminNavigation from '@/components/admin/AdminNavigation';
import StatisticsCards from '@/components/admin/StatisticsCards';
import SystemSummary from '@/components/admin/SystemSummary';
import StudentsTable from '@/components/admin/StudentsTable';
import { useAdminStats } from '@/hooks/useAdminStats';
import { useAdminStudents } from '@/hooks/useAdminStudents';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('estatisticas');
  const { data: stats } = useAdminStats();
  const { data: alunos } = useAdminStudents();

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="container mx-auto px-4 py-8">
        <AdminNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'estatisticas' && (
          <div className="space-y-8">
            <StatisticsCards stats={stats} />
            <SystemSummary />
          </div>
        )}

        {activeTab === 'alunos' && (
          <div className="space-y-6">
            <StudentsTable alunos={alunos} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
