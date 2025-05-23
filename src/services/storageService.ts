
import { STORAGE_KEYS, isStorageAvailable } from './storage/storageUtils';
import { User, Submission } from './storage/types';
import {
  getUsers, 
  getCurrentUser, 
  saveUser, 
  updateCurrentUser,
  getProfessors,
  authenticateUser
} from './storage/userService';
import {
  getSubmissions,
  getSubmissionById,
  getSubmissionsByUser,
  getSubmissionsByProfessor,
  getPendingSubmissions,
  getEvaluatedSubmissions,
  saveSubmission,
  debugSubmissions
} from './storage/submissionService';
import {
  initializeStorage,
  clearAllDataExceptUsers,
  debugStorage
} from './storage/systemService';

// Re-export types for backward compatibility
export type { User, Submission };
export { STORAGE_KEYS, isStorageAvailable };

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
  clearAllDataExceptUsers,
  authenticateUser,
  debugStorage,
  debugSubmissions,
  isStorageAvailable
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
  clearAllDataExceptUsers,
  authenticateUser,
  debugStorage,
  debugSubmissions
};
