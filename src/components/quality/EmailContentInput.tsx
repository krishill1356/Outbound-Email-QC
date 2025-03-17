
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Check, Clipboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EmailContentInputProps {
  onSubmit: (emailContent: string, subject: string, agentName: string) => void;
}

const EmailContentInput: React.FC<EmailContentInputProps> = ({ onSubmit }) => {
  const [emailContent, setEmailContent] = useState('');
  const [subject, setSubject] = useState('');
  const [agentName, setAgentName] = useState('');
  const [isPasting, setIsPasting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailContent.trim()) {
      toast({
        title: "Email content required",
        description: "Please paste some email content to analyze",
        variant: "destructive",
      });
      return;
    }

    if (!subject.trim()) {
      toast({
        title: "Subject required",
        description: "Please provide an email subject",
        variant: "destructive",
      });
      return;
    }

    if (!agentName.trim()) {
      toast({
        title: "Agent name required",
        description: "Please provide the agent's name for reporting",
        variant: "destructive",
      });
      return;
    }

    onSubmit(emailContent, subject, agentName);
  };

  const handlePasteFromClipboard = async () => {
    try {
      setIsPasting(true);
      const clipboardText = await navigator.clipboard.readText();
      setEmailContent(clipboardText);
      toast({
        title: "Content pasted",
        description: "Email content has been pasted from clipboard",
      });
    } catch (error) {
      toast({
        title: "Could not access clipboard",
        description: "Please paste the content manually",
        variant: "destructive",
      });
      console.error("Clipboard access error:", error);
    } finally {
      setIsPasting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Paste Email Content</CardTitle>
        <CardDescription>
          Paste email content to analyze without using Zammad
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Email Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter the email subject"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="agent-name">Agent Name</Label>
            <Input
              id="agent-name"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="Enter the agent's name for reporting"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email-content">Email Body</Label>
            <div className="relative">
              <Textarea
                id="email-content"
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="Paste email content here..."
                className="min-h-[200px] font-mono text-sm"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={handlePasteFromClipboard}
                disabled={isPasting}
              >
                {isPasting ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                <span className="ml-1">{isPasting ? "Pasted" : "Paste"}</span>
              </Button>
            </div>
          </div>
          <Button type="submit">
            Analyze Email
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EmailContentInput;
