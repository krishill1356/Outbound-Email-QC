
// This service is responsible for communicating with the Zammad API

interface ZammadSettings {
  apiUrl: string;
  apiToken: string;
}

export interface ZammadEmail {
  id: string;
  subject: string;
  body: string;
  from: string;
  to: string;
  createdAt: string;
  agentId: string;
  agentName: string;
  ticketId: string;
  ticketNumber: string;
}

// Function to fetch emails from Zammad
export const fetchEmails = async (
  settings: ZammadSettings, 
  dateFrom: string, 
  dateTo: string, 
  agentId?: string
): Promise<ZammadEmail[]> => {
  if (!settings.apiUrl || !settings.apiToken) {
    console.error('Zammad settings are not configured properly');
    return [];
  }

  try {
    // Format the date range for the API query
    const formattedDateFrom = new Date(dateFrom).toISOString();
    const formattedDateTo = new Date(dateTo).toISOString();
    
    // Build the API URL with query parameters
    let apiEndpoint = `${settings.apiUrl}/api/v1/tickets/search?query=`;
    
    // Add date range to query
    let query = `created_at:>=${formattedDateFrom} created_at:<=${formattedDateTo}`;
    
    // Add agent filter if provided
    if (agentId) {
      query += ` AND owner.id:${agentId}`;
    }
    
    // Encode the query for URL
    apiEndpoint += encodeURIComponent(query);
    
    // Make the API request
    const response = await fetch(apiEndpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Token token=${settings.apiToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Zammad API error: ${response.status} ${response.statusText}`);
    }
    
    // Parse the ticket IDs from the search response
    const ticketIds = await response.json();
    
    // Fetch detailed information for each ticket
    const emails: ZammadEmail[] = await Promise.all(
      ticketIds.map(async (ticketId: string) => {
        const ticketResponse = await fetch(`${settings.apiUrl}/api/v1/tickets/${ticketId}?expand=true`, {
          method: 'GET',
          headers: {
            'Authorization': `Token token=${settings.apiToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!ticketResponse.ok) {
          throw new Error(`Failed to fetch ticket ${ticketId}`);
        }
        
        const ticket = await ticketResponse.json();
        
        // Get the first article (email) from the ticket
        const articleResponse = await fetch(`${settings.apiUrl}/api/v1/ticket_articles/by_ticket/${ticketId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Token token=${settings.apiToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!articleResponse.ok) {
          throw new Error(`Failed to fetch articles for ticket ${ticketId}`);
        }
        
        const articles = await articleResponse.json();
        const agentEmail = articles.find((article: any) => article.sender_id === 1); // Sender ID 1 is usually the agent
        
        if (!agentEmail) {
          return null; // Skip tickets without agent replies
        }
        
        // Fetch agent information
        const agentResponse = await fetch(`${settings.apiUrl}/api/v1/users/${ticket.owner_id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Token token=${settings.apiToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!agentResponse.ok) {
          throw new Error(`Failed to fetch agent ${ticket.owner_id}`);
        }
        
        const agent = await agentResponse.json();
        
        return {
          id: agentEmail.id,
          subject: ticket.title,
          body: agentEmail.body,
          from: agentEmail.from,
          to: agentEmail.to,
          createdAt: agentEmail.created_at,
          agentId: agent.id,
          agentName: `${agent.firstname} ${agent.lastname}`,
          ticketId: ticket.id,
          ticketNumber: ticket.number
        };
      })
    );
    
    // Filter out any null values (tickets without agent replies)
    return emails.filter(email => email !== null);
  } catch (error) {
    console.error('Error fetching emails from Zammad:', error);
    throw error;
  }
};

// Function to test Zammad connection
export const testConnection = async (settings: ZammadSettings): Promise<boolean> => {
  try {
    // Try to fetch the current user as a simple way to test the connection
    const response = await fetch(`${settings.apiUrl}/api/v1/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Token token=${settings.apiToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error testing Zammad connection:', error);
    return false;
  }
};

// Function to fetch Zammad agents (for filtering)
export const fetchAgents = async (settings: ZammadSettings): Promise<{ id: string, name: string }[]> => {
  try {
    // Get agent roles (usually role_id 2 is the agent role)
    const response = await fetch(`${settings.apiUrl}/api/v1/roles`, {
      method: 'GET',
      headers: {
        'Authorization': `Token token=${settings.apiToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch roles: ${response.status}`);
    }
    
    const roles = await response.json();
    const agentRoleId = roles.find((role: any) => role.name.toLowerCase().includes('agent'))?.id || 2;
    
    // Get all users with the agent role
    const usersResponse = await fetch(`${settings.apiUrl}/api/v1/users/search?query=role_ids:${agentRoleId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token token=${settings.apiToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!usersResponse.ok) {
      throw new Error(`Failed to fetch users: ${usersResponse.status}`);
    }
    
    const userIds = await usersResponse.json();
    
    // Get details for each agent
    const agents = await Promise.all(
      userIds.map(async (userId: string) => {
        const userResponse = await fetch(`${settings.apiUrl}/api/v1/users/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Token token=${settings.apiToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!userResponse.ok) {
          return null;
        }
        
        const user = await userResponse.json();
        return {
          id: user.id,
          name: `${user.firstname} ${user.lastname}`
        };
      })
    );
    
    return agents.filter(agent => agent !== null);
  } catch (error) {
    console.error('Error fetching Zammad agents:', error);
    return [];
  }
};

// Function to save Zammad settings (would normally save to localStorage or backend)
export const saveZammadSettings = (settings: ZammadSettings): void => {
  localStorage.setItem('zammadSettings', JSON.stringify(settings));
};

// Function to get saved Zammad settings
export const getZammadSettings = (): ZammadSettings | null => {
  const settings = localStorage.getItem('zammadSettings');
  return settings ? JSON.parse(settings) : null;
};
