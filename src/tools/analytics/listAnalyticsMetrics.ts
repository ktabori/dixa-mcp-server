import { z } from "zod";

export const listAnalyticsMetrics = {
  name: "listAnalyticsMetrics",
  description: "List all available analytics metric IDs from Dixa that can be used to fetch data in Get Metric Data. These metrics represent different types of measurements and analytics that can be queried.",
  parameters: z.object({
    pageKey: z.string().optional().describe("Pagination key for next page of results"),
    pageLimit: z.number().optional().default(50).describe("Number of results per page (default: 50)"),
  }),
  execute: async (args, { log }) => {
    const url = new URL('https://dev.dixa.io/v1/analytics/metrics');
    if (args.pageKey) url.searchParams.set('pageKey', args.pageKey);
    if (args.pageLimit) url.searchParams.set('pageLimit', args.pageLimit.toString());
    
    log.debug('Request URL:', url.toString());

    if (!process.env.DIXA_API_KEY) {
      throw new Error('DIXA_API_KEY environment variable is not set');
    }

    const resp = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': process.env.DIXA_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    const responseText = await resp.text();
    
    if (!resp.ok) {
      throw new Error(`Failed to fetch analytics metrics: ${resp.status} ${resp.statusText}\nResponse: ${responseText}`);
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