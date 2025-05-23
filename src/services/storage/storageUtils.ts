
// Storage keys
export const STORAGE_KEYS = {
  USERS: 'simpUnespar:users',
  CURRENT_USER: 'simpUnespar:user',
  SUBMISSIONS: 'simpUnespar:submissions'
};

// Generic storage functions
export const getItem = <T>(key: string, defaultValue: T): T => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
};

export const setItem = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};
