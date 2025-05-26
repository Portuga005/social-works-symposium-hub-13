
export interface WorkFormData {
  titulo: string;
  tipo: 'resumo_expandido' | 'artigo_completo' | 'relato_experiencia';
  area_tematica_id: string;
  arquivo: File | null;
}

export interface ExistingWork {
  id: string;
  titulo: string;
  tipo: 'resumo_expandido' | 'artigo_completo' | 'relato_experiencia';
  area_tematica_id: string;
  arquivo_nome?: string;
  arquivo_url?: string;
  status_avaliacao: string;
  data_submissao: string;
}
