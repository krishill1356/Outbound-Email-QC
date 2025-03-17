
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Check, Clipboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmailContentInputProps {
  onSubmit: (emailContent: string, subject: string) => void;
}

const EmailContentInput: React.FC<EmailContentInputProps> = ({ onSubmit }) => {
  const [emailContent, setEmailContent] = useState('');
  const [subject, setSubject] = useState('');
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

    onSubmit(emailContent, subject);
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
            <label htmlFor="subject" className="text-sm font-medium">
              Email Subject
            </label>
            <div className="flex gap-2">
              <input
                id="subject"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter the email subject"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="email-content" className="text-sm font-medium">
              Email Body
            </label>
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
