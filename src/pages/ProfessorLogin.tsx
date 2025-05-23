
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ProfessorLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Attempting professor login with:', credentials.email);
      
      // Use the AuthContext login function
      await login(credentials.email, credentials.password);
      
      // Check if the email is correct for a professor
      if (credentials.email === 'profa@unespar.edu.br') {
        toast.success("Login realizado com sucesso! Redirecionando para o painel de avaliação...");
        navigate('/professor/dashboard');
      } else {
        throw new Error('Credenciais inválidas');
      }
    } catch (error) {
      toast.error("Credenciais inválidas. Tente novamente.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-social-orange to-red-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-social-orange rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">P</span>
          </div>
          <CardTitle className="text-2xl text-unespar-blue">Painel do Professor</CardTitle>
          <p className="text-gray-600">Acesso para avaliação de trabalhos</p>
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
                placeholder="professor@unespar.edu.br"
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
              className="w-full bg-social-orange hover:bg-social-orange/90"
            >
              {loading ? "Entrando..." : "Entrar no Painel"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <a href="/" className="text-social-orange hover:underline text-sm">
              ← Voltar ao site principal
            </a>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              <strong>Demo:</strong> Use email "profa@unespar.edu.br" e senha "prof123"
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessorLogin;
