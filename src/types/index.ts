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
