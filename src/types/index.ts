
export interface ZammadSettings {
  apiUrl: string;
  apiToken: string;
}

export interface ZammadEmail {
  id: string;
  ticketId: string;
  ticketNumber: string;
  subject: string;
  body: string;
  from: string;
  to: string;
  agentId: string;
  agentName: string;
  createdAt: string;
}

export interface SpellCheckResult {
  score: number;
  suggestions: string[];
}

export interface QualityCheck {
  id: string;
  agentId: string;
  agentName: string;
  emailId: string;
  emailSubject: string;
  reviewerId: string;
  date: string;
  emailContent: string;
  scores: ScoreResult[];
  overallScore: number;
  feedback: string;
  recommendations: string[];
  status: string;
}

// Extend the ScoreResult interface to include breakdown
export interface ScoreResult {
  criteriaId: string;
  score: number;
  feedback: string;
  breakdown?: {
    [key: string]: number;
  };
}

// Add missing types that are referenced in the codebase
export interface QualityCriteria {
  id: string;
  name: string;
  description: string;
  weight: number;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  department: string;
  avatar: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  content: string;
  tags: string[];
}

export interface PerformanceData {
  overall: {
    date: string;
    average: number;
  }[];
  agents: AgentPerformance[];
}

export interface AgentPerformance {
  agent?: Agent;
  trend: {
    date: string;
    score: number;
  }[];
  averageScore: number;
  checksCount: number;
  criteriaBreakdown: {
    criteriaId: string;
    name: string;
    average: number;
  }[];
}

export interface ScoreBreakdown {
  [key: string]: number;
}

// Add missing types that might be used in QCScoreForm.tsx
export interface ContentStats {
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  averageSentenceLength: number;
  readingTime: number;
}
