
// Storage keys
export const STORAGE_KEYS = {
  USERS: 'simpUnespar:users',
  CURRENT_USER: 'simpUnespar:user',
  SUBMISSIONS: 'simpUnespar:submissions'
};

// Generic storage functions
export const getItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export const setItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// Utility to check if localStorage is available
export const isStorageAvailable = (): boolean => {
  try {
    const testKey = 'test-localStorage';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};
