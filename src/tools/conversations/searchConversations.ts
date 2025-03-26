import { z } from "zod";

export const searchConversations = {
  name: "searchConversations",
  description: "Search conversations in Dixa",
  parameters: z.object({
    query: z.string().describe("The search query string"),
    exactMatch: z.boolean().optional().default(true).describe("Whether to perform exact matching"),
    pageKey: z.string().optional().describe("Pagination key for next page of results"),
    pageLimit: z.number().optional().default(50).describe("Number of results per page (default: 50)"),
  }),
  execute: async (args, { log }) => {
    // Only include parameters that have values
    const params = new URLSearchParams();
    
    if (args.query) {
      params.append('query', args.query);
    }
    
    if (args.exactMatch !== undefined) {
      params.append('exactMatch', String(args.exactMatch));
    }
    
    if (args.pageKey) {
      params.append('pageKey', args.pageKey);
    }
    
    if (args.pageLimit !== undefined) {
      params.append('pageLimit', String(args.pageLimit));
    }

    const url = `https://dev.dixa.io/v1/search/conversations?${params.toString()}`;
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
      throw new Error(`Failed to search conversations: ${resp.status} ${resp.statusText}\nResponse: ${errorText}`);
    }

    const data = await resp.json();
    return {
      type: "text" as const,
      text: JSON.stringify(data, null, 2)
    };
  },
}; 