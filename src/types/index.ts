export interface QualityCriteria {
  id: string;
  name: string;
  description: string;
  weight: number;
}

export interface ScoreResult {
  criteriaId: string;
  score: number; // 0-10
  feedback: string;
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
  status: 'completed' | 'draft';
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  department: string;
  avatar?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  content: string;
  tags: string[];
}

export interface PerformanceData {
  agentId: string;
  date: string;
  score: number;
}

export interface ScoreBreakdown {
  criteriaId: string;
  average: number;
}
