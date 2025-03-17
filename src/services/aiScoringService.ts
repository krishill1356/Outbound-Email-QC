
import { ScoreResult } from '@/types';
import { ZammadEmail } from '@/services/zammadService';
import { CRITERIA } from '@/lib/mock-data';

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
    // For now, we'll use a simulated AI response since we don't have a real AI API connected
    // In a production environment, this would call an actual AI service like OpenAI
    
    // Extract text content from HTML (simplified version)
    const textContent = stripHtmlTags(email.body);
    console.log('Analyzing email content:', email.subject);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate scores for each criteria
    const scores = CRITERIA.map(criteria => {
      // Generate a score based on simulated AI analysis
      let score = simulateAIScoring(textContent, criteria.id);
      
      // Generate feedback based on the score and criteria
      const feedback = generateFeedback(score, criteria.id, textContent);
      
      return {
        criteriaId: criteria.id,
        score,
        feedback
      };
    });
    
    // Generate overall feedback
    const overallScore = scores.reduce((total, score) => {
      const criteria = CRITERIA.find(c => c.id === score.criteriaId);
      return total + (score.score * (criteria?.weight || 0.2));
    }, 0).toFixed(1);
    
    const generalFeedback = generateOverallFeedback(parseFloat(overallScore), email.subject, textContent);
    
    // Generate recommendations
    const recommendations = generateRecommendations(scores, textContent);
    
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
const simulateAIScoring = (text: string, criteriaId: string): number => {
  const textLower = text.toLowerCase();
  
  // Simple scoring rules for demonstration purposes
  switch (criteriaId) {
    case 'spelling-grammar':
      // More complex texts are assumed to have higher risk of errors
      const wordsPerSentence = text.split(/[.!?]+/).map(s => s.trim().split(/\s+/).length).filter(l => l > 0);
      const avgWordsPerSentence = wordsPerSentence.reduce((sum, count) => sum + count, 0) / wordsPerSentence.length;
      // Higher word count per sentence means more complexity (higher chance of errors)
      return Math.min(10, Math.max(4, 10 - (avgWordsPerSentence > 20 ? 3 : avgWordsPerSentence > 15 ? 2 : 0)));
      
    case 'tone':
      // Check for professional tone markers
      const professionalTerms = ['thank you', 'please', 'appreciate', 'sincerely', 'regarding', 'assist'];
      const unprofessionalTerms = ['lol', 'yeah', 'hey', 'btw', 'cool', 'whatever'];
      
      let toneScore = 7; // Default professional score
      professionalTerms.forEach(term => {
        if (textLower.includes(term)) toneScore = Math.min(10, toneScore + 0.5);
      });
      
      unprofessionalTerms.forEach(term => {
        if (textLower.includes(term)) toneScore = Math.max(1, toneScore - 2);
      });
      
      return Math.round(toneScore);
      
    case 'empathy':
      // Check for empathetic phrases
      const empathyPhrases = ['understand', 'sorry', 'apologize', 'appreciate', 'feel', 'concern'];
      let empathyScore = 5;
      
      empathyPhrases.forEach(phrase => {
        if (textLower.includes(phrase)) empathyScore = Math.min(10, empathyScore + 1);
      });
      
      // Check if response addresses customer by name
      if (/dear\s+[a-z]+/i.test(textLower)) empathyScore = Math.min(10, empathyScore + 1);
      
      return Math.round(empathyScore);
      
    case 'template-consistency':
      // Check for standard template elements
      const templateElements = [
        'regards',
        'thank you',
        'best',
        'sincerely',
        'team'
      ];
      
      let templateScore = 5;
      templateElements.forEach(element => {
        if (textLower.includes(element)) templateScore = Math.min(10, templateScore + 1);
      });
      
      // Check for proper signature
      if (/regards[\s,]+[a-z]+/i.test(textLower) || /sincerely[\s,]+[a-z]+/i.test(textLower)) {
        templateScore = Math.min(10, templateScore + 2);
      }
      
      return Math.round(templateScore);
      
    case 'solution-clarity':
      // Check for clear solution presentation
      const clarityPhrases = ['next steps', 'will', 'can', 'please', 'following', 'steps', 'solution'];
      let clarityScore = 6;
      
      clarityPhrases.forEach(phrase => {
        if (textLower.includes(phrase)) clarityScore = Math.min(10, clarityScore + 0.5);
      });
      
      // Check for bullet points or numbered instructions
      if (text.includes('•') || /\d+\.\s/.test(text)) {
        clarityScore = Math.min(10, clarityScore + 2);
      }
      
      return Math.round(clarityScore);
      
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
    lines.push('This is an exceptional email response that effectively addresses the customer\'s needs while maintaining professionalism and empathy. The communication is clear, well-structured, and follows all best practices.');
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
const generateRecommendations = (scores: ScoreResult[], text: string): string[] => {
  const recommendations: string[] = [];
  
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
        case 'empathy':
          recommendations.push('Show more understanding and empathy toward the customer\'s situation.');
          break;
        case 'template-consistency':
          recommendations.push('Consistently use the approved email templates and formatting guidelines.');
          break;
        case 'solution-clarity':
          recommendations.push('Provide clearer explanations and specific next steps for the customer.');
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
