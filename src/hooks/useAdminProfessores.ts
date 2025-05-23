
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAdminProfessores = () => {
  return useQuery({
    queryKey: ['admin-professores'],
    queryFn: async () => {
      console.log('=== BUSCANDO PROFESSORES ADMIN ===');
      
      const { data, error } = await supabase
        .from('professores')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Resultado query professores:', { data, error });

      if (error) {
        console.error('Erro ao buscar professores:', error);
        throw error;
      }

      return data || [];
    }
  });
};

export const useCreateProfessor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (professorData: {
      nome: string;
      email: string;
      senha: string;
      especialidade?: string;
    }) => {
      console.log('=== CRIANDO PROFESSOR ===');
      console.log('Dados:', professorData);

      // Hash da senha usando a função crypt do PostgreSQL
      const { data, error } = await supabase.rpc('create_professor', {
        p_nome: professorData.nome,
        p_email: professorData.email,
        p_senha: professorData.senha,
        p_especialidade: professorData.especialidade || null
      });

      if (error) {
        console.error('Erro ao criar professor:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-professores'] });
      toast({
        title: "Professor cadastrado",
        description: "Professor foi cadastrado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro na mutation:', error);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar professor. Verifique se o email já não está em uso.",
        variant: "destructive",
      });
    }
  });
};

export const useUpdateProfessorStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) => {
      const { data, error } = await supabase
        .from('professores')
        .update({ ativo })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar status do professor:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-professores'] });
      toast({
        title: "Status atualizado",
        description: "Status do professor foi atualizado com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro na mutation:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status do professor.",
        variant: "destructive",
      });
    }
  });
};
