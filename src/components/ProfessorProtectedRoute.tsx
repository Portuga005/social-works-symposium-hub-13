
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfessorAuth } from '@/contexts/ProfessorAuthContext';

const ProfessorProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { professor, loading } = useProfessorAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !professor) {
      navigate('/professor/login');
    }
  }, [professor, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-social-orange mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!professor) {
    return null;
  }

  return <>{children}</>;
};

export default ProfessorProtectedRoute;
