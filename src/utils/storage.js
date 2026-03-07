const PREFIX = 'box-';

/**
 * Storage utility for APP BOX
 * Automatically handles JSON serialization and key prefixing
 */
export const storage = {
  /**
   * Set a value in localStorage with the prefix
   * @param {string} key 
   * @param {any} value 
   */
  set: (key, value) => {
    try {
      localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
    } catch (e) {
      console.error('Storage Set Error:', e);
    }
  },

  /**
   * Get a value from localStorage with the prefix
   * @param {string} key 
   * @param {any} defaultValue 
   * @returns {any}
   */
  get: (key, defaultValue) => {
    const value = localStorage.getItem(`${PREFIX}${key}`);
    if (value === null) return defaultValue;
    
    try {
      return JSON.parse(value);
    } catch (e) {
      // Return raw value if it's not JSON (legacy or unexpected)
      return value;
    }
  },

  /**
   * Remove a key from localStorage
   * @param {string} key 
   */
  remove: (key) => {
    localStorage.removeItem(`${PREFIX}${key}`);
  },

  /**
   * Clear all items with the APP BOX prefix
   */
  clear: () => {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(PREFIX)) {
        keys.push(key);
      }
    }
    keys.forEach(key => localStorage.removeItem(key));
  },

  /**
   * Get all storage items belonging to APP BOX
   * @returns {Array<{key: string, value: any}>}
   */
  getAll: () => {
    const items = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(PREFIX)) {
        const value = localStorage.getItem(key);
        let parsedValue;
        try {
          parsedValue = JSON.parse(value);
        } catch (e) {
          parsedValue = value;
        }
        items.push({
          key: key.replace(PREFIX, ''),
          value: parsedValue
        });
      }
    }
    return items;
  }
};
