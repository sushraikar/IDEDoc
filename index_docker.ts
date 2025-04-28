// MCP Server for UAE Real-Estate AI Platform - Docker-compatible version

import express from 'express';
import { Pool } from 'pg';
import { createClient } from '@langfuse/node';
import dotenv from 'dotenv';
import cors from 'cors';
import { PropertySearchTool } from './tools/PropertySearchTool';
import { PropertyAnalysisTool } from './tools/PropertyAnalysisTool';
import { MarketInsightsTool } from './tools/MarketInsightsTool';
import { ProposalGeneratorTool } from './tools/ProposalGeneratorTool';
import { TranslationTool } from './tools/TranslationTool';
import { DatabaseConnector } from './db/connector';
import { logger } from './utils/logger';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Configure middleware
app.use(express.json());
app.use(cors());

// Configure database connection
const dbConfig = {
  connectionString: process.env.VECTOR_DB_CONNECTION || 'postgresql://postgres:postgres@postgres:5432/vectordb',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Create database pool
const pool = new Pool(dbConfig);
const dbConnector = new DatabaseConnector(pool);

// Initialize Langfuse for tracing (if configured)
let langfuse;
if (process.env.LANGFUSE_PUBLIC_KEY && process.env.LANGFUSE_SECRET_KEY) {
  langfuse = createClient({
    publicKey: process.env.LANGFUSE_PUBLIC_KEY,
    secretKey: process.env.LANGFUSE_SECRET_KEY,
    baseUrl: process.env.LANGFUSE_HOST || 'https://cloud.langfuse.com',
  });
  logger.info('Langfuse tracing initialized');
} else {
  logger.warn('Langfuse tracing not configured - skipping initialization');
}

// Initialize tools
const tools = [
  new PropertySearchTool(dbConnector),
  new PropertyAnalysisTool(dbConnector),
  new MarketInsightsTool(dbConnector),
  new ProposalGeneratorTool(dbConnector),
  new TranslationTool(),
];

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
  logger.info(`Created logs directory at ${logsDir}`);
}

// MCP Server routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/tools', (req, res) => {
  const toolsInfo = tools.map(tool => ({
    name: tool.name,
    description: tool.description,
    parameters: tool.parameters,
  }));
  res.json(toolsInfo);
});

app.post('/tools/:toolName', async (req, res) => {
  const { toolName } = req.params;
  const parameters = req.body;
  
  // Start tracing if Langfuse is configured
  let trace;
  if (langfuse) {
    trace = langfuse.trace({
      name: `${toolName}_execution`,
      metadata: { parameters },
    });
  }
  
  try {
    // Find the requested tool
    const tool = tools.find(t => t.name === toolName);
    if (!tool) {
      logger.error(`Tool not found: ${toolName}`);
      return res.status(404).json({ error: `Tool not found: ${toolName}` });
    }
    
    logger.info(`Executing tool: ${toolName}`, { parameters });
    
    // Execute the tool
    const result = await tool.execute(parameters);
    
    // Complete tracing if Langfuse is configured
    if (trace) {
      trace.update({ 
        status: 'success',
        output: result,
      });
    }
    
    logger.info(`Tool execution successful: ${toolName}`);
    res.json(result);
  } catch (error) {
    logger.error(`Error executing tool ${toolName}:`, error);
    
    // Record error in trace if Langfuse is configured
    if (trace) {
      trace.update({ 
        status: 'error',
        error: error.message,
      });
    }
    
    res.status(500).json({ error: error.message });
  }
});

app.get('/tracing/status', (req, res) => {
  res.json({ 
    enabled: !!langfuse,
    host: process.env.LANGFUSE_HOST || 'https://cloud.langfuse.com'
  });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`MCP Server running on port ${PORT}`);
  logger.info(`Database connection: ${dbConfig.connectionString.replace(/:[^:]*@/, ':****@')}`);
});

// Handle graceful shutdown
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

async function shutdown() {
  logger.info('Shutting down MCP server...');
  
  // Close database pool
  await pool.end();
  logger.info('Database connections closed');
  
  // Exit process
  process.exit(0);
}

// Export app for testing
export default app;
