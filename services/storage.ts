
// In-memory fallback for when storage is blocked
const memoryStore = new Map<string, string>();
let isLocalBlocked = false;
let isSessionBlocked = false;

// Helper to safely access storage with circuit breaker
const tryStorage = (
  type: 'localStorage' | 'sessionStorage',
  action: 'get' | 'set' | 'remove' | 'clear',
  key?: string,
  value?: string
): string | null => {
  // 1. Check if already blocked
  if (type === 'localStorage' && isLocalBlocked) {
    if (action === 'get' && key) return memoryStore.get(key) || null;
    if (action === 'set' && key && value) memoryStore.set(key, value);
    if (action === 'remove' && key) memoryStore.delete(key);
    if (action === 'clear') memoryStore.clear();
    return null;
  }
  
  if (type === 'sessionStorage' && isSessionBlocked) return null;

  // 2. Try access
  try {
    const storage = window[type];
    if (action === 'get' && key) return storage.getItem(key);
    if (action === 'set' && key && value) storage.setItem(key, value);
    if (action === 'remove' && key) storage.removeItem(key);
    if (action === 'clear') storage.clear();
    return null;
  } catch (e) {
    // 3. On Error: Block future access
    if (type === 'localStorage') {
      isLocalBlocked = true;
      // Sync memory store if possible/needed? No, start fresh to be safe.
      if (action === 'set' && key && value) memoryStore.set(key, value);
    } else {
      isSessionBlocked = true;
    }
    return null;
  }
};

export const storageStatus = {
  get local() { return !isLocalBlocked; },
  get session() { return !isSessionBlocked; }
};

export const safeLocalStorage = {
  getItem: (key: string): string | null => tryStorage('localStorage', 'get', key),
  setItem: (key: string, value: string): void => { tryStorage('localStorage', 'set', key, value); },
  removeItem: (key: string): void => { tryStorage('localStorage', 'remove', key); },
  clear: (): void => { tryStorage('localStorage', 'clear'); }
};

export const safeSessionStorage = {
  getItem: (key: string): string | null => tryStorage('sessionStorage', 'get', key),
  setItem: (key: string, value: string): void => { tryStorage('sessionStorage', 'set', key, value); },
  removeItem: (key: string): void => { tryStorage('sessionStorage', 'remove', key); }
};
