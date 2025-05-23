
// Storage keys
export const STORAGE_KEYS = {
  USERS: 'simpUnespar:users',
  CURRENT_USER: 'simpUnespar:user',
  SUBMISSIONS: 'simpUnespar:submissions'
};

// Interface types
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

// Generic get function
const getItem = <T>(key: string, defaultValue: T): T => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
};

// Generic set function
const setItem = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// User functions
export const getUsers = (): User[] => {
  return getItem<User[]>(STORAGE_KEYS.USERS, []);
};

export const getCurrentUser = (): User | null => {
  return getItem<User | null>(STORAGE_KEYS.CURRENT_USER, null);
};

export const saveUser = (user: User): void => {
  const users = getUsers();
  const existingUserIndex = users.findIndex(u => u.id === user.id);
  
  if (existingUserIndex >= 0) {
    users[existingUserIndex] = user;
  } else {
    users.push(user);
  }
  
  setItem(STORAGE_KEYS.USERS, users);
};

export const updateCurrentUser = (user: User | null): void => {
  if (user) {
    saveUser(user);
  }
  setItem(STORAGE_KEYS.CURRENT_USER, user);
};

// Submission functions
export const getSubmissions = (): Submission[] => {
  return getItem<Submission[]>(STORAGE_KEYS.SUBMISSIONS, []);
};

export const getSubmissionById = (id: string): Submission | undefined => {
  const submissions = getSubmissions();
  return submissions.find(submission => submission.id === id);
};

export const getSubmissionsByUser = (userId: string): Submission[] => {
  const submissions = getSubmissions();
  return submissions.filter(submission => submission.userId === userId);
};

export const getSubmissionsByProfessor = (professorId: string): Submission[] => {
  const submissions = getSubmissions();
  return submissions.filter(submission => submission.professorId === professorId);
};

export const getPendingSubmissions = (): Submission[] => {
  const submissions = getSubmissions();
  return submissions.filter(submission => !submission.resultado || submission.resultado === 'Em análise');
};

export const getEvaluatedSubmissions = (): Submission[] => {
  const submissions = getSubmissions();
  return submissions.filter(submission => submission.resultado && submission.resultado !== 'Em análise');
};

export const saveSubmission = (submission: Submission): void => {
  const submissions = getSubmissions();
  const existingSubmissionIndex = submissions.findIndex(s => s.id === submission.id);
  
  if (existingSubmissionIndex >= 0) {
    submissions[existingSubmissionIndex] = submission;
  } else {
    submissions.push(submission);
  }
  
  setItem(STORAGE_KEYS.SUBMISSIONS, submissions);
  
  // Update user status if it's a new submission
  if (existingSubmissionIndex === -1) {
    const user = getUsers().find(u => u.id === submission.userId);
    if (user) {
      saveUser({
        ...user,
        trabalhosSubmetidos: true
      });
      
      // Update current user if it's the same
      const currentUser = getCurrentUser();
      if (currentUser && currentUser.id === user.id) {
        updateCurrentUser({
          ...currentUser,
          trabalhosSubmetidos: true
        });
      }
    }
  }
};

// Professor functions
export const getProfessors = (): User[] => {
  return getUsers().filter(user => user.role === 'professor');
};

// Initialize storage with default data
export const initializeStorage = (): void => {
  // Check if users already exist before initializing
  const existingUsers = getUsers();
  
  if (existingUsers.length === 0) {
    // Add default admin
    saveUser({
      id: 'admin-1',
      nome: 'Admin Principal',
      email: 'admin@unespar.edu.br',
      cpf: '111.111.111-11',
      instituicao: 'UNESPAR',
      trabalhosSubmetidos: false,
      role: 'admin',
      password: 'admin123' // Store password for authentication
    });
    
    // Add default professor
    saveUser({
      id: 'prof-1',
      nome: 'Professor A',
      email: 'profa@unespar.edu.br',
      cpf: '222.222.222-11',
      instituicao: 'UNESPAR',
      trabalhosSubmetidos: false,
      role: 'professor',
      password: 'prof123' // Store password for authentication
    });
  }
  
  // Initialize submissions if needed
  if (!localStorage.getItem(STORAGE_KEYS.SUBMISSIONS)) {
    setItem(STORAGE_KEYS.SUBMISSIONS, []);
  }
};

export default {
  getUsers,
  getCurrentUser,
  saveUser,
  updateCurrentUser,
  getSubmissions,
  getSubmissionById,
  getSubmissionsByUser,
  getSubmissionsByProfessor,
  getPendingSubmissions,
  getEvaluatedSubmissions,
  saveSubmission,
  getProfessors,
  initializeStorage
};
