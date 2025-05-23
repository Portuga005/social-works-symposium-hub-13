
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Download, CheckCircle, XCircle } from 'lucide-react';
import { submitAvaliacao } from '@/services/avaliacaoService';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const handleAvaliacao = async (resultado: 'aprovado' | 'rejeitado') => {
    setLoading(true);
    
    try {
      await submitAvaliacao(trabalho.trabalho_id, professorId, resultado, feedback);
      
      toast({
        title: `Trabalho ${resultado}!`,
        description: `A avaliação foi registrada no sistema.`,
      });
      
      setFeedback('');
      onAvaliacaoSubmitted();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao avaliar",
        description: "Não foi possível registrar a avaliação. Tente novamente.",
      });
    } finally {
      setLoading(false);
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
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Baixar {trabalho.arquivo_nome}
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Visualizar
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
