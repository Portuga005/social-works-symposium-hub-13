
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, CheckCircle, Clock, Download, Eye } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('estatisticas');
  const { adminUser, logout } = useAdminAuth();

  // Buscar estatísticas
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [profilesResult, trabalhosResult] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('trabalhos').select('*, profiles(nome, email, instituicao), areas_tematicas(nome)')
      ]);

      const totalAlunos = profilesResult.data?.length || 0;
      const trabalhos = trabalhosResult.data || [];
      const trabalhoEnviados = trabalhos.length;
      const trabalhosAprovados = trabalhos.filter(t => t.status_avaliacao === 'aprovado').length;
      const trabalhosPendentes = trabalhos.filter(t => t.status_avaliacao === 'pendente').length;
      const trabalhosReprovados = trabalhos.filter(t => t.status_avaliacao === 'rejeitado').length;

      return {
        totalAlunos,
        trabalhoEnviados,
        trabalhosAprovados,
        trabalhosPendentes,
        trabalhosReprovados
      };
    }
  });

  // Buscar lista de alunos com trabalhos
  const { data: alunos } = useQuery({
    queryKey: ['admin-alunos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          trabalhos(
            id,
            titulo,
            status_avaliacao,
            arquivo_url,
            arquivo_nome
          )
        `);

      if (error) throw error;

      return data?.map(profile => ({
        id: profile.id,
        nome: profile.nome,
        cpf: profile.cpf ? `${profile.cpf.slice(0, 3)}.${profile.cpf.slice(3, 6)}.***-**` : 'Não informado',
        email: profile.email,
        instituicao: profile.instituicao || 'Não informada',
        statusTrabalho: profile.trabalhos?.length > 0 ? 'Enviado' : 'Não enviado',
        resultado: profile.trabalhos?.length > 0 ? 
          (profile.trabalhos[0].status_avaliacao === 'aprovado' ? 'Aprovado' :
           profile.trabalhos[0].status_avaliacao === 'rejeitado' ? 'Reprovado' : 'Em análise') : '-',
        trabalho: profile.trabalhos?.[0] || null
      })) || [];
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Aprovado':
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>;
      case 'Reprovado':
        return <Badge className="bg-red-100 text-red-800">Reprovado</Badge>;
      case 'Em análise':
        return <Badge className="bg-yellow-100 text-yellow-800">Em análise</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  const handleDownloadFile = (aluno: any) => {
    if (aluno.trabalho?.arquivo_url) {
      window.open(aluno.trabalho.arquivo_url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

      <div className="container mx-auto px-4 py-8">
        {/* Navegação */}
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

        {/* Conteúdo */}
        {activeTab === 'estatisticas' && (
          <div className="space-y-8">
            {/* Cards de Estatísticas */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalAlunos || 0}</div>
                  <p className="text-xs text-muted-foreground">Cadastrados no sistema</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Trabalhos Enviados</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.trabalhoEnviados || 0}</div>
                  <p className="text-xs text-muted-foreground">Total de submissões</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats?.trabalhosAprovados || 0}</div>
                  <p className="text-xs text-muted-foreground">Trabalhos aprovados</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Em Análise</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{stats?.trabalhosPendentes || 0}</div>
                  <p className="text-xs text-muted-foreground">Aguardando avaliação</p>
                </CardContent>
              </Card>
            </div>

            {/* Gráfico de Distribuição */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Sistema integrado com Supabase funcionando corretamente
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Dados atualizados em tempo real
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'alunos' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lista de Alunos Cadastrados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Nome</th>
                        <th className="text-left py-3 px-4">CPF</th>
                        <th className="text-left py-3 px-4">E-mail</th>
                        <th className="text-left py-3 px-4">Instituição</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Resultado</th>
                        <th className="text-left py-3 px-4">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alunos?.map((aluno) => (
                        <tr key={aluno.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{aluno.nome}</td>
                          <td className="py-3 px-4 text-gray-600">{aluno.cpf}</td>
                          <td className="py-3 px-4 text-gray-600">{aluno.email}</td>
                          <td className="py-3 px-4">{aluno.instituicao}</td>
                          <td className="py-3 px-4">
                            <Badge variant={aluno.statusTrabalho === 'Enviado' ? 'default' : 'secondary'}>
                              {aluno.statusTrabalho}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            {getStatusBadge(aluno.resultado)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              {aluno.statusTrabalho === 'Enviado' && aluno.trabalho && (
                                <>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleDownloadFile(aluno)}
                                  >
                                    <Download className="w-4 h-4 mr-1" />
                                    Baixar
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {(!alunos || alunos.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      Nenhum aluno cadastrado ainda.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
