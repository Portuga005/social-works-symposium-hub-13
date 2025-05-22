
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-unespar-blue text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Informações da UNESPAR */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <span className="text-unespar-blue font-bold text-lg">U</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">UNESPAR</h3>
                <p className="text-sm opacity-80">Campus Apucarana</p>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Universidade Estadual do Paraná - Campus Apucarana. 
              Formando profissionais comprometidos com a transformação social.
            </p>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Contato</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 mt-1 text-social-orange flex-shrink-0" />
                <div>
                  <p>Rua Carlos Drumond de Andrade, 302</p>
                  <p>Centro - Apucarana/PR</p>
                  <p>CEP: 86900-000</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-social-orange" />
                <span>(43) 3422-0000</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-social-orange" />
                <span>simposio@unespar.edu.br</span>
              </div>
            </div>
          </div>

          {/* Links e Redes Sociais */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Redes Sociais</h3>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-social-orange transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-social-orange transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-social-orange transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
            
            <div className="pt-4">
              <h4 className="font-semibold mb-2">Links Úteis</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block hover:text-social-orange transition-colors">Site UNESPAR</a>
                <a href="#" className="block hover:text-social-orange transition-colors">Curso de Serviço Social</a>
                <a href="#" className="block hover:text-social-orange transition-colors">Biblioteca Digital</a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-sm opacity-80">
            © 2025 UNESPAR - Campus Apucarana. Todos os direitos reservados.
          </p>
          <p className="text-xs opacity-60 mt-2">
            II Simpósio de Serviço Social: Desafios Contemporâneos e Práticas Transformadoras
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
