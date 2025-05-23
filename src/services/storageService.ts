
import { STORAGE_KEYS } from './storage/storageUtils';
import { User, Submission } from './storage/types';
import {
  getUsers, 
  getCurrentUser, 
  saveUser, 
  updateCurrentUser,
  getProfessors
} from './storage/userService';
import {
  getSubmissions,
  getSubmissionById,
  getSubmissionsByUser,
  getSubmissionsByProfessor,
  getPendingSubmissions,
  getEvaluatedSubmissions,
  saveSubmission
} from './storage/submissionService';
import {
  initializeStorage,
  clearAllDataExceptUsers
} from './storage/systemService';

// Re-export types for backward compatibility
export type { User, Submission };
export { STORAGE_KEYS };

// Export all functions as a single object to maintain the original API
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
  initializeStorage,
  clearAllDataExceptUsers
};

// Also export individual functions for direct imports
export {
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
  initializeStorage,
  clearAllDataExceptUsers
};
