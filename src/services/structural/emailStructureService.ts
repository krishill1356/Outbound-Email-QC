
/**
 * Services for analyzing email structure components
 */

/**
 * Analyze email structure to check for greeting, header, signature, and footer
 */
export const analyzeEmailStructure = (emailContent: string): {
  hasGreeting: boolean;
  hasHeader: boolean;
  hasSignature: boolean;
  hasFooter: boolean;
  feedback: string;
  score: number;
} => {
  // Convert to lowercase and normalize whitespace
  const normalizedContent = emailContent.toLowerCase().replace(/\s+/g, ' ');
  const lines = emailContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Check for greeting
  const greetingPatterns = [
    /\b(hello|hi|hey|dear|good\s(morning|afternoon|evening)|greetings)\b/i
  ];
  const hasGreeting = greetingPatterns.some(pattern => 
    pattern.test(lines.length > 0 ? lines[0] : '') || 
    (lines.length > 1 ? pattern.test(lines[1]) : false)
  );
  
  // Check for header (company/department names at top)
  const headerPatterns = [
    /\b(my\s+law\s+matters|air\s+travel\s+claim|legal\s+department|claims\s+department)\b/i
  ];
  const hasHeader = headerPatterns.some(pattern => 
    normalizedContent.includes(pattern.source.replace(/\\b|\\/g, '').toLowerCase())
  );
  
  // Check for signature (closing remarks)
  const signaturePatterns = [
    /\b(many\s+thanks|yours\s+(sincerely|faithfully)|best\s+(regards|wishes)|thank\s+you|regards|sincerely)\b/i
  ];
  const hasSignature = signaturePatterns.some(pattern => {
    // Look at the last 3 lines for signatures
    for (let i = Math.max(0, lines.length - 3); i < lines.length; i++) {
      if (pattern.test(lines[i])) return true;
    }
    return false;
  });
  
  // Check for footer
  const footerPatterns = [
    /\b(my\s+law\s+matters|air\s+travel\s+claim|contact\s+us|www\.|http)/i
  ];
  const hasFooter = footerPatterns.some(pattern => {
    // Look at the last 2 lines for footer
    for (let i = Math.max(0, lines.length - 2); i < lines.length; i++) {
      if (pattern.test(lines[i])) return true;
    }
    return false;
  });
  
  // Count missing elements
  const missingElements = [];
  if (!hasGreeting) missingElements.push("greeting");
  if (!hasHeader) missingElements.push("header");
  if (!hasSignature) missingElements.push("signature");
  if (!hasFooter) missingElements.push("footer");
  
  // Calculate score (0-10) based on presence of elements
  let score = 10;
  // Each missing element reduces score by 2.5 points
  score -= missingElements.length * 2.5;
  
  // Generate feedback
  let feedback = "";
  if (missingElements.length === 0) {
    feedback = "Email has proper structure with all required elements: greeting, header, signature, and footer.";
  } else {
    feedback = `Email is missing the following structural elements: ${missingElements.join(', ')}.`;
  }
  
  return {
    hasGreeting,
    hasHeader,
    hasSignature,
    hasFooter,
    feedback,
    score
  };
};
