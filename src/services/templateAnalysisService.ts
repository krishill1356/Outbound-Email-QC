
interface EmailTemplate {
  id: string;
  name: string;
  identifierPatterns: RegExp[];
  components: {
    [key: string]: {
      required: boolean;
      patterns: RegExp[];
    }
  }
}

export interface TemplateAnalysisResult {
  detectedTemplate?: string;
  templateName?: string;
  score: number;
  missingComponents: string[];
  prohibitedPhrases: string[];
  componentScores: Record<string, number>;
}

// Define the email templates based on the Python implementation
const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "air_travel_claim",
    name: "Air Travel Claim",
    identifierPatterns: [
      /AIR\s+TRAVEL\s+CLAIM/i,
    ],
    components: {
      header: {
        required: true,
        patterns: [
          /AIR\s+TRAVEL\s+CLAIM/i,
          /WE'VE\s+GOT\s+AN\s+UPDATE\s+FOR\s+YOU!/i
        ]
      },
      claim_summary: {
        required: true,
        patterns: [
          /Claim\s+Summary/i,
          /Flight\s+Claim\s+Reference:/i,
          /Airline:/i,
          /Departure\s+Date:/i,
          /Flight\s+Journey:/i,
          /Booking\s+Reference:/i,
          /Passengers:/i,
          /Flight\s+Claim\s+Reason:/i
        ]
      },
      greeting: {
        required: true,
        patterns: [
          /Hello\s+\w+,/i,
          /Dear\s+\w+,/i
        ]
      },
      thank_you_intro: {
        required: true,
        patterns: [
          /Thank\s+you\s+for\s+reaching\s+out/i,
          /We\s+appreciate\s+your\s+patience/i
        ]
      },
      main_content: {
        required: true,
        patterns: [
          /specificcontent/i
        ]
      },
      claim_info: {
        required: false,
        patterns: [
          /Please\s+be\s+aware\s+that\s+the\s+time/i,
          /airline\s+tactics/i,
          /best\s+possible\s+outcome/i
        ]
      },
      update_promise: {
        required: true,
        patterns: [
          /we\s+will\s+keep\s+you\s+informed/i,
          /ensure\s+you\s+receive\s+these\s+updates/i
        ]
      },
      help_section: {
        required: true,
        patterns: [
          /Questions\?\s+We're\s+to\s+help!/i,
          /frequently\s+asked\s+questions/i
        ]
      },
      sign_off: {
        required: true,
        patterns: [
          /Thank\s+you\s+for\s+choosing/i,
          /Best\s+regards/i,
          /Kind\s+regards/i,
        ]
      }
    }
  },
  {
    id: "my_law_matters",
    name: "My Law Matters",
    identifierPatterns: [
      /MY\s+LAW\s+MATTERS/i,
      /Making\s+Law\s+Simple/i
    ],
    components: {
      header: {
        required: true,
        patterns: [
          /MY\s+LAW\s+MATTERS/i,
          /Making\s+Law\s+Simple/i
        ]
      },
      greeting: {
        required: true,
        patterns: [
          /Dear\s+\w+,/i,
          /Dear\s+Sirs,/i
        ]
      },
      reference: {
        required: true,
        patterns: [
          /\[INSERT\s+REFERENCE\]/i,
          /Our\s+Ref:/i,
          /Your\s+Ref:/i
        ]
      },
      main_content: {
        required: true,
        patterns: [
          /We\s+accept\s+the\s+offer/i,
          /N270/i
        ]
      },
      sign_off: {
        required: true,
        patterns: [
          /Kind\s+Regards,/i,
          /Yours\s+faithfully,/i,
          /Yours\s+sincerely,/i
        ]
      },
      company_signature: {
        required: true,
        patterns: [
          /My\s+Law\s+Matters/i
        ]
      },
      contact_details: {
        required: true,
        patterns: [
          /E\s+\|\s+\S+@mylawmatters\.co\.uk/i,
          /W\s+\|\s+www\.mylawmatters\.co\.uk/i
        ]
      },
      office_locations: {
        required: true,
        patterns: [
          /Solihull\s+[\s\S]*\s+Manchester/i
        ]
      },
      regulatory_info: {
        required: true,
        patterns: [
          /My\s+Law\s+Matters\s+is\s+a\s+trading\s+style/i,
          /Company\s+Number\s+\d+/i,
          /SRA\s+number\s+\d+/i
        ]
      },
      confidentiality_notice: {
        required: true,
        patterns: [
          /THIS\s+EMAIL\s+[\s\S]*\s+CONFIDENTIAL/i,
          /legally\s+privileged/i
        ]
      }
    }
  }
];

// List of prohibited phrases
const PROHIBITED_PHRASES = [
  "you're wrong",
  "that's not our problem",
  "I can't help you",
  "not my job",
];

/**
 * Identify which template the email content matches
 */
export function identifyTemplate(emailContent: string): string | null {
  for (const template of EMAIL_TEMPLATES) {
    for (const pattern of template.identifierPatterns) {
      if (pattern.test(emailContent)) {
        return template.id;
      }
    }
  }
  return null;
}

/**
 * Get the name of a template by its ID
 */
export function getTemplateName(templateId: string): string {
  const template = EMAIL_TEMPLATES.find(t => t.id === templateId);
  return template ? template.name : "Unknown Template";
}

/**
 * Analyze email content against template requirements
 */
export function analyzeTemplateConsistency(emailContent: string): TemplateAnalysisResult {
  // Default result structure
  const result: TemplateAnalysisResult = {
    score: 0,
    missingComponents: [],
    prohibitedPhrases: [],
    componentScores: {},
  };
  
  // Identify which template to use
  const templateId = identifyTemplate(emailContent);
  
  if (!templateId) {
    return result;
  }
  
  result.detectedTemplate = templateId;
  
  const template = EMAIL_TEMPLATES.find(t => t.id === templateId);
  
  if (!template) {
    return result;
  }
  
  result.templateName = template.name;
  
  // Check template components
  const componentScores: Record<string, number> = {};
  const missingComponents: string[] = [];
  
  // Track components
  let totalComponents = 0;
  let foundComponents = 0;
  
  for (const [componentName, componentInfo] of Object.entries(template.components)) {
    totalComponents++;
    let componentFound = false;
    
    // Skip checking for patterns if component isn't required
    if (!componentInfo.required) {
      continue;
    }
    
    // Check if any pattern for this component is found
    for (const pattern of componentInfo.patterns) {
      if (pattern.test(emailContent)) {
        componentFound = true;
        foundComponents++;
        break;
      }
    }
    
    // Add component result
    componentScores[componentName] = componentFound ? 1.0 : 0.0;
    
    // Track missing required components
    if (!componentFound && componentInfo.required) {
      missingComponents.push(componentName.replace(/_/g, ' '));
    }
  }
  
  // Check for prohibited phrases
  const prohibitedFound: string[] = [];
  for (const phrase of PROHIBITED_PHRASES) {
    if (emailContent.toLowerCase().includes(phrase.toLowerCase())) {
      prohibitedFound.push(phrase);
    }
  }
  
  // Calculate overall template score (max 10)
  let templateScore = 0;
  if (totalComponents > 0) {
    // Component structure accounts for 8 points
    const componentRatio = foundComponents / totalComponents;
    const componentPoints = componentRatio * 8;
    
    // No prohibited phrases accounts for 2 points
    const prohibitedPoints = prohibitedFound.length === 0 ? 2 : 0;
    
    templateScore = componentPoints + prohibitedPoints;
  }
  
  // Return the result
  result.score = templateScore;
  result.componentScores = componentScores;
  result.missingComponents = missingComponents;
  result.prohibitedPhrases = prohibitedFound;
  
  return result;
}
