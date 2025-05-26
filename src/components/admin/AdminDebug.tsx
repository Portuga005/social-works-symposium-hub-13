
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

const AdminDebug = () => {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testDatabaseConnection = async () => {
    setLoading(true);
    console.log('🔍 Testando conexão com banco de dados...');
    
    try {
      // Testar conexão básica
      const { data: areas, error: areasError } = await supabase
        .from('areas_tematicas')
        .select('*')
        .limit(5);

      // Testar tabela de admins
      const { data: admins, error: adminsError } = await supabase
        .from('admin_users')
        .select('id, email, nome, ativo')
        .limit(5);

      // Testar estatísticas administrativas
      const { data: stats, error: statsError } = await supabase
        .rpc('get_admin_statistics');

      const info = {
        timestamp: new Date().toISOString(),
        areas_tematicas: {
          data: areas,
          error: areasError,
          count: areas?.length || 0
        },
        admin_users: {
          data: admins,
          error: adminsError,
          count: admins?.length || 0
        },
        statistics: {
          data: stats,
          error: statsError
        },
        status: 'Conexão estabelecida com sucesso'
      };

      setDebugInfo(info);
      console.log('✅ Debug info:', info);
    } catch (error) {
      console.error('❌ Erro no teste:', error);
      setDebugInfo({
        timestamp: new Date().toISOString(),
        error: error,
        status: 'Erro na conexão'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-sm">Debug do Sistema</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testDatabaseConnection} 
          disabled={loading}
          size="sm" 
          variant="outline"
          className="w-full"
        >
          {loading ? 'Testando...' : 'Testar Conexão BD'}
        </Button>
        
        {debugInfo && (
          <div className="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-64">
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}
        
        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Status:</strong> Sistema operacional</p>
          <p><strong>Versão:</strong> 2.0 (Login Seguro)</p>
          <p><strong>Banco:</strong> Supabase PostgreSQL</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminDebug;
