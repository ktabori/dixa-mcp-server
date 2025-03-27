# Dixa MCP Server

This is a FastMCP server that provides tools for interacting with the Dixa API. It allows you to search conversations, get conversation details, manage tags, and more.

## Running the Server

To run the server, you need to:

1. Install dependencies:
```bash
npm install
npm install fastmcp
```

2. Set up your environment variables:
```bash
cp .env.example .env
```
Then edit `.env` and add your Dixa API key:
```
DIXA_API_KEY=your_api_key_here
```

3. Start the server:
```bash
# Test the addition server example using CLI:
npx fastmcp dev src/tools/index.ts

# Test the addition server example using MCP Inspector:
npx fastmcp inspect src/tools/index.ts
```

## Setting up in Claude

To use this server with Claude:

1. Turn on dev mode
2. In Claude, go to Settings > Developer > Edit Config
3. Add the following configuration

```json
{
  "mcpServers": {
    "dixa-mcp-server": {
      "command": "npx",
      "args": [
        "tsx",
        "/PATH/TO/FOLDER/dixa-mcp-server/src/tools/index.ts"
      ],
      "env": {
        "DIXA_API_KEY": "YOUR_API_KEY_TO_DIXA"
      }
    }
  }
}
```

## Server-Sent Events (SSE)

You can also run the server with SSE support:

```ts
server.start({
  transportType: "sse",
  sse: {
    endpoint: "/sse",
    port: 8080,
  },
});
```

This will start the server and listen for SSE connections on `http://localhost:8080/sse`.

You can then use `SSEClientTransport` to connect to the server:

```ts
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

const client = new Client(
  {
    name: "example-client",
    version: "1.0.0",
  },
  {
    capabilities: {},
  },
);

const transport = new SSEClientTransport(new URL(`http://localhost:8080/sse`));

await client.connect(transport);
```

## Implemented Tools

### Conversation Management
- `searchConversations`: Search conversations in Dixa with pagination support
- `getConversation`: Get a single conversation by ID
- `getConversationMessages`: Get all messages for a specific conversation
- `getConversationTags`: Get all tags associated with a conversation
- `getConversationNotes`: Get all internal notes for a conversation
- `getConversationRatings`: Get all ratings for a conversation

### Tag Management
- `listTags`: List all available tags in Dixa
- `tagConversation`: Add a tag to a specific conversation
- `removeConversationTag`: Remove a tag from a specific conversation

### End User Management
- `getEndUser`: Get information about a specific end user
- `getEndUserConversations`: Get all conversations for a specific end user

### Agent Management
- `getAgent`: Get information about a specific agent
- `listAgents`: List all agents with optional filtering

### Analytics
- `getAnalyticsMetric`: Get detailed information about a specific analytics metric
- `getAnalyticsRecord`: Get detailed information about a specific analytics record
- `listAnalyticsRecords`: List all available analytics record IDs
- `listAnalyticsMetrics`: List all available analytics metric IDs
- `getAnalyticsFilter`: Get possible values for a given analytics filter attribute
- `getAnalyticsRecordsData`: Get analytics data for a specific record with filters and period settings
- `getAnalyticsMetricsData`: Get analytics data for a specific metric with filters, period settings, and aggregations
