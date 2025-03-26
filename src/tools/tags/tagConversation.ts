import { z } from "zod";

export const tagConversation = {
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
        type: "text" as const,
        text: JSON.stringify({ success: true, message: "Tag added successfully" }, null, 2)
      };
    }

    const data = await resp.json();
    return {
      type: "text" as const,
      text: JSON.stringify(data, null, 2)
    };
  },
}; 