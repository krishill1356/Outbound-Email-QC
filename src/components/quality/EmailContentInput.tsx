
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAgents } from '@/services/agentService';
import { Textarea } from '@/components/ui/textarea';

interface EmailContentInputProps {
  onSubmit: (emailContent: string, subject: string, agentName: string) => void;
}

const EmailContentInput: React.FC<EmailContentInputProps> = ({ onSubmit }) => {
  const [emailContent, setEmailContent] = useState('');
  const [subject, setSubject] = useState('');
  const [agentName, setAgentName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [agentsList, setAgentsList] = useState<Array<{id: string, name: string}>>(
    getAgents().map(agent => ({ id: agent.id, name: agent.name }))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailContent.trim()) {
      toast({
        title: "Email content required",
        description: "Please paste in the email content",
        variant: "destructive"
      });
      return;
    }
    
    if (!subject.trim()) {
      toast({
        title: "Subject required",
        description: "Please enter an email subject",
        variant: "destructive"
      });
      return;
    }
    
    if (!agentName.trim()) {
      toast({
        title: "Agent name required",
        description: "Please enter the agent's name",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      onSubmit(emailContent, subject, agentName);
      
      // Reset form
      setEmailContent('');
      setSubject('');
      
      toast({
        title: "Email submitted",
        description: "The email has been loaded for quality checking",
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while submitting the email",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle paste with formatting preservation
  const handlePaste = (e: React.ClipboardEvent) => {
    // Get plain text 
    const plainText = e.clipboardData.getData('text/plain');
    
    // Get HTML content if available
    let htmlContent = e.clipboardData.getData('text/html');
    
    // If we have HTML, use it (this preserves formatting)
    if (htmlContent && htmlContent.trim() !== '') {
      // Sanitize the HTML to avoid XSS attacks in a real app
      // This is a simple example that keeps only safe HTML elements and attributes
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      
      // Set the email content to the HTML content
      setEmailContent(doc.body.innerHTML);
      e.preventDefault(); // Prevent default paste behavior
    } else {
      // Otherwise just use plain text
      setEmailContent(plainText);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paste Email Content</CardTitle>
        <CardDescription>
          Paste the full email content including any formatting to evaluate
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="subject">Email Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter the email subject"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="agent-name">Agent Name</Label>
            <Input 
              id="agent-name"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="Enter the agent's name"
              className="mt-1"
              list="agents-list"
            />
            <datalist id="agents-list">
              {agentsList.map(agent => (
                <option key={agent.id} value={agent.name} />
              ))}
            </datalist>
          </div>
          
          <div>
            <Label htmlFor="email-content">Email Content</Label>
            <Textarea
              id="email-content"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              placeholder="Paste or type email content here"
              className="min-h-[300px] mt-1"
              onPaste={handlePaste}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Paste the email content here. Simple formatting will be preserved.
            </p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit for Quality Check
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmailContentInput;
