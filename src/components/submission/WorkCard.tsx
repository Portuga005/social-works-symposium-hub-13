
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Edit, Trash2, Upload } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface WorkCardProps {
  trabalho: any;
  onEdit: () => void;
  onDelete: () => void;
  deletingWork: boolean;
}

const WorkCard = ({ trabalho, onEdit, onDelete, deletingWork }: WorkCardProps) => {
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

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{trabalho.titulo}</CardTitle>
            <div className="flex items-center gap-4 mt-2">
              <StatusBadge status={trabalho.status_avaliacao} />
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
                  onClick={onEdit}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDelete}
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
                onClick={onEdit}
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
  );
};

export default WorkCard;
