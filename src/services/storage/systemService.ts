import { setItem, STORAGE_KEYS } from './storageUtils';
import { getUsers, getCurrentUser, saveUser } from './userService';

// Clear all data except for the admin and professor users
export const clearAllDataExceptUsers = (): void => {
  const users = getUsers();
  
  // Filter to keep only admin and professor users
  const adminUser = users.find(user => user.email === 'admin@unespar.edu.br');
  const professorUser = users.find(user => user.email === 'profa@unespar.edu.br');
  
  const essentialUsers = [];
  if (adminUser) essentialUsers.push(adminUser);
  if (professorUser) essentialUsers.push(professorUser);
  
  // Clear all storage except users
  setItem(STORAGE_KEYS.USERS, essentialUsers);
  setItem(STORAGE_KEYS.SUBMISSIONS, []);
  
  // Clear current user if it's not admin or professor
  const currentUser = getCurrentUser();
  if (currentUser && (currentUser.email !== 'admin@unespar.edu.br' && currentUser.email !== 'profa@unespar.edu.br')) {
    setItem(STORAGE_KEYS.CURRENT_USER, null);
  }
};

// Initialize storage with only admin and professor accounts
export const initializeStorage = (): void => {
  // Check if users already exist before initializing
  const existingUsers = getUsers();
  
  // Only initialize if no users exist
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
      password: 'admin123'
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
      password: 'prof123'
    });
  }
  
  // Initialize submissions if needed but with empty array
  if (!localStorage.getItem(STORAGE_KEYS.SUBMISSIONS)) {
    setItem(STORAGE_KEYS.SUBMISSIONS, []);
  }
  
  // Clear any fictional data
  clearAllDataExceptUsers();
};
