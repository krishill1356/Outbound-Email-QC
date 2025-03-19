
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
