
// Storage keys
export const STORAGE_KEYS = {
  USERS: 'simpUnespar:users',
  CURRENT_USER: 'simpUnespar:user',
  SUBMISSIONS: 'simpUnespar:submissions',
  PROFESSORS: 'simpUnespar:professors'
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
}

export interface Professor {
  id: string;
  nome: string;
  email: string;
  trabalhosAvaliados: number;
}

export interface Admin {
  id: string;
  nome: string;
  email: string;
}

export interface User {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  instituicao: string;
  trabalhosSubmetidos: boolean;
  role?: 'admin' | 'professor' | 'user';
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

export const deleteUser = (userId: string): void => {
  const users = getUsers();
  const filteredUsers = users.filter(user => user.id !== userId);
  setItem(STORAGE_KEYS.USERS, filteredUsers);
  
  // If current user is deleted, log out
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    updateCurrentUser(null);
  }
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

export const deleteSubmission = (submissionId: string): void => {
  const submissions = getSubmissions();
  const submission = submissions.find(s => s.id === submissionId);
  
  if (submission) {
    // Update user status
    const user = getUsers().find(u => u.id === submission.userId);
    if (user) {
      saveUser({
        ...user,
        trabalhosSubmetidos: false
      });
      
      // Update current user if it's the same
      const currentUser = getCurrentUser();
      if (currentUser && currentUser.id === user.id) {
        updateCurrentUser({
          ...currentUser,
          trabalhosSubmetidos: false
        });
      }
    }
  }
  
  const filteredSubmissions = submissions.filter(s => s.id !== submissionId);
  setItem(STORAGE_KEYS.SUBMISSIONS, filteredSubmissions);
};

// Professor functions
export const getProfessors = (): User[] => {
  return getUsers().filter(user => user.role === 'professor');
};

// Initialize storage with default data
export const initializeStorage = (): void => {
  const users = getUsers();
  
  // Only initialize if no users exist
  if (users.length === 0) {
    // Add default admin
    saveUser({
      id: '1',
      nome: 'Admin Principal',
      email: 'admin@unespar.edu.br',
      cpf: '111.111.111-11',
      instituicao: 'UNESPAR',
      trabalhosSubmetidos: false,
      role: 'admin'
    });
    
    // Add default professors
    ['A', 'B', 'C'].forEach((letter, index) => {
      saveUser({
        id: `prof-${index + 1}`,
        nome: `Professor ${letter}`,
        email: `prof${letter.toLowerCase()}@unespar.edu.br`,
        cpf: `222.222.222-${index + 1}${index + 1}`,
        instituicao: 'UNESPAR',
        trabalhosSubmetidos: false,
        role: 'professor'
      });
    });
  }
};

export default {
  getUsers,
  getCurrentUser,
  saveUser,
  updateCurrentUser,
  deleteUser,
  getSubmissions,
  getSubmissionById,
  getSubmissionsByUser,
  getSubmissionsByProfessor,
  getPendingSubmissions,
  getEvaluatedSubmissions,
  saveSubmission,
  deleteSubmission,
  getProfessors,
  initializeStorage
};
