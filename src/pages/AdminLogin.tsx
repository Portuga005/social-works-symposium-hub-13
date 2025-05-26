
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAdminUser, isAdminAuthenticated } = useAdminAuth();

  useEffect(() => {
    if (isAdminAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAdminAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('validate-admin-login', {
        body: {
          email: credentials.email,
          password: credentials.password
        }
      });

      if (error) {
        throw new Error(error.message || 'Erro na validação');
      }

      if (data?.success && data?.admin) {
        localStorage.setItem('admin_session', JSON.stringify(data.admin));
        setAdminUser(data.admin);

        toast.success("Login realizado com sucesso!");
        navigate('/admin/dashboard');
      } else {
        throw new Error(data?.error || 'Credenciais inválidas');
      }
    } catch (error: any) {
      toast.error(error.message || "Credenciais inválidas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-unespar-blue to-unespar-green flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
            
            <div className="mt-6 text-center">
              <a href="/" className="text-unespar-blue hover:underline text-sm">
                ← Voltar ao site principal
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
