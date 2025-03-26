import { z } from "zod";

export const getAnalyticsRecord = {
  name: "getAnalyticsRecord",
  description: "Get detailed information about a specific analytics record from Dixa. This endpoint lists all available properties of a record that can be used for querying its data.",
  parameters: z.object({
    recordId: z.string().describe("The ID of the record to fetch information for (e.g., 'conversation')"),
  }),
  execute: async (args, { log }) => {
    const url = `https://dev.dixa.io/v1/analytics/records/${args.recordId}`;
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
      throw new Error(`Failed to fetch analytics record: ${resp.status} ${resp.statusText}\nResponse: ${responseText}`);
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