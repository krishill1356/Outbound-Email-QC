import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { CRITERIA } from '@/lib/mock-data';
import { Separator } from '@/components/ui/separator';
import { ScoreResult } from '@/types';
import { Save, Loader2, Wand2, AlertCircle, Check, X, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface QCScoreFormProps {
  onSubmit: (scores: ScoreResult[], feedback: string, recommendations: string[], agentName: string) => void;
  isSubmitting: boolean;
  disabled?: boolean;
  email?: any; // The selected email to assess
  onAutoScore?: (email: any) => Promise<{
    scores: ScoreResult[];
    generalFeedback: string;
    recommendations: string[];
    templateAnalysis?: {
      detectedTemplate?: string;
      missingComponents?: string[];
      prohibitedPhrases?: string[];
    };
  }>;
  onTemplateChange?: (template: string) => void;
  initialData?: {
    scores: ScoreResult[];
    generalFeedback: string;
    recommendations: string[];
  };
  isAnalyzing?: boolean;
}

const EMAIL_TEMPLATES = [
  { id: 'air_travel_claim', name: 'Air Travel Claim' },
  { id: 'my_law_matters', name: 'My Law Matters' },
  { id: 'general', name: 'General Response' }
];

const QCScoreForm: React.FC<QCScoreFormProps> = ({ 
  onSubmit, 
  isSubmitting, 
  disabled = false,
  email = null,
  onAutoScore,
  onTemplateChange,
  initialData,
  isAnalyzing = false
}) => {
  const [scores, setScores] = useState<ScoreResult[]>(
    CRITERIA.map(criteria => ({
      criteriaId: criteria.id,
      score: 7, // Default score
      feedback: ''
    }))
  );
  const [generalFeedback, setGeneralFeedback] = useState('');
  const [recommendations, setRecommendations] = useState<string[]>(['']);
  const [isAutoScoring, setIsAutoScoring] = useState(false);
  const [aiAssisted, setAiAssisted] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  // Load initial data when it becomes available
  useEffect(() => {
    if (initialData) {
      setScores(initialData.scores);
      setGeneralFeedback(initialData.generalFeedback);
      
      if (initialData.recommendations.length > 0) {
        setRecommendations(initialData.recommendations);
      }
      
      setAiAssisted(true);
    }
  }, [initialData]);

  // Reset form when email changes
  useEffect(() => {
    if (!email) {
      // Reset form to defaults
      setScores(CRITERIA.map(criteria => ({
        criteriaId: criteria.id,
        score: 7,
        feedback: ''
      })));
      setGeneralFeedback('');
      setRecommendations(['']);
      setAiAssisted(false);
      setSelectedTemplate('');
    }
  }, [email]);

  const handleScoreChange = (criteriaId: string, score: number) => {
    setScores(prev => 
      prev.map(item => 
        item.criteriaId === criteriaId ? { ...item, score } : item
      )
    );
  };

  const handleFeedbackChange = (criteriaId: string, feedback: string) => {
    setScores(prev => 
      prev.map(item => 
        item.criteriaId === criteriaId ? { ...item, feedback } : item
      )
    );
  };

  const addRecommendation = () => {
    setRecommendations([...recommendations, '']);
  };

  const updateRecommendation = (index: number, value: string) => {
    const newRecommendations = [...recommendations];
    newRecommendations[index] = value;
    setRecommendations(newRecommendations);
  };

  const removeRecommendation = (index: number) => {
    setRecommendations(recommendations.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const filteredRecommendations = recommendations.filter(r => r.trim() !== '');
    onSubmit(scores, generalFeedback, filteredRecommendations, email?.agentName || 'Unknown Agent');
  };

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template);
    if (onTemplateChange) {
      onTemplateChange(template);
    }
  };

  const handleAutoScore = async () => {
    if (!email || !onAutoScore) return;
    
    setIsAutoScoring(true);
    
    try {
      const result = await onAutoScore(email);
      
      setScores(result.scores);
      setGeneralFeedback(result.generalFeedback);
      
      // Convert recommendations array to the form state format
      if (result.recommendations.length > 0) {
        setRecommendations(result.recommendations);
      }
      
      // Set detected template if available
      if (result.templateAnalysis?.detectedTemplate) {
        setSelectedTemplate(result.templateAnalysis.detectedTemplate);
        if (onTemplateChange) {
          onTemplateChange(result.templateAnalysis.detectedTemplate);
        }
      }
      
      setAiAssisted(true);
    } catch (error) {
      console.error('Auto-scoring failed:', error);
    } finally {
      setIsAutoScoring(false);
    }
  };

  // Calculate overall score as weighted average
  const overallScore = scores.reduce((total, score) => {
    const criteria = CRITERIA.find(c => c.id === score.criteriaId);
    return total + (score.score * (criteria?.weight || 0.2));
  }, 0).toFixed(1);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="flex items-center gap-2">
              Quality Assessment
              {aiAssisted && <Badge variant="secondary" className="ml-2">AI Assisted</Badge>}
            </span>
            {email && email.agentName && (
              <div className="flex items-center mt-1 text-sm font-normal text-muted-foreground">
                <User className="h-3.5 w-3.5 mr-1" />
                {email.agentName}
              </div>
            )}
          </div>
          <span className="text-3xl font-bold">{overallScore}/10</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 overflow-y-auto max-h-[600px] pr-2">
        {isAnalyzing && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Analyzing email content...</span>
          </div>
        )}
        
        {email && (
          <div className="space-y-2">
            <Label htmlFor="template-select">Email Template</Label>
            <Select 
              value={selectedTemplate} 
              onValueChange={handleTemplateChange}
              disabled={disabled || isSubmitting}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                {EMAIL_TEMPLATES.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {email && onAutoScore && (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleAutoScore}
            disabled={disabled || isSubmitting || isAutoScoring}
          >
            {isAutoScoring ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Email...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Auto-Score with AI
              </>
            )}
          </Button>
        )}
        
        {CRITERIA.map(criteria => (
          <div key={criteria.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor={`score-${criteria.id}`} className="font-medium">
                {criteria.name}
              </Label>
              <span className="text-xl font-bold">
                {scores.find(s => s.criteriaId === criteria.id)?.score || 0}/10
              </span>
            </div>
            <Slider
              id={`score-${criteria.id}`}
              min={0}
              max={10}
              step={1}
              value={[scores.find(s => s.criteriaId === criteria.id)?.score || 0]}
              onValueChange={([value]) => handleScoreChange(criteria.id, value)}
              disabled={disabled || isSubmitting}
            />
            <Textarea
              placeholder={`Feedback on ${criteria.name.toLowerCase()}`}
              className="h-20 resize-none"
              value={scores.find(s => s.criteriaId === criteria.id)?.feedback || ''}
              onChange={(e) => handleFeedbackChange(criteria.id, e.target.value)}
              disabled={disabled || isSubmitting}
            />
            <p className="text-sm text-muted-foreground">{criteria.description}</p>
          </div>
        ))}

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="general-feedback" className="font-medium">General Feedback</Label>
          <Textarea
            id="general-feedback"
            placeholder="Provide overall feedback for the agent"
            className="h-32 resize-none"
            value={generalFeedback}
            onChange={(e) => setGeneralFeedback(e.target.value)}
            disabled={disabled || isSubmitting || isAutoScoring}
          />
        </div>

        <div className="space-y-3">
          <Label className="font-medium">Recommendations</Label>
          {recommendations.map((rec, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Add recommendation for improvement"
                value={rec}
                onChange={(e) => updateRecommendation(index, e.target.value)}
                disabled={disabled || isSubmitting || isAutoScoring}
              />
              {recommendations.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeRecommendation(index)}
                  disabled={disabled || isSubmitting || isAutoScoring}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              {index === recommendations.length - 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addRecommendation}
                  disabled={disabled || isSubmitting || isAutoScoring}
                >
                  <Check className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleSubmit}
          disabled={disabled || isSubmitting || isAutoScoring}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Submit Quality Assessment
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QCScoreForm;
