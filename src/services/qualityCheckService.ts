
import { QualityCheck } from '@/types';
import { getQualityChecks, saveQualityCheck as saveQC } from './storage/qualityCheckStorageService';
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
  return getQualityChecks();
};

/**
 * Save a quality check with improved error handling
 */
export const saveQualityCheck = (qualityCheck: QualityCheck): QualityCheck => {
  const result = saveQC(qualityCheck);
  
  if (!result.success) {
    // This could be enhanced with a toast notification in the future
    console.error('Failed to save quality check. Storage may be full.');
  }
  
  return qualityCheck;
};

/**
 * Get performance data from quality checks - delegated to performance service
 */
export const getPerformanceData = () => {
  return getPerfData();
};
