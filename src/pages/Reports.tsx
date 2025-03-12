
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar,
  ChevronDown,
  Download
} from 'lucide-react';
import {
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { motion } from 'framer-motion';
import { getPerformanceData, AGENTS, CRITERIA } from '@/lib/mock-data';

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '14d' | '30d'>('30d');
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  
  const performanceData = getPerformanceData();
  const daysToShow = selectedPeriod === '7d' ? 7 : selectedPeriod === '14d' ? 14 : 30;
  
  // Format trend data based on selected period and agent
  const getTrendData = () => {
    if (selectedAgent === 'all') {
      return performanceData.overall
        .slice(-daysToShow)
        .map(item => ({
          date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          score: item.average
        }));
    } else {
      const agentData = performanceData.agents.find(a => a.agent.id === selectedAgent);
      if (!agentData) return [];
      
      return agentData.trend
        .slice(-daysToShow)
        .map(item => ({
          date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          score: item.score
        }));
    }
  };
  
  // Get criteria breakdown for selected agent or overall
  const getCriteriaBreakdown = () => {
    if (selectedAgent === 'all') {
      // Average all agent scores per criteria
      return CRITERIA.map(criteria => {
        const allScores = performanceData.agents.flatMap(agent => 
          agent.criteriaBreakdown.filter(c => c.criteriaId === criteria.id)
        );
        
        const average = allScores.length 
          ? Number((allScores.reduce((sum, item) => sum + item.average, 0) / allScores.length).toFixed(1))
          : 0;
          
        return {
          name: criteria.name,
          score: average,
          fullMark: 10
        };
      });
    } else {
      const agentData = performanceData.agents.find(a => a.agent.id === selectedAgent);
      if (!agentData) return [];
      
      return agentData.criteriaBreakdown.map(c => ({
        name: c.name,
        score: c.average,
        fullMark: 10
      }));
    }
  };
  
  // Get distribution of scores for pie chart
  const getScoreDistribution = () => {
    const distribution = [
      { name: 'Excellent (8-10)', value: 0, color: '#10b981' },
      { name: 'Good (6-7.9)', value: 0, color: '#f59e0b' },
      { name: 'Needs Improvement (0-5.9)', value: 0, color: '#ef4444' }
    ];
    
    let scores = [];
    
    if (selectedAgent === 'all') {
      scores = performanceData.agents.map(a => a.averageScore);
    } else {
      const agentData = performanceData.agents.find(a => a.agent.id === selectedAgent);
      if (agentData) {
        scores = [agentData.averageScore];
      }
    }
    
    scores.forEach(score => {
      if (score >= 8) {
        distribution[0].value++;
      } else if (score >= 6) {
        distribution[1].value++;
      } else {
        distribution[2].value++;
      }
    });
    
    return distribution;
  };
  
  // Get agent comparison data
  const getAgentComparison = () => {
    return performanceData.agents.map(agent => ({
      name: agent.agent.name.split(' ')[0],
      score: agent.averageScore,
      checks: agent.checksCount
    }));
  };
  
  const renderAgentBadge = () => {
    if (selectedAgent === 'all') {
      return <Badge variant="outline" className="ml-2">All Agents</Badge>;
    }
    
    const agent = AGENTS.find(a => a.id === selectedAgent);
    if (!agent) return null;
    
    return <Badge variant="outline" className="ml-2">{agent.name}</Badge>;
  };
  
  const trendData = getTrendData();
  const criteriaData = getCriteriaBreakdown();
  const distributionData = getScoreDistribution();
  const agentComparisonData = getAgentComparison();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <section className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground mt-1">Analyze quality assessment results</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={selectedPeriod} onValueChange={(value: any) => setSelectedPeriod(value)}>
              <SelectTrigger className="w-36">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="14d">Last 14 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger className="w-40">
                <Users className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agents</SelectItem>
                {AGENTS.map(agent => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </section>
      
      <section className="mb-8">
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Performance Trend</CardTitle>
                <CardDescription>
                  Email quality scores over time {renderAgentBadge()}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trendData}
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
            </div>
          </CardContent>
        </Card>
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-xl">Criteria Breakdown</CardTitle>
            <CardDescription>
              Performance by evaluation criteria {renderAgentBadge()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} data={criteriaData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" tick={{ fill: '#888', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-xl">Score Distribution</CardTitle>
            <CardDescription>
              Distribution of quality scores {renderAgentBadge()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [value, 'Count']}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      border: 'none'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>
      
      <section className="mb-8">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-xl">Agent Comparison</CardTitle>
            <CardDescription>Average score comparison across all agents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={agentComparisonData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" scale="band" axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" orientation="left" domain={[0, 10]} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      border: 'none'
                    }}
                  />
                  <Legend />
                  <Bar 
                    yAxisId="left" 
                    dataKey="score" 
                    name="Avg. Score" 
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    yAxisId="right" 
                    dataKey="checks" 
                    name="Reviews Count" 
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>
    </motion.div>
  );
};

export default Reports;
