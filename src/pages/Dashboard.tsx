
import { useState, useEffect } from 'react';
import {
  BarChart3,
  CheckCircle,
  Users,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getAgents } from '@/services/agentService';
import { getQualityChecks } from '@/services/storage/qualityCheckStorageService';
import { getPerformanceData, CRITERIA } from '@/services/reports/performanceDataService';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '14d' | '30d'>('7d');
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const [lowPerformers, setLowPerformers] = useState<number>(0);
  const [agents] = useState(getAgents());
  
  // Update dashboard data when needed
  useEffect(() => {
    // Get quality checks from service
    const qualityChecks = getQualityChecks();
    setTotalReviews(qualityChecks.length);
    
    // Calculate average score
    const avgScore = totalReviews > 0 
      ? Math.round(qualityChecks.reduce((sum, check) => sum + check.overallScore, 0) / totalReviews)
      : 0;
    setAverageScore(avgScore);
    
    // Get performance data from service
    const perfData = getPerformanceData();
    setPerformanceData(perfData);
    
    // Calculate low performers
    if (perfData && perfData.agents) {
      const lowPerfs = perfData.agents.filter((agent: any) => agent.averageScore < 7);
      setLowPerformers(lowPerfs.length);
    }
  }, [totalReviews]);
  
  // Filter data based on selected period
  const filterDataByPeriod = (data: any[]) => {
    if (!data || data.length === 0) return [];
    const days = selectedPeriod === '7d' ? 7 : selectedPeriod === '14d' ? 14 : 30;
    
    const now = new Date();
    const cutoffDate = new Date(now.setDate(now.getDate() - days));
    
    return data.filter(item => new Date(item.date) >= cutoffDate);
  };
  
  const periodFilters = [
    { value: '7d', label: '7 days' },
    { value: '14d', label: '14 days' },
    { value: '30d', label: '30 days' },
  ];
  
  // Format chart data
  const overallChartData = performanceData && performanceData.overall ? 
    filterDataByPeriod(performanceData.overall).map((item: any) => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: item.average
    })) : [];
  
  // Prepare criteria comparison data
  const criteriaComparisonData = performanceData && performanceData.agents ? 
    performanceData.agents.map((agentData: any) => {
      if (!agentData) return null;

      return {
        name: agentData.agent.name.split(' ')[0],
        ...agentData.criteriaBreakdown.reduce((acc: any, criteria: any) => {
          acc[criteria.name] = criteria.average;
          return acc;
        }, {} as Record<string, number>)
      };
    }).filter(Boolean) : [];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <section className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Email quality assessment overview</p>
          </div>
          <Link to="/quality-check">
            <Button className="mt-4 md:mt-0">
              <CheckCircle size={16} className="mr-2" />
              New Quality Check
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-muted-foreground text-sm">Total Reviews</p>
                  <h3 className="text-3xl font-bold mt-1">{totalReviews}</h3>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <CheckCircle size={24} className="text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-muted-foreground text-sm">Average Score</p>
                  <h3 className="text-3xl font-bold mt-1">{averageScore}/10</h3>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <BarChart3 size={24} className="text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-muted-foreground text-sm">Low Performers</p>
                  <h3 className="text-3xl font-bold mt-1">{lowPerformers}</h3>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <AlertCircle size={24} className="text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <section className="mb-8">
        <Card className="glass-card">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-xl">Performance Overview</CardTitle>
                <CardDescription>Average quality score over time</CardDescription>
              </div>
              <div className="inline-flex items-center rounded-md border border-input mt-4 md:mt-0">
                {periodFilters.map((filter) => (
                  <Button
                    key={filter.value}
                    variant={selectedPeriod === filter.value ? "default" : "ghost"}
                    className="rounded-none first:rounded-l-md last:rounded-r-md"
                    onClick={() => setSelectedPeriod(filter.value as any)}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {overallChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={overallChartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#888', fontSize: 12 }}
                    />
                    <YAxis 
                      domain={[0, 10]} 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#888', fontSize: 12 }}
                      ticks={[0, 2, 4, 6, 8, 10]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        border: 'none'
                      }}
                      formatter={(value) => [`${value}/10`, 'Score']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorScore)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>No data available yet. Complete some quality checks to see performance trends.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
      
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-xl">Criteria Comparison</CardTitle>
            <CardDescription>Agent scores by quality criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {criteriaComparisonData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={criteriaComparisonData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" scale="band" axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 10]} axisLine={false} tickLine={false} ticks={[0, 2, 4, 6, 8, 10]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Spelling & Grammar" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Tone" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Clarity" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Structure" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>No data available yet. Complete some quality checks to see criteria comparison.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-xl">Agents Overview</CardTitle>
            <CardDescription>Performance by agent</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceData && performanceData.agents && performanceData.agents.length > 0 ? (
                performanceData.agents.map((agentData: any) => {
                  const scoreColor = 
                    agentData.averageScore >= 8 ? 'text-green-500' :
                    agentData.averageScore >= 6 ? 'text-amber-500' :
                    'text-red-500';
                    
                  return (
                    <div key={agentData.agent.id} className="flex items-center justify-between p-3 rounded-lg bg-background hover:bg-muted/50 transition-colors group">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                          <img 
                            src={agentData.agent.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(agentData.agent.name)}`} 
                            alt={agentData.agent.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{agentData.agent.name}</h4>
                          <p className="text-sm text-muted-foreground">{agentData.checksCount} reviews</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`font-semibold text-lg ${scoreColor}`}>
                          {Math.round(agentData.averageScore)}/10
                        </span>
                        <ChevronRight className="ml-2 w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center">
                  <p className="text-muted-foreground">No agents data available</p>
                  <Link to="/agents" className="mt-2 inline-block">
                    <Button variant="outline" size="sm">Add Agents</Button>
                  </Link>
                </div>
              )}
              
              <div className="text-center mt-4">
                <Link to="/agents">
                  <Button variant="outline" className="w-full">
                    View All Agents
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </motion.div>
  );
};

export default Dashboard;
