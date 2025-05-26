
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

const AdminDebug = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const checkAdmins = async () => {
    setLoading(true);
    try {
      // Verificar se há admins na tabela
      const { data, error } = await supabase
        .from('admin_users')
        .select('id, email, nome, ativo');
      
      if (error) {
        console.error('Erro ao buscar admins:', error);
        alert('Erro ao buscar admins: ' + error.message);
      } else {
        console.log('Admins encontrados:', data);
        setAdmins(data || []);
      }
    } catch (error) {
      console.error('Erro geral:', error);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      // Criar função RPC temporária para teste
      const { data, error } = await supabase.rpc('check_admin_access');

      console.log('Resultado do teste de login:', data);
      console.log('Erro (se houver):', error);

      if (error) {
        alert('Erro na validação: ' + error.message);
      } else {
        alert('Resultado do teste: ' + JSON.stringify(data));
      }
    } catch (error) {
      console.error('Erro geral:', error);
    } finally {
      setLoading(false);
    }
  };

  const directInsertAdmin = async () => {
    setLoading(true);
    try {
      // Tentar inserir diretamente com senha simples (para teste)
      const { data, error } = await supabase
        .from('admin_users')
        .insert({
          email: 'admin@unespar.edu.br',
          nome: 'Administrador',
          password_hash: 'admin123', // Senha em texto plano para teste
          ativo: true
        })
        .select();

      if (error) {
        console.error('Erro ao inserir admin:', error);
        alert('Erro ao inserir admin: ' + error.message);
      } else {
        console.log('Admin inserido:', data);
        alert('Admin criado com sucesso!\nEmail: admin@unespar.edu.br\nSenha: admin123');
        checkAdmins();
      }
    } catch (error) {
      console.error('Erro geral:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAllAdmins = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all except impossible id

      if (error) {
        console.error('Erro ao deletar admins:', error);
        alert('Erro ao deletar admins: ' + error.message);
      } else {
        console.log('Admins deletados:', data);
        alert('Todos os admins foram deletados');
        checkAdmins();
      }
    } catch (error) {
      console.error('Erro geral:', error);
    } finally {
      setLoading(false);
    }
  };

  const testDirectSelect = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', 'admin@unespar.edu.br')
        .single();

      console.log('Admin encontrado:', data);
      console.log('Erro (se houver):', error);

      if (error) {
        alert('Erro na busca: ' + error.message);
      } else {
        alert('Admin encontrado: ' + JSON.stringify(data, null, 2));
      }
    } catch (error) {
      console.error('Erro geral:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>Debug Admin Login - Diagnóstico Completo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={checkAdmins} disabled={loading} variant="outline">
            Verificar Admins
          </Button>
          <Button onClick={testLogin} disabled={loading} variant="outline">
            Testar Access RPC
          </Button>
          <Button onClick={directInsertAdmin} disabled={loading} variant="secondary">
            Criar Admin Direto
          </Button>
          <Button onClick={testDirectSelect} disabled={loading} variant="secondary">
            Buscar Admin Específico
          </Button>
          <Button onClick={deleteAllAdmins} disabled={loading} variant="destructive">
            Deletar Todos Admins
          </Button>
        </div>
        
        {admins.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Admins encontrados:</h3>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
              {JSON.stringify(admins, null, 2)}
            </pre>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Email padrão: admin@unespar.edu.br</p>
          <p>• Senha padrão: admin123</p>
          <p>• Verifique o console do navegador para logs detalhados</p>
          <p>• Use "Criar Admin Direto" para inserir um admin de teste</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminDebug;
