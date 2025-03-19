
import { ScoreResult } from '@/types';

/**
 * Services for generating feedback based on email analysis
 */

/**
 * Generate overall feedback based on scores
 */
export function generateOverallFeedback(scores: ScoreResult[]): string {
  let overallFeedback = 'The email meets the basic quality standards. ';
  
  const avgScore = scores.reduce((sum, score) => sum + score.score, 0) / scores.length;
  
  if (avgScore >= 8) {
    overallFeedback = 'The email demonstrates high quality and professionalism. ';
  } else if (avgScore < 6) {
    overallFeedback = 'The email needs significant improvements to meet quality standards. ';
  }
  
  return overallFeedback;
}

/**
 * Generate sentiment analysis feedback
 */
export function analyzeSentiment(content: string): string {
  // Simple sentiment analysis based on keywords
  const positiveWords = ['thank', 'appreciate', 'pleased', 'happy', 'glad', 'good', 'great'];
  const negativeWords = ['unfortunately', 'regret', 'sorry', 'issue', 'problem', 'difficult'];
  
  const words = content.toLowerCase().split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;
  
  words.forEach(word => {
    if (positiveWords.some(pw => word.includes(pw))) positiveCount++;
    if (negativeWords.some(nw => word.includes(nw))) negativeCount++;
  });
  
  if (positiveCount > negativeCount * 2) {
    return "The email has a very positive sentiment, which creates a good customer experience.";
  } else if (positiveCount > negativeCount) {
    return "The email has a positive sentiment, which is appropriate for most communications.";
  } else if (negativeCount > positiveCount * 2) {
    return "The email has a very negative sentiment. Consider reframing negative information more constructively.";
  } else if (negativeCount > positiveCount) {
    return "The email has a somewhat negative sentiment. Try balancing with more positive language.";
  } else {
    return "The email has a neutral sentiment, which is appropriate for factual communications.";
  }
}

/**
 * Generate recommendations based on scores
 */
export function generateRecommendations(scores: ScoreResult[]): string[] {
  const recommendations: string[] = [];
  
  // Tone recommendations
  const toneScore = scores.find(s => s.criteriaId === 'tone');
  if (toneScore && toneScore.score < 7) {
    recommendations.push('Improve email tone by using more professional and courteous language.');
    if (toneScore.score < 5) {
      recommendations.push('Avoid casual language and colloquialisms in professional communications.');
    }
  }
  
  // Clarity recommendations
  const clarityScore = scores.find(s => s.criteriaId === 'clarity');
  if (clarityScore && clarityScore.score < 7) {
    recommendations.push('Enhance clarity by organizing information in a more logical sequence.');
    if (clarityScore.score < 5) {
      recommendations.push('Use shorter sentences and simpler language to improve readability.');
    }
  }
  
  // Spelling & grammar recommendations
  const spellingScore = scores.find(s => s.criteriaId === 'spelling-grammar');
  if (spellingScore && spellingScore.score < 7) {
    recommendations.push('Use spell-check tools before sending emails to catch common errors.');
    if (spellingScore.score < 5) {
      recommendations.push('Have a colleague review important emails to catch spelling and grammar mistakes.');
    }
  }
  
  // Structure recommendations
  const structureScore = scores.find(s => s.criteriaId === 'structure');
  if (structureScore && structureScore.score < 10) {
    // Add specific recommendations based on what's missing
    if (structureScore.score <= 7.5) {
      recommendations.push('Always include a proper greeting and signature in your emails.');
    }
    if (structureScore.score <= 5) {
      recommendations.push('Follow company template with header and footer in all customer communications.');
    }
    if (structureScore.score <= 2.5) {
      recommendations.push('Review the email template guidelines to ensure all required elements are included.');
    }
  }
  
  return recommendations;
}
