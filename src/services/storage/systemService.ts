import { setItem, getItem, STORAGE_KEYS, isStorageAvailable } from './storageUtils';
import { User } from './types';
import { getUsers, getCurrentUser, saveUser } from './userService';

// Clear all data except for the admin and professor users
export const clearAllDataExceptUsers = (): void => {
  if (!isStorageAvailable()) {
    console.error('localStorage is not available');
    return;
  }

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
  if (!isStorageAvailable()) {
    console.error('localStorage is not available');
    return;
  }

  console.log('Initializing storage...');
  
  // Check if users already exist before initializing
  const existingUsers = getUsers();
  
  // Only initialize if no users exist
  if (existingUsers.length === 0) {
    console.log('Creating default users...');
    
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
    
    console.log('Default users created successfully.');
  } else {
    console.log('Users already exist:', existingUsers.length);
  }
  
  // Initialize submissions if needed but with empty array
  if (!localStorage.getItem(STORAGE_KEYS.SUBMISSIONS)) {
    setItem(STORAGE_KEYS.SUBMISSIONS, []);
    console.log('Submissions initialized with empty array.');
  }
};

// Function to check and log all stored data (for debugging)
export const debugStorage = (): void => {
  if (!isStorageAvailable()) {
    console.error('localStorage is not available');
    return;
  }
  
  console.log('===== STORAGE DEBUG =====');
  console.log('USERS:', getItem(STORAGE_KEYS.USERS, []));
  console.log('CURRENT_USER:', getItem(STORAGE_KEYS.CURRENT_USER, null));
  console.log('SUBMISSIONS:', getItem(STORAGE_KEYS.SUBMISSIONS, []));
  console.log('========================');
};
