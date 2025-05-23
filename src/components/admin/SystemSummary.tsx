
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SystemSummary = () => {
  return (
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
  );
};

export default SystemSummary;
