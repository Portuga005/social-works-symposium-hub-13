
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, File, AlertTriangle, X } from 'lucide-react';

interface SubmitWorkModalProps {
  onClose: () => void;
}

type AreaTematica = {
  id: string;
  nome: string;
  descricao: string | null;
};

type TrabalhoExistente = {
  id: string;
  titulo: string;
  tipo: string;
  area_tematica: { nome: string };
  arquivo_nome: string;
  status_avaliacao: string;
  created_at: string;
};

export const SubmitWorkModal = ({ onClose }: SubmitWorkModalProps) => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    areaTematica: '',
    titulo: '',
    tipo: 'resumo_expandido' as 'resumo_expandido' | 'artigo_completo' | 'relato_experiencia',
    arquivo: null as File | null
  });
  
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [areasTematicas, setAreasTematicas] = useState<AreaTematica[]>([]);
  const [trabalhoExistente, setTrabalhoExistente] = useState<TrabalhoExistente | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Buscar áreas temáticas
      const { data: areas, error: areasError } = await supabase
        .from('areas_tematicas')
        .select('*')
        .eq('ativa', true)
        .order('nome');

      if (areasError) {
        console.error('Error fetching areas:', areasError);
        toast.error('Erro ao carregar áreas temáticas');
      } else {
        setAreasTematicas(areas || []);
      }

      // Verificar se o usuário já tem um trabalho submetido
      if (user?.id) {
        const { data: trabalho, error: trabalhoError } = await supabase
          .from('trabalhos')
          .select(`
            id,
            titulo,
            tipo,
            arquivo_nome,
            status_avaliacao,
            created_at,
            area_tematica:areas_tematicas(nome)
          `)
          .eq('user_id', user.id)
          .single();

        if (!trabalhoError && trabalho) {
          setTrabalhoExistente(trabalho as TrabalhoExistente);
        }
      }
    };

    fetchData();
  }, [user?.id]);
  
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

  const handleCancelWork = async () => {
    if (!trabalhoExistente || !user?.id) return;

    setLoading(true);
    
    try {
      // Deletar arquivo do storage se existir
      if (trabalhoExistente.arquivo_nome) {
        const filePath = `${user.id}/${trabalhoExistente.arquivo_nome}`;
        await supabase.storage
          .from('trabalhos')
          .remove([filePath]);
      }

      // Deletar registros de avaliação
      await supabase
        .from('avaliacoes')
        .delete()
        .eq('trabalho_id', trabalhoExistente.id);

      // Deletar trabalho
      const { error } = await supabase
        .from('trabalhos')
        .delete()
        .eq('id', trabalhoExistente.id);

      if (error) throw error;

      toast.success('Trabalho cancelado com sucesso!');
      setTrabalhoExistente(null);
      setShowCancelConfirm(false);
    } catch (error: any) {
      console.error('Error canceling work:', error);
      toast.error('Erro ao cancelar trabalho: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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

    if (!user?.id) {
      toast.error('Você precisa estar logado para submeter um trabalho');
      return;
    }
    
    setLoading(true);
    
    try {
      // Upload do arquivo para o Supabase Storage
      const fileExtension = formData.arquivo.name.split('.').pop();
      const fileName = `${Date.now()}_${formData.titulo.replace(/[^a-zA-Z0-9]/g, '_')}.${fileExtension}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('trabalhos')
        .upload(filePath, formData.arquivo);

      if (uploadError) {
        throw new Error('Erro no upload do arquivo: ' + uploadError.message);
      }

      // Obter URL pública do arquivo
      const { data: urlData } = supabase.storage
        .from('trabalhos')
        .getPublicUrl(filePath);

      // Inserir trabalho no banco de dados
      const { error: insertError } = await supabase
        .from('trabalhos')
        .insert({
          user_id: user.id,
          area_tematica_id: formData.areaTematica,
          titulo: formData.titulo,
          tipo: formData.tipo,
          arquivo_nome: fileName,
          arquivo_storage_path: filePath,
          arquivo_url: urlData.publicUrl,
          status_avaliacao: 'pendente'
        });

      if (insertError) {
        // Se falhar a inserção, deletar o arquivo do storage
        await supabase.storage
          .from('trabalhos')
          .remove([filePath]);
        throw insertError;
      }

      toast.success('Trabalho enviado com sucesso!');
      onClose();
    } catch (error: any) {
      console.error('Error submitting work:', error);
      toast.error('Erro ao enviar o trabalho: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Se já tem trabalho submetido, mostrar informações
  if (trabalhoExistente) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 text-green-500 mb-4">
            <File size={32} />
          </div>
          <h3 className="text-xl font-bold">Trabalho Submetido</h3>
          <p className="text-gray-600">
            Você já enviou um trabalho para este simpósio.
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div><strong>Título:</strong> {trabalhoExistente.titulo}</div>
          <div><strong>Tipo:</strong> {trabalhoExistente.tipo.replace('_', ' ')}</div>
          <div><strong>Área:</strong> {trabalhoExistente.area_tematica.nome}</div>
          <div><strong>Arquivo:</strong> {trabalhoExistente.arquivo_nome}</div>
          <div><strong>Status:</strong> 
            <span className={`ml-2 px-2 py-1 rounded text-sm ${
              trabalhoExistente.status_avaliacao === 'aprovado' ? 'bg-green-100 text-green-800' :
              trabalhoExistente.status_avaliacao === 'rejeitado' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {trabalhoExistente.status_avaliacao === 'pendente' ? 'Em análise' :
               trabalhoExistente.status_avaliacao === 'aprovado' ? 'Aprovado' : 'Rejeitado'}
            </span>
          </div>
          <div><strong>Enviado em:</strong> {new Date(trabalhoExistente.created_at).toLocaleDateString('pt-BR')}</div>
        </div>

        {!showCancelConfirm ? (
          <div className="flex gap-2">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Fechar
            </Button>
            <Button 
              onClick={() => setShowCancelConfirm(true)}
              variant="destructive" 
              className="flex-1"
              disabled={trabalhoExistente.status_avaliacao !== 'pendente'}
            >
              Cancelar Trabalho
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-red-800 mb-2">
                <AlertTriangle size={20} />
                <strong>Confirmação de Cancelamento</strong>
              </div>
              <p className="text-red-700 text-sm">
                Tem certeza que deseja cancelar este trabalho? Esta ação não pode ser desfeita.
                O arquivo será deletado permanentemente e você poderá enviar um novo trabalho.
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowCancelConfirm(false)}
                variant="outline" 
                className="flex-1"
              >
                Manter Trabalho
              </Button>
              <Button 
                onClick={handleCancelWork}
                variant="destructive" 
                className="flex-1"
                disabled={loading}
              >
                {loading ? "Cancelando..." : "Confirmar Cancelamento"}
              </Button>
            </div>
          </div>
        )}
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
            {areasTematicas.map(area => (
              <SelectItem key={area.id} value={area.id}>
                {area.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="tipo">Tipo de Trabalho</Label>
        <Select 
          value={formData.tipo} 
          onValueChange={(value: any) => setFormData(prev => ({ ...prev, tipo: value }))}
          required
        >
          <SelectTrigger id="tipo" className="w-full">
            <SelectValue placeholder="Selecione o tipo de trabalho" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="resumo_expandido">Resumo Expandido</SelectItem>
            <SelectItem value="artigo_completo">Artigo Completo</SelectItem>
            <SelectItem value="relato_experiencia">Relato de Experiência</SelectItem>
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
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <File className="w-6 h-6 text-unespar-blue" />
                <span className="text-sm font-medium">{formData.arquivo.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, arquivo: null }))}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Tamanho: {(formData.arquivo.size / 1024 / 1024).toFixed(2)} MB
              </p>
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
