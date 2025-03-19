
import { QualityCheck, QualityCriteria } from '@/types';
import { getAgent } from './agentService';

const STORAGE_KEY = 'quality_check_results';

// Default quality criteria
export const CRITERIA: QualityCriteria[] = [
  {
    id: 'tone',
    name: 'Tone',
    description: 'Professional, polite with semi-formal language. No colloquialisms.',
    weight: 0.25,
  },
  {
    id: 'clarity',
    name: 'Clarity',
    description: 'Clear explanation of information and next steps',
    weight: 0.25,
  },
  {
    id: 'spelling-grammar',
    name: 'Spelling & Grammar',
    description: 'Correct spelling and grammar throughout the email',
    weight: 0.25,
  },
  {
    id: 'structure',
    name: 'Structure',
    description: 'Includes greeting, header, proper signature, and footer',
    weight: 0.25,
  },
];

/**
 * Get all quality checks from localStorage
 */
export const getQualityChecks = (): QualityCheck[] => {
  try {
    const checks = localStorage.getItem(STORAGE_KEY);
    return checks ? JSON.parse(checks) : [];
  } catch (error) {
    console.error('Error getting quality checks:', error);
    return [];
  }
};

/**
 * Save quality checks to localStorage
 */
export const saveQualityChecks = (checks: QualityCheck[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checks));
  } catch (error) {
    console.error('Error saving quality checks:', error);
  }
};

/**
 * Save a quality check
 */
export const saveQualityCheck = (qualityCheck: QualityCheck): QualityCheck => {
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
  
  saveQualityChecks(checks);
  return qualityCheck;
};

/**
 * Analyze email structure to check for greeting, header, signature, and footer
 */
export const analyzeEmailStructure = (emailContent: string): {
  hasGreeting: boolean;
  hasHeader: boolean;
  hasSignature: boolean;
  hasFooter: boolean;
  feedback: string;
  score: number;
} => {
  // Convert to lowercase and normalize whitespace
  const normalizedContent = emailContent.toLowerCase().replace(/\s+/g, ' ');
  const lines = emailContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Check for greeting
  const greetingPatterns = [
    /\b(hello|hi|hey|dear|good\s(morning|afternoon|evening)|greetings)\b/i
  ];
  const hasGreeting = greetingPatterns.some(pattern => 
    pattern.test(lines.length > 0 ? lines[0] : '') || 
    (lines.length > 1 ? pattern.test(lines[1]) : false)
  );
  
  // Check for header (company/department names at top)
  const headerPatterns = [
    /\b(my\s+law\s+matters|air\s+travel\s+claim|legal\s+department|claims\s+department)\b/i
  ];
  const hasHeader = headerPatterns.some(pattern => 
    normalizedContent.includes(pattern.source.replace(/\\b|\\/g, '').toLowerCase())
  );
  
  // Check for signature (closing remarks)
  const signaturePatterns = [
    /\b(many\s+thanks|yours\s+(sincerely|faithfully)|best\s+(regards|wishes)|thank\s+you|regards|sincerely)\b/i
  ];
  const hasSignature = signaturePatterns.some(pattern => {
    // Look at the last 3 lines for signatures
    for (let i = Math.max(0, lines.length - 3); i < lines.length; i++) {
      if (pattern.test(lines[i])) return true;
    }
    return false;
  });
  
  // Check for footer
  const footerPatterns = [
    /\b(my\s+law\s+matters|air\s+travel\s+claim|contact\s+us|www\.|http)/i
  ];
  const hasFooter = footerPatterns.some(pattern => {
    // Look at the last 2 lines for footer
    for (let i = Math.max(0, lines.length - 2); i < lines.length; i++) {
      if (pattern.test(lines[i])) return true;
    }
    return false;
  });
  
  // Count missing elements
  const missingElements = [];
  if (!hasGreeting) missingElements.push("greeting");
  if (!hasHeader) missingElements.push("header");
  if (!hasSignature) missingElements.push("signature");
  if (!hasFooter) missingElements.push("footer");
  
  // Calculate score (0-10) based on presence of elements
  let score = 10;
  // Each missing element reduces score by 2.5 points
  score -= missingElements.length * 2.5;
  
  // Generate feedback
  let feedback = "";
  if (missingElements.length === 0) {
    feedback = "Email has proper structure with all required elements: greeting, header, signature, and footer.";
  } else {
    feedback = `Email is missing the following structural elements: ${missingElements.join(', ')}.`;
  }
  
  return {
    hasGreeting,
    hasHeader,
    hasSignature,
    hasFooter,
    feedback,
    score
  };
};

/**
 * Get performance data from quality checks
 */
export const getPerformanceData = () => {
  const checks = getQualityChecks();
  
  // Aggregate overall scores
  const overallScores = checks.map(check => ({
    date: check.date,
    average: check.overallScore
  }));

  // Get agents from the quality checks
  const uniqueAgentIds = [...new Set(checks.map(check => check.agentId))];
  
  // Calculate agent-specific scores
  const agentScores = uniqueAgentIds.map(agentId => {
    const agent = getAgent(agentId);
    if (!agent) return null;
    
    const agentChecks = checks.filter(check => check.agentId === agentId);
    const trend = agentChecks.map(check => ({
      date: check.date,
      score: check.overallScore
    }));

    // Calculate average score for the agent
    const averageScore = agentChecks.length > 0
      ? agentChecks.reduce((sum, check) => sum + check.overallScore, 0) / agentChecks.length
      : 0;

    // Calculate criteria breakdown for the agent
    const criteriaBreakdown = CRITERIA.map(criteria => {
      const criteriaScores = agentChecks.map(check => {
        const score = check.scores.find(s => s.criteriaId === criteria.id);
        return score ? score.score : 0;
      });

      const average = criteriaScores.length > 0
        ? criteriaScores.reduce((sum, score) => sum + score, 0) / criteriaScores.length
        : 0;

      return {
        criteriaId: criteria.id,
        name: criteria.name,
        average: average
      };
    });

    return {
      agent: agent,
      trend: trend,
      averageScore: averageScore,
      checksCount: agentChecks.length,
      criteriaBreakdown: criteriaBreakdown
    };
  }).filter(Boolean);

  return {
    overall: overallScores,
    agents: agentScores
  };
};
