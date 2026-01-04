
// In-memory fallback
class MemoryStore {
  private cache: Record<string, string> = {};
  getItem(key: string) { return this.cache[key] || null; }
  setItem(key: string, v: string) { this.cache[key] = v; }
  removeItem(key: string) { delete this.cache[key]; }
  clear() { this.cache = {}; }
}

const memStore = new MemoryStore();

// Feature Detection - Runs once on module load
let isLocalAvailable = false;
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    const key = '__storage_test__';
    window.localStorage.setItem(key, key);
    window.localStorage.removeItem(key);
    isLocalAvailable = true;
  }
} catch (e) {
  isLocalAvailable = false;
}

let isSessionAvailable = false;
try {
  if (typeof window !== 'undefined' && window.sessionStorage) {
    const key = '__storage_test__';
    window.sessionStorage.setItem(key, key);
    window.sessionStorage.removeItem(key);
    isSessionAvailable = true;
  }
} catch (e) {
  isSessionAvailable = false;
}

export const storageStatus = {
  local: isLocalAvailable,
  session: isSessionAvailable
};

// Safe wrappers that respect the detection result
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (!isLocalAvailable) return memStore.getItem(key);
    try {
      return window.localStorage.getItem(key);
    } catch (e) { return null; }
  },
  setItem: (key: string, value: string): void => {
    if (!isLocalAvailable) {
      memStore.setItem(key, value);
      return;
    }
    try {
      window.localStorage.setItem(key, value);
    } catch (e) { /* Quota exceeded or permission change */ }
  },
  removeItem: (key: string): void => {
    if (!isLocalAvailable) {
      memStore.removeItem(key);
      return;
    }
    try {
      window.localStorage.removeItem(key);
    } catch (e) { }
  },
  clear: (): void => {
    if (!isLocalAvailable) {
      memStore.clear();
      return;
    }
    try {
      window.localStorage.clear();
    } catch (e) { }
  }
};

export const safeSessionStorage = {
  getItem: (key: string): string | null => {
    if (!isSessionAvailable) return null;
    try {
      return window.sessionStorage.getItem(key);
    } catch (e) { return null; }
  },
  setItem: (key: string, value: string): void => {
    if (!isSessionAvailable) return;
    try {
      window.sessionStorage.setItem(key, value);
    } catch (e) { }
  },
  removeItem: (key: string): void => {
    if (!isSessionAvailable) return;
    try {
      window.sessionStorage.removeItem(key);
    } catch (e) { }
  }
};
