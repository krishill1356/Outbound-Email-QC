
// Template Analysis Service
// Analyzes emails to check for template consistency

/**
 * Template definitions with their identifier patterns and required components
 */
const EMAIL_TEMPLATES = {
  "air_travel_claim": {
    identifierPatterns: [
      /AIR\s+TRAVEL\s+CLAIM/i,
    ],
    components: {
      "header": {
        required: true,
        patterns: [
          /AIR\s+TRAVEL\s+CLAIM/i,
          /WE'VE\s+GOT\s+AN\s+UPDATE\s+FOR\s+YOU!/i
        ]
      },
      "claim_summary": {
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
      "greeting": {
        required: true,
        patterns: [
          /Hello\s+\w+,/i,
          /Dear\s+\w+,/i
        ]
      },
      "thank_you_intro": {
        required: true,
        patterns: [
          /Thank\s+you\s+for\s+reaching\s+out/i,
          /We\s+appreciate\s+your\s+patience/i
        ]
      },
      "update_promise": {
        required: true,
        patterns: [
          /we\s+will\s+keep\s+you\s+informed/i,
          /ensure\s+you\s+receive\s+these\s+updates/i
        ]
      },
      "help_section": {
        required: true,
        patterns: [
          /Questions\?\s+We're\s+here\s+to\s+help!/i,
          /frequently\s+asked\s+questions/i
        ]
      },
      "sign_off": {
        required: true,
        patterns: [
          /Thank\s+you\s+for\s+choosing/i,
          /Best\s+regards/i,
          /Kind\s+regards/i,
        ]
      }
    }
  },
  "my_law_matters": {
    identifierPatterns: [
      /MY\s+LAW\s+MATTERS/i,
      /Making\s+Law\s+Simple/i
    ],
    components: {
      "header": {
        required: true,
        patterns: [
          /MY\s+LAW\s+MATTERS/i,
          /Making\s+Law\s+Simple/i
        ]
      },
      "greeting": {
        required: true,
        patterns: [
          /Dear\s+\w+,/i,
          /Dear\s+Sirs,/i
        ]
      },
      "reference": {
        required: true,
        patterns: [
          /\[INSERT\s+REFERENCE\]/i,
          /Our\s+Ref:/i,
          /Your\s+Ref:/i
        ]
      },
      "sign_off": {
        required: true,
        patterns: [
          /Kind\s+Regards,/i,
          /Yours\s+faithfully,/i,
          /Yours\s+sincerely,/i
        ]
      },
      "company_signature": {
        required: true,
        patterns: [
          /My\s+Law\s+Matters/i
        ]
      },
      "contact_details": {
        required: true,
        patterns: [
          /E\s+\|\s+\S+@mylawmatters\.co\.uk/i,
          /W\s+\|\s+www\.mylawmatters\.co\.uk/i
        ]
      },
      "regulatory_info": {
        required: true,
        patterns: [
          /My\s+Law\s+Matters\s+is\s+a\s+trading\s+style/i,
          /Company\s+Number\s+\d+/i,
          /SRA\s+number\s+\d+/i
        ]
      },
      "confidentiality_notice": {
        required: true,
        patterns: [
          /THIS\s+EMAIL\s+[\s\S]*\s+CONFIDENTIAL/i,
          /legally\s+privileged/i
        ]
      }
    }
  }
};

// Prohibited phrases across all templates
const PROHIBITED_PHRASES = [
  "you're wrong",
  "that's not our problem",
  "I can't help you",
  "not my job"
];

/**
 * Identify which template matches the email content
 */
const identifyTemplate = (emailContent: string): string | undefined => {
  for (const [templateName, template] of Object.entries(EMAIL_TEMPLATES)) {
    for (const pattern of template.identifierPatterns) {
      if (pattern.test(emailContent)) {
        return templateName;
      }
    }
  }
  return undefined;
};

/**
 * Check for missing components in the template
 */
const findMissingComponents = (
  emailContent: string, 
  templateName: string
): string[] => {
  const missingComponents: string[] = [];
  const template = EMAIL_TEMPLATES[templateName as keyof typeof EMAIL_TEMPLATES];
  
  if (!template) return [];
  
  for (const [componentName, componentData] of Object.entries(template.components)) {
    if (!componentData.required) continue;
    
    let componentFound = false;
    for (const pattern of componentData.patterns) {
      if (pattern.test(emailContent)) {
        componentFound = true;
        break;
      }
    }
    
    if (!componentFound) {
      missingComponents.push(componentName.replace(/_/g, ' '));
    }
  }
  
  return missingComponents;
};

/**
 * Check for prohibited phrases in the email content
 */
const findProhibitedPhrases = (emailContent: string): string[] => {
  const foundPhrases: string[] = [];
  const lowerContent = emailContent.toLowerCase();
  
  for (const phrase of PROHIBITED_PHRASES) {
    if (lowerContent.includes(phrase.toLowerCase())) {
      foundPhrases.push(phrase);
    }
  }
  
  return foundPhrases;
};

/**
 * Analyze email content for template adherence
 */
export const analyzeEmailTemplate = async (emailContent: string) => {
  // Identify which template is being used
  const detectedTemplate = identifyTemplate(emailContent);
  
  if (!detectedTemplate) {
    return {
      detectedTemplate: undefined,
      missingComponents: [],
      prohibitedPhrases: findProhibitedPhrases(emailContent)
    };
  }
  
  // Find missing components
  const missingComponents = findMissingComponents(emailContent, detectedTemplate);
  
  // Find prohibited phrases
  const prohibitedPhrases = findProhibitedPhrases(emailContent);
  
  return {
    detectedTemplate: detectedTemplate.replace(/_/g, ' '),
    missingComponents,
    prohibitedPhrases
  };
};
