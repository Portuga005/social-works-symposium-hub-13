
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, CheckCircle, Download } from 'lucide-react';

const SubmissionSection = () => {
  return (
    <section id="submissao" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-unespar-blue mb-4">
            Submissão de Trabalhos
          </h2>
          <div className="w-24 h-1 bg-social-orange mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Os trabalhos aprovados serão publicados nos Anais do II Simpósio de Serviço Social da UNESPAR com ISBN digital.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-8">
            <Card className="border-l-4 border-l-social-orange">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-6 h-6 text-social-orange" />
                  <CardTitle className="text-unespar-blue">Prazo de Submissão</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-social-orange mb-2">20 de Setembro de 2025</p>
                <p className="text-gray-600">Envie suas produções acadêmicas até esta data pelo site oficial do evento.</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-unespar-blue">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <FileText className="w-6 h-6 text-unespar-blue" />
                  <CardTitle className="text-unespar-blue">Tipos de Trabalho</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Resumos expandidos</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Artigos completos</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Relatos de experiência</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="border-l-4 border-l-unespar-green">
              <CardHeader>
                <CardTitle className="text-unespar-blue">Processo de Avaliação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-unespar-green rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                    <div>
                      <h4 className="font-semibold text-unespar-blue">Submissão</h4>
                      <p className="text-gray-600 text-sm">Envio do trabalho através do sistema</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-unespar-green rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                    <div>
                      <h4 className="font-semibold text-unespar-blue">Avaliação</h4>
                      <p className="text-gray-600 text-sm">Análise por comissão científica especializada</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-unespar-green rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                    <div>
                      <h4 className="font-semibold text-unespar-blue">Resultado</h4>
                      <p className="text-gray-600 text-sm">Comunicação do resultado via e-mail</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-unespar-green rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                    <div>
                      <h4 className="font-semibold text-unespar-blue">Apresentação</h4>
                      <p className="text-gray-600 text-sm">Apresentação durante as sessões temáticas</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-unespar-blue mb-4">Documentos Importantes</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Edital de Submissão
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Template para Artigos
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Normas de Formatação
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubmissionSection;
