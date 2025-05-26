
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminDebug from '@/components/admin/AdminDebug';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showDebug, setShowDebug] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setAdminUser, isAdminAuthenticated } = useAdminAuth();

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAdminAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log('=== INÍCIO DO LOGIN SEGURO ===');
    console.log('Tentando fazer login com:', credentials.email);

    try {
      // Chamar função Edge segura para validação
      const { data, error } = await supabase.functions.invoke('validate-admin-login', {
        body: {
          email: credentials.email,
          password: credentials.password
        }
      });

      console.log('Resposta da função:', data);
      console.log('Erro (se houver):', error);

      if (error) {
        throw new Error(error.message || 'Erro na validação');
      }

      if (data?.success && data?.admin) {
        console.log('Login bem-sucedido! Dados do admin:', data.admin);

        // Armazenar dados do admin no localStorage e contexto
        localStorage.setItem('admin_session', JSON.stringify(data.admin));
        setAdminUser(data.admin);

        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando para o painel administrativo...",
        });
        navigate('/admin/dashboard');
      } else {
        throw new Error(data?.error || 'Credenciais inválidas');
      }
    } catch (error: any) {
      console.error('=== ERRO NO LOGIN ===');
      console.error('Erro completo:', error);
      
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: error.message || "Credenciais inválidas. Tente novamente.",
      });
    } finally {
      setLoading(false);
      console.log('=== FIM DO LOGIN ===');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-unespar-blue to-unespar-green flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-unespar-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">A</span>
            </div>
            <CardTitle className="text-2xl text-unespar-blue">Painel Administrativo</CardTitle>
            <p className="text-gray-600">Acesso para coordenadores do simpósio</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="admin@unespar.edu.br"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Digite sua senha"
                  required
                />
              </div>
              
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-unespar-blue hover:bg-unespar-blue/90"
              >
                {loading ? "Validando..." : "Entrar no Painel"}
              </Button>
            </form>
            
            <div className="mt-6 space-y-2 text-center">
              <a href="/" className="text-unespar-blue hover:underline text-sm block">
                ← Voltar ao site principal
              </a>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowDebug(!showDebug)}
                className="text-xs"
              >
                {showDebug ? 'Ocultar' : 'Mostrar'} Debug
              </Button>
              
              <div className="text-xs text-gray-500 space-y-1 border-t pt-2">
                <p><strong>Teste:</strong> admin@unespar.edu.br</p>
                <p><strong>Senha:</strong> admin123</p>
                <p className="text-green-600">🔒 Login seguro ativado</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {showDebug && <AdminDebug />}
      </div>
    </div>
  );
};

export default AdminLogin;
