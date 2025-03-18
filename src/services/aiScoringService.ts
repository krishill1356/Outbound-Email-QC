
import { ScoreResult } from '@/types';
import { ZammadEmail } from '@/services/zammadService';
import { CRITERIA, checkGrammar } from '@/lib/mock-data';

// This service handles AI-based email quality assessment

interface AIScoreRequest {
  emailContent: string;
  subject: string;
  criteria: typeof CRITERIA;
}

interface AIScoreResponse {
  scores: ScoreResult[];
  generalFeedback: string;
  recommendations: string[];
}

// Update the function signature to only accept email parameter
export const analyzeEmailContent = async (email: ZammadEmail): Promise<AIScoreResponse> => {
  try {
    // Extract text content from HTML (simplified version)
    const textContent = stripHtmlTags(email.body);
    console.log('Analyzing email content:', email.subject);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check grammar with Grammarly
    const grammarCheck = await checkGrammar(textContent);
    
    // Generate scores for each criteria
    const scores = await Promise.all(CRITERIA.map(async criteria => {
      // Generate a score based on simulated AI analysis
      let score = await simulateAIScoring(textContent, criteria.id, email.subject, grammarCheck);
      
      // Generate feedback based on the score and criteria
      const feedback = generateFeedback(score, criteria.id, textContent);
      
      return {
        criteriaId: criteria.id,
        score,
        feedback
      };
    }));
    
    // Generate overall feedback - using Math.round to remove decimal places
    const overallScore = Math.round(scores.reduce((total, score) => {
      const criteria = CRITERIA.find(c => c.id === score.criteriaId);
      return total + (score.score * (criteria?.weight || 0.25));
    }, 0));
    
    const generalFeedback = generateOverallFeedback(overallScore, email.subject, textContent);
    
    // Generate recommendations
    const recommendations = generateRecommendations(scores, textContent, grammarCheck.suggestions);
    
    return {
      scores,
      generalFeedback,
      recommendations
    };
  } catch (error) {
    console.error('Error analyzing email content:', error);
    throw new Error('Failed to analyze email content');
  }
};

// Helper function to strip HTML tags from content
const stripHtmlTags = (html: string): string => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

// Simulated AI scoring function based on criteria
const simulateAIScoring = async (
  text: string, 
  criteriaId: string, 
  subject: string,
  grammarCheck: { score: number; suggestions: string[] }
): Promise<number> => {
  const textLower = text.toLowerCase();
  
  // Simple scoring rules for demonstration purposes
  switch (criteriaId) {
    case 'spelling-grammar':
      // Use Grammarly score
      return grammarCheck.score;
      
    case 'tone':
      // Check for professional tone markers
      const professionalTerms = ['thank you', 'please', 'appreciate', 'sincerely', 'regarding', 'assist'];
      const unprofessionalTerms = ['lol', 'yeah', 'hey', 'btw', 'cool', 'whatever', 'guys', 'cheers', 'mate'];
      
      let toneScore = 7; // Default professional score
      professionalTerms.forEach(term => {
        if (textLower.includes(term)) toneScore = Math.min(10, toneScore + 1);
      });
      
      unprofessionalTerms.forEach(term => {
        if (textLower.includes(term)) toneScore = Math.max(1, toneScore - 2);
      });
      
      return Math.round(toneScore);
      
    case 'clarity':
      // Check for clear solution presentation
      const clarityPhrases = ['next steps', 'will', 'can', 'please', 'following', 'steps', 'solution'];
      let clarityScore = 7;
      
      clarityPhrases.forEach(phrase => {
        if (textLower.includes(phrase)) clarityScore = Math.min(10, clarityScore + 0.5);
      });
      
      // Check for bullet points or numbered instructions
      if (text.includes('•') || /\d+\.\s/.test(text)) {
        clarityScore = Math.min(10, clarityScore + 2);
      }
      
      return Math.round(clarityScore);
      
    case 'structure':
      // Check for standard email structure elements
      let structureScore = 5;
      const hasGreeting = /^(dear|hello|hi|good morning|good afternoon|good evening)/i.test(textLower);
      const hasSignOff = /(regards|sincerely|thank you|best wishes|yours truly)/i.test(textLower);
      const hasHeader = text.includes('HEADER') || text.includes('TEMPLATE HEADER');
      const hasFooter = text.includes('FOOTER') || text.includes('TEMPLATE FOOTER');
      
      if (hasGreeting) structureScore += 2;
      if (hasSignOff) structureScore += 2;
      if (hasHeader) structureScore += 2;
      if (hasFooter) structureScore += 2;
      
      return Math.min(10, Math.round(structureScore));
      
    default:
      return 7; // Default score
  }
};

// Generate feedback based on score and criteria
const generateFeedback = (score: number, criteriaId: string, text: string): string => {
  // Simplified feedback generation
  if (score >= 9) {
    return `Excellent performance in this area. The ${criteriaId.replace('-', ' ')} is outstanding.`;
  } else if (score >= 7) {
    return `Good job on ${criteriaId.replace('-', ' ')}. Some minor improvements could be made.`;
  } else if (score >= 5) {
    return `Acceptable ${criteriaId.replace('-', ' ')}, but there's room for improvement.`;
  } else {
    return `The ${criteriaId.replace('-', ' ')} needs significant improvement. Please review our guidelines.`;
  }
};

// Generate overall feedback
const generateOverallFeedback = (overallScore: number, subject: string, text: string): string => {
  const lines = [
    `Overall assessment of response to "${subject}":`,
    ''
  ];
  
  if (overallScore >= 9) {
    lines.push('This is an exceptional email response that effectively addresses the customer\'s needs while maintaining professionalism and clarity. The communication is well-structured and follows all best practices.');
  } else if (overallScore >= 7) {
    lines.push('This is a good email response that addresses the customer\'s concerns adequately. The communication is generally professional and clear, though there are some minor areas for improvement as noted in the specific criteria.');
  } else if (overallScore >= 5) {
    lines.push('This email response is satisfactory but could benefit from several improvements. While it addresses the basic requirements, there are notable opportunities to enhance the quality of communication.');
  } else {
    lines.push('This email response requires significant improvement. There are several areas that do not meet our quality standards, and immediate attention is needed to address these issues.');
  }
  
  return lines.join('\n');
};

// Generate recommendations
const generateRecommendations = (scores: ScoreResult[], text: string, grammarSuggestions: string[]): string[] => {
  const recommendations: string[] = [];
  
  // Add grammar suggestions
  if (grammarSuggestions.length > 0) {
    recommendations.push(...grammarSuggestions);
  }
  
  // Add recommendations based on the lowest scoring areas
  const sortedScores = [...scores].sort((a, b) => a.score - b.score);
  
  // Focus on the lowest scoring areas
  sortedScores.slice(0, 2).forEach(score => {
    if (score.score < 7) {
      switch (score.criteriaId) {
        case 'spelling-grammar':
          recommendations.push('Review response for grammatical errors and spelling mistakes before sending.');
          break;
        case 'tone':
          recommendations.push('Maintain a more professional tone throughout your communications.');
          break;
        case 'clarity':
          recommendations.push('Provide clearer explanations and specific next steps for the customer.');
          break;
        case 'structure':
          recommendations.push('Include all required structural elements: proper greeting, sign-off, header and footer.');
          break;
      }
    }
  });
  
  // Add general recommendations if needed
  if (recommendations.length === 0 && sortedScores[0].score < 9) {
    recommendations.push('Continue to refine your communication skills in all areas.');
  }
  
  return recommendations;
};
