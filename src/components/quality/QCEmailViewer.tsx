
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ZammadEmail } from '@/services/zammadService';

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

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Email: {email.subject}</span>
          <span className="text-sm text-muted-foreground">#{email.ticketNumber}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <div><strong>From:</strong> {email.from}</div>
            <div><strong>Date:</strong> {new Date(email.createdAt).toLocaleString()}</div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div><strong>To:</strong> {email.to}</div>
            <div><strong>Agent:</strong> {email.agentName}</div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: email.body }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QCEmailViewer;
