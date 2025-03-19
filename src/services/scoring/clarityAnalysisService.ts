
/**
 * Services for analyzing clarity in email content
 */

/**
 * Analyze clarity of email content
 */
export function analyzeClarity(content: string) {
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
