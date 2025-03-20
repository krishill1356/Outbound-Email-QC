
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
  
  // Add tone score with enhanced breakdown
  const toneAnalysis = analyzeTone(emailContent);
  scores.push({
    criteriaId: 'tone',
    score: toneAnalysis.score,
    feedback: toneAnalysis.feedback,
    breakdown: toneAnalysis.toneBreakdown
  });
  
  // If rude language/swearing was detected, set all scores to 0
  const containsRudeLanguage = toneAnalysis.score === 0;
  
  // Add clarity score with enhanced breakdown
  const clarityAnalysis = analyzeClarity(emailContent);
  scores.push({
    criteriaId: 'clarity',
    score: containsRudeLanguage ? 0 : clarityAnalysis.score,
    feedback: containsRudeLanguage ? 
      "Inappropriate language detected, affecting overall score." : 
      clarityAnalysis.feedback,
    breakdown: clarityAnalysis.clarityBreakdown
  });
  
  // Add spelling & grammar score
  scores.push({
    criteriaId: 'spelling-grammar',
    score: containsRudeLanguage ? 0 : spellingResult.score,
    feedback: containsRudeLanguage ? 
      "Inappropriate language detected, affecting overall score." : 
      (spellingResult.suggestions.length > 0 
        ? `Found ${spellingResult.suggestions.length} possible spelling/grammar issues: ${spellingResult.suggestions.slice(0, 3).join('; ')}${spellingResult.suggestions.length > 3 ? '...' : ''}`
        : 'No significant spelling or grammar issues found.')
  });
  
  // Add structure score
  scores.push({
    criteriaId: 'structure',
    score: containsRudeLanguage ? 0 : structureAnalysis.score,
    feedback: containsRudeLanguage ? 
      "Inappropriate language detected, affecting overall score." : 
      structureAnalysis.feedback,
    breakdown: {
      greeting: structureAnalysis.hasGreeting ? 10 : 0,
      header: structureAnalysis.hasHeader ? 10 : 0,
      signature: structureAnalysis.hasSignature ? 10 : 0,
      footer: structureAnalysis.hasFooter ? 10 : 0,
    }
  });
  
  // Generate overall feedback
  const generalFeedback = containsRudeLanguage ? 
    "This email contains inappropriate language which results in an automatic zero score. All professional communication must be free from rude language and profanity." : 
    generateOverallFeedback(scores);
  
  // Add enhanced sentiment analysis
  const sentimentFeedback = containsRudeLanguage ? "" : analyzeSentiment(emailContent);
  
  // Generate recommendations with more actionable insights
  const recommendations = containsRudeLanguage ? 
    ["Remove all inappropriate language and profanity", "Ensure communication maintains professional tone at all times", "Consider using more formal language"] : 
    generateRecommendations(scores);
  
  // Enhanced content statistics for better insights
  const contentStats = {
    wordCount: emailContent.split(/\s+/).length,
    sentenceCount: emailContent.split(/[.!?]+/).filter(s => s.trim() !== "").length,
    paragraphCount: emailContent.split(/\n\s*\n/).filter(p => p.trim() !== "").length,
    avgWordLength: emailContent.split(/\s+/).reduce((sum, word) => sum + word.length, 0) / 
                  Math.max(1, emailContent.split(/\s+/).length),
    questionCount: (emailContent.match(/\?/g) || []).length,
    exclamationCount: (emailContent.match(/!/g) || []).length
  };
  
  return {
    scores,
    generalFeedback: containsRudeLanguage ? generalFeedback : `${generalFeedback} ${sentimentFeedback}`,
    recommendations,
    structureDetails: {
      hasGreeting: structureAnalysis.hasGreeting,
      hasHeader: structureAnalysis.hasHeader,
      hasSignature: structureAnalysis.hasSignature,
      hasFooter: structureAnalysis.hasFooter
    },
    contentStats // New addition to provide more insights
  };
};
