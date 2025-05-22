
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Mail, GraduationCap } from 'lucide-react';

const ProfessorsSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-unespar-blue mb-4">
            Professores Responsáveis
          </h2>
          <div className="w-24 h-1 bg-social-orange mx-auto mb-6"></div>
          <p className="text-xl text-gray-600">
            Coordenação do evento e do curso de Serviço Social
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-24 h-24 bg-unespar-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-bold text-unespar-blue">Coordenação do Curso</h3>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-800">
                  Profª. Drª. Luciane Francielli Zorzetti Maroneze
                </h4>
                <p className="text-social-orange font-medium">Coordenadora do Curso de Serviço Social</p>
              </div>
              
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <a 
                  href="mailto:luciane.maroneze@unespar.edu.br" 
                  className="text-unespar-blue hover:underline"
                >
                  luciane.maroneze@unespar.edu.br
                </a>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Responsável pela coordenação geral do curso e organização do simpósio
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-24 h-24 bg-social-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-bold text-unespar-blue">Coordenação de TCC</h3>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-800">
                  Profª. Drª. Kamila Cristina da Silva Teixeira
                </h4>
                <p className="text-social-orange font-medium">Coordenadora de TCC</p>
              </div>
              
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <a 
                  href="mailto:kamila.teixeira@ies.unespar.edu.br" 
                  className="text-unespar-blue hover:underline"
                >
                  kamila.teixeira@ies.unespar.edu.br
                </a>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Responsável pela coordenação dos trabalhos de conclusão e avaliação acadêmica
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-white border-l-4 border-l-unespar-green">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-unespar-blue mb-4">
                Curso de Serviço Social - UNESPAR
              </h3>
              <p className="text-gray-600 leading-relaxed">
                O curso de Serviço Social da UNESPAR Campus Apucarana tem como missão formar profissionais 
                críticos e competentes para atuar na defesa dos direitos sociais e na construção de uma 
                sociedade mais justa e igualitária. O simpósio representa um importante momento de 
                integração entre teoria e prática, fortalecendo a formação acadêmica e profissional.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProfessorsSection;
