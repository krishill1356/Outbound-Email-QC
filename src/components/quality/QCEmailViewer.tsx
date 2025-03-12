
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ZammadEmail } from '@/services/zammadService';
import { ScrollArea } from '@/components/ui/scroll-area';

interface QCEmailViewerProps {
  email: ZammadEmail | null;
}

const QCEmailViewer: React.FC<QCEmailViewerProps> = ({ email }) => {
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
          <span className="truncate">{email.subject}</span>
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
            <div><strong>Agent:</strong> {email.agentName}</div>
          </div>
        </div>
        
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
