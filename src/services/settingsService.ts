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

/**
 * Get general application settings
 * @returns The general settings object with defaults
 */
export const getGeneralSettings = () => {
  const settings = getSettings('general');
  return {
    language: 'en',
    timezone: 'utc',
    defaultView: 'dashboard',
    ...(settings || {})
  };
};

/**
 * Save general application settings
 * @param settings - The settings object to store
 */
export const saveGeneralSettings = (settings: any): void => {
  saveSettings('general', settings);
};

/**
 * Apply the current theme based on stored settings
 * Sets the appropriate class on the document element
 */
export const applyTheme = (): void => {
  const themeSettings = getSettings('appearance');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // If settings exist and specify a theme, apply it
  // Otherwise, use the system preference
  if (themeSettings?.theme) {
    document.documentElement.classList.toggle('dark', themeSettings.theme === 'dark');
  } else {
    document.documentElement.classList.toggle('dark', prefersDark);
  }
};

/**
 * Save theme settings
 * @param theme - 'light', 'dark', or 'system'
 */
export const saveThemeSettings = (theme: 'light' | 'dark' | 'system'): void => {
  saveSettings('appearance', { theme });
  applyTheme();
};
