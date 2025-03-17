
// A simple service to get and store settings in localStorage

/**
 * Get settings from localStorage
 * @param key - The key under which settings are stored
 * @returns The settings object or null if not found
 */
export const getSettings = (key: string): any => {
  const settingsString = localStorage.getItem(`app_settings_${key}`);
  if (!settingsString) return null;
  
  try {
    return JSON.parse(settingsString);
  } catch (error) {
    console.error(`Error parsing settings for ${key}:`, error);
    return null;
  }
};

/**
 * Save settings to localStorage
 * @param key - The key under which to store settings
 * @param settings - The settings object to store
 */
export const saveSettings = (key: string, settings: any): void => {
  try {
    localStorage.setItem(`app_settings_${key}`, JSON.stringify(settings));
  } catch (error) {
    console.error(`Error saving settings for ${key}:`, error);
  }
};
