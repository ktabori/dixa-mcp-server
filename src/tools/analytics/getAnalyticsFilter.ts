import { z } from "zod";

export const getAnalyticsFilter = {
  name: "getAnalyticsFilter",
  description: "Get possible values to be used with a given analytics filter attribute from Dixa. Filter attributes are not metric or record specific, so one filter attribute can be used with multiple metrics/records. When a filter value is not relevant for a specific metric/record, it is simply ignored.",
  parameters: z.object({
    filterAttribute: z.string().describe("The filter attribute to get values for (e.g., 'agent_id', 'queue_id', 'channel')"),
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

    const url = `https://dev.dixa.io/v1/analytics/filter/${args.filterAttribute}?${params.toString()}`;
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

    const responseText = await resp.text();
    
    if (!resp.ok) {
      throw new Error(`Failed to fetch analytics filter values: ${resp.status} ${resp.statusText}\nResponse: ${responseText}`);
    }

    try {
      const data = JSON.parse(responseText);
      return {
        type: "text" as const,
        text: JSON.stringify(data, null, 2)
      };
    } catch (error) {
      throw new Error(`Invalid JSON response from server: ${responseText}`);
    }
  },
}; 