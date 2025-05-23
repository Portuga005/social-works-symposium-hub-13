
import { getItem, setItem, STORAGE_KEYS, isStorageAvailable } from './storageUtils';
import { User } from './types';

// User functions
export const getUsers = (): User[] => {
  return getItem<User[]>(STORAGE_KEYS.USERS, []);
};

export const getCurrentUser = (): User | null => {
  return getItem<User | null>(STORAGE_KEYS.CURRENT_USER, null);
};

export const saveUser = (user: User): void => {
  if (!isStorageAvailable()) {
    console.error('localStorage is not available');
    return;
  }
  
  try {
    const users = getUsers();
    const existingUserIndex = users.findIndex(u => u.id === user.id);
    
    if (existingUserIndex >= 0) {
      users[existingUserIndex] = user;
    } else {
      users.push(user);
    }
    
    setItem(STORAGE_KEYS.USERS, users);
    console.log(`User ${user.nome} (${user.id}) saved successfully`);
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

export const updateCurrentUser = (user: User | null): void => {
  if (!isStorageAvailable()) {
    console.error('localStorage is not available');
    return;
  }
  
  try {
    if (user) {
      saveUser(user);
    }
    setItem(STORAGE_KEYS.CURRENT_USER, user);
    console.log('Current user updated:', user?.nome || 'null');
  } catch (error) {
    console.error('Error updating current user:', error);
  }
};

// Professor functions
export const getProfessors = (): User[] => {
  return getUsers().filter(user => user.role === 'professor');
};

// User authentication function
export const authenticateUser = (email: string, password: string): User | null => {
  try {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    return user || null;
  } catch (error) {
    console.error('Error authenticating user:', error);
    return null;
  }
};
