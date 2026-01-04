
// Safely check if storage is available
const isStorageAvailable = (type: 'localStorage' | 'sessionStorage'): boolean => {
  try {
    const storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return false;
  }
};

export const storageStatus = {
  local: typeof window !== 'undefined' ? isStorageAvailable('localStorage') : false,
  session: typeof window !== 'undefined' ? isStorageAvailable('sessionStorage') : false
};

// Wrapper for LocalStorage
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      if (storageStatus.local) {
        return localStorage.getItem(key);
      }
      return null;
    } catch (e) {
      console.warn('LocalStorage blocked:', e);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      if (storageStatus.local) {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn('LocalStorage write failed:', e);
    }
  },
  removeItem: (key: string): void => {
    try {
      if (storageStatus.local) {
        localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn('LocalStorage remove failed:', e);
    }
  },
  clear: (): void => {
    try {
      if (storageStatus.local) {
        localStorage.clear();
      }
    } catch (e) {
       console.warn('LocalStorage clear failed:', e);
    }
  }
};

// Wrapper for SessionStorage
export const safeSessionStorage = {
  getItem: (key: string): string | null => {
    try {
      if (storageStatus.session) {
        return sessionStorage.getItem(key);
      }
      return null;
    } catch (e) {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      if (storageStatus.session) {
        sessionStorage.setItem(key, value);
      }
    } catch (e) {
      // Ignore
    }
  },
  removeItem: (key: string): void => {
    try {
      if (storageStatus.session) {
        sessionStorage.removeItem(key);
      }
    } catch (e) {
      // Ignore
    }
  }
};
