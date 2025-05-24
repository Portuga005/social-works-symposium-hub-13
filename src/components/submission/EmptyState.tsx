
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface EmptyStateProps {
  onSubmit: () => void;
}

const EmptyState = ({ onSubmit }: EmptyStateProps) => {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Nenhum trabalho enviado</h3>
        <p className="text-gray-600 mb-6">
          Você ainda não enviou nenhum trabalho para o simpósio.
        </p>
        <Button
          onClick={onSubmit}
          className="bg-unespar-blue hover:bg-unespar-blue/90"
        >
          <Upload className="w-4 h-4 mr-2" />
          Enviar Trabalho
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
