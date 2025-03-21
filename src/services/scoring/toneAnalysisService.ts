
/**
 * Services for analyzing tone in email content
 */

/**
 * Simulate tone analysis for an email
 */
export function analyzeTone(content: string) {
  const professionalKeywords = ['sincerely', 'regards', 'thank you', 'please', 'appreciate', 'respectfully', 'professionally'];
  const politeKeywords = ['hello', 'hi', 'dear', 'good morning', 'good afternoon', 'good evening', 'greetings'];
  // Updated explicit swear words list (these are the only words that should trigger zero score)
  const explicitSwearWords = ['fuck', 'shit', 'cunt', 'bollocks', 'bastard', 'twat', 'asshole', 'bitch'];
  const forcefulLanguage = ['must', 'immediately', 'urgent', 'asap', 'demand', 'require'];
  const empathyKeywords = ['understand', 'appreciate', 'sorry', 'empathize', 'perspective', 'situation', 'aware'];
  
  // Check for explicit swear words only - these are the only words that should trigger zero score
  for (const word of explicitSwearWords) {
    // Use word boundary to match whole words only
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(content.toLowerCase())) {
      return {
        score: 0,
        feedback: 'The email contains explicit language (swearing). This type of language is not acceptable in professional communication.',
        toneBreakdown: {
          professionalism: 0,
          politeness: 0,
          empathy: 0,
          appropriateness: 0
        }
      };
    }
  }
  
  // Calculate individual tone aspects
  const professionalismScore = calculateScore(content, professionalKeywords, 0.5);
  const politenessScore = calculateScore(content, politeKeywords, 0.5);
  const empathyScore = calculateScore(content, empathyKeywords, 0.5);
  
  // Penalize for forceful language
  let forcefulnessDeduction = 0;
  forcefulLanguage.forEach(keyword => {
    if (content.toLowerCase().includes(keyword)) {
      forcefulnessDeduction += 0.3;
    }
  });
  forcefulnessDeduction = Math.min(forcefulnessDeduction, 3); // Cap the deduction
  
  // Combine the individual aspects to get the overall tone score
  let score = (professionalismScore + politenessScore + empathyScore) - forcefulnessDeduction;
  
  // Check for exclamation marks (more nuanced analysis)
  const exclamationCount = (content.match(/!/g) || []).length;
  if (exclamationCount > 5) {
    score -= 2; // Heavy penalty for excessive exclamation
  } else if (exclamationCount > 2) {
    score -= 1; // Light penalty for multiple exclamations
  }
  
  // Check for ALL CAPS text (indicates shouting)
  const words = content.split(/\s+/);
  const allCapsWords = words.filter(word => word.length > 3 && word === word.toUpperCase());
  if (allCapsWords.length > 3) {
    score -= 2; // Penalty for multiple all-caps words
  }
  
  score = Math.max(0, Math.min(10, score)); // Ensure score is within 0-10 range
  
  let feedback = 'The tone of the email is neutral.';
  if (score >= 8) {
    feedback = 'The email has an excellent professional and polite tone with appropriate empathy.';
  } else if (score >= 7) {
    feedback = 'The email has a professional and polite tone.';
  } else if (score < 4) {
    feedback = 'The email tone may be too forceful, informal or lacks empathy. Consider using more professional language.';
  } else if (score < 6) {
    feedback = 'The email tone could be improved with more professional and empathetic language.';
  }
  
  return {
    score: Math.round(score),
    feedback: feedback,
    toneBreakdown: {
      professionalism: Math.round(professionalismScore * 2), // Convert to scale of 10
      politeness: Math.round(politenessScore * 2),
      empathy: Math.round(empathyScore * 2),
      appropriateness: 10 - Math.round(forcefulnessDeduction * 3.3) // Convert deduction to scale of 10
    }
  };
}

/**
 * Calculate a score based on keyword presence
 */
function calculateScore(content: string, keywords: string[], weightPerMatch: number) {
  let score = 0;
  const lowerContent = content.toLowerCase();
  
  keywords.forEach(keyword => {
    if (lowerContent.includes(keyword)) {
      score += weightPerMatch;
    }
  });
  
  return Math.min(score, 5); // Cap at 5 (half of the total scale)
}
