
import { QualityCheck } from '@/types';
import { getQualityChecks as getStoredQualityChecks, saveQualityCheck as saveQC } from './storage/qualityCheckStorageService';
import { analyzeEmailStructure } from './structural/emailStructureService';
import { getPerformanceData as getPerfData, CRITERIA } from './reports/performanceDataService';

/**
 * Re-export CRITERIA for backward compatibility
 */
export { CRITERIA };

/**
 * Re-export analyzeEmailStructure for backward compatibility
 */
export { analyzeEmailStructure };

/**
 * Get all quality checks - delegated to storage service
 */
export const getQualityChecks = (): QualityCheck[] => {
  return getStoredQualityChecks();
};

/**
 * Save a quality check with improved error handling
 */
export const saveQualityCheck = (qualityCheck: QualityCheck): QualityCheck => {
  // Ensure the qualityCheck has all required fields
  if (!qualityCheck.id || !qualityCheck.agentId || !qualityCheck.emailContent) {
    console.error('Invalid quality check data. Missing required fields.');
    throw new Error('Invalid quality check data');
  }
  
  const result = saveQC(qualityCheck);
  
  if (!result.success) {
    console.error('Failed to save quality check. Storage may be full.');
    // The toast is now handled by the component that calls this function
  }
  
  return qualityCheck;
};

/**
 * Get performance data from quality checks - delegated to performance service
 */
export const getPerformanceData = () => {
  return getPerfData();
};

/**
 * Run a full automated quality analysis on an email
 * This is a convenience method that combines multiple analysis services
 */
export const runAutomatedQualityAnalysis = async (emailContent: string, subject: string) => {
  // This could be expanded later to integrate with more advanced AI services
  const structuralAnalysis = analyzeEmailStructure(emailContent);
  
  // Return a combined analysis result
  return {
    structuralAnalysis,
    // Other analysis results could be added here
  };
};

/**
 * Delete quality checks for a specific agent
 * This should be called when an agent is deleted
 */
export const deleteQualityChecksForAgent = (agentId: string): boolean => {
  try {
    const allChecks = getQualityChecks();
    const filteredChecks = allChecks.filter(check => check.agentId !== agentId);
    
    // If any checks were removed
    if (filteredChecks.length < allChecks.length) {
      // Save the filtered list back
      const result = saveQC({ type: 'bulk', checks: filteredChecks });
      return result.success;
    }
    
    return true; // No checks needed to be removed
  } catch (error) {
    console.error('Error deleting quality checks for agent:', error);
    return false;
  }
};
