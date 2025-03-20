
/**
 * Services for analyzing clarity in email content
 */

/**
 * Analyze clarity of email content
 */
export function analyzeClarity(content: string) {
  // Break content into parts for analysis
  const words = content.split(/\s+/);
  const sentences = content.split(/[.!?]+/).filter(s => s.trim() !== "");
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim() !== "");
  
  // Analyze complex words (more than 3 syllables or length > 7)
  const complexWords = words.filter(word => word.length > 7);
  const complexWordRatio = complexWords.length / words.length;
  
  // Analyze sentence length - average and extremes
  const avgSentenceLength = words.length / Math.max(1, sentences.length);
  const longSentences = sentences.filter(sentence => sentence.split(/\s+/).length > 25);
  const longSentenceRatio = longSentences.length / Math.max(1, sentences.length);
  
  // Analyze paragraph structure
  const avgParagraphLength = sentences.length / Math.max(1, paragraphs.length);
  const longParagraphs = paragraphs.filter(p => p.split(/[.!?]+/).length > 5);
  
  // Check for clear structure indicators
  const hasListIndicators = /(\d+\.|\*|\-)\s+\w+/g.test(content);
  const hasSectionHeadings = /([A-Z][A-Za-z\s]+:)/g.test(content);
  const hasNextSteps = /(next steps|to do|action items|follow up)/i.test(content);
  
  // Calculate individual clarity aspects
  let readabilityScore = 10 - (complexWordRatio * 20) - (longSentenceRatio * 10);
  let structureScore = 5 + (hasListIndicators ? 1 : 0) + (hasSectionHeadings ? 2 : 0) + (hasNextSteps ? 2 : 0);
  let concisionScore = 10 - Math.min(5, Math.max(0, avgSentenceLength - 15) / 3) - Math.min(5, Math.max(0, avgParagraphLength - 3) * 0.8);
  
  // Penalize extremely long emails
  if (words.length > 300) {
    concisionScore -= 2;
  }
  
  // Combine scores (weighted)
  let overallScore = (readabilityScore * 0.4) + (structureScore * 0.3) + (concisionScore * 0.3);
  overallScore = Math.max(0, Math.min(10, overallScore)); // Ensure score is within 0-10 range
  
  // Generate feedback
  let feedback = 'The clarity of the email is neutral.';
  if (overallScore >= 8) {
    feedback = 'The email clearly explains information with excellent structure and readability.';
  } else if (overallScore >= 6.5) {
    feedback = 'The email clearly explains information and next steps.';
  } else if (overallScore < 4) {
    feedback = 'The email may be unclear. Use simpler language, shorter sentences, and clearly outline next steps.';
  } else if (overallScore < 6) {
    feedback = 'The email could be clearer. Consider improving structure and using more concise language.';
  }
  
  return {
    score: Math.round(overallScore),
    feedback: feedback,
    clarityBreakdown: {
      readability: Math.round(readabilityScore),
      structure: Math.round(structureScore),
      concision: Math.round(concisionScore)
    }
  };
}
