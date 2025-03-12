
import { QualityCriteria, Agent, Template, QualityCheck } from '@/types';

// Define quality assessment criteria
export const CRITERIA: QualityCriteria[] = [
  {
    id: "spelling-grammar",
    name: "Spelling & Grammar",
    description: "Correct spelling, grammar, and punctuation throughout the email",
    weight: 0.2
  },
  {
    id: "tone",
    name: "Tone",
    description: "Appropriate and professional tone that aligns with company standards",
    weight: 0.2
  },
  {
    id: "empathy",
    name: "Empathy",
    description: "Shows understanding and addresses the customer's emotional state",
    weight: 0.2
  },
  {
    id: "template-consistency",
    name: "Template Consistency",
    description: "Adheres to the required template structure and formatting",
    weight: 0.2
  },
  {
    id: "solution-clarity",
    name: "Solution Clarity",
    description: "Clearly explains solutions, next steps, or requested information",
    weight: 0.2
  }
];

// Empty initial states
export const AGENTS: Agent[] = [];
export const TEMPLATES: Template[] = [];
export const QUALITY_CHECKS: QualityCheck[] = [];

// Helper function to get all quality checks for an agent
export const getAgentQualityChecks = (agentId: string) => {
  return QUALITY_CHECKS.filter(qc => qc.agentId === agentId);
};

// Helper function to get performance data for charts
export const getPerformanceData = () => {
  const last30Days = [...Array(30)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split('T')[0];
  });
  
  // Empty performance data structure
  return {
    overall: last30Days.map(date => ({ date, average: 0 })),
    agents: []
  };
};
