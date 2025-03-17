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
import { ScoreResult } from '@/types';
import { format, subDays } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmailContentInput from '@/components/quality/EmailContentInput';

const QualityCheck = () => {
  const { toast } = useToast();
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
  const [activeTab, setActiveTab] = useState('zammad');
  const [templateAnalysis, setTemplateAnalysis] = useState<{
    detectedTemplate?: string;
    missingComponents?: string[];
    prohibitedPhrases?: string[];
  } | undefined>(undefined);

  // Check if Zammad is configured
  useEffect(() => {
    const settings = getZammadSettings();
    setZammadConfigured(!!settings?.apiUrl && !!settings?.apiToken);
    
    if (settings?.apiUrl && settings?.apiToken) {
      loadAgents(settings);
    }
  }, []);

  // Load agents from Zammad
  const loadAgents = async (settings: any) => {
    try {
      const agentList = await fetchAgents(settings);
      setAgents(agentList);
    } catch (error) {
      console.error('Failed to load agents:', error);
    }
  };

  // Filter emails when search query changes
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

  // Calculate date range based on selection
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

  // Fetch emails from Zammad API
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

  // Handle QC form submission
  const handleQCSubmit = (scores: ScoreResult[], feedback: string, recommendations: string[]) => {
    if (!selectedEmail) return;
    
    setIsSubmittingQC(true);
    
    // In a real implementation, this would save to a database
    // For now, just simulate the API call
    setTimeout(() => {
      setIsSubmittingQC(false);
      toast({
        title: "Quality Check Saved",
        description: `Assessment for ticket #${selectedEmail.ticketNumber} has been saved successfully.`,
      });
      
      // Clear selection to allow for next assessment
      setSelectedEmail(null);
    }, 1000);
    
    console.log('QC Submission:', { 
      emailId: selectedEmail.id,
      ticketId: selectedEmail.ticketId,
      agentId: selectedEmail.agentId,
      scores, 
      feedback, 
      recommendations 
    });
  };

  // Handle auto-scoring of emails with added template analysis
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
      const result = await analyzeEmailContent(email, templateResults);
      
      toast({
        title: "AI Analysis Complete",
        description: "Email has been analyzed and scored by AI.",
      });
      
      return result;
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

  // Handle pasted email content
  const handlePastedEmail = async (emailContent: string, subject: string) => {
    // Create a synthetic email object
    const pastedEmail: ZammadEmail = {
      id: `pasted-${Date.now()}`,
      ticketId: 0,
      ticketNumber: 0,
      subject,
      body: emailContent,
      from: "Pasted Email",
      to: "QC Tool",
      agentId: "manual",
      agentName: "Manual Input",
      createdAt: new Date().toISOString()
    };

    setSelectedEmail(pastedEmail);
    
    // Analyze the template
    try {
      const templateResults = await analyzeEmailTemplate(emailContent);
      setTemplateAnalysis(templateResults);
      
      toast({
        title: "Email Loaded",
        description: "Email content has been loaded for analysis.",
      });
    } catch (error) {
      console.error('Template analysis error:', error);
      setTemplateAnalysis(undefined);
    }
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
                  onClick={() => window.location.href = '/settings'}
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
          disabled={!selectedEmail}
          email={selectedEmail}
          onAutoScore={handleAutoScore}
        />
      </div>
    </motion.div>
  );
};

export default QualityCheck;
