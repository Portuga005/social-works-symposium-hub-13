
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CadastrarProfessorModal from './CadastrarProfessorModal';
import ProfessoresTable from './ProfessoresTable';
import { useAdminProfessores } from '@/hooks/useAdminProfessores';

const ProfessoresSection = () => {
  const { data: professores, isLoading, error } = useAdminProfessores();

  if (isLoading) {
    return <div className="text-center">Carregando professores...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Erro ao carregar professores: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Gerenciar Professores</CardTitle>
            <CardDescription>
              Cadastre e gerencie os professores que poderão acessar o painel de avaliação.
            </CardDescription>
          </div>
          <CadastrarProfessorModal />
        </CardHeader>
        <CardContent>
          <ProfessoresTable professores={professores} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessoresSection;
