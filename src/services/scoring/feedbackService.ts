
import { ScoreResult } from '@/types';

/**
 * Services for generating feedback based on email analysis
 */

/**
 * Generate overall feedback based on scores
 */
export function generateOverallFeedback(scores: ScoreResult[]): string {
  let overallFeedback = 'The email meets the basic quality standards. ';
  
  const avgScore = scores.reduce((sum, score) => sum + score.score, 0) / scores.length;
  
  if (avgScore >= 8) {
    overallFeedback = 'The email demonstrates excellent quality and professionalism. ';
  } else if (avgScore >= 7) {
    overallFeedback = 'The email demonstrates high quality and professionalism. ';
  } else if (avgScore < 4) {
    overallFeedback = 'The email requires substantial improvements to meet quality standards. ';
  } else if (avgScore < 6) {
    overallFeedback = 'The email needs improvements to meet quality standards. ';
  }
  
  return overallFeedback;
}

/**
 * Generate sentiment analysis feedback with more nuanced understanding
 */
export function analyzeSentiment(content: string): string {
  // Enhanced sentiment analysis with more word categories
  const positiveWords = [
    'thank', 'appreciate', 'pleased', 'happy', 'glad', 'good', 'great', 'delighted',
    'excellent', 'wonderful', 'valued', 'pleasure', 'fantastic', 'beneficial', 'positive'
  ];
  
  const negativeWords = [
    'unfortunately', 'regret', 'sorry', 'issue', 'problem', 'difficult', 'inconvenience',
    'concern', 'mistake', 'error', 'disappointed', 'frustrating', 'disappointing', 'negative'
  ];
  
  const neutralWords = [
    'inform', 'advise', 'update', 'note', 'regarding', 'reference', 'awareness',
    'attention', 'review', 'consider', 'acknowledge', 'recognize'
  ];
  
  const words = content.toLowerCase().split(/\s+/);
  let positiveCount = 0;
  let negativeCount = 0;
  let neutralCount = 0;
  
  words.forEach(word => {
    if (positiveWords.some(pw => word.includes(pw))) positiveCount++;
    if (negativeWords.some(nw => word.includes(nw))) negativeCount++;
    if (neutralWords.some(nw => word.includes(nw))) neutralCount++;
  });
  
  // Calculate sentiment score (-10 to +10 scale)
  const total = positiveCount + negativeCount + neutralCount;
  const sentimentScore = total > 0 ? ((positiveCount - negativeCount) / total) * 10 : 0;
  
  // Generate more nuanced feedback
  if (sentimentScore > 7) {
    return "The email has a very positive sentiment, which creates an excellent customer experience and builds rapport.";
  } else if (sentimentScore > 3) {
    return "The email has a positive sentiment, which is appropriate for fostering good customer relationships.";
  } else if (sentimentScore > -3) {
    if (neutralCount > positiveCount && neutralCount > negativeCount) {
      return "The email has a neutral, factual sentiment, which is appropriate for informational communications.";
    } else {
      return "The email has a balanced sentiment, combining facts with appropriate emotional tone.";
    }
  } else if (sentimentScore > -7) {
    return "The email has a somewhat negative sentiment. Consider balancing necessary negative information with more positive or solution-oriented language.";
  } else {
    return "The email has a very negative sentiment. When delivering difficult news, try to reframe it constructively and include positive next steps or solutions.";
  }
}

/**
 * Generate recommendations based on scores with more specific, actionable advice
 */
export function generateRecommendations(scores: ScoreResult[]): string[] {
  const recommendations: string[] = [];
  
  // Enhanced tone recommendations
  const toneScore = scores.find(s => s.criteriaId === 'tone');
  if (toneScore) {
    const toneBreakdown = (toneScore as any).toneBreakdown;
    
    if (toneScore.score < 7) {
      if (toneBreakdown?.professionalism < 7) {
        recommendations.push('Improve professionalism by using more formal language and avoiding colloquialisms.');
      }
      
      if (toneBreakdown?.politeness < 7) {
        recommendations.push('Enhance politeness by including proper greetings and expressions of gratitude.');
      }
      
      if (toneBreakdown?.empathy < 6) {
        recommendations.push('Show more empathy by acknowledging the customer\'s situation and expressing understanding.');
      }
      
      if (toneBreakdown?.appropriateness < 6) {
        recommendations.push('Avoid forceful language like "must" or "immediately" which can sound demanding.');
      }
    }
  }
  
  // Enhanced clarity recommendations
  const clarityScore = scores.find(s => s.criteriaId === 'clarity');
  if (clarityScore) {
    const clarityBreakdown = (clarityScore as any).clarityBreakdown;
    
    if (clarityScore.score < 7) {
      if (clarityBreakdown?.readability < 6) {
        recommendations.push('Use simpler words and shorter sentences to improve readability.');
      }
      
      if (clarityBreakdown?.structure < 7) {
        recommendations.push('Improve structure with clear sections, bullet points, or numbered lists for complex information.');
      }
      
      if (clarityBreakdown?.concision < 6) {
        recommendations.push('Be more concise by removing redundant information and focusing on key points.');
      }
    }
  }
  
  // Spelling & grammar recommendations
  const spellingScore = scores.find(s => s.criteriaId === 'spelling-grammar');
  if (spellingScore && spellingScore.score < 7) {
    recommendations.push('Use a spelling and grammar checker before sending emails to catch common errors.');
    
    if (spellingScore.score < 5) {
      recommendations.push('Have a colleague review important emails before sending to catch spelling, grammar, and punctuation mistakes.');
    }
  }
  
  // Structure recommendations
  const structureScore = scores.find(s => s.criteriaId === 'structure');
  if (structureScore && structureScore.score < 10) {
    // Add specific recommendations based on what's missing
    if (structureScore.score <= 7.5) {
      recommendations.push('Always include a proper greeting and signature in your emails for a professional appearance.');
    }
    if (structureScore.score <= 5) {
      recommendations.push('Follow the company template with appropriate header and footer elements in all customer communications.');
    }
    if (structureScore.score <= 2.5) {
      recommendations.push('Review the email template guidelines to ensure all required elements are included in the correct order.');
    }
  }
  
  return recommendations;
}
