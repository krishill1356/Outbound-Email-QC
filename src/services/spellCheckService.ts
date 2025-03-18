
import { SpellCheckResult } from '@/types';

/**
 * A more balanced spelling and grammar checker
 * @param text The text to check
 * @returns A score and suggestions for improvement
 */
export const checkGrammar = async (text: string): Promise<SpellCheckResult> => {
  console.log("Checking grammar for:", text.substring(0, 50) + "...");
  
  // Initial score is 10
  let score = 10;
  const suggestions: string[] = [];
  
  // Common English errors and professional writing issues to check
  // Reduced number of patterns with less aggressive scoring
  const commonErrors = [
    // Basic grammar and punctuation - only the most important ones
    { pattern: /\.{3,}/g, message: "Consider using a single period for sentence endings" },
    { pattern: /\byour welcome\b/gi, message: "Use 'you're welcome' instead of 'your welcome'" },
    { pattern: /\btheir is\b/gi, message: "Consider using 'there is' instead of 'their is'" },
    { pattern: /\bthere (book|pen|car|company|product|service)\b/gi, message: "Consider using 'their' for possession" },
    
    // Reduced patterns for professional tone issues
    { pattern: /\b(yo|whats up)\b/gi, message: "Consider a more formal greeting in professional emails" },
    { pattern: /!{2,}/g, message: "Consider reducing multiple exclamation marks" },
    
    // Fewer colloquialisms
    { pattern: /\b(lol|omg|btw)\b/gi, message: "Consider avoiding chat abbreviations in formal communication" },
  ];
  
  // Check for each error - less aggressive scoring
  commonErrors.forEach(error => {
    const matches = text.match(error.pattern);
    if (matches && matches.length > 0) {
      // Deduct points based on severity but less than before
      const deduction = Math.min(matches.length * 0.3, 1.5);
      score -= deduction;
      suggestions.push(error.message);
    }
  });
  
  // Check for paragraphs and sentences with more lenient limits
  // Longer paragraphs allowed
  const paragraphs = text.split(/\n\s*\n/);
  const longParagraphs = paragraphs.filter(p => p.split(" ").length > 75); // Increased from 50
  if (longParagraphs.length > 0) {
    score -= Math.min(longParagraphs.length * 0.3, 1); // Less deduction
    suggestions.push("Consider breaking very long paragraphs into smaller ones for better readability");
  }
  
  // Check for sentence length - more lenient
  const sentences = text.split(/[.!?]+/);
  const longSentences = sentences.filter(s => s.trim() !== "" && s.split(" ").length > 35); // Increased from 25
  if (longSentences.length > 0) {
    score -= Math.min(longSentences.length * 0.3, 1); // Less deduction
    suggestions.push("Consider breaking very long sentences into shorter ones");
  }
  
  // Passive voice check - more lenient
  const passiveVoicePatterns = [
    /\b(is|are|was|were) ([a-z]+ed)\b/gi
  ];
  
  let passiveCount = 0;
  passiveVoicePatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) passiveCount += matches.length;
  });
  
  // Only deduct if there's excessive passive voice
  if (passiveCount > 5) { // Increased threshold from 3
    score -= Math.min(passiveCount * 0.2, 1); // Less deduction
    suggestions.push("Consider using active voice in some sentences for clearer communication");
  }
  
  // Add a minimum score floor to prevent too low scores
  score = Math.max(5, Math.min(10, score)); // Minimum score is now 5
  
  // Round to whole number
  score = Math.round(score);
  
  // If score is 7 or above and we have suggestions, limit to just 2 most important ones
  if (score >= 7 && suggestions.length > 2) {
    suggestions.splice(2); // Keep only first 2 suggestions for high scores
  }
  
  return {
    score,
    suggestions: Array.from(new Set(suggestions)) // Remove duplicates
  };
};
