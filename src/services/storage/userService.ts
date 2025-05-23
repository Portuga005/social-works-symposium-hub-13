
import { getItem, setItem, STORAGE_KEYS } from './storageUtils';
import { User } from './types';

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

// Professor functions
export const getProfessors = (): User[] => {
  return getUsers().filter(user => user.role === 'professor');
};
