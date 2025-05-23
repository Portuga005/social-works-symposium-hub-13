
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from '@/components/LoginForm';
import { RegisterForm } from '@/components/RegisterForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Auth = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('login');

  // Redirect authenticated users to home page
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-unespar-blue to-unespar-green flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-unespar-blue">
            II Simpósio de Serviço Social
          </CardTitle>
          <p className="text-gray-600">UNESPAR - Campus de Apucarana</p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Cadastrar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-6">
              <LoginForm onClose={() => {}} />
            </TabsContent>
            
            <TabsContent value="register" className="mt-6">
              <RegisterForm onClose={() => setActiveTab('login')} />
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center">
            <a href="/" className="text-unespar-blue hover:underline text-sm">
              ← Voltar ao site principal
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
