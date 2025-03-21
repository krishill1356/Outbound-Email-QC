
import React, { useState, useRef } from 'react';
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
  const imageContainerRef = useRef<HTMLDivElement>(null);

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
      onSubmit(emailContent, subject, agentName);
      
      // Reset form after successful submission
      setTimeout(() => {
        setEmailContent('');
        setSubject('');
        setAgentName('');
        setDetectedImages([]);
        if (imageContainerRef.current) {
          imageContainerRef.current.innerHTML = '';
        }
        
        toast({
          title: "Email submitted",
          description: "The email has been loaded for quality checking",
          variant: "success"
        });
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error('Error submitting email:', error);
      toast({
        title: "Error",
        description: "An error occurred while submitting the email",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };
  
  // Handle direct paste to the textarea
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault(); // Prevent default paste to handle it manually
    
    // Extract both plain text and HTML content (if available)
    const plainText = e.clipboardData.getData('text/plain');
    const htmlContent = e.clipboardData.getData('text/html');
    
    // Array to store detected images
    const newDetectedImages: string[] = [];
    
    // Process the pasted content
    if (htmlContent && htmlContent.trim() !== '') {
      try {
        // Create a temporary DOM element to parse the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        
        // Extract images from HTML
        const images = doc.querySelectorAll('img');
        images.forEach(img => {
          if (img.src) {
            if (img.src.startsWith('data:image') || img.src.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i)) {
              newDetectedImages.push(img.src);
              
              // Create an image element to display the pasted image
              if (imageContainerRef.current) {
                const imgElement = document.createElement('img');
                imgElement.src = img.src;
                imgElement.className = 'max-h-40 max-w-full rounded-md mt-2 mb-2';
                imgElement.alt = 'Pasted image';
                imageContainerRef.current.appendChild(imgElement);
              }
            }
          }
        });

        // Look for image references in the content
        const imgRegex = /\b[\w-]+\.(png|jpg|jpeg|gif|webp|svg)\b/gi;
        const textContent = doc.body.textContent || '';
        const imgMatches = textContent.match(imgRegex) || [];
        
        imgMatches.forEach(match => {
          // Prevent duplicates
          if (!newDetectedImages.includes(`Image reference: ${match}`)) {
            newDetectedImages.push(`Image reference: ${match}`);
          }
        });
        
        // Clean up and preserve formatting from HTML
        let sanitizedContent = '';
        
        // Process each node to preserve formatting
        const processNode = (node: Node): string => {
          if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent || '';
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            const tagName = element.tagName.toLowerCase();
            
            // Skip script tags
            if (tagName === 'script') return '';
            
            // Handle specific formatting elements
            if (tagName === 'br') return '\n';
            if (tagName === 'p') {
              let content = '';
              Array.from(element.childNodes).forEach(child => {
                content += processNode(child);
              });
              return content + '\n\n';
            }
            if (tagName === 'div') {
              let content = '';
              Array.from(element.childNodes).forEach(child => {
                content += processNode(child);
              });
              return content + '\n';
            }
            if (tagName === 'li') {
              let content = '';
              Array.from(element.childNodes).forEach(child => {
                content += processNode(child);
              });
              return '• ' + content + '\n';
            }
            if (tagName === 'img') {
              return '[IMAGE]\n';
            }
            
            // Process other elements
            let content = '';
            Array.from(element.childNodes).forEach(child => {
              content += processNode(child);
            });
            return content;
          }
          return '';
        };
        
        // Process the body content
        if (doc.body) {
          Array.from(doc.body.childNodes).forEach(node => {
            sanitizedContent += processNode(node);
          });
        }
        
        // Clean up extra newlines and whitespace
        sanitizedContent = sanitizedContent
          .replace(/\n{3,}/g, '\n\n') // Replace 3+ newlines with just 2
          .replace(/^\s+|\s+$/g, ''); // Trim whitespace
        
        setEmailContent(sanitizedContent || plainText);
      } catch (error) {
        console.error('Error processing HTML content:', error);
        // Fallback to plain text if HTML processing fails
        const formattedText = plainText
          .replace(/\r\n/g, '\n')
          .replace(/\n{3,}/g, '\n\n')
          .trim();
        setEmailContent(formattedText);
      }
    } else {
      // If no HTML content is available, format the plain text
      // Look for image references in plain text
      const imgRegex = /\b[\w-]+\.(png|jpg|jpeg|gif|webp|svg)\b/gi;
      const imgMatches = plainText.match(imgRegex) || [];
      
      imgMatches.forEach(match => {
        newDetectedImages.push(`Image reference: ${match}`);
      });
      
      // Format plain text with proper line breaks
      const formattedText = plainText
        .replace(/\r\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
      
      setEmailContent(formattedText);
    }

    // Handle pasted image files directly
    if (e.clipboardData.items) {
      for (let i = 0; i < e.clipboardData.items.length; i++) {
        const item = e.clipboardData.items[i];
        
        if (item.type.indexOf('image') !== -1) {
          const blob = item.getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (event) => {
              if (event.target && event.target.result) {
                const imageUrl = event.target.result.toString();
                
                // Add to detected images list
                newDetectedImages.push(imageUrl);
                
                // Create an image element to display the pasted image
                if (imageContainerRef.current) {
                  const imgElement = document.createElement('img');
                  imgElement.src = imageUrl;
                  imgElement.className = 'max-h-40 max-w-full rounded-md mt-2 mb-2';
                  imgElement.alt = 'Pasted image';
                  imageContainerRef.current.appendChild(imgElement);
                }
              }
            };
            reader.readAsDataURL(blob);
          }
        }
      }
    }
    
    // Update detected images
    if (newDetectedImages.length > 0) {
      setDetectedImages(prevImages => {
        const combinedImages = [...prevImages, ...newDetectedImages];
        return [...new Set(combinedImages)]; // Remove duplicates
      });
      
      toast({
        title: `${newDetectedImages.length} image(s) detected`,
        description: "Images found in the pasted content",
        variant: "default"
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
              Paste the email content here. Formatting, images, and attachments will be preserved.
            </p>
          </div>
          
          {/* Display pasted images here */}
          <div ref={imageContainerRef} className="flex flex-wrap gap-2"></div>
          
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
                Processing...
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
