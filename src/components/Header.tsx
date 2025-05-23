
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { Menu, X, LogOut, FileText, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserSettingsModal } from './UserSettingsModal';
import { SubmitWorkModal } from './SubmitWorkModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [submitWorkOpen, setSubmitWorkOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo UNESPAR */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-unespar-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">U</span>
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-unespar-blue">UNESPAR</h1>
              <p className="text-sm text-gray-600">Campus Apucarana</p>
            </div>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#home" className="text-gray-700 hover:text-unespar-blue transition-colors">
              Início
            </a>
            <a href="#about" className="text-gray-700 hover:text-unespar-blue transition-colors">
              Sobre
            </a>
            <a href="#programacao" className="text-gray-700 hover:text-unespar-blue transition-colors">
              Programação
            </a>
            <a href="#contato" className="text-gray-700 hover:text-unespar-blue transition-colors">
              Contato
            </a>
          </nav>

          {/* Buttons Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Dialog open={submitWorkOpen} onOpenChange={setSubmitWorkOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="flex items-center space-x-2 bg-social-orange hover:bg-social-orange/90"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Submeter Trabalho</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Submeter Trabalho</DialogTitle>
                      <DialogDescription>
                        Preencha o formulário para submeter seu trabalho ao simpósio
                      </DialogDescription>
                    </DialogHeader>
                    <SubmitWorkModal onClose={() => setSubmitWorkOpen(false)} />
                  </DialogContent>
                </Dialog>

                <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline"
                      className="flex items-center space-x-2 border-unespar-blue text-unespar-blue"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Configurações</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Configurações do Usuário</DialogTitle>
                      <DialogDescription>
                        Gerencie suas informações pessoais
                      </DialogDescription>
                    </DialogHeader>
                    <UserSettingsModal onClose={() => setSettingsOpen(false)} />
                  </DialogContent>
                </Dialog>

                <Button 
                  variant="ghost"
                  onClick={logout}
                  className="flex items-center space-x-2 text-red-500 hover:text-red-700"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </Button>
              </>
            ) : (
              <>
                <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-unespar-blue text-unespar-blue hover:bg-unespar-blue hover:text-white">
                      Login
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Fazer Login</DialogTitle>
                      <DialogDescription>
                        Entre com suas credenciais para acessar o sistema
                      </DialogDescription>
                    </DialogHeader>
                    <LoginForm onClose={() => setLoginOpen(false)} />
                  </DialogContent>
                </Dialog>

                <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-unespar-blue hover:bg-unespar-blue/90">
                      Cadastrar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Cadastrar-se</DialogTitle>
                      <DialogDescription>
                        Crie sua conta para participar do simpósio
                      </DialogDescription>
                    </DialogHeader>
                    <RegisterForm onClose={() => setRegisterOpen(false)} />
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <a href="#home" className="text-gray-700 hover:text-unespar-blue transition-colors">
                Início
              </a>
              <a href="#about" className="text-gray-700 hover:text-unespar-blue transition-colors">
                Sobre
              </a>
              <a href="#programacao" className="text-gray-700 hover:text-unespar-blue transition-colors">
                Programação
              </a>
              <a href="#contato" className="text-gray-700 hover:text-unespar-blue transition-colors">
                Contato
              </a>

              <div className="flex flex-col space-y-2 pt-4">
                {isAuthenticated ? (
                  <>
                    <Dialog open={submitWorkOpen} onOpenChange={setSubmitWorkOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          className="flex items-center justify-start space-x-2 bg-social-orange hover:bg-social-orange/90"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Submeter Trabalho</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Submeter Trabalho</DialogTitle>
                          <DialogDescription>
                            Preencha o formulário para submeter seu trabalho ao simpósio
                          </DialogDescription>
                        </DialogHeader>
                        <SubmitWorkModal onClose={() => setSubmitWorkOpen(false)} />
                      </DialogContent>
                    </Dialog>

                    <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline"
                          className="flex items-center justify-start space-x-2 border-unespar-blue text-unespar-blue"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Configurações</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Configurações do Usuário</DialogTitle>
                          <DialogDescription>
                            Gerencie suas informações pessoais
                          </DialogDescription>
                        </DialogHeader>
                        <UserSettingsModal onClose={() => setSettingsOpen(false)} />
                      </DialogContent>
                    </Dialog>

                    <Button 
                      variant="ghost"
                      onClick={logout}
                      className="flex items-center justify-start space-x-2 text-red-500 hover:text-red-700"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sair</span>
                    </Button>
                  </>
                ) : (
                  <>
                    <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="border-unespar-blue text-unespar-blue hover:bg-unespar-blue hover:text-white">
                          Login
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Fazer Login</DialogTitle>
                          <DialogDescription>
                            Entre com suas credenciais para acessar o sistema
                          </DialogDescription>
                        </DialogHeader>
                        <LoginForm onClose={() => setLoginOpen(false)} />
                      </DialogContent>
                    </Dialog>

                    <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-unespar-blue hover:bg-unespar-blue/90">
                          Cadastrar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Cadastrar-se</DialogTitle>
                          <DialogDescription>
                            Crie sua conta para participar do simpósio
                          </DialogDescription>
                        </DialogHeader>
                        <RegisterForm onClose={() => setRegisterOpen(false)} />
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
