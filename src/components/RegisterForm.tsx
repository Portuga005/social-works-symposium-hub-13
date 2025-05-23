
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';

interface RegisterFormProps {
  onClose: () => void;
}

export const RegisterForm = ({ onClose }: RegisterFormProps) => {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    instituicao: '',
    senha: '',
    confirmarSenha: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'cpf') {
      value = formatCPF(value);
    }
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro quando o usuário começar a digitar
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validações
    if (!formData.nome || !formData.email || !formData.senha || !formData.confirmarSenha) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      setLoading(false);
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    if (formData.senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.senha,
        options: {
          data: {
            nome: formData.nome,
            instituicao: formData.instituicao,
            cpf: formData.cpf
          }
        }
      });

      if (error) {
        console.error('Erro no cadastro:', error);
        
        if (error.message.includes('already registered')) {
          setError('Este e-mail já está cadastrado. Tente fazer login.');
        } else if (error.message.includes('Email rate limit exceeded')) {
          setError('Muitas tentativas de cadastro. Tente novamente em alguns minutos.');
        } else {
          setError(error.message || 'Erro no cadastro. Tente novamente.');
        }
        return;
      }

      toast.success('Cadastro realizado com sucesso! Você já pode fazer login.');
      onClose();
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      setError('Erro no cadastro: ' + (error.message || 'Tente novamente.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}
      
      <div>
        <Label htmlFor="nome">Nome Completo *</Label>
        <Input
          id="nome"
          value={formData.nome}
          onChange={(e) => handleInputChange('nome', e.target.value)}
          placeholder="Digite seu nome completo"
          required
          disabled={loading}
        />
      </div>
      
      <div>
        <Label htmlFor="cpf">CPF</Label>
        <Input
          id="cpf"
          value={formData.cpf}
          onChange={(e) => handleInputChange('cpf', e.target.value)}
          placeholder="000.000.000-00"
          maxLength={14}
          disabled={loading}
        />
      </div>
      
      <div>
        <Label htmlFor="email">E-mail *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="seu@email.com"
          required
          disabled={loading}
        />
      </div>
      
      <div>
        <Label htmlFor="instituicao">Instituição de Origem</Label>
        <Input
          id="instituicao"
          value={formData.instituicao}
          onChange={(e) => handleInputChange('instituicao', e.target.value)}
          placeholder="Nome da sua instituição"
          disabled={loading}
        />
      </div>
      
      <div>
        <Label htmlFor="senha">Senha *</Label>
        <Input
          id="senha"
          type="password"
          value={formData.senha}
          onChange={(e) => handleInputChange('senha', e.target.value)}
          placeholder="Mínimo 6 caracteres"
          minLength={6}
          required
          disabled={loading}
        />
      </div>
      
      <div>
        <Label htmlFor="confirmarSenha">Confirmar Senha *</Label>
        <Input
          id="confirmarSenha"
          type="password"
          value={formData.confirmarSenha}
          onChange={(e) => handleInputChange('confirmarSenha', e.target.value)}
          placeholder="Digite novamente sua senha"
          required
          disabled={loading}
        />
      </div>
      
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1"
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-unespar-blue hover:bg-unespar-blue/90"
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </Button>
      </div>
    </form>
  );
};
