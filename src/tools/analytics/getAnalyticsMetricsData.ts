import { z } from "zod";

const PERIOD_PRESETS = [
  "PreviousQuarter",
  "ThisWeek",
  "PreviousWeek",
  "Yesterday",
  "Today",
  "ThisMonth",
  "PreviousMonth",
  "ThisQuarter",
  "ThisYear"
] as const;

export const getAnalyticsMetricsData = {
  name: "getAnalyticsMetricsData",
  description: "Call listAnalyticsMetrics before calling this endpoint to get the available metrics. Get analytics data for a specific metric with filters, period settings, and aggregations. This endpoint allows you to query analytics metrics data with custom filters, period settings, aggregations, and timezone.",
  parameters: z.object({
    metricId: z.string().describe("The ID of the metric to fetch data for (e.g., 'closed_conversations')"),
    periodFilter: z.object({
      value: z.object({
        _type: z.enum(PERIOD_PRESETS).describe("The type of preset period")
      }),
      _type: z.literal("Preset")
    }).describe("The period filter configuration using preset periods"),
    filters: z.array(z.object({
      attribute: z.string().describe("The attribute to filter by (e.g., 'channel')"),
      values: z.array(z.string()).describe("Array of values to filter by")
    })).optional().describe("Array of filters to apply"),
    aggregations: z.array(z.string()).describe("Array of aggregations to apply (e.g., ['Count'])"),
    timezone: z.string().describe("The timezone to use for the data (e.g., 'Europe/Copenhagen') (required)"),
    pageKey: z.string().optional().describe("Pagination key for next page of results"),
    pageLimit: z.number().optional().default(50).describe("Number of results per page (default: 50)"),
  }),
  execute: async (args, { log }) => {
    // Build query parameters
    const url = new URL('https://dev.dixa.io/v1/analytics/metrics');
    if (args.pageKey) url.searchParams.set('pageKey', args.pageKey);
    if (args.pageLimit) url.searchParams.set('pageLimit', args.pageLimit.toString());
    
    log.debug('Request URL:', url.toString());
    log.debug('Request body:', JSON.stringify(args, null, 2));

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
        id: args.metricId,
        periodFilter: args.periodFilter,
        filters: args.filters,
        aggregations: args.aggregations,
        timezone: args.timezone
      })
    });

    const responseText = await resp.text();
    
    if (!resp.ok) {
      throw new Error(`Failed to fetch analytics metrics data: ${resp.status} ${resp.statusText}\nResponse: ${responseText}`);
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