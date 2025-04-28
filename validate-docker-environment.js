#!/usr/bin/env node

/**
 * Docker Environment Validation Script for UAE Real-Estate AI Platform
 * 
 * This script validates the Docker environment setup for the UAE Real-Estate AI Platform.
 * It checks Docker installation, container status, network configuration, and service health.
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

// Configuration
const config = {
  requiredContainers: ['uae-realestate-mcp-server', 'uae-realestate-postgres'],
  mcpServerPort: process.env.MCP_SERVER_PORT || 3000,
  postgresPort: process.env.POSTGRES_PORT || 5432,
  networkName: 'uae-realestate-network',
  volumeNames: ['uae-realestate-postgres-data', 'uae-realestate-mcp-logs']
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
    return execSync(command, { encoding: 'utf8' });
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
 * Check if Docker is installed and running
 */
function checkDockerInstallation() {
  try {
    const dockerVersion = execCommand('docker --version');
    const dockerComposeVersion = execCommand('docker-compose --version', true);
    
    logResult(
      'Docker Installation', 
      true, 
      `Docker version: ${dockerVersion.trim()}\nDocker Compose version: ${dockerComposeVersion.trim()}`
    );
    
    const dockerInfo = execCommand('docker info');
    const isRunning = dockerInfo.includes('Server Version');
    
    logResult(
      'Docker Engine Status', 
      isRunning, 
      isRunning ? 'Docker Engine is running' : 'Docker Engine is not running'
    );
  } catch (error) {
    logResult('Docker Installation', false, `Error: ${error.message}`);
  }
}

/**
 * Check if required containers are running
 */
function checkContainers() {
  try {
    const containers = execCommand('docker ps --format "{{.Names}}"', true);
    
    config.requiredContainers.forEach(container => {
      const isRunning = containers.includes(container);
      logResult(
        `Container: ${container}`,
        isRunning,
        isRunning ? `Container is running` : `Container is not running`
      );
    });
  } catch (error) {
    logResult('Container Check', false, `Error: ${error.message}`);
  }
}

/**
 * Check Docker network configuration
 */
function checkNetworkConfiguration() {
  try {
    const networks = execCommand('docker network ls --format "{{.Name}}"');
    const networkExists = networks.includes(config.networkName);
    
    logResult(
      `Network: ${config.networkName}`,
      networkExists,
      networkExists ? 'Network exists' : 'Network does not exist'
    );
    
    if (networkExists) {
      const networkInspect = execCommand(`docker network inspect ${config.networkName}`);
      const networkInfo = JSON.parse(networkInspect);
      
      if (networkInfo.length > 0) {
        const containers = Object.keys(networkInfo[0].Containers || {});
        const allContainersConnected = config.requiredContainers.every(container => 
          containers.some(c => networkInfo[0].Containers[c].Name === container)
        );
        
        logResult(
          'Network Container Connections',
          allContainersConnected,
          allContainersConnected 
            ? 'All required containers are connected to the network' 
            : 'Some containers are not connected to the network',
          !allContainersConnected
        );
      }
    }
  } catch (error) {
    logResult('Network Configuration', false, `Error: ${error.message}`);
  }
}

/**
 * Check Docker volumes
 */
function checkVolumes() {
  try {
    const volumes = execCommand('docker volume ls --format "{{.Name}}"');
    
    config.volumeNames.forEach(volume => {
      const exists = volumes.includes(volume);
      logResult(
        `Volume: ${volume}`,
        exists,
        exists ? 'Volume exists' : 'Volume does not exist',
        !exists
      );
    });
  } catch (error) {
    logResult('Volume Check', false, `Error: ${error.message}`);
  }
}

/**
 * Check MCP server health
 */
function checkMcpServerHealth() {
  const options = {
    hostname: 'localhost',
    port: config.mcpServerPort,
    path: '/health',
    method: 'GET',
    timeout: 5000
  };
  
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
      } catch (error) {
        logResult('MCP Server Health', false, `Error parsing response: ${error.message}`);
      }
    });
  });
  
  req.on('error', (error) => {
    logResult('MCP Server Health', false, `Error connecting to MCP server: ${error.message}`);
  });
  
  req.on('timeout', () => {
    req.destroy();
    logResult('MCP Server Health', false, 'Connection to MCP server timed out');
  });
  
  req.end();
}

/**
 * Check PostgreSQL connection
 */
function checkPostgresConnection() {
  try {
    const result = execCommand(
      `docker exec uae-realestate-postgres pg_isready -h localhost -p 5432 -U postgres`, 
      true
    );
    
    const isConnected = result.includes('accepting connections');
    logResult(
      'PostgreSQL Connection',
      isConnected,
      isConnected ? 'PostgreSQL is accepting connections' : `PostgreSQL connection failed: ${result}`
    );
    
    // Check if pgvector extension is installed
    try {
      const pgvectorCheck = execCommand(
        `docker exec uae-realestate-postgres psql -U postgres -d vectordb -c "SELECT * FROM pg_extension WHERE extname = 'vector';" -t`,
        true
      );
      
      const isPgvectorInstalled = pgvectorCheck.trim().length > 0;
      logResult(
        'pgvector Extension',
        isPgvectorInstalled,
        isPgvectorInstalled ? 'pgvector extension is installed' : 'pgvector extension is not installed',
        !isPgvectorInstalled
      );
    } catch (error) {
      logResult('pgvector Extension', false, `Error checking pgvector extension: ${error.message}`);
    }
  } catch (error) {
    logResult('PostgreSQL Connection', false, `Error: ${error.message}`);
  }
}

/**
 * Check Docker resource usage
 */
function checkResourceUsage() {
  try {
    const stats = execCommand(`docker stats --no-stream --format "{{.Name}},{{.CPUPerc}},{{.MemUsage}},{{.MemPerc}}"`);
    const lines = stats.trim().split('\n');
    
    config.requiredContainers.forEach(container => {
      const containerStats = lines.find(line => line.startsWith(container));
      
      if (containerStats) {
        const [_, cpuPerc, memUsage, memPerc] = containerStats.split(',');
        
        // Parse memory percentage
        const memPercValue = parseFloat(memPerc.replace('%', ''));
        const cpuPercValue = parseFloat(cpuPerc.replace('%', ''));
        
        const highMemory = memPercValue > 80;
        const highCpu = cpuPercValue > 80;
        
        logResult(
          `Resource Usage: ${container}`,
          !highMemory && !highCpu,
          `CPU: ${cpuPerc}, Memory: ${memUsage} (${memPerc})`,
          highMemory || highCpu
        );
      } else {
        logResult(`Resource Usage: ${container}`, false, 'Container not found in stats output');
      }
    });
  } catch (error) {
    logResult('Resource Usage', false, `Error: ${error.message}`);
  }
}

/**
 * Check environment variables
 */
function checkEnvironmentVariables() {
  try {
    // Check if .env file exists
    const envPath = path.resolve(process.cwd(), '.env');
    const envExists = fs.existsSync(envPath);
    
    logResult(
      '.env File',
      envExists,
      envExists ? '.env file exists' : '.env file not found',
      !envExists
    );
    
    if (envExists) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const requiredVars = [
        'MCP_SERVER_PORT',
        'POSTGRES_USER',
        'POSTGRES_PASSWORD',
        'POSTGRES_DB',
        'POSTGRES_PORT'
      ];
      
      const missingVars = requiredVars.filter(variable => !envContent.includes(`${variable}=`));
      
      logResult(
        'Required Environment Variables',
        missingVars.length === 0,
        missingVars.length === 0 
          ? 'All required environment variables are set' 
          : `Missing environment variables: ${missingVars.join(', ')}`,
        missingVars.length > 0
      );
      
      // Check for API keys (optional but recommended)
      const apiKeys = [
        'BAYUT_API_KEY',
        'PROPERTY_FINDER_API_KEY',
        'DLD_API_KEY',
        'OPENAI_API_KEY'
      ];
      
      const missingApiKeys = apiKeys.filter(key => !envContent.includes(`${key}=`));
      
      logResult(
        'API Keys',
        missingApiKeys.length === 0,
        missingApiKeys.length === 0 
          ? 'All API keys are set' 
          : `Missing API keys: ${missingApiKeys.join(', ')}`,
        missingApiKeys.length > 0
      );
    }
  } catch (error) {
    logResult('Environment Variables', false, `Error: ${error.message}`);
  }
}

/**
 * Print summary of test results
 */
function printSummary() {
  console.log('\n' + colors.bold + colors.cyan + '=== Validation Summary ===' + colors.reset);
  console.log(colors.green + `✅ Passed: ${results.passed}/${results.total}` + colors.reset);
  
  if (results.warnings > 0) {
    console.log(colors.yellow + `⚠️ Warnings: ${results.warnings}/${results.total}` + colors.reset);
  }
  
  if (results.failed > 0) {
    console.log(colors.red + `❌ Failed: ${results.failed}/${results.total}` + colors.reset);
  }
  
  if (results.failed === 0 && results.warnings === 0) {
    console.log(colors.green + '\n🎉 All checks passed! Your Docker environment is correctly set up.' + colors.reset);
  } else if (results.failed === 0) {
    console.log(colors.yellow + '\n⚠️ Your Docker environment is working but has some warnings to address.' + colors.reset);
  } else {
    console.log(colors.red + '\n❌ Your Docker environment has issues that need to be fixed.' + colors.reset);
    console.log(colors.cyan + 'Please refer to the troubleshooting_docker.md guide for solutions.' + colors.reset);
  }
}

/**
 * Main function to run all checks
 */
function main() {
  log(colors.bold + colors.cyan + '\n=== UAE Real-Estate AI Platform Docker Environment Validation ===\n' + colors.reset);
  
  // Run all checks
  checkDockerInstallation();
  checkContainers();
  checkNetworkConfiguration();
  checkVolumes();
  checkMcpServerHealth();
  checkPostgresConnection();
  checkResourceUsage();
  checkEnvironmentVariables();
  
  // Print summary
  printSummary();
}

// Run the main function
main();
