
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown,
  Mail,
  Building,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  BarChart,
  Trash,
  AlertCircle
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AddAgentDialog from '@/components/agents/AddAgentDialog';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Agent } from '@/types';
import { getAgents, removeAgent } from '@/services/agentService';
import { getPerformanceData } from '@/services/qualityCheckService';

const Agents = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [performanceData, setPerformanceData] = useState(getPerformanceData());
  const { toast } = useToast();
  
  // Load agents on component mount
  useEffect(() => {
    loadAgents();
  }, []);
  
  const loadAgents = () => {
    setAgents(getAgents());
    setPerformanceData(getPerformanceData());
  };
  
  // Find agent performance data and merge with agent data
  const agentsWithPerformance = agents.map(agent => {
    const performance = performanceData.agents.find(a => a.agent?.id === agent.id);
    return {
      ...agent,
      performance: performance ? {
        averageScore: performance.averageScore,
        checksCount: performance.checksCount
      } : { averageScore: 0, checksCount: 0 }
    };
  });
  
  // Filter agents based on search query
  const filteredAgents = agentsWithPerformance.filter(agent => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveAgent = (agentId: string) => {
    const wasRemoved = removeAgent(agentId);
    if (wasRemoved) {
      loadAgents();
      toast({
        title: "Agent Removed",
        description: "The agent has been removed successfully",
      });
    } else {
      toast({
        title: "Error",
        description: "Could not remove the agent",
        variant: "destructive",
      });
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <section className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Agents</h1>
            <p className="text-muted-foreground mt-1">Manage and review customer service agents</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search agents..."
                className="w-full md:w-[240px] pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button variant="outline">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filter
            </Button>
            
            <AddAgentDialog onAgentAdded={loadAgents} />
          </div>
        </div>
      </section>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Agent Directory</CardTitle>
          <CardDescription>
            View and manage your team of customer service agents
          </CardDescription>
        </CardHeader>
        <CardContent>
          {agents.length === 0 ? (
            <div className="p-8 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-3" />
              <h3 className="text-lg font-medium">No agents found</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                There are no agents in the system yet. Add your first agent to get started.
              </p>
              <AddAgentDialog onAgentAdded={loadAgents} />
            </div>
          ) : (
            <div className="rounded-md border">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      <div className="flex items-center space-x-2">
                        <span>Agent</span>
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Department</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Reviews</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      <div className="flex items-center space-x-2">
                        <span>Avg. Score</span>
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                    <th className="h-12 px-4 text-left align-middle font-medium"></th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {filteredAgents.map((agent) => {
                    const scoreColor = 
                      agent.performance.averageScore >= 8 ? 'text-green-500' :
                      agent.performance.averageScore >= 6 ? 'text-amber-500' :
                      agent.performance.averageScore > 0 ? 'text-red-500' :
                      'text-muted-foreground';
                      
                    return (
                      <tr key={agent.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={agent.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.name)}`} alt={agent.name} />
                              <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{agent.name}</div>
                              <div className="text-muted-foreground flex items-center text-xs">
                                <Mail className="h-3 w-3 mr-1" />
                                {agent.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                            {agent.department}
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="font-medium">{agent.performance.checksCount}</div>
                          <div className="text-xs text-muted-foreground">quality checks</div>
                        </td>
                        <td className="p-4 align-middle">
                          {agent.performance.averageScore > 0 ? (
                            <div className={`font-medium ${scoreColor}`}>
                              {Math.round(agent.performance.averageScore)}/10
                            </div>
                          ) : (
                            <div className="text-muted-foreground">No data</div>
                          )}
                        </td>
                        <td className="p-4 align-middle">
                          {agent.performance.averageScore >= 7 ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Good Standing
                            </Badge>
                          ) : agent.performance.averageScore > 0 ? (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                              <XCircle className="h-3 w-3 mr-1" />
                              Needs Training
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                              New
                            </Badge>
                          )}
                        </td>
                        <td className="p-4 align-middle">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <Link to={`/quality-check?agent=${agent.id}`}>
                                <DropdownMenuItem>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  New QC Check
                                </DropdownMenuItem>
                              </Link>
                              <Link to={`/reports?agent=${agent.id}`}>
                                <DropdownMenuItem>
                                  <BarChart className="h-4 w-4 mr-2" />
                                  View Reports
                                </DropdownMenuItem>
                              </Link>
                              <DropdownMenuSeparator />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                    <Trash className="h-4 w-4 mr-2" />
                                    Remove Agent
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently remove {agent.name} and all their quality check records.
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleRemoveAgent(agent.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Remove
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Agents;
