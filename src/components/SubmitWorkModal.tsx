
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, FileText, Trash2 } from 'lucide-react';

interface SubmitWorkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  existingWork?: any;
}

const SubmitWorkModal = ({ open, onOpenChange, onSuccess, existingWork }: SubmitWorkModalProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [areasTemáticas, setAreasTemáticas] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: '',
    area_tematica_id: '',
    arquivo: null as File | null
  });

  useEffect(() => {
    if (open) {
      fetchAreasTemáticas();
      if (existingWork) {
        setFormData({
          titulo: existingWork.titulo || '',
          tipo: existingWork.tipo || '',
          area_tematica_id: existingWork.area_tematica_id || '',
          arquivo: null
        });
      } else {
        setFormData({
          titulo: '',
          tipo: '',
          area_tematica_id: '',
          arquivo: null
        });
      }
    }
  }, [open, existingWork]);

  const fetchAreasTemáticas = async () => {
    try {
      const { data, error } = await supabase
        .from('areas_tematicas')
        .select('*')
        .eq('ativa', true)
        .order('nome');

      if (error) throw error;
      setAreasTemáticas(data || []);
    } catch (error) {
      console.error('Erro ao buscar áreas temáticas:', error);
      toast.error('Erro ao carregar áreas temáticas');
    }
  };

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

    setFormData(prev => ({ ...prev, arquivo: file }));
  };

  const uploadFile = async (file: File, workId: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${workId}.${fileExt}`;
    const filePath = `${user?.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('trabalhos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      throw new Error(`Erro no upload: ${uploadError.message}`);
    }

    return { filePath, fileName };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    if (!formData.titulo || !formData.tipo || !formData.area_tematica_id) {
      toast.error('Todos os campos são obrigatórios');
      return;
    }

    if (!existingWork && !formData.arquivo) {
      toast.error('Selecione um arquivo para enviar');
      return;
    }

    setLoading(true);
    setUploading(true);

    try {
      let workData = {
        titulo: formData.titulo,
        tipo: formData.tipo as 'resumo_expandido' | 'artigo_completo' | 'relato_experiencia',
        area_tematica_id: formData.area_tematica_id,
        user_id: user.id,
        data_submissao: new Date().toISOString(),
        status_avaliacao: 'pendente' as 'pendente' | 'aprovado' | 'rejeitado' | 'em_revisao'
      };

      let workId: string;

      if (existingWork) {
        // Atualizar trabalho existente
        const { error: updateError } = await supabase
          .from('trabalhos')
          .update(workData)
          .eq('id', existingWork.id);

        if (updateError) throw updateError;
        workId = existingWork.id;
      } else {
        // Criar novo trabalho
        const { data: newWork, error: insertError } = await supabase
          .from('trabalhos')
          .insert(workData)
          .select()
          .single();

        if (insertError) throw insertError;
        workId = newWork.id;
      }

      // Upload do arquivo se fornecido
      if (formData.arquivo) {
        const { filePath, fileName } = await uploadFile(formData.arquivo, workId);

        // Atualizar trabalho com informações do arquivo
        const { error: updateFileError } = await supabase
          .from('trabalhos')
          .update({
            arquivo_storage_path: filePath,
            arquivo_nome: fileName
          })
          .eq('id', workId);

        if (updateFileError) throw updateFileError;
      }

      toast.success(existingWork ? 'Trabalho atualizado com sucesso!' : 'Trabalho enviado com sucesso!');
      onSuccess();
      onOpenChange(false);

    } catch (error: any) {
      console.error('Erro ao submeter trabalho:', error);
      toast.error('Erro ao enviar trabalho: ' + error.message);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, arquivo: null }));
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
            <Label htmlFor="tipo">Tipo de Trabalho</Label>
            <Select 
              value={formData.tipo} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, tipo: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="resumo_expandido">Resumo Expandido</SelectItem>
                <SelectItem value="artigo_completo">Artigo Completo</SelectItem>
                <SelectItem value="relato_experiencia">Relato de Experiência</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="area">Área Temática</Label>
            <Select 
              value={formData.area_tematica_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, area_tematica_id: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a área temática" />
              </SelectTrigger>
              <SelectContent>
                {areasTemáticas.map((area) => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="arquivo">Arquivo do Trabalho</Label>
            <div className="mt-2">
              {formData.arquivo ? (
                <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">{formData.arquivo.name}</span>
                    <span className="text-xs text-gray-500">
                      ({(formData.arquivo.size / 1024 / 1024).toFixed(2)} MB)
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
                          {existingWork && existingWork.arquivo_nome 
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
              
              {existingWork && existingWork.arquivo_nome && !formData.arquivo && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-blue-700">
                      Arquivo atual: {existingWork.arquivo_nome}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

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
              {uploading ? 'Enviando...' : existingWork ? 'Atualizar' : 'Enviar Trabalho'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitWorkModal;
