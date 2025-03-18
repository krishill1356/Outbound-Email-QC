
import { QualityCriteria, QualityCheck, Agent, Template, PerformanceData, ScoreBreakdown, SpellCheckResult } from '@/types';

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

// Using let to make the array mutable for agent management
export let AGENTS: Agent[] = [
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
  // Check if the quality check already exists
  const existingIndex = QUALITY_CHECKS.findIndex(qc => qc.id === qualityCheck.id);
  
  if (existingIndex !== -1) {
    // Update existing check
    QUALITY_CHECKS[existingIndex] = qualityCheck;
  } else {
    // Add new check
    QUALITY_CHECKS.unshift(qualityCheck); // Add to the beginning of the array
  }
  
  return qualityCheck;
};

// Create a function to get all quality checks
export const getQualityChecks = (): QualityCheck[] => {
  return QUALITY_CHECKS;
};

// Add function to manage agents
export const addAgent = (agent: Omit<Agent, 'id' | 'avatar'>): Agent => {
  const newAgent: Agent = {
    id: `agent-${Date.now()}`,
    ...agent,
    avatar: `https://i.pravatar.cc/150?img=${AGENTS.length + 1}`
  };
  
  AGENTS = [...AGENTS, newAgent];
  return newAgent;
};

export const removeAgent = (agentId: string): boolean => {
  const initialLength = AGENTS.length;
  AGENTS = AGENTS.filter(agent => agent.id !== agentId);
  
  // Also remove quality checks associated with this agent
  QUALITY_CHECKS = QUALITY_CHECKS.filter(check => check.agentId !== agentId);
  
  return AGENTS.length < initialLength;
};

export const getAgent = (agentId: string): Agent | undefined => {
  return AGENTS.find(agent => agent.id === agentId);
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

// Helper function to check grammar with a simple spell checker
export const checkGrammar = async (text: string): Promise<SpellCheckResult> => {
  console.log("Checking grammar for:", text.substring(0, 50) + "...");
  
  // Simple scoring based on common errors
  let score = 10;
  const suggestions: string[] = [];
  
  // Common English errors to check
  const commonErrors = [
    { pattern: /  /g, message: "Remove double spaces" },
    { pattern: /\bi'm\b/gi, message: "Write 'I am' instead of 'I'm' in formal communication" },
    { pattern: /\bdon't\b/gi, message: "Write 'do not' instead of 'don't' in formal communication" },
    { pattern: /\bcan't\b/gi, message: "Write 'cannot' instead of 'can't' in formal communication" },
    { pattern: /\byour welcome\b/gi, message: "Use 'you're welcome' instead of 'your welcome'" },
    { pattern: /\btheir is\b/gi, message: "Use 'there is' instead of 'their is'" },
    { pattern: /\bit's a\b/gi, message: "Consider using 'it is a' for more formal tone" },
    { pattern: /\bthanks\b/gi, message: "Consider using 'thank you' for more formal tone" },
    { pattern: /\bhey\b/gi, message: "Use a more formal greeting than 'hey'" },
    { pattern: /!+/g, message: "Avoid excessive exclamation marks in professional emails" },
    { pattern: /\b(?:really|very|extremely|totally)\b/gi, message: "Avoid intensifiers in professional communication" },
    { pattern: /\b(?:awesome|amazing|fantastic|great)\b/gi, message: "Use more moderate language in professional context" },
    { pattern: /\b(?:stuff|things)\b/gi, message: "Use more specific terminology instead of generic words" },
    { pattern: /\blike\b/gi, message: "Avoid filler words such as 'like'" },
    { pattern: /\bjust\b/gi, message: "The word 'just' can diminish the importance of your message" },
  ];
  
  // Check for each error
  commonErrors.forEach(error => {
    if (text.match(error.pattern)) {
      score -= 0.5; // Deduct points for each type of error
      suggestions.push(error.message);
    }
  });
  
  // Check for paragraph length (readability)
  const paragraphs = text.split(/\n\s*\n/);
  const longParagraphs = paragraphs.filter(p => p.split(" ").length > 50);
  if (longParagraphs.length > 0) {
    score -= longParagraphs.length * 0.5;
    suggestions.push("Consider breaking long paragraphs into smaller ones for better readability");
  }
  
  // Check for sentence length
  const sentences = text.split(/[.!?]+/);
  const longSentences = sentences.filter(s => s.trim() !== "" && s.split(" ").length > 25);
  if (longSentences.length > 0) {
    score -= longSentences.length * 0.5;
    suggestions.push("Some sentences are too long. Consider breaking them into shorter ones");
  }
  
  // Ensure the score is between 0 and 10
  score = Math.max(0, Math.min(10, score));
  
  // Round to whole number as specified
  score = Math.round(score);
  
  return {
    score,
    suggestions: Array.from(new Set(suggestions)) // Remove duplicates
  };
};
