
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, CheckCircle, Clock, Download, Eye } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('estatisticas');

  // Dados simulados
  const stats = {
    totalAlunos: 156,
    trabalhoEnviados: 89,
    trabalhosAprovados: 23,
    trabalhosPendentes: 45,
    trabalhosReprovados: 21
  };

  const alunos = [
    {
      id: 1,
      nome: 'Maria Silva Santos',
      cpf: '123.456.***-**',
      email: 'maria@email.com',
      instituicao: 'UNESPAR',
      statusTrabalho: 'Enviado',
      resultado: 'Aprovado'
    },
    {
      id: 2,
      nome: 'João Oliveira Costa',
      cpf: '987.654.***-**',
      email: 'joao@email.com',
      instituicao: 'UEL',
      statusTrabalho: 'Enviado',
      resultado: 'Em análise'
    },
    {
      id: 3,
      nome: 'Ana Paula Ferreira',
      cpf: '456.789.***-**',
      email: 'ana@email.com',
      instituicao: 'UEM',
      statusTrabalho: 'Não enviado',
      resultado: '-'
    }
  ];

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
                <p className="text-sm text-gray-600">II Simpósio de Serviço Social</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
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
                  <div className="text-2xl font-bold">{stats.totalAlunos}</div>
                  <p className="text-xs text-muted-foreground">Cadastrados no sistema</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Trabalhos Enviados</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.trabalhoEnviados}</div>
                  <p className="text-xs text-muted-foreground">Total de submissões</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Aprovados</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.trabalhosAprovados}</div>
                  <p className="text-xs text-muted-foreground">Trabalhos aprovados</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Em Análise</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{stats.trabalhosPendentes}</div>
                  <p className="text-xs text-muted-foreground">Aguardando avaliação</p>
                </CardContent>
              </Card>
            </div>

            {/* Gráfico de Distribuição */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Área Temática</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Políticas Públicas</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-unespar-blue h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                      <span className="text-sm font-medium">26</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Direitos Sociais</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-social-orange h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                      <span className="text-sm font-medium">18</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Família e Comunidade</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-unespar-green h-2 rounded-full" style={{ width: '55%' }}></div>
                      </div>
                      <span className="text-sm font-medium">22</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pesquisa e Metodologia</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                      <span className="text-sm font-medium">14</span>
                    </div>
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
                      {alunos.map((aluno) => (
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
                              {aluno.statusTrabalho === 'Enviado' && (
                                <>
                                  <Button size="sm" variant="outline">
                                    <Eye className="w-4 h-4 mr-1" />
                                    Ver
                                  </Button>
                                  <Button size="sm" variant="outline">
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
