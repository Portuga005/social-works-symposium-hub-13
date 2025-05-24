
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadProps {
  arquivo: File | null;
  onFileChange: (file: File | null) => void;
  existingFileName?: string;
}

const FileUpload = ({ arquivo, onFileChange, existingFileName }: FileUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    // Validar tipo de arquivo
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast.error('Apenas arquivos PDF, DOC e DOCX são permitidos');
      return;
    }

    // Validar tamanho (máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error('Arquivo muito grande. Máximo permitido: 10MB');
      return;
    }

    onFileChange(file);
  };

  const removeFile = () => {
    onFileChange(null);
  };

  return (
    <div>
      <Label htmlFor="arquivo">Arquivo do Trabalho</Label>
      <div className="mt-2">
        {arquivo ? (
          <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-blue-500" />
              <span className="text-sm">{arquivo.name}</span>
              <span className="text-xs text-gray-500">
                ({(arquivo.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeFile}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="arquivo" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    {existingFileName 
                      ? 'Clique para substituir o arquivo atual' 
                      : 'Clique para selecionar um arquivo'
                    }
                  </span>
                  <span className="mt-1 block text-xs text-gray-500">
                    PDF, DOC ou DOCX até 10MB
                  </span>
                </label>
                <input
                  id="arquivo"
                  type="file"
                  className="sr-only"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>
        )}
        
        {existingFileName && !arquivo && (
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-blue-700">
                Arquivo atual: {existingFileName}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
