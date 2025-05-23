
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.senha !== formData.confirmarSenha) {
      toast.error('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    if (formData.senha.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres.');
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
        if (error.message.includes('already registered')) {
          toast.error('Este e-mail já está cadastrado. Tente fazer login.');
        } else {
          toast.error('Erro no cadastro: ' + error.message);
        }
        return;
      }

      toast.success('Cadastro realizado com sucesso! Você já pode fazer login.');
      onClose();
    } catch (error: any) {
      toast.error('Erro no cadastro: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nome">Nome Completo</Label>
        <Input
          id="nome"
          value={formData.nome}
          onChange={(e) => handleInputChange('nome', e.target.value)}
          placeholder="Digite seu nome completo"
          required
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
          required
        />
      </div>
      
      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="seu@email.com"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="instituicao">Instituição de Origem</Label>
        <Input
          id="instituicao"
          value={formData.instituicao}
          onChange={(e) => handleInputChange('instituicao', e.target.value)}
          placeholder="Nome da sua instituição"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="senha">Senha</Label>
        <Input
          id="senha"
          type="password"
          value={formData.senha}
          onChange={(e) => handleInputChange('senha', e.target.value)}
          placeholder="Mínimo 6 caracteres"
          minLength={6}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
        <Input
          id="confirmarSenha"
          type="password"
          value={formData.confirmarSenha}
          onChange={(e) => handleInputChange('confirmarSenha', e.target.value)}
          placeholder="Digite novamente sua senha"
          required
        />
      </div>
      
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1"
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
