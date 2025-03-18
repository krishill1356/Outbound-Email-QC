
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Search, RefreshCw, AlertCircle } from 'lucide-react';
import Logo from '@/components/common/Logo';
import QCEmailViewer from '@/components/quality/QCEmailViewer';
import QCScoreForm from '@/components/quality/QCScoreForm';
import { ZammadEmail, fetchEmails, getZammadSettings, fetchAgents } from '@/services/zammadService';
import { analyzeEmailContent } from '@/services/aiScoringService';
import { analyzeEmailTemplate } from '@/services/templateAnalysisService';
import { ScoreResult, QualityCheck } from '@/types';
import { format, subDays } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmailContentInput from '@/components/quality/EmailContentInput';
import { saveQualityCheck } from '@/lib/mock-data';
import { useNavigate } from 'react-router-dom';

const QualityCheckPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState<ZammadEmail[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<ZammadEmail | null>(null);
  const [isSubmittingQC, setIsSubmittingQC] = useState(false);
  const [dateRange, setDateRange] = useState('last-7-days');
  const [selectedAgent, setSelectedAgent] = useState('all-agents');
  const [agents, setAgents] = useState<{id: string, name: string}[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmails, setFilteredEmails] = useState<ZammadEmail[]>([]);
  const [zammadConfigured, setZammadConfigured] = useState(false);
  const [activeTab, setActiveTab] = useState('paste');
  const [templateAnalysis, setTemplateAnalysis] = useState<{
    detectedTemplate?: string;
    missingComponents?: string[];
    prohibitedPhrases?: string[];
  } | undefined>(undefined);
  
  // State for AI analysis results
  const [aiAnalysisResults, setAiAnalysisResults] = useState<{
    scores: ScoreResult[];
    generalFeedback: string;
    recommendations: string[];
  } | null>(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const settings = getZammadSettings();
    setZammadConfigured(!!settings?.apiUrl && !!settings?.apiToken);
    
    if (settings?.apiUrl && settings?.apiToken) {
      loadAgents(settings);
    }
  }, []);

  const loadAgents = async (settings: any) => {
    try {
      const agentList = await fetchAgents(settings);
      setAgents(agentList);
    } catch (error) {
      console.error('Failed to load agents:', error);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredEmails(emails);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = emails.filter(email => 
      email.subject.toLowerCase().includes(query) ||
      email.ticketNumber.toString().includes(query) ||
      email.from.toLowerCase().includes(query) ||
      email.to.toLowerCase().includes(query) ||
      email.agentName.toLowerCase().includes(query)
    );
    
    setFilteredEmails(filtered);
  }, [searchQuery, emails]);

  // Automatically analyze email when selected
  useEffect(() => {
    if (selectedEmail) {
      analyzeSelectedEmail(selectedEmail);
    } else {
      // Reset analysis when no email is selected
      setTemplateAnalysis(undefined);
      setAiAnalysisResults(null);
    }
  }, [selectedEmail]);

  // Function to analyze the selected email
  const analyzeSelectedEmail = async (email: ZammadEmail) => {
    setIsAnalyzing(true);
    
    try {
      // Analyze template
      const templateResults = await analyzeEmailTemplate(email.body);
      setTemplateAnalysis(templateResults);
      
      // Analyze content with AI
      const aiResults = await analyzeEmailContent(email);
      setAiAnalysisResults(aiResults);
      
      toast({
        title: "Analysis Complete",
        description: "Email has been automatically analyzed",
      });
    } catch (error) {
      console.error('Email analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze email content",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getDateRange = () => {
    const today = new Date();
    let fromDate;
    
    switch (dateRange) {
      case 'today':
        fromDate = today;
        break;
      case 'yesterday':
        fromDate = subDays(today, 1);
        break;
      case 'last-7-days':
        fromDate = subDays(today, 7);
        break;
      case 'last-30-days':
        fromDate = subDays(today, 30);
        break;
      default:
        fromDate = subDays(today, 7);
    }
    
    return {
      from: format(fromDate, 'yyyy-MM-dd'),
      to: format(today, 'yyyy-MM-dd')
    };
  };

  const handleFetchEmails = async () => {
    const settings = getZammadSettings();
    
    if (!settings?.apiUrl || !settings?.apiToken) {
      toast({
        title: "Zammad Not Configured",
        description: "Please set up Zammad integration in Settings first.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    setEmails([]);
    setSelectedEmail(null);
    
    try {
      const { from, to } = getDateRange();
      const agentId = selectedAgent !== 'all-agents' ? selectedAgent : undefined;
      
      const emailData = await fetchEmails(settings, from, to, agentId);
      
      setEmails(emailData);
      setFilteredEmails(emailData);
      
      if (emailData.length === 0) {
        toast({
          title: "No Emails Found",
          description: `No agent emails found for the selected date range and filters.`,
        });
      } else {
        toast({
          title: "Emails Loaded",
          description: `Successfully loaded ${emailData.length} emails.`,
        });
      }
    } catch (error) {
      console.error('Failed to fetch emails:', error);
      toast({
        title: "Error Loading Emails",
        description: "Failed to fetch emails from Zammad. Check your settings and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQCSubmit = (scores: ScoreResult[], feedback: string, recommendations: string[], agentName: string) => {
    if (!selectedEmail) return;
    
    setIsSubmittingQC(true);
    
    try {
      // Calculate overall score using the weights from criteria
      const overallScore = Math.round(scores.reduce((total, score) => {
        const criteria = scores.find(s => s.criteriaId === score.criteriaId);
        return total + (score.score * 0.25); // Equal 25% weight for all criteria
      }, 0));
      
      // Create new quality check record
      const newQualityCheck: QualityCheck = {
        id: `qc-${Date.now()}`,
        agentId: selectedEmail.agentId || 'unknown',
        agentName: agentName,
        emailId: selectedEmail.id,
        emailSubject: selectedEmail.subject,
        reviewerId: 'current-user', // In a real app, this would be the current user's ID
        date: new Date().toISOString(),
        emailContent: selectedEmail.body,
        scores: scores,
        overallScore: overallScore,
        feedback: feedback,
        recommendations: recommendations,
        status: 'completed'
      };
      
      // Save the quality check
      saveQualityCheck(newQualityCheck);
      
      toast({
        title: "Quality Check Saved",
        description: `Assessment for ${agentName}'s email has been saved successfully.`,
      });
      
      // Navigate to reports page to show the saved assessment
      setTimeout(() => {
        navigate('/reports');
      }, 1500);
    } catch (error) {
      console.error('Error saving quality check:', error);
      toast({
        title: "Error Saving Assessment",
        description: "Failed to save the quality assessment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmittingQC(false);
      // Clear selection to allow for next assessment
      setSelectedEmail(null);
    }
  };

  const handleAutoScore = async (email: ZammadEmail) => {
    if (!email) {
      toast({
        title: "No Email Selected",
        description: "Please select an email to analyze.",
        variant: "destructive"
      });
      throw new Error("No email selected");
    }
    
    try {
      // First analyze the template
      const templateResults = await analyzeEmailTemplate(email.body);
      setTemplateAnalysis(templateResults);
      
      // Then use AI service to analyze the email
      const result = await analyzeEmailContent(email);
      setAiAnalysisResults(result);
      
      toast({
        title: "AI Analysis Complete",
        description: "Email has been analyzed and scored by AI.",
      });
      
      return {
        ...result,
        templateAnalysis
      };
    } catch (error) {
      console.error('Auto-scoring error:', error);
      toast({
        title: "AI Analysis Failed",
        description: "Unable to automatically analyze this email. Try manual scoring.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const handlePastedEmail = async (emailContent: string, subject: string, agentName: string) => {
    // Create a synthetic email object
    const pastedEmail: ZammadEmail = {
      id: `pasted-${Date.now()}`,
      ticketId: "0", 
      ticketNumber: "0", 
      subject,
      body: emailContent,
      from: "Pasted Email",
      to: "QC Tool",
      agentId: "manual",
      agentName: agentName, // Use the provided agent name
      createdAt: new Date().toISOString()
    };

    setSelectedEmail(pastedEmail);
    // Analyze the template and content automatically
    // The useEffect will trigger the analysis
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="paste">Paste Email</TabsTrigger>
          <TabsTrigger value="zammad">Zammad Import</TabsTrigger>
        </TabsList>
        
        <TabsContent value="paste" className="mt-4">
          <EmailContentInput onSubmit={handlePastedEmail} />
        </TabsContent>
        
        <TabsContent value="zammad" className="mt-4">
          {!zammadConfigured && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Zammad Integration Not Configured</AlertTitle>
              <AlertDescription>
                You need to configure your Zammad integration before you can fetch emails.
                <Button 
                  variant="outline" 
                  className="ml-2"
                  onClick={() => navigate('/settings')}
                >
                  Go to Settings
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Email Selection</CardTitle>
              <CardDescription>
                Select emails to perform quality assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Select 
                    defaultValue="last-7-days"
                    onValueChange={setDateRange}
                    value={dateRange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="yesterday">Yesterday</SelectItem>
                      <SelectItem value="last-7-days">Last 7 days</SelectItem>
                      <SelectItem value="last-30-days">Last 30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Select 
                    defaultValue="all-agents"
                    onValueChange={setSelectedAgent}
                    value={selectedAgent}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select agent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-agents">All Agents</SelectItem>
                      {agents.map(agent => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.name}
                        </SelectItem>
                      ))}
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
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="shrink-0"
                    onClick={handleFetchEmails}
                    disabled={isLoading || !zammadConfigured}
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>
              
              {filteredEmails.length === 0 ? (
                <div className="mt-6 text-center p-8 border border-dashed rounded-lg">
                  <p className="text-muted-foreground">
                    {isLoading 
                      ? 'Loading emails...' 
                      : zammadConfigured 
                        ? 'No emails found. Use the controls above to fetch emails.' 
                        : 'Connect to Zammad in Settings to import emails.'}
                  </p>
                  {!zammadConfigured && (
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => window.location.href = '/settings'}
                    >
                      Go to Settings
                    </Button>
                  )}
                </div>
              ) : (
                <div className="mt-6 space-y-2 max-h-96 overflow-y-auto">
                  {filteredEmails.map(email => (
                    <div 
                      key={email.id}
                      className={`p-3 border rounded-md cursor-pointer transition-colors ${
                        selectedEmail?.id === email.id 
                          ? 'bg-primary/10 border-primary/30' 
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => setSelectedEmail(email)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-base truncate">{email.subject}</h4>
                        <span className="text-xs text-muted-foreground">#{email.ticketNumber}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                          Agent: {email.agentName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(email.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QCEmailViewer email={selectedEmail} templateAnalysis={templateAnalysis} />
        <QCScoreForm 
          onSubmit={handleQCSubmit} 
          isSubmitting={isSubmittingQC} 
          disabled={!selectedEmail || isAnalyzing}
          email={selectedEmail}
          onAutoScore={handleAutoScore}
          initialData={aiAnalysisResults || undefined}
          isAnalyzing={isAnalyzing}
        />
      </div>
    </motion.div>
  );
};

export default QualityCheckPage;
