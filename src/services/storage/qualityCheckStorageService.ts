
import { QualityCheck } from '@/types';

const STORAGE_KEY = 'quality_check_results';

/**
 * Get all quality checks from localStorage with error handling
 */
export const getQualityChecks = (): QualityCheck[] => {
  try {
    const checks = localStorage.getItem(STORAGE_KEY);
    if (!checks) {
      console.info('No quality checks found in localStorage');
      return [];
    }
    return JSON.parse(checks);
  } catch (error) {
    console.error('Error getting quality checks:', error);
    // Show a toast or other user notification here
    return [];
  }
};

/**
 * Save quality checks to localStorage with error handling
 */
export const saveQualityChecks = (checks: QualityCheck[]): boolean => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checks));
    return true;
  } catch (error) {
    console.error('Error saving quality checks:', error);
    // This could be due to localStorage being full or other browser issues
    return false;
  }
};

/**
 * Save a quality check with error handling and return success status
 */
export const saveQualityCheck = (qualityCheck: QualityCheck): { success: boolean, result: QualityCheck | null } => {
  try {
    const checks = getQualityChecks();
    
    // Check if it already exists
    const existingIndex = checks.findIndex(qc => qc.id === qualityCheck.id);
    
    if (existingIndex !== -1) {
      // Update existing check
      checks[existingIndex] = qualityCheck;
    } else {
      // Add new check
      checks.unshift(qualityCheck);
    }
    
    const saveSuccess = saveQualityChecks(checks);
    
    if (!saveSuccess) {
      throw new Error('Failed to save quality checks to localStorage');
    }
    
    return { success: true, result: qualityCheck };
  } catch (error) {
    console.error('Error in saveQualityCheck:', error);
    return { success: false, result: null };
  }
};
