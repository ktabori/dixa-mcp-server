import { z } from "zod";

export const listTags = {
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
      type: "text" as const,
      text: JSON.stringify(data, null, 2)
    };
  },
}; 