
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { CRITERIA } from '@/lib/mock-data';
import { Separator } from '@/components/ui/separator';
import { ScoreResult } from '@/types';
import { Save, Loader2 } from 'lucide-react';

interface QCScoreFormProps {
  onSubmit: (scores: ScoreResult[], feedback: string, recommendations: string[]) => void;
  isSubmitting: boolean;
  disabled?: boolean;
}

const QCScoreForm: React.FC<QCScoreFormProps> = ({ 
  onSubmit, 
  isSubmitting, 
  disabled = false 
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
    onSubmit(scores, generalFeedback, filteredRecommendations);
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
          <span>Quality Assessment</span>
          <span className="text-3xl font-bold">{overallScore}/10</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 overflow-y-auto max-h-[600px] pr-2">
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
            disabled={disabled || isSubmitting}
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
                disabled={disabled || isSubmitting}
              />
              {recommendations.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeRecommendation(index)}
                  disabled={disabled || isSubmitting}
                >
                  -
                </Button>
              )}
              {index === recommendations.length - 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addRecommendation}
                  disabled={disabled || isSubmitting}
                >
                  +
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
          disabled={disabled || isSubmitting}
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
