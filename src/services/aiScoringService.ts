
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
  
  // If rude language/swearing was detected, set all scores to 0
  const containsRudeLanguage = toneScore.score === 0;
  
  // Add clarity score
  const clarityScore = analyzeClarity(emailContent);
  scores.push({
    criteriaId: 'clarity',
    score: containsRudeLanguage ? 0 : clarityScore.score,
    feedback: containsRudeLanguage ? 
      "Inappropriate language detected, affecting overall score." : 
      clarityScore.feedback
  });
  
  // Add spelling & grammar score
  scores.push({
    criteriaId: 'spelling-grammar',
    score: containsRudeLanguage ? 0 : spellingResult.score,
    feedback: containsRudeLanguage ? 
      "Inappropriate language detected, affecting overall score." : 
      (spellingResult.suggestions.length > 0 
        ? `Found ${spellingResult.suggestions.length} possible spelling/grammar issues: ${spellingResult.suggestions.length > 3 ? '...' : ''}`
        : 'No significant spelling or grammar issues found.')
  });
  
  // Add structure score
  scores.push({
    criteriaId: 'structure',
    score: containsRudeLanguage ? 0 : structureAnalysis.score,
    feedback: containsRudeLanguage ? 
      "Inappropriate language detected, affecting overall score." : 
      structureAnalysis.feedback
  });
  
  // Generate overall feedback
  const generalFeedback = containsRudeLanguage ? 
    "This email contains inappropriate language which results in an automatic zero score. All professional communication must be free from rude language and profanity." : 
    generateOverallFeedback(scores);
  
  // Add sentiment analysis
  const sentimentFeedback = containsRudeLanguage ? "" : analyzeSentiment(emailContent);
  
  // Generate recommendations
  const recommendations = containsRudeLanguage ? 
    ["Remove all inappropriate language and profanity", "Ensure communication maintains professional tone at all times", "Consider using more formal language"] : 
    generateRecommendations(scores);
  
  return {
    scores,
    generalFeedback: containsRudeLanguage ? generalFeedback : `${generalFeedback} ${sentimentFeedback}`,
    recommendations,
    structureDetails: {
      hasGreeting: structureAnalysis.hasGreeting,
      hasHeader: structureAnalysis.hasHeader,
      hasSignature: structureAnalysis.hasSignature,
      hasFooter: structureAnalysis.hasFooter
    }
  };
};
