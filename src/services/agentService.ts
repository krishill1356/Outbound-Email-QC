
import { Agent } from '@/types';

const STORAGE_KEY = 'quality_check_agents';

// Initial agents if none exist in storage
const DEFAULT_AGENTS: Agent[] = [];

/**
 * Get all agents from localStorage
 */
export const getAgents = (): Agent[] => {
  try {
    const agents = localStorage.getItem(STORAGE_KEY);
    return agents ? JSON.parse(agents) : DEFAULT_AGENTS;
  } catch (error) {
    console.error('Error getting agents:', error);
    return DEFAULT_AGENTS;
  }
};

/**
 * Save agents to localStorage
 */
export const saveAgents = (agents: Agent[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(agents));
  } catch (error) {
    console.error('Error saving agents:', error);
  }
};

/**
 * Add a new agent
 */
export const addAgent = (agent: Omit<Partial<Agent>, 'id' | 'avatar'> & { name: string, department: string }): Agent => {
  const agents = getAgents();
  
  // Create new agent with ID and deterministic avatar based on name
  const newAgent: Agent = {
    id: `agent-${Date.now()}`,
    name: agent.name,
    department: agent.department,
    email: agent.email || `${agent.name.toLowerCase().replace(/\s+/g, '.')}@example.com`, // Default email if not provided
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.name)}&background=8B5CF6&color=fff`
  };
  
  // Save to localStorage
  saveAgents([...agents, newAgent]);
  
  return newAgent;
};

/**
 * Remove an agent by ID
 */
export const removeAgent = (agentId: string): boolean => {
  const agents = getAgents();
  const filteredAgents = agents.filter(agent => agent.id !== agentId);
  
  if (filteredAgents.length < agents.length) {
    saveAgents(filteredAgents);
    return true;
  }
  
  return false;
};

/**
 * Get an agent by ID
 */
export const getAgent = (agentId: string): Agent | undefined => {
  const agents = getAgents();
  return agents.find(agent => agent.id === agentId);
};

/**
 * Update an existing agent
 */
export const updateAgent = (agentId: string, updates: Partial<Omit<Agent, 'id'>>): Agent | undefined => {
  const agents = getAgents();
  const agentIndex = agents.findIndex(agent => agent.id === agentId);
  
  if (agentIndex !== -1) {
    const updatedAgent = {
      ...agents[agentIndex],
      ...updates
    };
    
    agents[agentIndex] = updatedAgent;
    saveAgents(agents);
    
    return updatedAgent;
  }
  
  return undefined;
};
