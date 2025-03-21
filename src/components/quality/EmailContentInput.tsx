import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Send, Image } from 'lucide-react';
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
  const [detectedImages, setDetectedImages] = useState<string[]>([]);
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
      // Process the emailContent to ensure it's properly formatted
      // This will preserve any detected images and send the final content
      onSubmit(emailContent, subject, agentName);
      
      // Reset form
      setEmailContent('');
      setSubject('');
      setDetectedImages([]);
      
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
  
  // Handle paste with improved formatting preservation and image detection
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault(); // Prevent default to handle paste manually
    
    // Get plain text 
    const plainText = e.clipboardData.getData('text/plain');
    
    // Get HTML content if available
    let htmlContent = e.clipboardData.getData('text/html');
    
    // Detect any images in the pasted content
    const newDetectedImages: string[] = [];
    
    // Process HTML content if available
    if (htmlContent && htmlContent.trim() !== '') {
      try {
        // Create a temporary DOM element to parse the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        
        // Find all image elements
        const images = doc.querySelectorAll('img');
        images.forEach(img => {
          if (img.src) {
            // Check if it's a data URL or regular URL
            if (img.src.startsWith('data:image') || img.src.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i)) {
              newDetectedImages.push(img.src);
            }
          }
        });

        // Find any references to image files in the text
        const imgRegex = /\b\w+\.(png|jpg|jpeg|gif|webp|svg)\b/gi;
        const textContent = doc.body.textContent || '';
        const imgMatches = textContent.match(imgRegex) || [];
        
        imgMatches.forEach(match => {
          newDetectedImages.push(`Image reference: ${match}`);
        });
        
        // Set the content, preserving proper formatting
        // Remove potentially unsafe scripts but keep formatting
        const sanitizedNodes = Array.from(doc.body.childNodes);
        let sanitizedHtml = '';
        
        sanitizedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (element.tagName.toLowerCase() !== 'script') {
              sanitizedHtml += element.outerHTML;
            }
          } else if (node.nodeType === Node.TEXT_NODE) {
            sanitizedHtml += node.textContent;
          }
        });
        
        // Set email content with sanitized HTML
        setEmailContent(sanitizedHtml || plainText);
      } catch (error) {
        console.error('Error parsing HTML content:', error);
        setEmailContent(plainText); // Fallback to plain text
      }
    } else {
      // If no HTML is available, check for image references in plain text
      const imgRegex = /\b\w+\.(png|jpg|jpeg|gif|webp|svg)\b/gi;
      const imgMatches = plainText.match(imgRegex) || [];
      
      imgMatches.forEach(match => {
        newDetectedImages.push(`Image reference: ${match}`);
      });
      
      // Format plain text with proper paragraph breaks
      const formattedText = plainText
        .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with just two
        .replace(/\r\n/g, '\n'); // Normalize line breaks
      
      setEmailContent(formattedText);
    }
    
    // Update detected images
    if (newDetectedImages.length > 0) {
      setDetectedImages(newDetectedImages);
      
      toast({
        title: `${newDetectedImages.length} image(s) detected`,
        description: "References to images found in the pasted content",
        variant: "info"
      });
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
              Paste the email content here. Formatting and image references will be preserved.
            </p>
          </div>
          
          {detectedImages.length > 0 && (
            <div className="rounded-md bg-muted p-3">
              <div className="flex items-center gap-2 mb-2">
                <Image className="h-4 w-4" />
                <span className="font-medium text-sm">Detected Images/Attachments:</span>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1">
                {detectedImages.map((img, index) => (
                  <li key={index} className="truncate">
                    {img.startsWith('data:image') 
                      ? `[Embedded image ${index + 1}]` 
                      : img.startsWith('Image reference:') 
                        ? img 
                        : `[Image: ${img.split('/').pop()}]`}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
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
