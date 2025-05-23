
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, FileText, Edit, Trash2, AlertCircle } from 'lucide-react';
import SubmitWorkModal from './SubmitWorkModal';

const SubmissionSection = () => {
  const { user, isAuthenticated } = useAuth();
  const [trabalho, setTrabalho] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [deletingWork, setDeletingWork] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserWork();
    }
  }, [isAuthenticated, user]);

  const fetchUserWork = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('trabalhos')
        .select(`
          *,
          areas_tematicas (nome)
        `)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setTrabalho(data || null);
    } catch (error: any) {
      console.error('Erro ao buscar trabalho:', error);
      if (error.code !== 'PGRST116') {
        toast.error('Erro ao carregar trabalho');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWork = async () => {
    if (!trabalho || !user) return;

    const confirmed = window.confirm(
      'Tem certeza que deseja cancelar a submissão? Esta ação não pode ser desfeita.'
    );

    if (!confirmed) return;

    setDeletingWork(true);
    try {
      // Deletar arquivo do storage se existir
      if (trabalho.arquivo_storage_path) {
        const { error: storageError } = await supabase.storage
          .from('trabalhos')
          .remove([trabalho.arquivo_storage_path]);

        if (storageError) {
          console.error('Erro ao deletar arquivo:', storageError);
        }
      }

      // Deletar trabalho do banco
      const { error } = await supabase
        .from('trabalhos')
        .delete()
        .eq('id', trabalho.id);

      if (error) throw error;

      setTrabalho(null);
      toast.success('Submissão cancelada com sucesso');

    } catch (error: any) {
      console.error('Erro ao deletar trabalho:', error);
      toast.error('Erro ao cancelar submissão: ' + error.message);
    } finally {
      setDeletingWork(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge className="bg-yellow-100 text-yellow-800">Em Análise</Badge>;
      case 'aprovado':
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>;
      case 'rejeitado':
        return <Badge className="bg-red-100 text-red-800">Rejeitado</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'resumo_expandido':
        return 'Resumo Expandido';
      case 'artigo_completo':
        return 'Artigo Completo';
      case 'relato_experiencia':
        return 'Relato de Experiência';
      default:
        return tipo;
    }
  };

  if (!isAuthenticated) {
    return (
      <section id="submissao" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Login Necessário</h3>
              <p className="text-gray-600 mb-6">
                Faça login para submeter seu trabalho ao simpósio.
              </p>
              <Button 
                onClick={() => window.location.href = '/auth'}
                className="bg-unespar-blue hover:bg-unespar-blue/90"
              >
                Fazer Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="submissao" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-unespar-blue mb-4">
            Submissão de Trabalhos
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Envie seu trabalho para avaliação no II Simpósio de Serviço Social da UNESPAR.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {loading ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-unespar-blue mx-auto"></div>
                <p className="mt-4 text-gray-600">Carregando...</p>
              </CardContent>
            </Card>
          ) : trabalho ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{trabalho.titulo}</CardTitle>
                    <div className="flex items-center gap-4 mt-2">
                      {getStatusBadge(trabalho.status_avaliacao)}
                      <span className="text-sm text-gray-600">
                        {getTipoLabel(trabalho.tipo)}
                      </span>
                      <span className="text-sm text-gray-600">
                        {trabalho.areas_tematicas?.nome}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {trabalho.status_avaliacao === 'pendente' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowSubmitModal(true)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDeleteWork}
                          disabled={deletingWork}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          {deletingWork ? 'Cancelando...' : 'Cancelar'}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trabalho.arquivo_nome && (
                    <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <span className="text-sm text-blue-700">
                        Arquivo: {trabalho.arquivo_nome}
                      </span>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Data de Submissão:</strong>
                      <br />
                      {trabalho.data_submissao 
                        ? new Date(trabalho.data_submissao).toLocaleDateString('pt-BR')
                        : '-'
                      }
                    </div>
                    <div>
                      <strong>Data de Avaliação:</strong>
                      <br />
                      {trabalho.data_avaliacao 
                        ? new Date(trabalho.data_avaliacao).toLocaleDateString('pt-BR')
                        : 'Aguardando avaliação'
                      }
                    </div>
                  </div>

                  {trabalho.observacoes && (
                    <div className="p-3 bg-gray-50 border rounded-lg">
                      <strong className="text-sm">Observações:</strong>
                      <p className="text-sm text-gray-600 mt-1">{trabalho.observacoes}</p>
                    </div>
                  )}

                  {trabalho.status_avaliacao === 'rejeitado' && (
                    <div className="mt-4">
                      <Button
                        onClick={() => setShowSubmitModal(true)}
                        className="bg-unespar-blue hover:bg-unespar-blue/90"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Reenviar Trabalho
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nenhum trabalho enviado</h3>
                <p className="text-gray-600 mb-6">
                  Você ainda não enviou nenhum trabalho para o simpósio.
                </p>
                <Button
                  onClick={() => setShowSubmitModal(true)}
                  className="bg-unespar-blue hover:bg-unespar-blue/90"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Enviar Trabalho
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <SubmitWorkModal
          open={showSubmitModal}
          onOpenChange={setShowSubmitModal}
          onSuccess={fetchUserWork}
          existingWork={trabalho}
        />
      </div>
    </section>
  );
};

export default SubmissionSection;
