
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormData {
  titulo: string;
  tipo: string;
  area_tematica_id: string;
  arquivo: File | null;
}

interface WorkFormFieldsProps {
  formData: FormData;
  areasTemáticas: any[];
  onFormDataChange: (data: Partial<FormData>) => void;
}

const WorkFormFields = ({ formData, areasTemáticas, onFormDataChange }: WorkFormFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="titulo">Título do Trabalho</Label>
        <Input
          id="titulo"
          value={formData.titulo}
          onChange={(e) => onFormDataChange({ titulo: e.target.value })}
          placeholder="Digite o título do seu trabalho"
          required
        />
      </div>

      <div>
        <Label htmlFor="tipo">Tipo de Trabalho</Label>
        <Select 
          value={formData.tipo} 
          onValueChange={(value) => onFormDataChange({ tipo: value })}
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
          onValueChange={(value) => onFormDataChange({ area_tematica_id: value })}
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
    </>
  );
};

export default WorkFormFields;
