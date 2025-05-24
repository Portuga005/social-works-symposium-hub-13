
import { useState } from 'react';
import { useSubmission } from './submission/useSubmission';
import SubmitWorkModal from './SubmitWorkModal';
import WorkCard from './submission/WorkCard';
import EmptyState from './submission/EmptyState';
import LoadingState from './submission/LoadingState';
import AuthRequired from './submission/AuthRequired';

const SubmissionSection = () => {
  const {
    trabalho,
    loading,
    deletingWork,
    authLoading,
    isAuthenticated,
    fetchUserWork,
    handleDeleteWork
  } = useSubmission();
  
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const handleModalSuccess = () => {
    fetchUserWork();
    setShowSubmitModal(false);
  };

  if (authLoading) {
    return (
      <section id="submissao" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <LoadingState />
        </div>
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section id="submissao" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <AuthRequired />
        </div>
      </section>
    );
  }

  return (
    <section id="submissao" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-unespar-blue mb-4">
            Submissão de Trabalhos
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Envie seu trabalho para avaliação no II Simpósio de Serviço Social da UNESPAR.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {loading ? (
            <LoadingState />
          ) : trabalho ? (
            <WorkCard
              trabalho={trabalho}
              onEdit={() => setShowSubmitModal(true)}
              onDelete={handleDeleteWork}
              deletingWork={deletingWork}
            />
          ) : (
            <EmptyState onSubmit={() => setShowSubmitModal(true)} />
          )}
        </div>

        <SubmitWorkModal
          open={showSubmitModal}
          onOpenChange={setShowSubmitModal}
          onSuccess={handleModalSuccess}
          existingWork={trabalho}
        />
      </div>
    </section>
  );
};

export default SubmissionSection;
