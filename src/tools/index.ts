/**
 * This is a complete example of an MCP server.
 */
import { FastMCP } from "fastmcp";
import {
  getAnalyticsMetric,
  getAnalyticsRecord,
  listAnalyticsRecords,
  listAnalyticsMetrics,
  getAnalyticsFilter,
  getAnalyticsRecordsData,
  getAnalyticsMetricsData,
} from "./analytics";
import {
  searchConversations,
  getConversation,
  getConversationMessages,
  getConversationNotes,
  getConversationRatings,
} from "./conversations";
import {
  listTags,
  tagConversation,
  removeConversationTag,
  getConversationTags,
} from "./tags";
import {
  getEndUser,
  getEndUserConversations,
} from "./users";
import {
  getAgent,
  listAgents,
} from "./agents";

const server = new FastMCP({
  name: "Dixa MCP Server",
  version: "1.0.0",
});

// Register analytics tools
server.addTool(getAnalyticsMetric);
server.addTool(getAnalyticsRecord);
server.addTool(listAnalyticsRecords);
server.addTool(listAnalyticsMetrics);
server.addTool(getAnalyticsFilter);
server.addTool(getAnalyticsRecordsData);
server.addTool(getAnalyticsMetricsData);

// Register conversation tools
server.addTool(searchConversations);
server.addTool(getConversation);
server.addTool(getConversationMessages);
server.addTool(getConversationNotes);
server.addTool(getConversationRatings);

// Register tag tools
server.addTool(listTags);
server.addTool(tagConversation);
server.addTool(removeConversationTag);
server.addTool(getConversationTags);

// Register user tools
server.addTool(getEndUser);
server.addTool(getEndUserConversations);

// Register agent tools
server.addTool(getAgent);
server.addTool(listAgents);

// Start server with stdio transport
server.start({
  transportType: "stdio"
});
