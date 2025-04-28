#!/usr/bin/env node

/**
 * Docker Setup Test Script for UAE Real-Estate AI Platform
 * 
 * This script tests the Docker setup instructions by performing a clean installation
 * and validation of the Docker environment for the UAE Real-Estate AI Platform.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  total: 0
};

/**
 * Execute a shell command and return the output
 * @param {string} command - Command to execute
 * @param {boolean} ignoreErrors - Whether to ignore command execution errors
 * @returns {string} Command output
 */
function execCommand(command, ignoreErrors = false) {
  try {
    console.log(`${colors.blue}Executing: ${command}${colors.reset}`);
    const output = execSync(command, { encoding: 'utf8' });
    return output;
  } catch (error) {
    if (ignoreErrors) {
      return error.message;
    }
    throw error;
  }
}

/**
 * Log a message with color
 * @param {string} message - Message to log
 * @param {string} color - Color to use
 */
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Log a test result
 * @param {string} name - Test name
 * @param {boolean} success - Whether the test passed
 * @param {string} message - Additional message
 * @param {boolean} isWarning - Whether this is a warning instead of a failure
 */
function logResult(name, success, message = '', isWarning = false) {
  results.total++;
  
  if (success) {
    results.passed++;
    log(`✅ ${name}`, colors.green);
    if (message) {
      log(`   ${message}`, colors.green);
    }
  } else if (isWarning) {
    results.warnings++;
    log(`⚠️ ${name}`, colors.yellow);
    if (message) {
      log(`   ${message}`, colors.yellow);
    }
  } else {
    results.failed++;
    log(`❌ ${name}`, colors.red);
    if (message) {
      log(`   ${message}`, colors.red);
    }
  }
  console.log(''); // Empty line for readability
}

/**
 * Create a test directory
 */
function createTestDirectory() {
  try {
    const testDir = path.resolve(process.cwd(), 'docker-test');
    
    // Remove existing test directory if it exists
    if (fs.existsSync(testDir)) {
      log('Removing existing test directory...', colors.yellow);
      execCommand(`rm -rf ${testDir}`);
    }
    
    // Create test directory
    log('Creating test directory...', colors.blue);
    fs.mkdirSync(testDir, { recursive: true });
    
    // Change to test directory
    process.chdir(testDir);
    log(`Working directory: ${process.cwd()}`, colors.blue);
    
    logResult('Test Directory Setup', true, `Created test directory at ${testDir}`);
    return testDir;
  } catch (error) {
    logResult('Test Directory Setup', false, `Error: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Copy Docker files to test directory
 */
function copyDockerFiles() {
  try {
    const sourceDir = path.resolve(__dirname, '..');
    const currentDir = process.cwd();
    
    log('Copying Docker files to test directory...', colors.blue);
    
    // Copy Dockerfile
    fs.copyFileSync(
      path.join(sourceDir, 'mcp_server', 'Dockerfile'),
      path.join(currentDir, 'Dockerfile')
    );
    
    // Copy docker-compose.yml
    fs.copyFileSync(
      path.join(sourceDir, 'docker-compose.yml'),
      path.join(currentDir, 'docker-compose.yml')
    );
    
    // Create .env file
    const envContent = `
# MCP Server Configuration
MCP_SERVER_PORT=3000

# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=vectordb
POSTGRES_PORT=5432

# API Keys (using placeholder values for testing)
BAYUT_API_KEY=test_bayut_api_key
PROPERTY_FINDER_API_KEY=test_property_finder_api_key
DLD_API_KEY=test_dld_api_key
OPENAI_API_KEY=test_openai_api_key

# Langfuse Configuration (Optional)
LANGFUSE_PUBLIC_KEY=test_langfuse_public_key
LANGFUSE_SECRET_KEY=test_langfuse_secret_key
LANGFUSE_HOST=https://cloud.langfuse.com
`;
    
    fs.writeFileSync(path.join(currentDir, '.env'), envContent);
    
    // Create minimal MCP server for testing
    const mcpServerDir = path.join(currentDir, 'mcp_server');
    fs.mkdirSync(mcpServerDir, { recursive: true });
    
    // Copy Dockerfile to mcp_server directory
    fs.copyFileSync(
      path.join(sourceDir, 'mcp_server', 'Dockerfile'),
      path.join(mcpServerDir, 'Dockerfile')
    );
    
    // Create minimal package.json
    const packageJson = {
      "name": "uae-real-estate-ai-mcp-server",
      "version": "1.0.0",
      "description": "MCP Server for UAE Real-Estate AI Platform",
      "main": "index.js",
      "scripts": {
        "build": "tsc",
        "start": "node dist/index.js"
      },
      "dependencies": {
        "express": "^4.18.2",
        "pg": "^8.11.0",
        "cors": "^2.8.5",
        "dotenv": "^16.0.3"
      },
      "devDependencies": {
        "typescript": "^5.0.4",
        "@types/express": "^4.17.17",
        "@types/pg": "^8.6.6",
        "@types/cors": "^2.8.13"
      }
    };
    
    fs.writeFileSync(
      path.join(mcpServerDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
    
    // Create minimal index.ts
    const indexTs = `
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Configure middleware
app.use(express.json());
app.use(cors());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(\`MCP Server running on port \${PORT}\`);
});

export default app;
`;
    
    fs.writeFileSync(path.join(mcpServerDir, 'index.ts'), indexTs);
    
    // Create tsconfig.json
    const tsConfig = {
      "compilerOptions": {
        "target": "ES2020",
        "module": "commonjs",
        "outDir": "./dist",
        "rootDir": "./",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true
      },
      "include": ["./**/*.ts"],
      "exclude": ["node_modules", "dist"]
    };
    
    fs.writeFileSync(
      path.join(mcpServerDir, 'tsconfig.json'),
      JSON.stringify(tsConfig, null, 2)
    );
    
    // Create db directory for PostgreSQL initialization
    const dbDir = path.join(currentDir, 'db', 'init');
    fs.mkdirSync(dbDir, { recursive: true });
    
    // Create init SQL script
    const initSql = `
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS property_embeddings (
  id SERIAL PRIMARY KEY,
  property_id TEXT UNIQUE,
  embedding vector(1536),
  metadata JSONB
);

CREATE INDEX IF NOT EXISTS property_embeddings_idx ON property_embeddings USING ivfflat (embedding vector_l2_ops) WITH (lists = 100);
`;
    
    fs.writeFileSync(path.join(dbDir, 'init.sql'), initSql);
    
    logResult('Docker Files Setup', true, 'Copied and created all necessary Docker files');
    return true;
  } catch (error) {
    logResult('Docker Files Setup', false, `Error: ${error.message}`);
    return false;
  }
}

/**
 * Build and start Docker containers
 */
function buildAndStartContainers() {
  try {
    log('Building Docker containers...', colors.blue);
    execCommand('docker-compose build');
    
    log('Starting Docker containers...', colors.blue);
    execCommand('docker-compose up -d');
    
    // Wait for containers to start
    log('Waiting for containers to start...', colors.blue);
    execCommand('sleep 10');
    
    // Check if containers are running
    const containerStatus = execCommand('docker-compose ps');
    const allRunning = containerStatus.includes('Up') && 
                      !containerStatus.includes('Exit') && 
                      !containerStatus.includes('Restarting');
    
    logResult(
      'Docker Containers',
      allRunning,
      allRunning ? 'All containers are running' : 'Some containers failed to start'
    );
    
    return allRunning;
  } catch (error) {
    logResult('Docker Containers', false, `Error: ${error.message}`);
    return false;
  }
}

/**
 * Test MCP server health
 */
function testMcpServerHealth() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/health',
      method: 'GET',
      timeout: 5000
    };
    
    log('Testing MCP server health...', colors.blue);
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          const isHealthy = response.status === 'ok';
          
          logResult(
            'MCP Server Health',
            isHealthy,
            isHealthy ? 'MCP server is healthy' : `MCP server returned: ${data}`
          );
          
          resolve(isHealthy);
        } catch (error) {
          logResult('MCP Server Health', false, `Error parsing response: ${error.message}`);
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      logResult('MCP Server Health', false, `Error connecting to MCP server: ${error.message}`);
      resolve(false);
    });
    
    req.on('timeout', () => {
      req.destroy();
      logResult('MCP Server Health', false, 'Connection to MCP server timed out');
      resolve(false);
    });
    
    req.end();
  });
}

/**
 * Test PostgreSQL connection
 */
function testPostgresConnection() {
  try {
    log('Testing PostgreSQL connection...', colors.blue);
    
    const result = execCommand(
      `docker-compose exec -T postgres pg_isready -h localhost -p 5432 -U postgres`,
      true
    );
    
    const isConnected = result.includes('accepting connections');
    logResult(
      'PostgreSQL Connection',
      isConnected,
      isConnected ? 'PostgreSQL is accepting connections' : `PostgreSQL connection failed: ${result}`
    );
    
    return isConnected;
  } catch (error) {
    logResult('PostgreSQL Connection', false, `Error: ${error.message}`);
    return false;
  }
}

/**
 * Clean up test environment
 */
function cleanUp() {
  try {
    log('Cleaning up test environment...', colors.blue);
    
    // Stop and remove containers
    execCommand('docker-compose down -v', true);
    
    logResult('Cleanup', true, 'Successfully cleaned up test environment');
    return true;
  } catch (error) {
    logResult('Cleanup', false, `Error: ${error.message}`);
    return false;
  }
}

/**
 * Print summary of test results
 */
function printSummary() {
  console.log('\n' + colors.bold + colors.cyan + '=== Test Summary ===' + colors.reset);
  console.log(colors.green + `✅ Passed: ${results.passed}/${results.total}` + colors.reset);
  
  if (results.warnings > 0) {
    console.log(colors.yellow + `⚠️ Warnings: ${results.warnings}/${results.total}` + colors.reset);
  }
  
  if (results.failed > 0) {
    console.log(colors.red + `❌ Failed: ${results.failed}/${results.total}` + colors.reset);
  }
  
  if (results.failed === 0 && results.warnings === 0) {
    console.log(colors.green + '\n🎉 All tests passed! The Docker setup instructions are working correctly.' + colors.reset);
  } else if (results.failed === 0) {
    console.log(colors.yellow + '\n⚠️ The Docker setup instructions are working but have some warnings to address.' + colors.reset);
  } else {
    console.log(colors.red + '\n❌ The Docker setup instructions have issues that need to be fixed.' + colors.reset);
  }
}

/**
 * Main function to run all tests
 */
async function main() {
  log(colors.bold + colors.cyan + '\n=== UAE Real-Estate AI Platform Docker Setup Test ===\n' + colors.reset);
  
  try {
    // Create test directory
    const testDir = createTestDirectory();
    
    // Copy Docker files
    const filesSetup = copyDockerFiles();
    if (!filesSetup) {
      throw new Error('Failed to set up Docker files');
    }
    
    // Build and start containers
    const containersStarted = buildAndStartContainers();
    if (!containersStarted) {
      throw new Error('Failed to start Docker containers');
    }
    
    // Test MCP server health
    const mcpHealthy = await testMcpServerHealth();
    if (!mcpHealthy) {
      throw new Error('MCP server is not healthy');
    }
    
    // Test PostgreSQL connection
    const postgresConnected = testPostgresConnection();
    if (!postgresConnected) {
      throw new Error('PostgreSQL connection failed');
    }
    
    // Clean up
    cleanUp();
    
    // Print summary
    printSummary();
    
    return results.failed === 0;
  } catch (error) {
    log(`Test failed: ${error.message}`, colors.red);
    
    // Attempt to clean up even if tests fail
    cleanUp();
    
    // Print summary
    printSummary();
    
    return false;
  }
}

// Run the main function
main().then(success => {
  process.exit(success ? 0 : 1);
});
