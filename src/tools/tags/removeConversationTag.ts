import { z } from "zod";

export const removeConversationTag = {
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
        type: "text" as const,
        text: JSON.stringify({ success: true, message: "Tag removed successfully" }, null, 2)
      };
    }

    const data = await resp.json();
    return {
      type: "text" as const,
      text: JSON.stringify(data, null, 2)
    };
  },
}; 