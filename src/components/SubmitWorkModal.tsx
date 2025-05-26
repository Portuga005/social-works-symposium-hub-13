
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useSubmitWorkModal } from './submission/useSubmitWorkModal';
import WorkFormFields from './submission/WorkFormFields';
import FileUpload from './submission/FileUpload';
import { ExistingWork } from '@/types/work';

interface SubmitWorkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  existingWork?: ExistingWork;
}

const SubmitWorkModal = ({ open, onOpenChange, onSuccess, existingWork }: SubmitWorkModalProps) => {
  const {
    loading,
    areasTemáticas,
    formData,
    setFormData,
    handleSubmit
  } = useSubmitWorkModal({ open, existingWork, onSuccess });

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {existingWork ? 'Atualizar Trabalho' : 'Submeter Trabalho'}
          </DialogTitle>
          <DialogDescription>
            {existingWork 
              ? 'Atualize as informações do seu trabalho ou envie um novo arquivo.'
              : 'Preencha as informações do seu trabalho e faça o upload do arquivo.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <WorkFormFields
            formData={formData}
            areasTemáticas={areasTemáticas}
            onFormDataChange={updateFormData}
          />

          <FileUpload
            arquivo={formData.arquivo}
            onFileChange={(arquivo) => updateFormData({ arquivo })}
            existingFileName={existingWork?.arquivo_nome}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-unespar-blue hover:bg-unespar-blue/90"
            >
              {loading ? 'Enviando...' : existingWork ? 'Atualizar' : 'Enviar Trabalho'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitWorkModal;
