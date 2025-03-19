
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
