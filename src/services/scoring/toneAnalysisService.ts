
/**
 * Services for analyzing tone in email content
 */

/**
 * Simulate tone analysis for an email
 */
export function analyzeTone(content: string) {
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
