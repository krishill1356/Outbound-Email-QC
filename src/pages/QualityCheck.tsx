
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Search, RefreshCw } from 'lucide-react';
import Logo from '@/components/common/Logo';
import QCEmailViewer from '@/components/quality/QCEmailViewer';
import QCScoreForm from '@/components/quality/QCScoreForm';
import { ZammadEmail } from '@/services/zammadService';
import { ScoreResult } from '@/types';

const QualityCheck = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState<ZammadEmail[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<ZammadEmail | null>(null);
  const [isSubmittingQC, setIsSubmittingQC] = useState(false);

  // This would fetch emails from Zammad in a real implementation
  const handleFetchEmails = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "No Emails Found",
        description: "Please set up Zammad integration in Settings first.",
      });
    }, 1000);
  };

  const handleQCSubmit = (scores: ScoreResult[], feedback: string, recommendations: string[]) => {
    setIsSubmittingQC(true);
    
    // Simulate submission
    setTimeout(() => {
      setIsSubmittingQC(false);
      toast({
        title: "Quality Check Saved",
        description: "Assessment has been saved successfully.",
      });
    }, 1000);
    
    console.log('QC Submission:', { scores, feedback, recommendations });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <section className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Quality Check</h1>
            <p className="text-muted-foreground mt-1">Assess agent email quality</p>
          </div>
          <Logo size="medium" />
        </div>
      </section>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Email Selection</CardTitle>
          <CardDescription>
            Select emails to perform quality assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Select defaultValue="last-7-days">
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="last-7-days">Last 7 days</SelectItem>
                  <SelectItem value="last-30-days">Last 30 days</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select defaultValue="all-agents">
                <SelectTrigger>
                  <SelectValue placeholder="Select agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-agents">All Agents</SelectItem>
                  {/* Would be populated from Zammad data */}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by ticket #, subject..."
                  className="pl-8"
                />
              </div>
              
              <Button 
                variant="outline" 
                className="shrink-0"
                onClick={handleFetchEmails}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          
          {emails.length === 0 ? (
            <div className="mt-6 text-center p-8 border border-dashed rounded-lg">
              <p className="text-muted-foreground">
                No emails found. Connect to Zammad in Settings to import emails.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.href = '/settings'}
              >
                Go to Settings
              </Button>
            </div>
          ) : (
            <div className="mt-6">
              {/* Email list would go here */}
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QCEmailViewer email={selectedEmail} />
        <QCScoreForm onSubmit={handleQCSubmit} isSubmitting={isSubmittingQC} />
      </div>
    </motion.div>
  );
};

export default QualityCheck;
