
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

  const resetAdminPassword = async () => {
    setLoading(true);
    try {
      // Primeiro, vamos atualizar diretamente o admin existente
      const { data, error } = await supabase
        .from('admin_users')
        .update({
          password_hash: crypt('admin123', gen_salt('bf'))
        })
        .eq('email', 'admin@unespar.edu.br')
        .select();

      if (error) {
        console.error('Erro ao atualizar senha:', error);
        alert('Erro ao atualizar senha: ' + error.message);
      } else {
        console.log('Senha atualizada:', data);
        alert('Senha do admin resetada com sucesso!\nEmail: admin@unespar.edu.br\nSenha: admin123');
        checkAdmins();
      }
    } catch (error) {
      console.error('Erro geral:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewAdmin = async () => {
    setLoading(true);
    try {
      // Tentar inserir um novo admin com senha criptografada
      const { data, error } = await supabase.rpc('create_admin_user', {
        admin_email: 'admin@unespar.edu.br',
        admin_nome: 'Administrador do Sistema',
        admin_password: 'admin123'
      });

      if (error) {
        console.error('Erro ao criar admin via RPC:', error);
        alert('Erro ao criar admin: ' + error.message);
      } else {
        console.log('Admin criado via RPC:', data);
        alert('Admin criado com sucesso!\nEmail: admin@unespar.edu.br\nSenha: admin123');
        checkAdmins();
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
      const { data, error } = await supabase.rpc('validate_admin_login', {
        admin_email: 'admin@unespar.edu.br',
        admin_password: 'admin123'
      });

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

  const testPasswordHash = async () => {
    setLoading(true);
    try {
      // Testar como a senha está sendo hashada
      const { data, error } = await supabase.rpc('test_password_hash', {
        password_input: 'admin123'
      });

      console.log('Resultado do hash de senha:', data);
      if (error) {
        console.error('Erro no teste de hash:', error);
      } else {
        alert('Hash gerado: ' + JSON.stringify(data));
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
            Testar Login
          </Button>
          <Button onClick={resetAdminPassword} disabled={loading} variant="secondary">
            Resetar Senha Admin
          </Button>
          <Button onClick={createNewAdmin} disabled={loading} variant="secondary">
            Criar Novo Admin (RPC)
          </Button>
          <Button onClick={testPasswordHash} disabled={loading} variant="ghost">
            Testar Hash Senha
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
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminDebug;
