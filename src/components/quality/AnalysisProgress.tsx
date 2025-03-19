
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface AnalysisProgressProps {
  isAnalyzing: boolean;
  progress: number;
  stepName: string;
}

/**
 * Component to show analysis progress with better visual feedback
 */
const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ 
  isAnalyzing, 
  progress, 
  stepName 
}) => {
  const { toast } = useToast();
  
  React.useEffect(() => {
    if (progress === 100) {
      toast({
        title: "Analysis Complete",
        description: "Email has been analyzed successfully",
      });
    }
  }, [progress, toast]);
  
  if (!isAnalyzing) return null;
  
  return (
    <div className="p-4 rounded-md border mb-4 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium">Analyzing Email Quality</h4>
        <span className="text-xs text-muted-foreground">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
      <p className="text-xs text-muted-foreground mt-2">
        {stepName}
      </p>
    </div>
  );
};

export default AnalysisProgress;
