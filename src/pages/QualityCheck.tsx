
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  Star,
  MailCheck,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  BookTemplate,
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AGENTS, CRITERIA, TEMPLATES, SAMPLE_EMAILS } from '@/lib/mock-data';
import { QualityCheck, ScoreResult } from '@/types';

const QualityCheckPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('template');
  const [selectedAgent, setSelectedAgent] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [scores, setScores] = useState<ScoreResult[]>([]);
  const [feedback, setFeedback] = useState('');
  const [recommendations, setRecommendations] = useState<string[]>(['']);

  // Initialize scores when a template is selected
  const handleTemplateSelect = (value: string) => {
    setSelectedTemplate(value);
    // Initialize scores for all criteria
    setScores(CRITERIA.map(criteria => ({
      criteriaId: criteria.id,
      score: 0,
      feedback: ''
    })));
  };

  // Load email content when an email is selected
  const handleEmailSelect = (emailId: string) => {
    setSelectedEmail(emailId);
    const email = SAMPLE_EMAILS.find(e => e.id === emailId);
    if (email) {
      setEmailContent(email.content);
      // Try to determine the template type based on content
      if (email.content.includes('technical issue') || email.content.includes('installing')) {
        setSelectedTemplate('template-2');
        handleTemplateSelect('template-2');
      } else if (email.content.includes('billing') || email.content.includes('payment')) {
        setSelectedTemplate('template-3');
        handleTemplateSelect('template-3');
      } else {
        setSelectedTemplate('template-1');
        handleTemplateSelect('template-1');
      }
    }
  };

  // Update score for a specific criteria
  const updateScore = (criteriaId: string, score: number) => {
    setScores(prev => 
      prev.map(item => 
        item.criteriaId === criteriaId 
          ? { ...item, score } 
          : item
      )
    );
  };

  // Update feedback for a specific criteria
  const updateFeedback = (criteriaId: string, feedback: string) => {
    setScores(prev => 
      prev.map(item => 
        item.criteriaId === criteriaId 
          ? { ...item, feedback } 
          : item
      )
    );
  };

  // Add a new recommendation
  const addRecommendation = () => {
    setRecommendations([...recommendations, '']);
  };

  // Update recommendation at specific index
  const updateRecommendation = (index: number, value: string) => {
    const newRecommendations = [...recommendations];
    newRecommendations[index] = value;
    setRecommendations(newRecommendations);
  };

  // Remove recommendation at specific index
  const removeRecommendation = (index: number) => {
    setRecommendations(recommendations.filter((_, i) => i !== index));
  };

  // Calculate overall score
  const calculateOverallScore = () => {
    if (!scores.length) return 0;
    return Number((scores.reduce((sum, item) => sum + item.score, 0) / scores.length).toFixed(1));
  };

  // Submit the quality check
  const handleSubmit = () => {
    // Validation
    if (!selectedAgent) {
      toast({ 
        title: 'Error', 
        description: 'Please select an agent',
        variant: 'destructive'
      });
      return;
    }
    
    if (!emailContent) {
      toast({ 
        title: 'Error', 
        description: 'Please enter email content',
        variant: 'destructive'
      });
      return;
    }
    
    if (!selectedTemplate) {
      toast({ 
        title: 'Error', 
        description: 'Please select a template',
        variant: 'destructive'
      });
      return;
    }
    
    if (scores.some(score => score.score === 0)) {
      toast({ 
        title: 'Error', 
        description: 'Please provide scores for all criteria',
        variant: 'destructive'
      });
      return;
    }
    
    // Create QC object
    const qualityCheck: QualityCheck = {
      id: `qc-${Date.now()}`,
      agentId: selectedAgent,
      emailId: selectedEmail || `custom-${Date.now()}`,
      reviewerId: 'current-user',
      date: new Date().toISOString(),
      emailContent,
      templateUsed: selectedTemplate,
      scores: scores.filter(score => score.score > 0),
      overallScore: calculateOverallScore(),
      feedback,
      recommendations: recommendations.filter(r => r.trim() !== ''),
      status: 'completed'
    };
    
    // Here you would normally save to API
    console.log('Submitting quality check:', qualityCheck);
    
    toast({ 
      title: 'Success', 
      description: 'Quality check saved successfully'
    });
    
    // Reset form
    setSelectedAgent('');
    setSelectedEmail('');
    setEmailContent('');
    setSelectedTemplate('');
    setScores([]);
    setFeedback('');
    setRecommendations(['']);
    setActiveTab('template');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <section className="mb-8">
        <h1 className="text-3xl font-bold">Email Quality Check</h1>
        <p className="text-muted-foreground mt-1">Review and score agent emails</p>
      </section>
      
      <Card className="glass-card mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Review Process</CardTitle>
          <CardDescription>Follow the tabs to complete the quality check</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="template">
                <div className="flex flex-col items-center gap-1 py-1">
                  <BookTemplate size={18} />
                  <span className="text-xs">Email & Template</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="scoring">
                <div className="flex flex-col items-center gap-1 py-1">
                  <Star size={18} />
                  <span className="text-xs">Scoring</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="feedback">
                <div className="flex flex-col items-center gap-1 py-1">
                  <MessageSquare size={18} />
                  <span className="text-xs">Feedback</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="review">
                <div className="flex flex-col items-center gap-1 py-1">
                  <CheckCircle size={18} />
                  <span className="text-xs">Review & Submit</span>
                </div>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="template">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="agent">Agent</Label>
                  <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                    <SelectTrigger id="agent">
                      <SelectValue placeholder="Select an agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {AGENTS.map(agent => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Select value={selectedEmail} onValueChange={handleEmailSelect}>
                    <SelectTrigger id="email">
                      <SelectValue placeholder="Select an email or use custom" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="custom">Custom Email</SelectItem>
                      {SAMPLE_EMAILS.map(email => (
                        <SelectItem key={email.id} value={email.id}>
                          {email.subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email-content">Email Content</Label>
                  <Textarea
                    id="email-content"
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    placeholder="Paste the email content here..."
                    className="min-h-[200px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="template">Expected Template</Label>
                  <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                    <SelectTrigger id="template">
                      <SelectValue placeholder="Select the expected template" />
                    </SelectTrigger>
                    <SelectContent>
                      {TEMPLATES.map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {selectedTemplate && (
                    <div className="mt-4 p-4 bg-secondary/50 rounded-md border border-border">
                      <h4 className="font-medium mb-2 text-sm">Template Reference:</h4>
                      <div className="whitespace-pre-line text-sm text-muted-foreground">
                        {TEMPLATES.find(t => t.id === selectedTemplate)?.content}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={() => setActiveTab('scoring')}>
                    Continue to Scoring
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="scoring">
              <div className="space-y-8">
                {CRITERIA.map(criteria => {
                  const currentScore = scores.find(
                    s => s.criteriaId === criteria.id
                  )?.score || 0;
                  
                  const currentFeedback = scores.find(
                    s => s.criteriaId === criteria.id
                  )?.feedback || '';
                  
                  const scoreColor = 
                    currentScore >= 8 ? 'text-green-500' :
                    currentScore >= 6 ? 'text-amber-500' :
                    currentScore > 0 ? 'text-red-500' :
                    'text-muted-foreground';
                  
                  return (
                    <div key={criteria.id} className="p-4 rounded-lg border border-border bg-card">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium text-lg">{criteria.name}</h3>
                          <p className="text-sm text-muted-foreground">{criteria.description}</p>
                        </div>
                        <div className="mt-2 sm:mt-0 flex items-center">
                          <span className={`text-lg font-semibold ${scoreColor}`}>
                            {currentScore > 0 ? currentScore : '-'}/10
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <Label className="text-sm">Score</Label>
                            <span className="text-sm text-muted-foreground">
                              Drag to set score
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <Slider
                              value={[currentScore]}
                              min={0}
                              max={10}
                              step={1}
                              onValueChange={(values) => updateScore(criteria.id, values[0])}
                            />
                            <div className="w-12 text-center">
                              <span className={`font-medium ${scoreColor}`}>
                                {currentScore}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor={`feedback-${criteria.id}`} className="text-sm">
                            Feedback
                          </Label>
                          <Textarea
                            id={`feedback-${criteria.id}`}
                            value={currentFeedback}
                            onChange={(e) => updateFeedback(criteria.id, e.target.value)}
                            placeholder={`Provide specific feedback about ${criteria.name.toLowerCase()}...`}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab('template')}>
                    Back
                  </Button>
                  <Button onClick={() => setActiveTab('feedback')}>
                    Continue to Feedback
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="feedback">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="overall-feedback">Overall Feedback</Label>
                  <Textarea
                    id="overall-feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide overall feedback on the email quality..."
                    className="min-h-[150px]"
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Recommendations</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addRecommendation}
                      type="button"
                    >
                      Add Recommendation
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {recommendations.map((rec, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={rec}
                          onChange={(e) => updateRecommendation(index, e.target.value)}
                          placeholder="Enter a specific recommendation..."
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeRecommendation(index)}
                          type="button"
                          disabled={recommendations.length === 1 && index === 0}
                        >
                          <AlertCircle size={18} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab('scoring')}>
                    Back
                  </Button>
                  <Button onClick={() => setActiveTab('review')}>
                    Review & Submit
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="review">
              <div className="space-y-6">
                <div className="bg-secondary/50 p-4 rounded-lg border border-border">
                  <h3 className="font-medium mb-2">Review Summary</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Agent:</p>
                        <p className="font-medium">
                          {AGENTS.find(a => a.id === selectedAgent)?.name || 'Not selected'}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Template:</p>
                        <p className="font-medium">
                          {TEMPLATES.find(t => t.id === selectedTemplate)?.name || 'Not selected'}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground">Email Content:</p>
                      <div className="mt-1 p-3 bg-background rounded border border-border max-h-[150px] overflow-y-auto">
                        <p className="whitespace-pre-line text-sm">{emailContent}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Scores:</p>
                      <div className="space-y-2">
                        {scores.map(score => {
                          const criteria = CRITERIA.find(c => c.id === score.criteriaId);
                          if (!criteria) return null;
                          
                          const scoreColor = 
                            score.score >= 8 ? 'bg-green-500' :
                            score.score >= 6 ? 'bg-amber-500' :
                            'bg-red-500';
                            
                          return (
                            <div key={score.criteriaId} className="flex items-center justify-between">
                              <span className="text-sm">{criteria.name}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-44 h-2 bg-secondary rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full score-bar ${scoreColor}`}
                                    style={{ width: `${score.score * 10}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium w-8 text-right">
                                  {score.score}/10
                                </span>
                              </div>
                            </div>
                          );
                        })}
                        
                        <div className="flex items-center justify-between mt-4 border-t border-border pt-2">
                          <span className="font-medium">Overall Score</span>
                          <span className="font-semibold text-lg">
                            {calculateOverallScore()}/10
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {feedback && (
                      <div>
                        <p className="text-sm text-muted-foreground">Overall Feedback:</p>
                        <p className="mt-1">{feedback}</p>
                      </div>
                    )}
                    
                    {recommendations.filter(r => r.trim() !== '').length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground">Recommendations:</p>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          {recommendations
                            .filter(r => r.trim() !== '')
                            .map((rec, index) => (
                              <li key={index} className="text-sm">
                                {rec}
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                
                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertTitle>Ready to submit?</AlertTitle>
                  <AlertDescription>
                    Please review all scores and feedback before submitting. This quality check will be saved and used for agent performance tracking.
                  </AlertDescription>
                </Alert>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab('feedback')}>
                    Back
                  </Button>
                  <Button onClick={handleSubmit}>
                    Submit Quality Check
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QualityCheckPage;
