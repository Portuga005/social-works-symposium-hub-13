
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

  const createTestAdmin = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .insert({
          email: 'admin@unespar.edu.br',
          nome: 'Administrador Teste',
          password_hash: '$2b$12$LQv3c1yqBwWFLr5f.9dOle4uQyHyFILd4d8p5F1V4E0C0M1F5v1Y2', // senha: admin123
          ativo: true
        })
        .select();

      if (error) {
        console.error('Erro ao criar admin:', error);
        alert('Erro ao criar admin: ' + error.message);
      } else {
        console.log('Admin criado:', data);
        alert('Admin teste criado com sucesso!\nEmail: admin@unespar.edu.br\nSenha: admin123');
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

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>Debug Admin Login</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-x-2">
          <Button onClick={checkAdmins} disabled={loading}>
            Verificar Admins
          </Button>
          <Button onClick={createTestAdmin} disabled={loading} variant="secondary">
            Criar Admin Teste
          </Button>
          <Button onClick={testLogin} disabled={loading} variant="outline">
            Testar Login
          </Button>
        </div>
        
        {admins.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Admins encontrados:</h3>
            <pre className="bg-gray-100 p-2 rounded text-sm">
              {JSON.stringify(admins, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminDebug;
