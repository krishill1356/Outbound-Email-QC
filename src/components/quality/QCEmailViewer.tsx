
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ZammadEmail } from '@/services/zammadService';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, User } from 'lucide-react';
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

  // Function to sanitize HTML (in a real app you'd want to use a library like DOMPurify)
  const createMarkup = () => {
    return { __html: email.body };
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
        
        <ScrollArea className="border rounded-lg p-4 h-[400px]">
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={createMarkup()} />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default QCEmailViewer;
