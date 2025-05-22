
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Upload, File, AlertTriangle } from 'lucide-react';
import storageService, { Submission } from '@/services/storageService';

interface SubmitWorkModalProps {
  onClose: () => void;
}

const AREAS_TEMATICAS = [
  { id: '1', name: 'Fundamentos do Serviço Social' },
  { id: '2', name: 'Política Social e Trabalho' },
  { id: '3', name: 'Movimentos Sociais e Cidadania' },
  { id: '4', name: 'Questão Social e Desigualdade' },
  { id: '5', name: 'Ética e Direitos Humanos' },
  { id: '6', name: 'Serviço Social na Saúde' },
  { id: '7', name: 'Relatos de Experiência Profissional' }
];

// Helper to assign submission to a professor using round-robin
const assignSubmissionToProfessor = (): string => {
  const professors = storageService.getProfessors();
  
  if (professors.length === 0) {
    return '';
  }
  
  // Get all submissions
  const submissions = storageService.getSubmissions();
  
  // If no submissions yet, return first professor
  if (submissions.length === 0) {
    return professors[0].id;
  }
  
  // Get the last assigned professor
  const lastSubmission = submissions[submissions.length - 1];
  const lastProfessorId = lastSubmission.professorId || '';
  
  // Find index of last professor
  const lastProfessorIndex = professors.findIndex(p => p.id === lastProfessorId);
  
  // Get next professor (or first if at end/not found)
  const nextProfessorIndex = (lastProfessorIndex + 1) % professors.length;
  
  return professors[nextProfessorIndex].id;
};

export const SubmitWorkModal = ({ onClose }: SubmitWorkModalProps) => {
  const { user, updateUserInfo } = useAuth();
  
  const [formData, setFormData] = useState({
    areaTematica: '',
    titulo: '',
    arquivo: null as File | null
  });
  
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileChange(file);
    }
  };
  
  const handleFileChange = (file: File | null) => {
    if (!file) return;
    
    const fileType = file.name.split('.').pop()?.toLowerCase();
    
    if (fileType !== 'pdf' && fileType !== 'docx') {
      toast.error('Formato de arquivo inválido. Apenas PDF e DOCX são aceitos.');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('Arquivo muito grande. O tamanho máximo é de 10MB.');
      return;
    }
    
    setFormData(prev => ({ ...prev, arquivo: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Você precisa estar logado para enviar um trabalho.');
      return;
    }
    
    if (!formData.areaTematica) {
      toast.error('Selecione uma área temática');
      return;
    }
    
    if (!formData.titulo) {
      toast.error('Forneça um título para o trabalho');
      return;
    }
    
    if (!formData.arquivo) {
      toast.error('Faça o upload do seu trabalho');
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, we'd upload the file to cloud storage here
      // For this demo, we're just simulating that with the filename
      
      // Create a new submission
      const newSubmission: Submission = {
        id: `sub-${Date.now()}`,
        userId: user.id,
        titulo: formData.titulo,
        areaTematica: formData.areaTematica,
        dataEnvio: new Date().toISOString(),
        arquivo: formData.arquivo.name,
        resultado: 'Em análise',
        professorId: assignSubmissionToProfessor()
      };
      
      // Save submission
      storageService.saveSubmission(newSubmission);
      
      // Update user's status
      updateUserInfo({ trabalhosSubmetidos: true });
      
      toast.success('Trabalho enviado com sucesso!');
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao enviar o trabalho. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Verificar se o usuário já submeteu um trabalho
  if (user?.trabalhosSubmetidos) {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-50 text-yellow-500 mb-4">
          <AlertTriangle size={32} />
        </div>
        <h3 className="text-xl font-bold">Trabalho já submetido</h3>
        <p className="text-gray-600">
          Você já enviou um trabalho para este simpósio. Cada participante pode submeter apenas um trabalho.
        </p>
        <Button onClick={onClose} className="mt-4">
          Entendi
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      <div>
        <Label htmlFor="area-tematica">Área Temática</Label>
        <Select 
          value={formData.areaTematica} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, areaTematica: value }))}
          required
        >
          <SelectTrigger id="area-tematica" className="w-full">
            <SelectValue placeholder="Selecione uma área temática" />
          </SelectTrigger>
          <SelectContent>
            {AREAS_TEMATICAS.map(area => (
              <SelectItem key={area.id} value={area.id}>
                {area.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="titulo">Título do Trabalho</Label>
        <Input
          id="titulo"
          value={formData.titulo}
          onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
          placeholder="Digite o título do seu trabalho"
          required
        />
      </div>
      
      <div>
        <Label>Upload do Arquivo</Label>
        <div 
          className={`border-2 border-dashed rounded-lg p-6 mt-1 text-center ${
            dragActive ? 'border-unespar-blue bg-blue-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          {formData.arquivo ? (
            <div className="flex items-center justify-center space-x-2">
              <File className="w-6 h-6 text-unespar-blue" />
              <span className="text-sm font-medium">{formData.arquivo.name}</span>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-10 h-10 text-gray-400 mx-auto" />
              <p className="text-sm text-gray-500">
                Arraste seu arquivo ou clique para fazer o upload
              </p>
              <p className="text-xs text-gray-400">
                (Formatos aceitos: PDF, DOCX. Tamanho máximo: 10MB)
              </p>
            </div>
          )}
          
          <input
            type="file"
            id="file-upload"
            accept=".pdf,.docx"
            onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            Selecionar Arquivo
          </Button>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-unespar-blue hover:bg-unespar-blue/90"
        >
          {loading ? "Enviando..." : "Submeter Trabalho"}
        </Button>
      </div>
    </form>
  );
};
