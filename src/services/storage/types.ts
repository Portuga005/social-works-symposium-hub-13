
export interface Submission {
  id: string;
  userId: string;
  titulo: string;
  areaTematica: string;
  dataEnvio: string;
  arquivo: string;
  resultado?: 'Aprovado' | 'Reprovado' | 'Em análise';
  feedback?: string;
  professorId?: string;
  dataAvaliacao?: string;
}

export interface User {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  instituicao: string;
  trabalhosSubmetidos: boolean;
  role?: 'admin' | 'professor' | 'user';
  password?: string; // Added password field for authentication
}
