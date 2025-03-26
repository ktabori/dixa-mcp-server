import { z } from "zod";

export const getConversationNotes = {
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
      type: "text" as const,
      text: JSON.stringify(data, null, 2)
    };
  },
}; 