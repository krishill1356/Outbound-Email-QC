import { getSettings } from '@/services/settingsService';

// Define the structure for Zammad email
export interface ZammadEmail {
  id: string;
  ticketId: string; // Changed from number to string
  ticketNumber: string; // Changed from number to string
  subject: string;
  body: string;
  from: string;
  to: string;
  agentId: string;
  agentName: string;
  createdAt: string;
}

// Function to fetch emails from Zammad API
export const fetchEmails = async (settings: any, fromDate: string, toDate: string, agentId?: string): Promise<ZammadEmail[]> => {
  const apiUrl = settings.apiUrl;
  const apiToken = settings.apiToken;

  let url = `${apiUrl}/api/v1/tickets/search?query=created_at:>="${fromDate}" created_at:<="${toDate}"`;
  if (agentId) {
    url += `+ AND +owner_id:=${agentId}`;
  }

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Token token=${apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const ticketIds = data.results;

    // Fetch each ticket detail
    const emailData = await Promise.all(
      ticketIds.map(async (ticketId: number) => {
        const ticketResponse = await fetch(`${apiUrl}/api/v1/tickets/${ticketId}`, {
          headers: {
            'Authorization': `Token token=${apiToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!ticketResponse.ok) {
          console.error(`Failed to fetch ticket ${ticketId}: ${ticketResponse.status}`);
          return null;
        }

        const ticketData = await ticketResponse.json();

        // Fetch articles for the ticket
        const articlesResponse = await fetch(`${apiUrl}/api/v1/ticket_articles/by_ticket/${ticketId}`, {
          headers: {
            'Authorization': `Token token=${apiToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!articlesResponse.ok) {
          console.error(`Failed to fetch articles for ticket ${ticketId}: ${articlesResponse.status}`);
          return null;
        }

        const articlesData = await articlesResponse.json();

        // Find the latest email article
        const latestEmailArticle = articlesData
          .filter((article: any) => article.type === 'email' && article.internal === false)
          .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

        if (!latestEmailArticle) {
          console.warn(`No suitable email article found for ticket ${ticketId}`);
          return null;
        }

        // Extract relevant information
        const subject = ticketData.title || 'No Subject';
        const body = latestEmailArticle.body || 'No Body';
        const from = latestEmailArticle.from || 'Unknown Sender';
        const to = latestEmailArticle.to || 'Unknown Recipient';
        const agentId = ticketData.owner_id ? ticketData.owner_id.toString() : 'Unknown Agent';

        // Fetch agent information
        const agentName = await fetchAgentName(apiUrl, apiToken, agentId);

        const email: ZammadEmail = {
          id: latestEmailArticle.id.toString(),
          ticketId: ticketData.id.toString(),
          ticketNumber: ticketData.number.toString(),
          subject,
          body,
          from,
          to,
          agentId,
          agentName,
          createdAt: latestEmailArticle.created_at
        };

        return email;
      })
    );

    // Filter out any null results from failed ticket fetches
    return emailData.filter(email => email !== null) as ZammadEmail[];

  } catch (error) {
    console.error('Failed to fetch emails from Zammad:', error);
    throw error;
  }
};

// Function to fetch agent name by ID
const fetchAgentName = async (apiUrl: string, apiToken: string, agentId: string): Promise<string> => {
  try {
    const response = await fetch(`${apiUrl}/api/v1/users/${agentId}`, {
      headers: {
        'Authorization': `Token token=${apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`Failed to fetch agent ${agentId}: ${response.status}`);
      return 'Unknown Agent';
    }

    const agentData = await response.json();
    return agentData.firstname + ' ' + agentData.lastname;

  } catch (error) {
    console.error(`Failed to fetch agent name for ${agentId}:`, error);
    return 'Unknown Agent';
  }
};

// Function to fetch all agents from Zammad
export const fetchAgents = async (settings: any): Promise<{id: string, name: string}[]> => {
  const apiUrl = settings.apiUrl;
  const apiToken = settings.apiToken;

  try {
    const response = await fetch(`${apiUrl}/api/v1/users?expand=true`, {
      headers: {
        'Authorization': `Token token=${apiToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const agentsData = await response.json();

    // Filter out agents that are not active and map the data
    return agentsData
      .filter((agent: any) => agent.active === true)
      .map((agent: any) => ({
        id: agent.id.toString(),
        name: `${agent.firstname} ${agent.lastname}`
      }));

  } catch (error) {
    console.error('Failed to fetch agents from Zammad:', error);
    throw error;
  }
};

// Function to get Zammad settings from local storage
export const getZammadSettings = () => {
  return getSettings('zammad');
};
