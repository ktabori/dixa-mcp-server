/**
 * This is a complete example of an MCP server.
 */
import { FastMCP } from "../FastMCP.js";
import { z } from "zod";

const server = new FastMCP({
  name: "dixa-mcp-server",
  version: "1.0.0",
});

server.addTool({
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
      type: "text",
      text: JSON.stringify(data, null, 2)
    };
  },
});

server.addTool({
  name: "getConversation",
  description: "Get a single conversation by ID from Dixa",
  parameters: z.object({
    conversationId: z.string().describe("The ID of the conversation to fetch"),
  }),
  execute: async (args, { log }) => {
    const url = `https://dev.dixa.io/v1/conversations/${args.conversationId}`;
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
      throw new Error(`Failed to fetch conversation: ${resp.status} ${resp.statusText}\nResponse: ${errorText}`);
    }

    const data = await resp.json();
    return {
      type: "text",
      text: JSON.stringify(data, null, 2)
    };
  },
});

server.addTool({
  name: "getConversationMessages",
  description: "Get all messages for a specific conversation from Dixa",
  parameters: z.object({
    conversationId: z.string().describe("The ID of the conversation to fetch messages for"),
  }),
  execute: async (args, { log }) => {
    const url = `https://dev.dixa.io/v1/conversations/${args.conversationId}/messages`;
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
      throw new Error(`Failed to fetch conversation messages: ${resp.status} ${resp.statusText}\nResponse: ${errorText}`);
    }

    const data = await resp.json();
    return {
      type: "text",
      text: JSON.stringify(data, null, 2)
    };
  },
});

server.addTool({
  name: "getConversationTags",
  description: "Get all tags associated with a specific conversation from Dixa",
  parameters: z.object({
    conversationId: z.string().describe("The ID of the conversation to fetch tags for"),
  }),
  execute: async (args, { log }) => {
    const url = `https://dev.dixa.io/v1/conversations/${args.conversationId}/tags`;
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
      throw new Error(`Failed to fetch conversation tags: ${resp.status} ${resp.statusText}\nResponse: ${errorText}`);
    }

    const data = await resp.json();
    return {
      type: "text",
      text: JSON.stringify(data, null, 2)
    };
  },
});

server.addTool({
  name: "listTags",
  description: "List all available tags in Dixa",
  parameters: z.object({
    includeDeactivated: z.boolean().optional().default(false).describe("Whether to include deactivated tags"),
  }),
  execute: async (args, { log }) => {
    const query = new URLSearchParams({
      includeDeactivated: String(args.includeDeactivated)
    }).toString();

    const url = `https://dev.dixa.io/v1/tags?${query}`;
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
      throw new Error(`Failed to fetch tags: ${resp.status} ${resp.statusText}\nResponse: ${errorText}`);
    }

    const data = await resp.json();
    return {
      type: "text",
      text: JSON.stringify(data, null, 2)
    };
  },
});

server.addTool({
  name: "tagConversation",
  description: "Add a tag to a specific conversation in Dixa",
  parameters: z.object({
    conversationId: z.string().describe("The ID of the conversation to tag"),
    tagId: z.string().describe("The ID of the tag to add to the conversation"),
  }),
  execute: async (args, { log }) => {
    const url = `https://dev.dixa.io/v1/conversations/${args.conversationId}/tags/${args.tagId}`;
    log.debug('Request URL:', url);

    if (!process.env.DIXA_API_KEY) {
      throw new Error('DIXA_API_KEY environment variable is not set');
    }

    const resp = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': process.env.DIXA_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (resp.status === 204) {
      return {
        type: "text",
        text: JSON.stringify({ success: true, message: "Tag added successfully" }, null, 2)
      };
    }

    const data = await resp.json();
    return {
      type: "text",
      text: JSON.stringify(data, null, 2)
    };
  },
});

server.addTool({
  name: "removeConversationTag",
  description: "Remove a tag from a specific conversation in Dixa",
  parameters: z.object({
    conversationId: z.string().describe("The ID of the conversation to remove the tag from"),
    tagId: z.string().describe("The ID of the tag to remove from the conversation"),
  }),
  execute: async (args, { log }) => {
    const url = `https://dev.dixa.io/v1/conversations/${args.conversationId}/tags/${args.tagId}`;
    log.debug('Request URL:', url);

    if (!process.env.DIXA_API_KEY) {
      throw new Error('DIXA_API_KEY environment variable is not set');
    }

    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': process.env.DIXA_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (resp.status === 204) {
      return {
        type: "text",
        text: JSON.stringify({ success: true, message: "Tag removed successfully" }, null, 2)
      };
    }

    const data = await resp.json();
    return {
      type: "text",
      text: JSON.stringify(data, null, 2)
    };
  },
});

server.addTool({
  name: "getConversationNotes",
  description: "Get all internal notes for a specific conversation from Dixa",
  parameters: z.object({
    conversationId: z.string().describe("The ID of the conversation to fetch notes for"),
  }),
  execute: async (args, { log }) => {
    const url = `https://dev.dixa.io/v1/conversations/${args.conversationId}/notes`;
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
      throw new Error(`Failed to fetch conversation notes: ${resp.status} ${resp.statusText}\nResponse: ${errorText}`);
    }

    const data = await resp.json();
    return {
      type: "text",
      text: JSON.stringify(data, null, 2)
    };
  },
});

server.addTool({
  name: "getConversationRatings",
  description: "Get all ratings for a specific conversation from Dixa",
  parameters: z.object({
    conversationId: z.string().describe("The ID of the conversation to fetch ratings for"),
  }),
  execute: async (args, { log }) => {
    const url = `https://dev.dixa.io/v1/conversations/${args.conversationId}/ratings`;
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
      throw new Error(`Failed to fetch conversation ratings: ${resp.status} ${resp.statusText}\nResponse: ${errorText}`);
    }

    const data = await resp.json();
    return {
      type: "text",
      text: JSON.stringify(data, null, 2)
    };
  },
});

server.addTool({
  name: "getEndUser",
  description: "Get information about a specific end user from Dixa",
  parameters: z.object({
    userId: z.string().describe("The ID of the end user to fetch information for"),
  }),
  execute: async (args, { log }) => {
    const url = `https://dev.dixa.io/v1/endusers/${args.userId}`;
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
      throw new Error(`Failed to fetch end user information: ${resp.status} ${resp.statusText}\nResponse: ${errorText}`);
    }

    const data = await resp.json();
    return {
      type: "text",
      text: JSON.stringify(data, null, 2)
    };
  },
});

server.addTool({
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
      type: "text",
      text: JSON.stringify(data, null, 2)
    };
  },
});

server.addTool({
  name: "getAgent",
  description: "Get information about a specific agent from Dixa",
  parameters: z.object({
    agentId: z.string().describe("The ID of the agent to fetch information for"),
  }),
  execute: async (args, { log }) => {
    const url = `https://dev.dixa.io/v1/agents/${args.agentId}`;
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
      throw new Error(`Failed to fetch agent information: ${resp.status} ${resp.statusText}\nResponse: ${errorText}`);
    }

    const data = await resp.json();
    return {
      type: "text",
      text: JSON.stringify(data, null, 2)
    };
  },
});

server.addTool({
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
      type: "text",
      text: JSON.stringify(data, null, 2)
    };
  },
});

server.addTool({
  name: "getAnalyticsMetric",
  description: "Call listAnalyticsRecords before calling this endpoint to get the available metrics. Get detailed information about a specific analytics metric from Dixa. This endpoint lists all available properties of a metric that can be used for querying its data.",
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

    if (!resp.ok) {
      const errorText = await resp.text();
      throw new Error(`Failed to fetch analytics metric: ${resp.status} ${resp.statusText}\nResponse: ${errorText}`);
    }

    const data = await resp.json();
    return {
      type: "text",
      text: JSON.stringify(data, null, 2)
    };
  },
});

server.addTool({
  name: "getAnalyticsRecord",
  description: "Call listAnalyticsRecords before calling this endpoint to get the available records. Get detailed information about a specific analytics record from Dixa. This endpoint lists all available properties of a record that can be used for querying its data.",
  parameters: z.object({
    recordId: z.string().describe("The ID of the record to fetch information for (e.g., 'ratings')"),
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

    if (!resp.ok) {
      const errorText = await resp.text();
      throw new Error(`Failed to fetch analytics record: ${resp.status} ${resp.statusText}\nResponse: ${errorText}`);
    }

    const data = await resp.json();
    return {
      type: "text",
      text: JSON.stringify(data, null, 2)
    };
  },
});

server.addTool({
  name: "listAnalyticsRecords",
  description: "List all available analytics record IDs from Dixa that can be used to fetch data in Get Metric Records Data. These records represent different types of data that can be queried.",
  parameters: z.object({
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

    const url = `https://dev.dixa.io/v1/analytics/records?${params.toString()}`;
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
      throw new Error(`Failed to fetch analytics records: ${resp.status} ${resp.statusText}\nResponse: ${errorText}`);
    }

    const data = await resp.json();
    return {
      type: "text",
      text: JSON.stringify(data, null, 2)
    };
  },
});

server.addTool({
  name: "listAnalyticsMetrics",
  description: "Call listAnalyticsRecords before calling this endpoint to get the available metrics. List all available analytics metric IDs from Dixa that can be used to fetch data in Get Metric Data. These metrics represent different types of measurements and analytics that can be queried.",
  parameters: z.object({
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

    const url = `https://dev.dixa.io/v1/analytics/metrics?${params.toString()}`;
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
      throw new Error(`Failed to fetch analytics metrics: ${resp.status} ${resp.statusText}\nResponse: ${errorText}`);
    }

    const data = await resp.json();
    return {
      type: "text",
      text: JSON.stringify(data, null, 2)
    };
  },
});

server.addTool({
  name: "getAnalyticsFilter",
  description: "Call listAnalyticsMetrics before calling this endpoint to get the available metrics. Get possible values to be used with a given analytics filter attribute from Dixa. Filter attributes are not metric or record specific, so one filter attribute can be used with multiple metrics/records. When a filter value is not relevant for a specific metric/record, it is simply ignored.",
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

    if (!resp.ok) {
      const errorText = await resp.text();
      throw new Error(`Failed to fetch analytics filter values: ${resp.status} ${resp.statusText}\nResponse: ${errorText}`);
    }

    const data = await resp.json();
    return {
      type: "text",
      text: JSON.stringify(data, null, 2)
    };
  },
});

server.addTool({
  name: "getAnalyticsRecordsData",
  description: "Call listAnalyticsMetrics before calling this endpoint to get the available metrics. Get analytics data for a specific record with filters and period settings. This endpoint allows you to query analytics records data with custom filters, period settings, and timezone.",
  parameters: z.object({
    recordId: z.string().describe("The ID of the record to fetch data for (e.g., 'closed_conversations')"),
    periodFilter: z.object({
      value: z.object({
        _type: z.string().describe("The type of period (e.g., 'PreviousWeek')")
      }),
      _type: z.string().describe("The type of filter (e.g., 'Preset')")
    }).describe("The period filter configuration"),
    filters: z.array(z.object({
      attribute: z.string().describe("The attribute to filter by (e.g., 'initial_direction')"),
      values: z.array(z.string()).describe("Array of values to filter by")
    })).optional().describe("Array of filters to apply"),
    timezone: z.string().describe("The timezone to use for the data (e.g., 'Europe/Copenhagen')"),
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

    const url = `https://dev.dixa.io/v1/analytics/records?${params.toString()}`;
    log.debug('Request URL:', url);

    if (!process.env.DIXA_API_KEY) {
      throw new Error('DIXA_API_KEY environment variable is not set');
    }

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': process.env.DIXA_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: args.recordId,
        periodFilter: args.periodFilter,
        filters: args.filters,
        timezone: args.timezone
      })
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      throw new Error(`Failed to fetch analytics records data: ${resp.status} ${resp.statusText}\nResponse: ${errorText}`);
    }

    const data = await resp.json();
    return {
      type: "text",
      text: JSON.stringify(data, null, 2)
    };
  },
});

server.addTool({
  name: "getAnalyticsMetricsData",
  description: "Call listAnalyticsMetrics before calling this endpoint to get the available metrics.  Get analytics data for a specific metric with filters, period settings, and aggregations. This endpoint allows you to query analytics metrics data with custom filters, period settings, aggregations, and timezone.",
  parameters: z.object({
    metricId: z.string().describe("The ID of the metric to fetch data for (e.g., 'closed_conversations')"),
    periodFilter: z.object({
      value: z.object({
        _type: z.string().describe("The type of period (e.g., 'PreviousWeek')")
      }),
      _type: z.string().describe("The type of filter (e.g., 'Preset')")
    }).describe("The period filter configuration"),
    filters: z.array(z.object({
      attribute: z.string().describe("The attribute to filter by (e.g., 'channel')"),
      values: z.array(z.string()).describe("Array of values to filter by")
    })).optional().describe("Array of filters to apply"),
    aggregations: z.array(z.string()).describe("Array of aggregations to apply (e.g., ['Count'])"),
    timezone: z.string().describe("The timezone to use for the data (e.g., 'Europe/Copenhagen')"),
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

    const url = `https://dev.dixa.io/v1/analytics/metrics?${params.toString()}`;
    log.debug('Request URL:', url);

    if (!process.env.DIXA_API_KEY) {
      throw new Error('DIXA_API_KEY environment variable is not set');
    }

    const resp = await fetch(url, {
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

    if (!resp.ok) {
      const errorText = await resp.text();
      throw new Error(`Failed to fetch analytics metrics data: ${resp.status} ${resp.statusText}\nResponse: ${errorText}`);
    }

    const data = await resp.json();
    return {
      type: "text",
      text: JSON.stringify(data, null, 2)
    };
  },
});

server.start({
  transportType: "stdio",
});
