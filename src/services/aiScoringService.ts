
import { ScoreResult } from '@/types';
import { checkGrammar } from './spellCheckService';
import { analyzeTone } from './scoring/toneAnalysisService';
import { analyzeClarity } from './scoring/clarityAnalysisService';
import { generateOverallFeedback, generateRecommendations, analyzeSentiment } from './scoring/feedbackService';
import { analyzeEmailStructure } from './structural/emailStructureService';

/**
 * Simulate AI analysis of email content with enhanced sentiment analysis
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
  
  // Analyze tone and clarity
  const scores: ScoreResult[] = [];
  
  // Add tone score
  const toneScore = analyzeTone(emailContent);
  scores.push({
    criteriaId: 'tone',
    score: toneScore.score,
    feedback: toneScore.feedback
  });
  
  // Add clarity score
  const clarityScore = analyzeClarity(emailContent);
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
  
  // Add sentiment analysis
  const sentimentFeedback = analyzeSentiment(emailContent);
  
  // Generate recommendations
  const recommendations = generateRecommendations(scores);
  
  return {
    scores,
    generalFeedback: `${generalFeedback} ${sentimentFeedback}`,
    recommendations,
    structureDetails: {
      hasGreeting: structureAnalysis.hasGreeting,
      hasHeader: structureAnalysis.hasHeader,
      hasSignature: structureAnalysis.hasSignature,
      hasFooter: structureAnalysis.hasFooter
    }
  };
};
