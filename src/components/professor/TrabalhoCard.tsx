import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Download, CheckCircle, XCircle } from 'lucide-react';
import { submitAvaliacao } from '@/services/avaliacaoService';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

type TrabalhoCardProps = {
  trabalho: {
    trabalho_id: string;
    titulo: string;
    area_tematica: string;
    autor_nome: string;
    autor_email: string;
    data_submissao: string;
    status_avaliacao: string;
    arquivo_nome: string;
  };
  professorId: string;
  onAvaliacaoSubmitted: () => void;
};

const TrabalhoCard = ({ trabalho, professorId, onAvaliacaoSubmitted }: TrabalhoCardProps) => {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadingFile, setDownloadingFile] = useState(false);

  const handleAvaliacao = async (resultado: 'aprovado' | 'rejeitado') => {
    setLoading(true);
    
    try {
      await submitAvaliacao(trabalho.trabalho_id, professorId, resultado, feedback);
      
      toast.success(`Trabalho ${resultado}! A avaliação foi registrada no sistema.`);
      
      setFeedback('');
      onAvaliacaoSubmitted();
    } catch (error) {
      toast.error("Não foi possível registrar a avaliação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadFile = async () => {
    if (!trabalho.arquivo_nome) {
      toast.error("Arquivo não encontrado.");
      return;
    }

    setDownloadingFile(true);
    
    try {
      // Buscar o trabalho completo para obter o user_id e arquivo_storage_path
      const { data: trabalhoCompleto, error } = await supabase
        .from('trabalhos')
        .select('user_id, arquivo_storage_path, arquivo_nome')
        .eq('id', trabalho.trabalho_id)
        .single();

      if (error || !trabalhoCompleto) {
        throw new Error('Trabalho não encontrado');
      }

      const filePath = trabalhoCompleto.arquivo_storage_path || `${trabalhoCompleto.user_id}/${trabalho.arquivo_nome}`;

      // Download do arquivo do Supabase Storage
      const { data, error: downloadError } = await supabase.storage
        .from('trabalhos')
        .download(filePath);

      if (downloadError) {
        throw new Error('Erro ao baixar arquivo: ' + downloadError.message);
      }

      // Criar URL para download
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = trabalho.arquivo_nome;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("O arquivo está sendo baixado.");

    } catch (error: any) {
      console.error('Error downloading file:', error);
      toast.error(error.message || "Não foi possível baixar o arquivo.");
    } finally {
      setDownloadingFile(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pendente</Badge>;
      case 'aprovado':
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>;
      case 'rejeitado':
        return <Badge className="bg-red-100 text-red-800">Rejeitado</Badge>;
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  const isPendente = trabalho.status_avaliacao === 'pendente';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg">{trabalho.titulo}</CardTitle>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Área: {trabalho.area_tematica}</span>
              <span>•</span>
              <span>Autor: {trabalho.autor_nome}</span>
              <span>•</span>
              <span>Enviado em: {new Date(trabalho.data_submissao).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
          {getStatusBadge(trabalho.status_avaliacao)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleDownloadFile}
            disabled={downloadingFile || !trabalho.arquivo_nome}
          >
            <Download className="w-4 h-4 mr-2" />
            {downloadingFile ? 'Baixando...' : `Baixar ${trabalho.arquivo_nome}`}
          </Button>
        </div>
        
        {isPendente && (
          <>
            <div className="space-y-3">
              <label className="text-sm font-medium">Comentários (opcional):</label>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Digite suas observações sobre o trabalho..."
                rows={3}
              />
            </div>
            
            <div className="flex space-x-3">
              <Button
                onClick={() => handleAvaliacao('aprovado')}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Aprovar
              </Button>
              <Button
                onClick={() => handleAvaliacao('rejeitado')}
                disabled={loading}
                variant="destructive"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reprovar
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TrabalhoCard;
