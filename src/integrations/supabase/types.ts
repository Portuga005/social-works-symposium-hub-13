export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          email: string
          id: string
          nome: string
          password_hash: string
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          email: string
          id?: string
          nome: string
          password_hash: string
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          email?: string
          id?: string
          nome?: string
          password_hash?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      areas_tematicas: {
        Row: {
          ativa: boolean | null
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
        }
        Insert: {
          ativa?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
        }
        Update: {
          ativa?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      avaliacoes: {
        Row: {
          avaliador_id: string
          comentarios: string | null
          created_at: string | null
          id: string
          nota_apresentacao: number | null
          nota_conteudo: number | null
          nota_metodologia: number | null
          recomendacao: Database["public"]["Enums"]["status_avaliacao"]
          trabalho_id: string
        }
        Insert: {
          avaliador_id: string
          comentarios?: string | null
          created_at?: string | null
          id?: string
          nota_apresentacao?: number | null
          nota_conteudo?: number | null
          nota_metodologia?: number | null
          recomendacao: Database["public"]["Enums"]["status_avaliacao"]
          trabalho_id: string
        }
        Update: {
          avaliador_id?: string
          comentarios?: string | null
          created_at?: string | null
          id?: string
          nota_apresentacao?: number | null
          nota_conteudo?: number | null
          nota_metodologia?: number | null
          recomendacao?: Database["public"]["Enums"]["status_avaliacao"]
          trabalho_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "avaliacoes_avaliador_id_fkey"
            columns: ["avaliador_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avaliacoes_trabalho_id_fkey"
            columns: ["trabalho_id"]
            isOneToOne: false
            referencedRelation: "trabalhos"
            referencedColumns: ["id"]
          },
        ]
      }
      professores: {
        Row: {
          ativo: boolean
          created_at: string
          email: string
          especialidade: string | null
          id: string
          nome: string
          password_hash: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          email: string
          especialidade?: string | null
          id?: string
          nome: string
          password_hash: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          email?: string
          especialidade?: string | null
          id?: string
          nome?: string
          password_hash?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          cpf: string | null
          created_at: string | null
          email: string
          id: string
          instituicao: string | null
          nome: string
          tipo_usuario: Database["public"]["Enums"]["tipo_usuario"] | null
          updated_at: string | null
        }
        Insert: {
          cpf?: string | null
          created_at?: string | null
          email: string
          id: string
          instituicao?: string | null
          nome: string
          tipo_usuario?: Database["public"]["Enums"]["tipo_usuario"] | null
          updated_at?: string | null
        }
        Update: {
          cpf?: string | null
          created_at?: string | null
          email?: string
          id?: string
          instituicao?: string | null
          nome?: string
          tipo_usuario?: Database["public"]["Enums"]["tipo_usuario"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      trabalhos: {
        Row: {
          area_tematica_id: string
          arquivo_nome: string | null
          arquivo_storage_path: string | null
          arquivo_url: string | null
          avaliado_por: string | null
          created_at: string | null
          data_avaliacao: string | null
          data_submissao: string | null
          id: string
          observacoes: string | null
          status_avaliacao:
            | Database["public"]["Enums"]["status_avaliacao"]
            | null
          tipo: Database["public"]["Enums"]["tipo_trabalho"]
          titulo: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          area_tematica_id: string
          arquivo_nome?: string | null
          arquivo_storage_path?: string | null
          arquivo_url?: string | null
          avaliado_por?: string | null
          created_at?: string | null
          data_avaliacao?: string | null
          data_submissao?: string | null
          id?: string
          observacoes?: string | null
          status_avaliacao?:
            | Database["public"]["Enums"]["status_avaliacao"]
            | null
          tipo: Database["public"]["Enums"]["tipo_trabalho"]
          titulo: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          area_tematica_id?: string
          arquivo_nome?: string | null
          arquivo_storage_path?: string | null
          arquivo_url?: string | null
          avaliado_por?: string | null
          created_at?: string | null
          data_avaliacao?: string | null
          data_submissao?: string | null
          id?: string
          observacoes?: string | null
          status_avaliacao?:
            | Database["public"]["Enums"]["status_avaliacao"]
            | null
          tipo?: Database["public"]["Enums"]["tipo_trabalho"]
          titulo?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trabalhos_area_tematica_id_fkey"
            columns: ["area_tematica_id"]
            isOneToOne: false
            referencedRelation: "areas_tematicas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trabalhos_avaliado_por_fkey"
            columns: ["avaliado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trabalhos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_profile: {
        Args: { profile_user_id: string }
        Returns: boolean
      }
      check_admin_access: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      check_professor_access: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      create_professor: {
        Args: {
          p_nome: string
          p_email: string
          p_senha: string
          p_especialidade?: string
        }
        Returns: string
      }
      get_admin_statistics: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_participantes: number
          total_trabalhos: number
          trabalhos_pendentes: number
          trabalhos_aprovados: number
          trabalhos_rejeitados: number
          total_professores: number
        }[]
      }
      get_all_students_for_admin: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          nome: string
          cpf: string
          email: string
          instituicao: string
          status_trabalho: string
          resultado: string
          trabalho_id: string
          trabalho_titulo: string
          arquivo_url: string
          arquivo_nome: string
        }[]
      }
      get_trabalhos_professor: {
        Args: { professor_uuid: string }
        Returns: {
          trabalho_id: string
          titulo: string
          area_tematica: string
          autor_nome: string
          autor_email: string
          data_submissao: string
          status_avaliacao: string
          arquivo_nome: string
        }[]
      }
      submit_avaliacao: {
        Args: {
          trabalho_uuid: string
          professor_uuid: string
          resultado_avaliacao: string
          comentarios_texto?: string
        }
        Returns: boolean
      }
      validate_admin_login: {
        Args: { admin_email: string; admin_password: string }
        Returns: {
          id: string
          email: string
          nome: string
          valid: boolean
        }[]
      }
      validate_professor_login: {
        Args: { prof_email: string; prof_password: string }
        Returns: {
          id: string
          email: string
          nome: string
          valid: boolean
        }[]
      }
    }
    Enums: {
      status_avaliacao: "pendente" | "aprovado" | "rejeitado" | "em_revisao"
      tipo_trabalho:
        | "resumo_expandido"
        | "artigo_completo"
        | "relato_experiencia"
      tipo_usuario: "participante" | "professor" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      status_avaliacao: ["pendente", "aprovado", "rejeitado", "em_revisao"],
      tipo_trabalho: [
        "resumo_expandido",
        "artigo_completo",
        "relato_experiencia",
      ],
      tipo_usuario: ["participante", "professor", "admin"],
    },
  },
} as const
