import { QualityCriteria, QualityCheck, Agent, Template, PerformanceData, ScoreBreakdown } from '@/types';

// Updated criteria with new weights and removal of empathy
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
    description: 'Includes template header, footer, proper greeting and sign-off',
    weight: 0.25,
  },
];

export const AGENTS: Agent[] = [
  {
    id: 'agent-1',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    department: 'Customer Support',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: 'agent-2',
    name: 'Bob Williams',
    email: 'bob.williams@example.com',
    department: 'Customer Support',
    avatar: 'https://i.pravatar.cc/150?img=2'
  },
  {
    id: 'agent-3',
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    department: 'Customer Support',
    avatar: 'https://i.pravatar.cc/150?img=3'
  },
  {
    id: 'agent-4',
    name: 'Diana Miller',
    email: 'diana.miller@example.com',
    department: 'Customer Support',
    avatar: 'https://i.pravatar.cc/150?img=4'
  },
  {
    id: 'agent-5',
    name: 'Ethan Davis',
    email: 'ethan.davis@example.com',
    department: 'Customer Support',
    avatar: 'https://i.pravatar.cc/150?img=5'
  }
];

export const TEMPLATES: Template[] = [
  {
    id: 'template-1',
    name: 'Initial Response',
    description: 'Standard initial response to customer inquiries',
    content: 'Dear [Customer Name],\n\nThank you for contacting us. We have received your inquiry and are currently reviewing it. We will get back to you as soon as possible.\n\nRegards,\n[Your Name]',
    tags: ['initial', 'response', 'standard']
  },
  {
    id: 'template-2',
    name: 'Follow Up',
    description: 'Template for following up on unresolved issues',
    content: 'Dear [Customer Name],\n\nI hope this email finds you well. I am following up on your previous inquiry. Please let us know if you need further assistance.\n\nRegards,\n[Your Name]',
    tags: ['follow up', 'inquiry', 'assistance']
  },
  {
    id: 'template-3',
    name: 'Resolution Confirmation',
    description: 'Confirming that an issue has been resolved',
    content: 'Dear [Customer Name],\n\nWe are pleased to inform you that your issue has been resolved. If you have any further questions, please do not hesitate to contact us.\n\nRegards,\n[Your Name]',
    tags: ['resolution', 'confirmation', 'issue']
  }
];

export let QUALITY_CHECKS: QualityCheck[] = [
  {
    id: 'qc-1',
    agentId: 'agent-1',
    agentName: 'Alice Johnson',
    emailId: 'email-1',
    emailSubject: 'Regarding your inquiry',
    reviewerId: 'reviewer-1',
    date: '2024-07-15',
    emailContent: 'Dear Customer, Thank you for contacting us...',
    scores: [
      { criteriaId: 'tone', score: 8, feedback: 'Good tone.' },
      { criteriaId: 'clarity', score: 7, feedback: 'Could be clearer.' },
      { criteriaId: 'spelling-grammar', score: 9, feedback: 'Excellent grammar.' },
      { criteriaId: 'structure', score: 8, feedback: 'Well-structured.' }
    ],
    overallScore: 8,
    feedback: 'Overall good email.',
    recommendations: ['Maintain good tone.', 'Improve clarity in some areas.'],
    status: 'completed'
  },
  {
    id: 'qc-2',
    agentId: 'agent-2',
    agentName: 'Bob Williams',
    emailId: 'email-2',
    emailSubject: 'Re: Your recent order',
    reviewerId: 'reviewer-1',
    date: '2024-07-16',
    emailContent: 'Hello, We have processed your order...',
    scores: [
      { criteriaId: 'tone', score: 6, feedback: 'Tone could be improved.' },
      { criteriaId: 'clarity', score: 8, feedback: 'Clear and concise.' },
      { criteriaId: 'spelling-grammar', score: 7, feedback: 'Minor grammar issues.' },
      { criteriaId: 'structure', score: 9, feedback: 'Excellent structure.' }
    ],
    overallScore: 7,
    feedback: 'Good email but tone needs work.',
    recommendations: ['Work on professional tone.', 'Proofread for grammar.'],
    status: 'completed'
  },
  {
    id: 'qc-3',
    agentId: 'agent-1',
    agentName: 'Alice Johnson',
    emailId: 'email-3',
    emailSubject: 'Inquiry about product X',
    reviewerId: 'reviewer-1',
    date: '2024-07-17',
    emailContent: 'Dear Customer, Regarding your inquiry about product X...',
    scores: [
      { criteriaId: 'tone', score: 9, feedback: 'Excellent tone.' },
      { criteriaId: 'clarity', score: 9, feedback: 'Very clear.' },
      { criteriaId: 'spelling-grammar', score: 10, feedback: 'Perfect grammar.' },
      { criteriaId: 'structure', score: 10, feedback: 'Perfect structure.' }
    ],
    overallScore: 10,
    feedback: 'Excellent email overall.',
    recommendations: ['No recommendations, keep up the good work!'],
    status: 'completed'
  }
];

// Create a function to store quality checks
export const saveQualityCheck = (qualityCheck: QualityCheck) => {
  // In a real app, this would save to a database
  // For this mock, we'll add it to our existing array
  QUALITY_CHECKS.unshift(qualityCheck); // Add to the beginning of the array
  return qualityCheck;
};

// Create a function to get all quality checks
export const getQualityChecks = (): QualityCheck[] => {
  return QUALITY_CHECKS;
};

// Update the performance data function to use the stored quality checks
export const getPerformanceData = () => {
  // Aggregate overall scores
  const overallScores = QUALITY_CHECKS.map(check => ({
    date: check.date,
    average: check.overallScore
  }));

  // Aggregate agent-specific scores
  const agentScores = AGENTS.map(agent => {
    const agentChecks = QUALITY_CHECKS.filter(check => check.agentId === agent.id);
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
  });

  return {
    overall: overallScores,
    agents: agentScores
  };
};

// Helper function to check grammar with Grammarly
export const checkGrammar = async (text: string): Promise<{
  score: number;
  suggestions: string[];
}> => {
  // In a real implementation, this would call the Grammarly API
  // For now, we'll simulate a response
  console.log("Checking grammar with Grammarly for:", text.substring(0, 50) + "...");
  
  // Simple scoring based on common errors
  let score = 10;
  const suggestions: string[] = [];
  
  // Basic checks
  if (text.includes("  ")) {
    score -= 0.5;
    suggestions.push("Avoid double spaces");
  }
  
  if (text.toLowerCase().includes("your welcome")) {
    score -= 1;
    suggestions.push("Use 'you're welcome' instead of 'your welcome'");
  }
  
  if (text.toLowerCase().includes("their is")) {
    score -= 1;
    suggestions.push("Use 'there is' instead of 'their is'");
  }
  
  // Simulate a slight delay to simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    score: Math.round(score),
    suggestions
  };
};
