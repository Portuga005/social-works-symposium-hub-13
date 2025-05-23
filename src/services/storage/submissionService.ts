
import { getItem, setItem, STORAGE_KEYS } from './storageUtils';
import { Submission } from './types';
import { getUsers, getCurrentUser, saveUser, updateCurrentUser } from './userService';

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
