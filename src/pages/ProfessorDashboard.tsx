
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle, Clock, LogOut } from 'lucide-react';
import { useProfessorAuth } from '@/contexts/ProfessorAuthContext';
import { useTrabalhosAtribuidos } from '@/hooks/useTrabalhosAtribuidos';
import TrabalhoCard from '@/components/professor/TrabalhoCard';
import { useNavigate } from 'react-router-dom';

const ProfessorDashboard = () => {
  const [activeTab, setActiveTab] = useState('pendentes');
  const { professor, logout } = useProfessorAuth();
  const navigate = useNavigate();
  
  const { data: trabalhos = [], refetch } = useTrabalhosAtribuidos(professor?.id || null);

  const trabalhosPendentes = trabalhos.filter(t => t.status_avaliacao === 'pendente');
  const trabalhosAvaliados = trabalhos.filter(t => t.status_avaliacao !== 'pendente');

  const stats = {
    pendentes: trabalhosPendentes.length,
    avaliados: trabalhosAvaliados.length,
    total: trabalhos.length
  };

  const handleLogout = () => {
    logout();
    navigate('/professor/login');
  };

  const handleAvaliacaoSubmitted = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-social-orange rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-unespar-blue">Painel do Professor</h1>
                <p className="text-sm text-gray-600">Bem-vindo, {professor?.nome}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Cards de Estatísticas */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trabalhos Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendentes}</div>
              <p className="text-xs text-muted-foreground">Aguardando avaliação</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Já Avaliados</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.avaliados}</div>
              <p className="text-xs text-muted-foreground">Trabalhos concluídos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Atribuídos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Atribuídos a você</p>
            </CardContent>
          </Card>
        </div>

        {/* Navegação */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
            <Button
              variant={activeTab === 'pendentes' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('pendentes')}
              className="flex-1"
            >
              Pendentes ({stats.pendentes})
            </Button>
            <Button
              variant={activeTab === 'avaliados' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('avaliados')}
              className="flex-1"
            >
              Avaliados ({stats.avaliados})
            </Button>
          </div>
        </div>

        {/* Conteúdo */}
        {activeTab === 'pendentes' && (
          <div className="space-y-6">
            {trabalhosPendentes.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum trabalho pendente</h3>
                  <p className="text-gray-600">Todos os trabalhos atribuídos a você foram avaliados.</p>
                </CardContent>
              </Card>
            ) : (
              trabalhosPendentes.map((trabalho) => (
                <TrabalhoCard
                  key={trabalho.trabalho_id}
                  trabalho={trabalho}
                  professorId={professor?.id || ''}
                  onAvaliacaoSubmitted={handleAvaliacaoSubmitted}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'avaliados' && (
          <div className="space-y-6">
            {trabalhosAvaliados.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum trabalho avaliado</h3>
                  <p className="text-gray-600">Você ainda não avaliou nenhum trabalho.</p>
                </CardContent>
              </Card>
            ) : (
              trabalhosAvaliados.map((trabalho) => (
                <TrabalhoCard
                  key={trabalho.trabalho_id}
                  trabalho={trabalho}
                  professorId={professor?.id || ''}
                  onAvaliacaoSubmitted={handleAvaliacaoSubmitted}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessorDashboard;
