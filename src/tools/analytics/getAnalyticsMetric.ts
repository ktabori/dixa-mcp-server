import { z } from "zod";

export const getAnalyticsMetric = {
  name: "getAnalyticsMetric",
  description: "Get detailed information about a specific analytics metric from Dixa. This endpoint lists all available properties of a metric that can be used for querying its data.",
  parameters: z.object({
    metricId: z.string().describe("The ID of the metric to fetch information for (e.g., 'csat')"),
  }),
  execute: async (args, { log }) => {
    const url = `https://dev.dixa.io/v1/analytics/metrics/${args.metricId}`;
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
      throw new Error(`Failed to fetch analytics metric: ${resp.status} ${resp.statusText}\nResponse: ${responseText}`);
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