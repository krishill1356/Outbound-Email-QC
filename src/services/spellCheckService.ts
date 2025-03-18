
import { SpellCheckResult } from '@/types';

/**
 * A more comprehensive spelling and grammar checker
 * @param text The text to check
 * @returns A score and suggestions for improvement
 */
export const checkGrammar = async (text: string): Promise<SpellCheckResult> => {
  console.log("Checking grammar for:", text.substring(0, 50) + "...");
  
  // Initial score is 10
  let score = 10;
  const suggestions: string[] = [];
  
  // Common English errors and professional writing issues to check
  const commonErrors = [
    // Basic grammar and punctuation
    { pattern: /  /g, message: "Remove double spaces" },
    { pattern: /\.{2,}/g, message: "Use a single period for sentence endings" },
    { pattern: /,{2,}/g, message: "Avoid multiple commas" },
    { pattern: /\b[a-z](?=\.|\?|!)/g, message: "Check for missing capitalization at sentence start" },
    { pattern: /\b(i|i'm|i'll|i've|i'd)\b/g, message: "Capitalize 'I' when referring to yourself" },
    
    // Contractions (formal writing should avoid these)
    { pattern: /\b(i'm|don't|can't|won't|isn't|aren't|haven't|hasn't|couldn't|wouldn't|shouldn't)\b/gi, 
      message: "Avoid contractions in formal communication" },
    
    // Common grammar errors
    { pattern: /\byour welcome\b/gi, message: "Use 'you're welcome' instead of 'your welcome'" },
    { pattern: /\btheir is\b/gi, message: "Use 'there is' instead of 'their is'" },
    { pattern: /\bthere (book|pen|car|company|product|service)\b/gi, message: "Use 'their' instead of 'there' for possession" },
    { pattern: /\bits (a|an|the)\b/gi, message: "Use 'it's' (it is) instead of 'its' when used as 'it is'" },
    { pattern: /\bit's (owner|color|size|feature|quality)\b/gi, message: "Use 'its' instead of 'it's' for possession" },
    
    // Professional tone issues
    { pattern: /\b(hey|hi there|what's up|yo|hello there)\b/gi, message: "Use a more formal greeting in professional emails" },
    { pattern: /!{1,}/g, message: "Avoid exclamation marks in professional communication" },
    { pattern: /\b(really|very|extremely|totally|literally|actually)\b/gi, message: "Avoid intensifiers in professional communication" },
    { pattern: /\b(awesome|amazing|fantastic|great|cool|super)\b/gi, message: "Use more moderate language in professional context" },
    { pattern: /\b(stuff|things|bit|lots)\b/gi, message: "Use more specific terminology instead of vague words" },
    
    // Filler words
    { pattern: /\b(just|like|basically|honestly|literally|virtually)\b/gi, message: "Remove filler words that diminish your message" },
    
    // Redundancies
    { pattern: /\b(absolutely essential|actual fact|advance planning|basic essentials|completely finish|current status|end result|final outcome|future plans|past history|unexpected surprise)\b/gi, 
      message: "Remove redundant phrases" },
    
    // Colloquialisms
    { pattern: /\b(asap|fyi|btw|lol|omg|gonna|wanna|gotta|kinda|sorta)\b/gi, message: "Avoid colloquialisms and abbreviations in formal communication" },
  ];
  
  // Check for each error
  commonErrors.forEach(error => {
    const matches = text.match(error.pattern);
    if (matches && matches.length > 0) {
      // Deduct more points for more occurrences, up to a maximum
      const deduction = Math.min(matches.length * 0.5, 2);
      score -= deduction;
      suggestions.push(error.message);
    }
  });
  
  // Check for paragraph length (readability)
  const paragraphs = text.split(/\n\s*\n/);
  const longParagraphs = paragraphs.filter(p => p.split(" ").length > 50);
  if (longParagraphs.length > 0) {
    score -= Math.min(longParagraphs.length * 0.5, 2);
    suggestions.push("Break long paragraphs into smaller ones for better readability");
  }
  
  // Check for sentence length
  const sentences = text.split(/[.!?]+/);
  const longSentences = sentences.filter(s => s.trim() !== "" && s.split(" ").length > 25);
  if (longSentences.length > 0) {
    score -= Math.min(longSentences.length * 0.5, 2);
    suggestions.push("Some sentences are too long. Break them into shorter ones");
  }
  
  // Passive voice check (basic)
  const passiveVoicePatterns = [
    /\b(is|are|was|were|be|been|being) ([a-z]+ed|made|done|said|seen|given)\b/gi
  ];
  
  let passiveCount = 0;
  passiveVoicePatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) passiveCount += matches.length;
  });
  
  if (passiveCount > 3) {
    score -= Math.min(passiveCount * 0.3, 1.5);
    suggestions.push("Consider using active voice instead of passive voice for clearer communication");
  }
  
  // Ensure the score is between 0 and 10
  score = Math.max(0, Math.min(10, score));
  
  // Round to whole number
  score = Math.round(score);
  
  return {
    score,
    suggestions: Array.from(new Set(suggestions)) // Remove duplicates
  };
};
