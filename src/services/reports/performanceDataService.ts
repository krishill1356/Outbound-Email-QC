
import { QualityCriteria, QualityCheck } from '@/types';
import { getAgent } from '../agentService';
import { getQualityChecks } from '../storage/qualityCheckStorageService';

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
 * Get performance data from quality checks
 * @param agentId Optional filter by agent ID
 */
export const getPerformanceData = (agentId?: string) => {
  const checks = getQualityChecks();
  
  // Filter checks by agent if specified
  const filteredChecks = agentId 
    ? checks.filter(check => check.agentId === agentId) 
    : checks;
  
  // Aggregate overall scores
  const overallScores = filteredChecks.map(check => ({
    date: check.date,
    average: check.overallScore
  }));

  // Get agents from the quality checks
  let uniqueAgentIds = [...new Set(filteredChecks.map(check => check.agentId))];
  
  // If filtering by agent, only include that agent
  if (agentId) {
    uniqueAgentIds = uniqueAgentIds.filter(id => id === agentId);
  }
  
  // Calculate agent-specific scores
  const agentScores = uniqueAgentIds.map(agentId => {
    const agent = getAgent(agentId);
    if (!agent) return null;
    
    const agentChecks = filteredChecks.filter(check => check.agentId === agentId);
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

/**
 * Get performance data by criteria
 * Helps with drill-down reports
 */
export const getPerformanceByCriteria = (criteriaId: string, agentId?: string) => {
  const checks = getQualityChecks();
  
  // Filter checks by agent if specified
  const filteredChecks = agentId 
    ? checks.filter(check => check.agentId === agentId) 
    : checks;
  
  // Extract scores for the specific criteria
  const criteriaScores = filteredChecks.map(check => {
    const score = check.scores.find(s => s.criteriaId === criteriaId);
    return {
      date: check.date,
      agentId: check.agentId,
      agentName: check.agentName,
      score: score ? score.score : 0,
      feedback: score ? score.feedback : ''
    };
  });
  
  return criteriaScores;
};
