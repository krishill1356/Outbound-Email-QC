
import { QualityCriteria, Agent, Template, QualityCheck } from '@/types';

export const CRITERIA: QualityCriteria[] = [
  {
    id: "spelling-grammar",
    name: "Spelling & Grammar",
    description: "Correct spelling, grammar, and punctuation throughout the email",
    weight: 0.2
  },
  {
    id: "tone",
    name: "Tone",
    description: "Appropriate and professional tone that aligns with company standards",
    weight: 0.2
  },
  {
    id: "empathy",
    name: "Empathy",
    description: "Shows understanding and addresses the customer's emotional state",
    weight: 0.2
  },
  {
    id: "template-consistency",
    name: "Template Consistency",
    description: "Adheres to the required template structure and formatting",
    weight: 0.2
  },
  {
    id: "solution-clarity",
    name: "Solution Clarity",
    description: "Clearly explains solutions, next steps, or requested information",
    weight: 0.2
  }
];

export const AGENTS: Agent[] = [
  {
    id: "agent-1",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    department: "Customer Support",
    avatar: "https://i.pravatar.cc/300?img=1"
  },
  {
    id: "agent-2",
    name: "Sam Taylor",
    email: "sam.taylor@example.com",
    department: "Technical Support",
    avatar: "https://i.pravatar.cc/300?img=2"
  },
  {
    id: "agent-3",
    name: "Jamie Lee",
    email: "jamie.lee@example.com",
    department: "Customer Support",
    avatar: "https://i.pravatar.cc/300?img=3"
  },
  {
    id: "agent-4",
    name: "Casey Morgan",
    email: "casey.morgan@example.com",
    department: "Billing Support",
    avatar: "https://i.pravatar.cc/300?img=4"
  }
];

export const TEMPLATES: Template[] = [
  {
    id: "template-1",
    name: "General Support Response",
    description: "Standard template for general customer inquiries",
    content: "Hello [Customer Name],\n\nThank you for contacting our support team about [Issue Summary].\n\n[Response to the inquiry with detailed information]\n\nIf you have any further questions, please don't hesitate to contact us.\n\nBest regards,\n[Agent Name]\n[Department]",
    tags: ["general", "support"]
  },
  {
    id: "template-2",
    name: "Technical Issue Response",
    description: "Template for responding to technical problems",
    content: "Hello [Customer Name],\n\nThank you for reporting this technical issue to us.\n\n[Description of the problem based on understanding]\n\n[Step-by-step solution or troubleshooting steps]\n\nPlease let me know if this resolves your issue or if you need further assistance.\n\nBest regards,\n[Agent Name]\n[Department]",
    tags: ["technical", "troubleshooting"]
  },
  {
    id: "template-3",
    name: "Billing Inquiry Response",
    description: "Template for billing and payment questions",
    content: "Hello [Customer Name],\n\nThank you for your inquiry regarding your billing/payment.\n\n[Response to billing question with relevant details]\n\nIf you require any clarification or have additional questions about your billing, please reply to this email.\n\nBest regards,\n[Agent Name]\n[Department]",
    tags: ["billing", "payment"]
  }
];

export const SAMPLE_EMAILS: {id: string, subject: string, content: string}[] = [
  {
    id: "email-1",
    subject: "Re: Account Access Issue",
    content: "Hello Sarah,\n\nThank you for contacting our support team about your account access issue.\n\nI understand how frustrating it can be when you're unable to log in to your account. I've checked our system and can see that your account is active, but there appears to be an issue with your password.\n\nTo resolve this, I recommend resetting your password by following these steps:\n1. Go to our login page\n2. Click on \"Forgot Password\"\n3. Enter your email address\n4. Follow the instructions sent to your email\n\nIf you continue to experience issues after resetting your password, please let me know and I'll help you further.\n\nBest regards,\nAlex Johnson\nCustomer Support"
  },
  {
    id: "email-2",
    subject: "Re: Billing Question",
    content: "Hi David,\n\nThanks for your email about the charge on your account.\n\nI checked and saw the $15.99 charge from May 5th. This is for your monthly subscription. We charge on the 5th of each month.\n\nLet me know if you want to cancel or have more questions.\n\nThanks,\nJamie"
  },
  {
    id: "email-3",
    subject: "Re: Product Installation Help",
    content: "Hello Michael,\n\nThanks for contacting us about installing the software.\n\nTo fix this error, try these steps:\n- Restart your computer\n- Run as administrator\n- Update your graphics driver\n\nThis should work. Let me know if it doesn't.\n\nRegards,\nSam Taylor\nTechnical Support"
  }
];

// Generate some sample quality checks
export const SAMPLE_QUALITY_CHECKS: QualityCheck[] = [
  {
    id: "qc-1",
    agentId: "agent-1",
    emailId: "email-1",
    reviewerId: "reviewer-1",
    date: "2023-05-15T10:30:00Z",
    emailContent: SAMPLE_EMAILS[0].content,
    templateUsed: "template-1",
    scores: [
      { criteriaId: "spelling-grammar", score: 9, feedback: "Excellent spelling and grammar throughout" },
      { criteriaId: "tone", score: 8, feedback: "Professional and friendly tone" },
      { criteriaId: "empathy", score: 9, feedback: "Shows great understanding of customer frustration" },
      { criteriaId: "template-consistency", score: 7, feedback: "Good use of template but missing company signature" },
      { criteriaId: "solution-clarity", score: 10, feedback: "Clear step-by-step instructions provided" }
    ],
    overallScore: 8.6,
    feedback: "Overall excellent response with clear instructions and good empathy.",
    recommendations: [
      "Add company signature line for branding consistency",
      "Consider adding a direct contact option as an alternative"
    ],
    status: "completed"
  },
  {
    id: "qc-2",
    agentId: "agent-2",
    emailId: "email-3",
    reviewerId: "reviewer-1",
    date: "2023-05-16T14:45:00Z",
    emailContent: SAMPLE_EMAILS[2].content,
    templateUsed: "template-2",
    scores: [
      { criteriaId: "spelling-grammar", score: 9, feedback: "No spelling or grammar issues" },
      { criteriaId: "tone", score: 6, feedback: "Tone is a bit too direct/technical" },
      { criteriaId: "empathy", score: 5, feedback: "Could show more understanding of customer's difficulty" },
      { criteriaId: "template-consistency", score: 7, feedback: "Follows template structure but lacks personalization" },
      { criteriaId: "solution-clarity", score: 8, feedback: "Instructions are clear but could be more detailed" }
    ],
    overallScore: 7.0,
    feedback: "Response provides technical solution but lacks empathy and personal touch.",
    recommendations: [
      "Add a sentence acknowledging the frustration of software installation issues",
      "Provide more detailed explanation for each troubleshooting step",
      "Add follow-up offer for further assistance if needed"
    ],
    status: "completed"
  },
  {
    id: "qc-3",
    agentId: "agent-3",
    emailId: "email-2",
    reviewerId: "reviewer-2",
    date: "2023-05-17T09:15:00Z",
    emailContent: SAMPLE_EMAILS[1].content,
    templateUsed: "template-3",
    scores: [
      { criteriaId: "spelling-grammar", score: 10, feedback: "Perfect spelling and grammar" },
      { criteriaId: "tone", score: 5, feedback: "Tone is too casual for billing matter" },
      { criteriaId: "empathy", score: 4, feedback: "No acknowledgment of possible confusion about the charge" },
      { criteriaId: "template-consistency", score: 3, feedback: "Doesn't follow billing template format" },
      { criteriaId: "solution-clarity", score: 6, feedback: "Information is correct but presentation lacks detail" }
    ],
    overallScore: 5.6,
    feedback: "Response addresses the basic question but lacks professionalism and detail expected for billing matters.",
    recommendations: [
      "Use the proper billing inquiry template format",
      "Maintain professional tone for financial matters",
      "Provide more details about the subscription and payment process",
      "Add information about how to view billing history in account"
    ],
    status: "completed"
  }
];

// Generate more sample quality checks for reporting
export const generateSampleData = () => {
  const additionalChecks: QualityCheck[] = [];
  
  // Generate 30 more random quality checks across the past 30 days
  for (let i = 0; i < 30; i++) {
    const agentId = AGENTS[Math.floor(Math.random() * AGENTS.length)].id;
    const emailId = SAMPLE_EMAILS[Math.floor(Math.random() * SAMPLE_EMAILS.length)].id;
    const templateId = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)].id;
    
    // Generate a date within the last 30 days
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    // Generate random scores
    const scores = CRITERIA.map(criteria => {
      return {
        criteriaId: criteria.id,
        score: Math.floor(Math.random() * 5) + 5, // Random score between 5-10
        feedback: "Sample feedback for " + criteria.name
      };
    });
    
    // Calculate overall score
    const overallScore = Number((scores.reduce((sum, item) => sum + item.score, 0) / scores.length).toFixed(1));
    
    additionalChecks.push({
      id: `qc-sample-${i+4}`,
      agentId,
      emailId,
      reviewerId: Math.random() > 0.5 ? "reviewer-1" : "reviewer-2",
      date: date.toISOString(),
      emailContent: SAMPLE_EMAILS.find(email => email.id === emailId)?.content || "",
      templateUsed: templateId,
      scores,
      overallScore,
      feedback: "Sample feedback for review",
      recommendations: ["Sample recommendation 1", "Sample recommendation 2"],
      status: "completed"
    });
  }
  
  return [...SAMPLE_QUALITY_CHECKS, ...additionalChecks];
};

export const QUALITY_CHECKS = generateSampleData();

// Helper function to get all quality checks for an agent
export const getAgentQualityChecks = (agentId: string) => {
  return QUALITY_CHECKS.filter(qc => qc.agentId === agentId);
};

// Helper function to get performance data for charts
export const getPerformanceData = () => {
  const last30Days = [...Array(30)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split('T')[0];
  });
  
  // Get average scores by date for all agents
  const overallData = last30Days.map(date => {
    const dayChecks = QUALITY_CHECKS.filter(qc => 
      qc.date.split('T')[0] === date
    );
    
    const average = dayChecks.length 
      ? Number((dayChecks.reduce((sum, check) => sum + check.overallScore, 0) / dayChecks.length).toFixed(1))
      : null;
      
    return {
      date,
      average: average || 0
    };
  });
  
  // Get agent-specific data
  const agentData = AGENTS.map(agent => {
    const checks = getAgentQualityChecks(agent.id);
    
    // Calculate average score
    const averageScore = checks.length
      ? Number((checks.reduce((sum, check) => sum + check.overallScore, 0) / checks.length).toFixed(1))
      : 0;
      
    // Calculate criteria breakdown
    const criteriaBreakdown = CRITERIA.map(criteria => {
      const criteriaScores = checks
        .flatMap(check => check.scores)
        .filter(score => score.criteriaId === criteria.id);
        
      const average = criteriaScores.length
        ? Number((criteriaScores.reduce((sum, score) => sum + score.score, 0) / criteriaScores.length).toFixed(1))
        : 0;
        
      return {
        criteriaId: criteria.id,
        name: criteria.name,
        average
      };
    });
    
    return {
      agent,
      checksCount: checks.length,
      averageScore,
      criteriaBreakdown,
      trend: last30Days.map(date => {
        const dayChecks = checks.filter(qc => 
          qc.date.split('T')[0] === date
        );
        
        const average = dayChecks.length 
          ? Number((dayChecks.reduce((sum, check) => sum + check.overallScore, 0) / dayChecks.length).toFixed(1))
          : null;
          
        return {
          date,
          score: average || 0
        };
      })
    };
  });
  
  return {
    overall: overallData,
    agents: agentData
  };
};
