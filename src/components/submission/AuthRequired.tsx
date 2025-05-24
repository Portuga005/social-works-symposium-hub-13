
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

const AuthRequired = () => {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Login Necessário</h3>
        <p className="text-gray-600 mb-6">
          Faça login para submeter seu trabalho ao simpósio.
        </p>
        <Button 
          onClick={() => window.location.href = '/auth'}
          className="bg-unespar-blue hover:bg-unespar-blue/90"
        >
          Fazer Login
        </Button>
      </CardContent>
    </Card>
  );
};

export default AuthRequired;
