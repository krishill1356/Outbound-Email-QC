
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar,
  Cell,
  Legend
} from 'recharts';
import { format, subDays } from 'date-fns';
import { AlertCircle, BarChart3, DownloadIcon, ChevronRight, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getQualityChecks } from '@/services/qualityCheckService';
import { getPerformanceData, CRITERIA } from '@/services/reports/performanceDataService';
import { getAgents } from '@/services/agentService';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ScoreDistributionPie from '@/components/reports/ScoreDistributionPie';

const Reports = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialAgentId = searchParams.get('agent') || 'all';
  
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '14d' | '30d' | '90d'>('30d');
  const [selectedAgent, setSelectedAgent] = useState(initialAgentId);
  const [agents, setAgents] = useState(getAgents());
  const [performanceData, setPerformanceData] = useState(getPerformanceData(selectedAgent !== 'all' ? selectedAgent : undefined));
  const [qualityChecks, setQualityChecks] = useState(getQualityChecks());
  
  // Update performance data when agent selection changes
  useEffect(() => {
    setPerformanceData(getPerformanceData(selectedAgent !== 'all' ? selectedAgent : undefined));
  }, [selectedAgent]);
  
  const handleExportReport = () => {
    toast({
      title: "Report Exported",
      description: "The report has been exported to CSV",
      variant: "success",
    });
  };
  
  const generateDateRangeLabel = () => {
    const today = new Date();
    let fromDate;
    
    switch (selectedPeriod) {
      case '7d':
        fromDate = subDays(today, 7);
        break;
      case '14d':
        fromDate = subDays(today, 14);
        break;
      case '30d':
        fromDate = subDays(today, 30);
        break;
      case '90d':
        fromDate = subDays(today, 90);
        break;
      default:
        fromDate = subDays(today, 30);
    }
    
    return `${format(fromDate, 'MMM d, yyyy')} - ${format(today, 'MMM d, yyyy')}`;
  };
  
  // Overall performance chart data
  const overallChartData = performanceData.overall.map((item: any) => ({
    date: new Date(item.date).toLocaleDateString(),
    score: item.average
  }));
  
  // Calculate criteria averages
  const criteriaAverages = CRITERIA.map(criteria => {
    const allScores = qualityChecks.flatMap(check => {
      if (selectedAgent !== 'all' && check.agentId !== selectedAgent) {
        return [];
      }
      
      const score = check.scores.find(s => s.criteriaId === criteria.id);
      return score ? [score.score] : [];
    });
    
    const average = allScores.length > 0
      ? allScores.reduce((sum, score) => sum + score, 0) / allScores.length
      : 0;
      
    return {
      id: criteria.id,
      name: criteria.name,
      average: parseFloat(average.toFixed(1)),
      fill: criteria.id === 'tone' ? '#8884d8' : 
             criteria.id === 'clarity' ? '#82ca9d' : 
             criteria.id === 'spelling-grammar' ? '#ffc658' : 
             '#ff8042'
    };
  });
  
  // Create data for the agent comparison chart
  const agentComparisonData = performanceData.agents.map((agentData: any) => ({
    name: agentData.agent.name.split(' ')[0],
    score: parseFloat(agentData.averageScore.toFixed(1)),
    fill: agentData.averageScore >= 8 ? '#4ade80' : 
          agentData.averageScore >= 6 ? '#facc15' : 
          '#f87171'
  }));
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto py-8 px-4"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Quality Reports</h1>
          <p className="text-muted-foreground">
            {generateDateRangeLabel()}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          <div className="flex items-center rounded-md border">
            {['7d', '14d', '30d', '90d'].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "ghost"}
                className="rounded-none first:rounded-l-md last:rounded-r-md"
                onClick={() => setSelectedPeriod(period as any)}
              >
                {period === '7d' ? '7 days' : 
                 period === '14d' ? '14 days' : 
                 period === '30d' ? '30 days' : 
                 '90 days'}
              </Button>
            ))}
          </div>
          
          <Select value={selectedAgent} onValueChange={setSelectedAgent}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Select Agent" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Agents</SelectItem>
              {agents.map(agent => (
                <SelectItem key={agent.id} value={agent.id}>
                  {agent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={handleExportReport}>
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="agent">Agent Performance</TabsTrigger>
          <TabsTrigger value="criteria">Quality Criteria</TabsTrigger>
          <TabsTrigger value="reviews">Recent Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Average Score</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {performanceData.overall.length > 0 
                        ? (performanceData.overall.reduce((acc: number, curr: any) => acc + curr.average, 0) / performanceData.overall.length).toFixed(1)
                        : 0}
                      <span className="text-sm text-muted-foreground">/10</span>
                    </h3>
                  </div>
                  <div className="bg-primary/10 text-primary p-3 rounded-full">
                    <BarChart3 size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Reviews</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {performanceData.overall.length}
                    </h3>
                  </div>
                  <div className="bg-primary/10 text-primary p-3 rounded-full">
                    <AlertCircle size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Agents</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {performanceData.agents.length}
                    </h3>
                  </div>
                  <div className="bg-primary/10 text-primary p-3 rounded-full">
                    <AlertCircle size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Low Performers</p>
                    <h3 className="text-2xl font-bold mt-1">
                      {performanceData.agents.filter((a: any) => a.averageScore < 7).length}
                    </h3>
                  </div>
                  <div className="bg-primary/10 text-primary p-3 rounded-full">
                    <AlertCircle size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Overall Score Trend</CardTitle>
                <CardDescription>Average quality score over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {overallChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={overallChartData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="score"
                          stroke="#8884d8"
                          fillOpacity={1}
                          fill="url(#colorScore)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">No data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Score Distribution</CardTitle>
                <CardDescription>Quality scores breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  {qualityChecks.length > 0 ? (
                    <ScoreDistributionPie 
                      data={qualityChecks.filter(check => selectedAgent === 'all' || check.agentId === selectedAgent)} 
                    />
                  ) : (
                    <p className="text-muted-foreground">No data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quality Criteria Breakdown</CardTitle>
                <CardDescription>Average scores by criteria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {criteriaAverages.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={criteriaAverages}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="average" name="Average Score">
                          {criteriaAverages.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">No data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Agent Performance</CardTitle>
                <CardDescription>Average scores by agent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {agentComparisonData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={agentComparisonData}
                        layout="vertical"
                        margin={{
                          top: 5,
                          right: 30,
                          left: 40,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" domain={[0, 10]} />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip />
                        <Bar dataKey="score" name="Average Score">
                          {agentComparisonData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">No data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="agent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agent Performance Details</CardTitle>
              <CardDescription>
                Detailed quality scores by agent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {performanceData.agents.length > 0 ? (
                  performanceData.agents.map((agentData: any) => {
                    const scoreColor = 
                      agentData.averageScore >= 8 ? 'text-green-500' :
                      agentData.averageScore >= 6 ? 'text-amber-500' :
                      'text-red-500';
                    
                    return (
                      <div key={agentData.agent.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                              <img 
                                src={agentData.agent.avatar} 
                                alt={agentData.agent.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium text-lg">{agentData.agent.name}</h3>
                              <div className="text-sm text-muted-foreground">
                                {agentData.agent.department} • {agentData.checksCount} reviews
                              </div>
                            </div>
                          </div>
                          <div className={`text-2xl font-bold ${scoreColor}`}>
                            {agentData.averageScore.toFixed(1)}/10
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          {agentData.criteriaBreakdown.map((criteria: any) => (
                            <div key={criteria.criteriaId} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{criteria.name}</span>
                                <span className="font-medium">{criteria.average.toFixed(1)}/10</span>
                              </div>
                              <Progress value={criteria.average * 10} className="h-2" />
                            </div>
                          ))}
                        </div>
                        
                        <div className="pt-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => navigate(`/reports?agent=${agentData.agent.id}`)}
                          >
                            View Details
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No agent data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="criteria" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CRITERIA.map(criteria => (
              <Card key={criteria.id}>
                <CardHeader>
                  <CardTitle>{criteria.name}</CardTitle>
                  <CardDescription>{criteria.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Average Score</span>
                      <span className="text-2xl font-bold">
                        {criteriaAverages.find(c => c.id === criteria.id)?.average || 0}/10
                      </span>
                    </div>
                    <Progress 
                      value={(criteriaAverages.find(c => c.id === criteria.id)?.average || 0) * 10} 
                      className="h-2" 
                    />
                    
                    <h4 className="font-medium mt-6">Agent Performance</h4>
                    <div className="space-y-2">
                      {performanceData.agents.map((agentData: any) => {
                        const criteriaScore = agentData.criteriaBreakdown.find(
                          (c: any) => c.criteriaId === criteria.id
                        );
                        
                        const scoreColor = 
                          criteriaScore.average >= 8 ? 'text-green-500' :
                          criteriaScore.average >= 6 ? 'text-amber-500' :
                          'text-red-500';
                        
                        return (
                          <div key={agentData.agent.id} className="flex justify-between items-center">
                            <span>{agentData.agent.name}</span>
                            <span className={`font-medium ${scoreColor}`}>
                              {criteriaScore.average.toFixed(1)}/10
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="reviews" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Quality Checks</CardTitle>
              <CardDescription>
                Latest quality assessments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {qualityChecks.length > 0 ? (
                    qualityChecks
                      .filter(check => selectedAgent === 'all' || check.agentId === selectedAgent)
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map(check => {
                        const scoreColor = 
                          check.overallScore >= 8 ? 'bg-green-100 text-green-800 border-green-200' :
                          check.overallScore >= 6 ? 'bg-amber-100 text-amber-800 border-amber-200' :
                          'bg-red-100 text-red-800 border-red-200';
                        
                        return (
                          <div key={check.id} className="border rounded-md p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-medium">{check.emailSubject}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {check.agentName} • {new Date(check.date).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge 
                                variant="outline" 
                                className={scoreColor}
                              >
                                {check.overallScore}/10
                              </Badge>
                            </div>
                            
                            <div className="mt-3 space-y-2">
                              <h4 className="text-sm font-medium">Criteria Scores:</h4>
                              <div className="grid grid-cols-2 gap-2">
                                {check.scores.map(score => {
                                  const criteria = CRITERIA.find(c => c.id === score.criteriaId);
                                  
                                  const scoreColor = 
                                    score.score >= 8 ? 'text-green-600' :
                                    score.score >= 6 ? 'text-amber-600' :
                                    'text-red-600';
                                  
                                  return (
                                    <div key={score.criteriaId} className="flex justify-between">
                                      <span className="text-sm">{criteria?.name || score.criteriaId}</span>
                                      <span className={`text-sm font-medium ${scoreColor}`}>
                                        {score.score}/10
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                            
                            {check.feedback && (
                              <div className="mt-3">
                                <h4 className="text-sm font-medium">Feedback:</h4>
                                <p className="text-sm mt-1">{check.feedback}</p>
                              </div>
                            )}
                          </div>
                        );
                      })
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No quality checks available</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Reports;
