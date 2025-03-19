
import { ScoreResult, QualityCriteria } from '@/types';
import { analyzeEmailStructure, CRITERIA } from './qualityCheckService';
import { checkGrammar } from './spellCheckService';

/**
 * Simulate AI analysis of email content
 */
export const analyzeEmailContent = async (email: any) => {
  // This would typically be an API call to an AI service
  // For demo purposes, we're simulating the analysis
  
  // Get email content
  const emailContent = email.body;
  
  // Analyze structure
  const structureAnalysis = analyzeEmailStructure(emailContent);
  
  // Analyze spelling and grammar
  const spellingResult = await checkGrammar(emailContent);
  
  // Analyze tone and clarity (simplified simulation)
  const scores: ScoreResult[] = [];
  
  // Add tone score
  const toneScore = simulateToneAnalysis(emailContent);
  scores.push({
    criteriaId: 'tone',
    score: toneScore.score,
    feedback: toneScore.feedback
  });
  
  // Add clarity score
  const clarityScore = simulateClarityAnalysis(emailContent);
  scores.push({
    criteriaId: 'clarity',
    score: clarityScore.score,
    feedback: clarityScore.feedback
  });
  
  // Add spelling & grammar score
  scores.push({
    criteriaId: 'spelling-grammar',
    score: spellingResult.score,
    feedback: spellingResult.suggestions.length > 0 
      ? `Found ${spellingResult.suggestions.length} possible spelling/grammar issues: ${spellingResult.suggestions.length > 3 ? '...' : ''}`
      : 'No significant spelling or grammar issues found.'
  });
  
  // Add structure score
  scores.push({
    criteriaId: 'structure',
    score: structureAnalysis.score,
    feedback: structureAnalysis.feedback
  });
  
  // Generate overall feedback
  const generalFeedback = generateOverallFeedback(scores);
  
  // Generate recommendations
  const recommendations = generateRecommendations(scores);
  
  return {
    scores,
    generalFeedback,
    recommendations
  };
};

/**
 * Simulate tone analysis
 */
function simulateToneAnalysis(content: string) {
  const professionalKeywords = ['sincerely', 'regards', 'thank you', 'please', 'appreciate'];
  const politeKeywords = ['hello', 'hi', 'dear', 'good morning', 'good afternoon', 'good evening'];
  
  let score = 5; // Neutral tone by default
  
  professionalKeywords.forEach(keyword => {
    if (content.toLowerCase().includes(keyword)) {
      score += 1;
    }
  });
  
  politeKeywords.forEach(keyword => {
    if (content.toLowerCase().includes(keyword)) {
      score += 1;
    }
  });
  
  if (content.toLowerCase().includes('!') || content.toLowerCase().includes('urgent')) {
    score -= 2; // Deduct points for exclamation marks or urgency
  }
  
  score = Math.max(0, Math.min(10, score)); // Ensure score is within 0-10 range
  
  let feedback = 'The tone of the email is neutral.';
  if (score >= 7) {
    feedback = 'The email has a professional and polite tone.';
  } else if (score < 4) {
    feedback = 'The email tone may be too informal or urgent. Consider using more professional language.';
  }
  
  return {
    score: score,
    feedback: feedback
  };
}

/**
 * Simulate clarity analysis
 */
function simulateClarityAnalysis(content: string) {
  const complexWords = content.split(' ').filter(word => word.length > 7);
  const sentenceCount = content.split('.').length;
  const wordCount = content.split(' ').length;
  
  let score = 5; // Neutral clarity by default
  
  if (complexWords.length > wordCount / 5) {
    score -= 3; // Deduct points for too many complex words
  }
  
  if (sentenceCount > wordCount / 15) {
    score += 2; // Award points for shorter sentences
  }
  
  if (content.includes('next steps') || content.includes('to do')) {
    score += 3; // Award points for clear indication of next steps
  }
  
  score = Math.max(0, Math.min(10, score)); // Ensure score is within 0-10 range
  
  let feedback = 'The clarity of the email is neutral.';
  if (score >= 7) {
    feedback = 'The email clearly explains information and next steps.';
  } else if (score < 4) {
    feedback = 'The email may be unclear. Use simpler language and clearly outline next steps.';
  }
  
  return {
    score: score,
    feedback: feedback
  };
}

/**
 * Generate overall feedback based on scores
 */
function generateOverallFeedback(scores: ScoreResult[]): string {
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
 * Generate recommendations based on scores
 */
function generateRecommendations(scores: ScoreResult[]): string[] {
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
