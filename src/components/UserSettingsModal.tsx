
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Key, User, Bell, Lock, Trash2 } from 'lucide-react';

interface UserSettingsModalProps {
  onClose: () => void;
}

export const UserSettingsModal = ({ onClose }: UserSettingsModalProps) => {
  const { user, updateUserInfo, logout } = useAuth();
  
  const [formData, setFormData] = useState({
    nome: user?.nome || '',
    cpf: user?.cpf || '',
    email: user?.email || '',
    instituicao: user?.instituicao || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    receiveEmails: true,
    darkMode: false,
    twoFactorAuth: false
  });
  
  const [loading, setLoading] = useState(false);
  
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePersonalInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      updateUserInfo({
        nome: formData.nome,
        cpf: formData.cpf,
        instituicao: formData.instituicao
      });
      setLoading(false);
    }, 800);
  };
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      // Lógica para alterar senha seria implementada aqui
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      setLoading(false);
    }, 800);
  };
  
  const handleDeleteAccount = () => {
    // Implementar lógica de deleção de conta
    logout();
    onClose();
  };

  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="personal" className="flex items-center gap-2 py-2">
          <User size={16} />
          <span className="hidden sm:inline">Pessoal</span>
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-2 py-2">
          <Lock size={16} />
          <span className="hidden sm:inline">Segurança</span>
        </TabsTrigger>
        <TabsTrigger value="preferences" className="flex items-center gap-2 py-2">
          <Bell size={16} />
          <span className="hidden sm:inline">Preferências</span>
        </TabsTrigger>
        <TabsTrigger value="privacy" className="flex items-center gap-2 py-2">
          <Key size={16} />
          <span className="hidden sm:inline">Privacidade</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="personal" className="mt-4 space-y-4">
        <form onSubmit={handlePersonalInfoSubmit} className="space-y-4">
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
              readOnly
              className="bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">O CPF não pode ser alterado.</p>
          </div>
          
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              readOnly
              className="bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">O e-mail não pode ser alterado.</p>
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
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-unespar-blue hover:bg-unespar-blue/90"
            >
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </TabsContent>
      
      <TabsContent value="security" className="mt-4">
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <Label htmlFor="current-password">Senha Atual</Label>
            <Input
              id="current-password"
              type="password"
              value={formData.currentPassword}
              onChange={(e) => handleInputChange('currentPassword', e.target.value)}
              placeholder="Digite sua senha atual"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="new-password">Nova Senha</Label>
            <Input
              id="new-password"
              type="password"
              value={formData.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              placeholder="Digite uma nova senha"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
            <Input
              id="confirm-password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Confirme a nova senha"
              required
            />
          </div>
          
          <div className="flex items-center space-x-2 py-2">
            <Switch
              id="2fa"
              checked={formData.twoFactorAuth}
              onCheckedChange={(checked) => handleInputChange('twoFactorAuth', checked)}
            />
            <Label htmlFor="2fa" className="cursor-pointer">Ativar verificação em duas etapas</Label>
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-unespar-blue hover:bg-unespar-blue/90"
            >
              {loading ? "Alterando..." : "Alterar Senha"}
            </Button>
          </div>
        </form>
      </TabsContent>
      
      <TabsContent value="preferences" className="mt-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <h4 className="font-medium">Tema Escuro</h4>
              <p className="text-sm text-gray-500">Ativar o modo escuro na interface</p>
            </div>
            <Switch
              id="dark-mode"
              checked={formData.darkMode}
              onCheckedChange={(checked) => handleInputChange('darkMode', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between py-2 border-t">
            <div>
              <h4 className="font-medium">Notificações por E-mail</h4>
              <p className="text-sm text-gray-500">Receber notificações sobre o evento</p>
            </div>
            <Switch
              id="notifications"
              checked={formData.receiveEmails}
              onCheckedChange={(checked) => handleInputChange('receiveEmails', checked)}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={() => {
                // Salvar preferências
                onClose();
              }}
              className="bg-unespar-blue hover:bg-unespar-blue/90"
            >
              Salvar Preferências
            </Button>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="privacy" className="mt-4">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Seus Dados</h4>
            <p className="text-sm text-gray-500 mb-4">
              O simpósio armazena apenas as informações necessárias para sua participação no evento.
            </p>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                // Implementar download dos dados
              }}
            >
              Baixar Meus Dados
            </Button>
          </div>
          
          <div className="pt-4 border-t">
            <h4 className="font-medium text-red-500">Zona de Perigo</h4>
            <p className="text-sm text-gray-500 mb-4">
              Ao excluir sua conta, todos os seus dados serão removidos permanentemente.
            </p>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir Minha Conta
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta
                    e removerá seus dados dos nossos servidores.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteAccount}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Excluir Permanentemente
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};
