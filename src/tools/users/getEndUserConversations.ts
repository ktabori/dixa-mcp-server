import { z } from "zod";

export const getEndUserConversations = {
  name: "getEndUserConversations",
  description: "Get all conversations for a specific end user from Dixa",
  parameters: z.object({
    userId: z.string().describe("The ID of the end user to fetch conversations for"),
    pageKey: z.string().optional().describe("Pagination key for next page of results"),
    pageLimit: z.number().optional().default(50).describe("Number of results per page (default: 50)"),
  }),
  execute: async (args, { log }) => {
    // Build query parameters
    const params = new URLSearchParams();
    
    if (args.pageKey) {
      params.append('pageKey', args.pageKey);
    }
    
    if (args.pageLimit !== undefined) {
      params.append('pageLimit', String(args.pageLimit));
    }

    const url = `https://dev.dixa.io/v1/endusers/${args.userId}/conversations?${params.toString()}`;
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
      throw new Error(`Failed to fetch end user conversations: ${resp.status} ${resp.statusText}\nResponse: ${errorText}`);
    }

    const data = await resp.json();
    return {
      type: "text" as const,
      text: JSON.stringify(data, null, 2)
    };
  },
}; 