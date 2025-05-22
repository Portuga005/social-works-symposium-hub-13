
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users } from 'lucide-react';

const HeroSection = () => {
  return (
    <section id="home" className="bg-gradient-to-br from-unespar-blue via-unespar-blue/90 to-unespar-green min-h-screen flex items-center">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Conteúdo principal */}
          <div className="text-white space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                II Simpósio de
                <span className="block text-social-orange">Serviço Social</span>
              </h1>
              <h2 className="text-xl md:text-2xl font-medium opacity-90">
                Desafios Contemporâneos e Práticas Transformadoras
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-social-orange" />
                <span className="text-lg">10 e 11 de Outubro de 2025</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-6 h-6 text-social-orange" />
                <span className="text-lg">UNESPAR - Campus Apucarana</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-social-orange" />
                <span className="text-lg">Profissionais, Estudantes e Pesquisadores</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-social-orange hover:bg-social-orange/90 text-white px-8 py-4 text-lg">
                Inscrever-se Agora
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-unespar-blue px-8 py-4 text-lg">
                Ver Programação
              </Button>
            </div>
          </div>
          
          {/* Logo do Serviço Social */}
          <div className="flex justify-center lg:justify-end animate-fade-in">
            <div className="w-80 h-80 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
              <div className="w-64 h-64 bg-social-orange rounded-full flex items-center justify-center">
                <span className="text-white text-6xl font-bold">SS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
