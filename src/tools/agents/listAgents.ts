import { z } from "zod";

export const listAgents = {
  name: "listAgents",
  description: "List all agents from Dixa to find the agent ID with optional filtering by email and phone, and pagination support",
  parameters: z.object({
    pageLimit: z.number().optional().default(50).describe("Number of results per page (default: 50)"),
  }),
  execute: async (args, { log }) => {
    // Build query parameters
    const params = new URLSearchParams();
    
    if (args.pageLimit !== undefined) {
      params.append('pageLimit', String(args.pageLimit));
    }

    const url = `https://dev.dixa.io/v1/agents?${params.toString()}`;
    log.debug('Request URL:', url);

    if (!process.env.DIXA_API_KEY) {
      throw new Error('DIXA_API_KEY environment variable is not set');
    }

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': process.env.DIXA_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      throw new Error(`Failed to fetch agents: ${resp.status} ${resp.statusText}\nResponse: ${errorText}`);
    }

    const data = await resp.json();
    return {
      type: "text" as const,
      text: JSON.stringify(data, null, 2)
    };
  },
}; 