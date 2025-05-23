
import { supabase } from '@/integrations/supabase/client';

export const seedAreasTemáticas = async () => {
  const áreas = [
    {
      nome: 'Políticas Sociais',
      descricao: 'Estudos sobre políticas públicas e sociais'
    },
    {
      nome: 'Serviço Social e Direitos Humanos',
      descricao: 'Direitos humanos e cidadania'
    },
    {
      nome: 'Questão Social e Trabalho',
      descricao: 'Relações de trabalho e questão social'
    },
    {
      nome: 'Família e Comunidade',
      descricao: 'Estudos sobre família e desenvolvimento comunitário'
    },
    {
      nome: 'Saúde e Serviço Social',
      descricao: 'Atuação do serviço social na área da saúde'
    },
    {
      nome: 'Educação e Serviço Social',
      descricao: 'Serviço social no contexto educacional'
    }
  ];

  try {
    // Verificar se já existem áreas temáticas
    const { data: existing } = await supabase
      .from('areas_tematicas')
      .select('nome');

    if (existing && existing.length > 0) {
      console.log('Áreas temáticas já existem');
      return;
    }

    // Inserir áreas temáticas
    const { error } = await supabase
      .from('areas_tematicas')
      .insert(áreas);

    if (error) {
      console.error('Erro ao inserir áreas temáticas:', error);
    } else {
      console.log('Áreas temáticas inseridas com sucesso');
    }
  } catch (error) {
    console.error('Erro geral:', error);
  }
};
