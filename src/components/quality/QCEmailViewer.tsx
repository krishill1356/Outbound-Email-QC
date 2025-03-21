
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ZammadEmail } from '@/services/zammadService';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, User, Image } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface QCEmailViewerProps {
  email: ZammadEmail | null;
  templateAnalysis?: {
    detectedTemplate?: string;
    missingComponents?: string[];
    prohibitedPhrases?: string[];
  };
}

const QCEmailViewer: React.FC<QCEmailViewerProps> = ({ email, templateAnalysis }) => {
  if (!email) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Email Content</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Select an email to view its content</p>
        </CardContent>
      </Card>
    );
  }

  // Function to sanitize HTML and look for image references
  const createMarkup = () => {
    // Check for image file references that might have been missed
    const imgRegex = /\b\w+\.(png|jpg|jpeg|gif|webp|svg)\b/gi;
    let processedBody = email.body;
    const imgMatches = email.body.match(imgRegex) || [];
    
    // Highlight image references in the content
    if (imgMatches.length > 0) {
      // Create a set to avoid duplicates
      const uniqueMatches = [...new Set(imgMatches)];
      
      uniqueMatches.forEach(match => {
        // Don't replace inside HTML tags (to avoid breaking img src attributes)
        // This regex matches the pattern but checks it's not inside an HTML attribute
        const safeRegex = new RegExp(`(?<!src=["'][^"']*?)\\b${match}\\b`, 'gi');
        processedBody = processedBody.replace(
          safeRegex, 
          `<span class="inline-flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-1 py-0.5 rounded text-xs font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            ${match}
          </span>`
        );
      });
    }
    
    return { __html: processedBody };
  };

  // Check if email body contains image references
  const containsImageReferences = () => {
    const imgRegex = /\b\w+\.(png|jpg|jpeg|gif|webp|svg)\b/gi;
    return (email.body.match(imgRegex) || []).length > 0;
  };

  // Count image references in the email
  const countImageReferences = () => {
    const imgRegex = /\b\w+\.(png|jpg|jpeg|gif|webp|svg)\b/gi;
    const matches = email.body.match(imgRegex) || [];
    // Use a set to get unique image names
    return new Set(matches).size;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="truncate">{email.subject}</span>
            {templateAnalysis?.detectedTemplate && (
              <Badge variant="outline" className="ml-2">
                {templateAnalysis.detectedTemplate}
              </Badge>
            )}
            {containsImageReferences() && (
              <Badge variant="secondary" className="ml-2 flex items-center gap-1">
                <Image className="h-3 w-3" />
                {countImageReferences()} image(s)
              </Badge>
            )}
          </div>
          <span className="text-sm text-muted-foreground">#{email.ticketNumber}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1 p-3 bg-muted/30 rounded-lg">
          <div className="flex flex-wrap gap-2 justify-between text-sm">
            <div><strong>From:</strong> {email.from}</div>
            <div><strong>Date:</strong> {new Date(email.createdAt).toLocaleString()}</div>
          </div>
          <div className="flex flex-wrap gap-2 justify-between text-sm">
            <div><strong>To:</strong> {email.to}</div>
            <div className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              <strong>Agent:</strong> {email.agentName}
            </div>
          </div>
        </div>
        
        {(templateAnalysis?.missingComponents?.length || templateAnalysis?.prohibitedPhrases?.length) && (
          <div className="p-3 border border-yellow-200 bg-yellow-50 rounded-lg dark:bg-yellow-900/20 dark:border-yellow-800/30">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-400">Template Issues</h4>
                
                {templateAnalysis.missingComponents?.length > 0 && (
                  <div>
                    <p className="text-sm text-yellow-800 dark:text-yellow-400 font-medium">Missing components:</p>
                    <ul className="list-disc list-inside text-sm text-yellow-700 dark:text-yellow-300 pl-1">
                      {templateAnalysis.missingComponents.map((component, idx) => (
                        <li key={idx}>{component}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {templateAnalysis.prohibitedPhrases?.length > 0 && (
                  <div>
                    <p className="text-sm text-yellow-800 dark:text-yellow-400 font-medium">Prohibited phrases:</p>
                    <ul className="list-disc list-inside text-sm text-yellow-700 dark:text-yellow-300 pl-1">
                      {templateAnalysis.prohibitedPhrases.map((phrase, idx) => (
                        <li key={idx}>"{phrase}"</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        <ScrollArea className="border rounded-lg p-4 h-[400px] bg-white dark:bg-gray-800">
          <div className="prose dark:prose-invert max-w-none">
            <div 
              dangerouslySetInnerHTML={createMarkup()} 
              className="email-content" 
            />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default QCEmailViewer;
