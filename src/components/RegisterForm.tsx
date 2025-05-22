import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import storageService from '@/services/storageService';
import { toast } from 'sonner';

const registerSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido (formato: 123.456.789-00)'),
  instituicao: z.string().min(2, 'Instituição deve ter pelo menos 2 caracteres'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmarSenha: z.string(),
  termos: z.boolean().refine(val => val === true, 'Você deve aceitar os termos'),
}).refine(data => data.senha === data.confirmarSenha, {
  message: "As senhas não coincidem",
  path: ["confirmarSenha"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>({
    nome: '',
    email: '',
    cpf: '',
    instituicao: '',
    senha: '',
    confirmarSenha: '',
    termos: false,
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const { toast: uiToast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field: keyof RegisterFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when field is edited
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const formatCPF = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Apply CPF mask (123.456.789-00)
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    } else if (digits.length <= 9) {
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    } else {
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCPF = formatCPF(e.target.value);
    handleInputChange('cpf', formattedCPF);
  };

  const handleRegister = (formData: RegisterFormData) => {
    try {
      // Check if user with this email already exists
      const users = storageService.getUsers();
      const userExists = users.some(u => u.email === formData.email);
      
      if (userExists) {
        toast.error('Um usuário com este e-mail já existe.');
        return;
      }
      
      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        nome: formData.nome,
        email: formData.email,
        cpf: formData.cpf,
        instituicao: formData.instituicao,
        trabalhosSubmetidos: false,
        role: 'user'
      };
      
      // Save user
      storageService.saveUser(newUser);
      
      toast.success('Cadastro realizado com sucesso! Você pode fazer login agora.');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao criar conta. Tente novamente.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      const validatedData = registerSchema.parse(formData);
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Register user
      handleRegister(validatedData);
      
      // Redirect to login
      navigate('/login');
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convert Zod errors to a more usable format
        const fieldErrors: Partial<Record<keyof RegisterFormData, string>> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof RegisterFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
        
        // Show toast for first error
        if (error.errors[0]) {
          uiToast({
            title: "Erro no formulário",
            description: error.errors[0].message,
            variant: "destructive",
          });
        }
      } else {
        uiToast({
          title: "Erro no cadastro",
          description: "Ocorreu um erro ao processar seu cadastro. Tente novamente.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome Completo</Label>
        <Input
          id="nome"
          placeholder="Digite seu nome completo"
          value={formData.nome}
          onChange={(e) => handleInputChange('nome', e.target.value)}
          className={errors.nome ? "border-red-500" : ""}
        />
        {errors.nome && <p className="text-sm text-red-500">{errors.nome}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu.email@exemplo.com"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="cpf">CPF</Label>
        <Input
          id="cpf"
          placeholder="123.456.789-00"
          value={formData.cpf}
          onChange={handleCPFChange}
          maxLength={14}
          className={errors.cpf ? "border-red-500" : ""}
        />
        {errors.cpf && <p className="text-sm text-red-500">{errors.cpf}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="instituicao">Instituição</Label>
        <Input
          id="instituicao"
          placeholder="Nome da sua instituição"
          value={formData.instituicao}
          onChange={(e) => handleInputChange('instituicao', e.target.value)}
          className={errors.instituicao ? "border-red-500" : ""}
        />
        {errors.instituicao && <p className="text-sm text-red-500">{errors.instituicao}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="senha">Senha</Label>
        <Input
          id="senha"
          type="password"
          placeholder="Crie uma senha segura"
          value={formData.senha}
          onChange={(e) => handleInputChange('senha', e.target.value)}
          className={errors.senha ? "border-red-500" : ""}
        />
        {errors.senha && <p className="text-sm text-red-500">{errors.senha}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
        <Input
          id="confirmarSenha"
          type="password"
          placeholder="Digite a senha novamente"
          value={formData.confirmarSenha}
          onChange={(e) => handleInputChange('confirmarSenha', e.target.value)}
          className={errors.confirmarSenha ? "border-red-500" : ""}
        />
        {errors.confirmarSenha && <p className="text-sm text-red-500">{errors.confirmarSenha}</p>}
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="termos" 
          checked={formData.termos}
          onCheckedChange={(checked) => handleInputChange('termos', checked === true)}
        />
        <label
          htmlFor="termos"
          className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
            errors.termos ? "text-red-500" : ""
          }`}
        >
          Concordo com os termos e condições
        </label>
      </div>
      {errors.termos && <p className="text-sm text-red-500">{errors.termos}</p>}
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Cadastrando..." : "Cadastrar"}
      </Button>
    </form>
  );
}
