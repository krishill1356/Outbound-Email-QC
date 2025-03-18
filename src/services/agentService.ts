
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
export const addAgent = (agent: Omit<Agent, 'id' | 'avatar'>): Agent => {
  const agents = getAgents();
  
  // Create new agent with ID and avatar
  const newAgent: Agent = {
    id: `agent-${Date.now()}`,
    ...agent,
    avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
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
