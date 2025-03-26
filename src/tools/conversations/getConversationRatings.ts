import { z } from "zod";

export const getConversationRatings = {
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
      type: "text" as const,
      text: JSON.stringify(data, null, 2)
    };
  },
}; 