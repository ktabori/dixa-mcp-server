import { z } from "zod";

export const getAnalyticsRecordsData = {
  name: "getAnalyticsRecordsData",
  description: "Get analytics data for a specific record from Dixa.",
  parameters: z.object({
    recordId: z.string().describe("The ID of the record to fetch data for"),
    periodFilter: z.object({
      from: z.string().describe("Start date in ISO format"),
      to: z.string().describe("End date in ISO format"),
    }).describe("Time period to fetch data for"),
    filters: z.record(z.string(), z.array(z.string())).optional().describe("Optional filters to apply to the data"),
    timezone: z.string().describe("Timezone to use for the data (e.g., 'Europe/Copenhagen')"),
    pageKey: z.string().optional().describe("Optional pagination key for fetching next page of results"),
    pageLimit: z.number().optional().describe("Optional limit for number of results per page"),
  }),
  execute: async (args, { log }) => {
    const url = new URL(`https://dev.dixa.io/v1/analytics/records/${args.recordId}/data`);
    if (args.pageKey) url.searchParams.set('pageKey', args.pageKey);
    if (args.pageLimit) url.searchParams.set('pageLimit', args.pageLimit.toString());
    
    log.debug('Request URL:', url.toString());

    if (!process.env.DIXA_API_KEY) {
      throw new Error('DIXA_API_KEY environment variable is not set');
    }

    const resp = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Authorization': process.env.DIXA_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        periodFilter: args.periodFilter,
        filters: args.filters,
        timezone: args.timezone,
      })
    });

    const responseText = await resp.text();
    
    if (!resp.ok) {
      throw new Error(`Failed to fetch analytics records data: ${resp.status} ${resp.statusText}\nResponse: ${responseText}`);
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