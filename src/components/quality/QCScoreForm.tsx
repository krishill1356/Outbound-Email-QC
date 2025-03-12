
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { CRITERIA } from '@/lib/mock-data';
import { ScoreResult } from '@/types';
import { Save } from 'lucide-react';

interface QCScoreFormProps {
  onSubmit: (scores: ScoreResult[], feedback: string, recommendations: string[]) => void;
  isSubmitting?: boolean;
}

const QCScoreForm: React.FC<QCScoreFormProps> = ({ onSubmit, isSubmitting = false }) => {
  const [scores, setScores] = useState<ScoreResult[]>(
    CRITERIA.map(criteria => ({
      criteriaId: criteria.id,
      score: 7, // Default starting score
      feedback: ''
    }))
  );
  const [overallFeedback, setOverallFeedback] = useState('');
  const [recommendations, setRecommendations] = useState('');

  const handleScoreChange = (criteriaId: string, score: number) => {
    setScores(prev => prev.map(item => 
      item.criteriaId === criteriaId ? { ...item, score } : item
    ));
  };

  const handleFeedbackChange = (criteriaId: string, feedback: string) => {
    setScores(prev => prev.map(item => 
      item.criteriaId === criteriaId ? { ...item, feedback } : item
    ));
  };

  const handleSubmit = () => {
    const recommendationList = recommendations
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0);
      
    onSubmit(scores, overallFeedback, recommendationList);
  };

  // Calculate overall score
  const overallScore = scores.length 
    ? (scores.reduce((sum, item) => sum + item.score, 0) / scores.length).toFixed(1) 
    : '0.0';

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Quality Assessment</span>
          <span className="text-2xl font-bold">{overallScore}/10</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto">
        {CRITERIA.map((criteria) => {
          const scoreItem = scores.find(s => s.criteriaId === criteria.id);
          const currentScore = scoreItem?.score || 0;
          
          return (
            <div key={criteria.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="font-medium">{criteria.name}</Label>
                <span className="font-bold">{currentScore}/10</span>
              </div>
              <p className="text-sm text-muted-foreground">{criteria.description}</p>
              
              <Slider
                defaultValue={[currentScore]}
                max={10}
                step={1}
                value={[currentScore]}
                onValueChange={(value) => handleScoreChange(criteria.id, value[0])}
              />
              
              <Textarea 
                placeholder={`Feedback for ${criteria.name}...`}
                value={scoreItem?.feedback || ''}
                onChange={(e) => handleFeedbackChange(criteria.id, e.target.value)}
                className="h-24"
              />
            </div>
          );
        })}
        
        <div className="space-y-3">
          <Label className="font-medium">Overall Feedback</Label>
          <Textarea 
            placeholder="Provide overall feedback on the email quality..."
            value={overallFeedback}
            onChange={(e) => setOverallFeedback(e.target.value)}
            className="h-32"
          />
        </div>
        
        <div className="space-y-3">
          <Label className="font-medium">Recommendations</Label>
          <p className="text-sm text-muted-foreground">Enter each recommendation on a new line</p>
          <Textarea 
            placeholder="Enter recommendations for improvement..."
            value={recommendations}
            onChange={(e) => setRecommendations(e.target.value)}
            className="h-32"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Quality Assessment
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QCScoreForm;
