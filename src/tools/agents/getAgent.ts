import { z } from "zod";

export const getAgent = {
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
      type: "text" as const,
      text: JSON.stringify(data, null, 2)
    };
  },
}; 