
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Download, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProfessorDashboard = () => {
  const [activeTab, setActiveTab] = useState('pendentes');
  const [feedback, setFeedback] = useState('');
  const { toast } = useToast();

  // Dados simulados
  const stats = {
    pendentes: 3,
    avaliados: 12
  };

  const trabalhosPendentes = [
    {
      id: 1,
      titulo: 'Políticas Públicas de Assistência Social: Desafios na Implementação',
      areaTematica: 'Políticas Públicas',
      dataEnvio: '2025-01-15',
      arquivo: 'trabalho1.pdf'
    },
    {
      id: 2,
      titulo: 'Serviço Social e Saúde Mental: Práticas Inovadoras',
      areaTematica: 'Saúde Mental',
      dataEnvio: '2025-01-16',
      arquivo: 'trabalho2.pdf'
    },
    {
      id: 3,
      titulo: 'Direitos da Criança e do Adolescente: Análise de Casos',
      areaTematica: 'Direitos Humanos',
      dataEnvio: '2025-01-17',
      arquivo: 'trabalho3.pdf'
    }
  ];

  const trabalhosAvaliados = [
    {
      id: 4,
      titulo: 'Família e Vulnerabilidade Social',
      areaTematica: 'Família',
      dataAvaliacao: '2025-01-10',
      resultado: 'Aprovado',
      feedback: 'Trabalho bem estruturado com boa fundamentação teórica.'
    },
    {
      id: 5,
      titulo: 'Metodologia em Serviço Social',
      areaTematica: 'Metodologia',
      dataAvaliacao: '2025-01-12',
      resultado: 'Reprovado',
      feedback: 'Necessita melhor desenvolvimento metodológico.'
    }
  ];

  const handleAvaliacao = (id: number, resultado: 'Aprovado' | 'Reprovado') => {
    toast({
      title: `Trabalho ${resultado.toLowerCase()}!`,
      description: `O resultado foi registrado no sistema.`,
    });
    
    console.log(`Trabalho ${id} ${resultado} com feedback: ${feedback}`);
    setFeedback('');
  };

  const getResultadoBadge = (resultado: string) => {
    switch (resultado) {
      case 'Aprovado':
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>;
      case 'Reprovado':
        return <Badge className="bg-red-100 text-red-800">Reprovado</Badge>;
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
              <div className="w-10 h-10 bg-social-orange rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-unespar-blue">Painel do Professor</h1>
                <p className="text-sm text-gray-600">Avaliação de Trabalhos</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
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
              <CardTitle className="text-sm font-medium">Total Geral</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendentes + stats.avaliados}</div>
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
            {trabalhosPendentes.map((trabalho) => (
              <Card key={trabalho.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{trabalho.titulo}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Área: {trabalho.areaTematica}</span>
                        <span>•</span>
                        <span>Enviado em: {new Date(trabalho.dataEnvio).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                      Pendente
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Baixar {trabalho.arquivo}
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Feedback (opcional):</label>
                    <Textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Digite suas observações sobre o trabalho..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => handleAvaliacao(trabalho.id, 'Aprovado')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Aprovar
                    </Button>
                    <Button
                      onClick={() => handleAvaliacao(trabalho.id, 'Reprovado')}
                      variant="destructive"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reprovar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'avaliados' && (
          <div className="space-y-6">
            {trabalhosAvaliados.map((trabalho) => (
              <Card key={trabalho.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{trabalho.titulo}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Área: {trabalho.areaTematica}</span>
                        <span>•</span>
                        <span>Avaliado em: {new Date(trabalho.dataAvaliacao).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    {getResultadoBadge(trabalho.resultado)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Feedback dado:</label>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded mt-1">
                        {trabalho.feedback}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessorDashboard;
