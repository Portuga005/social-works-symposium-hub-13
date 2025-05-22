
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Target, Award, Clock } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-unespar-blue mb-4">
            Sobre o Simpósio
          </h2>
          <div className="w-24 h-1 bg-social-orange mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            O evento tem como objetivo fomentar o debate crítico sobre os desafios atuais enfrentados pelo Serviço Social diante das desigualdades sociais, políticas públicas e direitos sociais em tempos de retrocessos e resistência.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 bg-unespar-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-unespar-blue">Mesas-Redondas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Discussões aprofundadas com especialistas sobre temas contemporâneos</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 bg-social-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-unespar-blue">Oficinas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Atividades práticas para desenvolvimento de habilidades profissionais</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 bg-unespar-green rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-unespar-blue">Apresentações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Sessões de comunicação oral para compartilhar pesquisas e experiências</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-unespar-blue">Cultura</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Apresentações culturais que enriquecem a experiência do evento</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-unespar-blue mb-6">Objetivos do Evento</h3>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-social-orange rounded-full mt-2 flex-shrink-0"></div>
                <span>Fortalecer a formação acadêmica e profissional na área do Serviço Social</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-social-orange rounded-full mt-2 flex-shrink-0"></div>
                <span>Promover a troca de experiências entre profissionais, estudantes e pesquisadores</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-social-orange rounded-full mt-2 flex-shrink-0"></div>
                <span>Debater os desafios contemporâneos da profissão</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-social-orange rounded-full mt-2 flex-shrink-0"></div>
                <span>Refletir sobre práticas transformadoras no contexto atual</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-unespar-blue mb-6">Público-Alvo</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-unespar-blue/10 rounded-full flex items-center justify-center">
                  <span className="text-unespar-blue font-bold">01</span>
                </div>
                <div>
                  <h4 className="font-semibold text-unespar-blue">Estudantes</h4>
                  <p className="text-gray-600">De graduação e pós-graduação em Serviço Social</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-social-orange/10 rounded-full flex items-center justify-center">
                  <span className="text-social-orange font-bold">02</span>
                </div>
                <div>
                  <h4 className="font-semibold text-unespar-blue">Profissionais</h4>
                  <p className="text-gray-600">Assistentes sociais e profissionais da área</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-unespar-green/10 rounded-full flex items-center justify-center">
                  <span className="text-unespar-green font-bold">03</span>
                </div>
                <div>
                  <h4 className="font-semibold text-unespar-blue">Pesquisadores</h4>
                  <p className="text-gray-600">Docentes e pesquisadores da área social</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
