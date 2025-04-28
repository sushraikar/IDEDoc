#!/usr/bin/env node

const http = require('http');

// Configuration
const MCP_SERVER_HOST = 'localhost';
const MCP_SERVER_PORT = 3000;
const TIMEOUT_MS = 5000;

console.log('Testing MCP Server components...');
console.log(`Server: ${MCP_SERVER_HOST}:${MCP_SERVER_PORT}`);
console.log('-----------------------------------\n');

// Helper function to make HTTP requests
function makeRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: MCP_SERVER_HOST,
      port: MCP_SERVER_PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ statusCode: res.statusCode, data: jsonData });
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });
    
    // Set timeout
    req.setTimeout(TIMEOUT_MS, () => {
      req.abort();
      reject(new Error(`Request timed out after ${TIMEOUT_MS}ms`));
    });
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    
    req.end();
  });
}

// Test health check endpoint
async function testHealthCheck() {
  console.log('Testing health check endpoint...');
  try {
    const response = await makeRequest('/mcp/health');
    
    if (response.statusCode !== 200) {
      console.error(`❌ Health check failed with status code: ${response.statusCode}`);
      return false;
    }
    
    if (!response.data.status || response.data.status !== 'healthy') {
      console.error('❌ Health check response does not indicate healthy status');
      return false;
    }
    
    console.log('✅ Health check passed');
    console.log(`   Status: ${response.data.status}`);
    console.log(`   Version: ${response.data.version}`);
    console.log(`   Tool count: ${response.data.toolCount}`);
    return true;
  } catch (error) {
    console.error(`❌ Health check error: ${error.message}`);
    return false;
  }
}

// Test list tools endpoint
async function testListTools() {
  console.log('\nTesting list tools endpoint...');
  try {
    const response = await makeRequest('/mcp/list-tools');
    
    if (response.statusCode !== 200) {
      console.error(`❌ List tools failed with status code: ${response.statusCode}`);
      return false;
    }
    
    if (!response.data.tools || !Array.isArray(response.data.tools)) {
      console.error('❌ List tools response does not contain tools array');
      return false;
    }
    
    console.log('✅ List tools passed');
    console.log(`   Server name: ${response.data.name}`);
    console.log(`   Server version: ${response.data.version}`);
    console.log(`   Available tools: ${response.data.tools.length}`);
    
    // Print tool details
    response.data.tools.forEach((tool, index) => {
      console.log(`\n   Tool #${index + 1}: ${tool.name}`);
      console.log(`   Description: ${tool.description}`);
      console.log(`   Parameters: ${tool.parameters.length}`);
    });
    
    return response.data.tools;
  } catch (error) {
    console.error(`❌ List tools error: ${error.message}`);
    return false;
  }
}

// Test execute tool endpoint
async function testExecuteTool(toolName, params) {
  console.log(`\nTesting execute tool endpoint for ${toolName}...`);
  try {
    const response = await makeRequest(`/mcp/execute/${toolName}`, 'POST', params);
    
    if (response.statusCode !== 200) {
      console.error(`❌ Execute tool failed with status code: ${response.statusCode}`);
      return false;
    }
    
    if (!response.data.result) {
      console.error('❌ Execute tool response does not contain result');
      return false;
    }
    
    console.log('✅ Execute tool passed');
    console.log('   Result:');
    console.log(JSON.stringify(response.data.result, null, 2).split('\n').map(line => `   ${line}`).join('\n'));
    
    return true;
  } catch (error) {
    console.error(`❌ Execute tool error: ${error.message}`);
    return false;
  }
}

// Test error handling
async function testErrorHandling() {
  console.log('\nTesting error handling...');
  
  // Test non-existent tool
  try {
    console.log('Testing non-existent tool...');
    const response = await makeRequest('/mcp/execute/nonExistentTool', 'POST', {});
    
    if (response.statusCode === 404 && response.data.error) {
      console.log('✅ Non-existent tool test passed');
      console.log(`   Error message: ${response.data.error}`);
    } else {
      console.error('❌ Non-existent tool test failed - expected 404 error');
      return false;
    }
  } catch (error) {
    console.error(`❌ Non-existent tool test error: ${error.message}`);
    return false;
  }
  
  // Test missing required parameters
  try {
    console.log('\nTesting missing required parameters...');
    const response = await makeRequest('/mcp/execute/propertySearch', 'POST', {});
    
    if (response.statusCode === 400 && response.data.error) {
      console.log('✅ Missing parameters test passed');
      console.log(`   Error message: ${response.data.error}`);
      if (response.data.missingParams) {
        console.log(`   Missing parameters: ${response.data.missingParams.join(', ')}`);
      }
    } else {
      console.error('❌ Missing parameters test failed - expected 400 error');
      return false;
    }
  } catch (error) {
    console.error(`❌ Missing parameters test error: ${error.message}`);
    return false;
  }
  
  // Test invalid JSON
  try {
    console.log('\nTesting invalid JSON...');
    
    const options = {
      hostname: MCP_SERVER_HOST,
      port: MCP_SERVER_PORT,
      path: '/mcp/execute/propertySearch',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          if (res.statusCode === 400 && jsonData.error) {
            console.log('✅ Invalid JSON test passed');
            console.log(`   Error message: ${jsonData.error}`);
          } else {
            console.error('❌ Invalid JSON test failed - expected 400 error');
          }
        } catch (error) {
          console.error(`❌ Failed to parse response: ${error.message}`);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error(`❌ Request failed: ${error.message}`);
    });
    
    // Send invalid JSON
    req.write('{"this is not valid JSON');
    req.end();
    
    // Wait for response
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  } catch (error) {
    console.error(`❌ Invalid JSON test error: ${error.message}`);
    return false;
  }
}

// Run all tests
async function runTests() {
  try {
    // Test health check
    const healthCheckPassed = await testHealthCheck();
    if (!healthCheckPassed) {
      console.error('\n❌ Health check failed. Make sure the MCP server is running.');
      process.exit(1);
    }
    
    // Test list tools
    const tools = await testListTools();
    if (!tools) {
      console.error('\n❌ List tools test failed.');
      process.exit(1);
    }
    
    // Test execute tool for each tool
    let executeTestsPassed = true;
    
    // Find property search tool
    const propertySearchTool = tools.find(tool => tool.name === 'propertySearch');
    if (propertySearchTool) {
      const propertySearchPassed = await testExecuteTool('propertySearch', {
        location: 'Downtown Dubai',
        propertyType: 'apartment',
        minPrice: 1000000,
        maxPrice: 3000000,
        limit: 2
      });
      executeTestsPassed = executeTestsPassed && propertySearchPassed;
    }
    
    // Find market insights tool
    const marketInsightsTool = tools.find(tool => tool.name === 'marketInsights');
    if (marketInsightsTool) {
      const marketInsightsPassed = await testExecuteTool('marketInsights', {
        location: 'Dubai Marina',
        propertyType: 'apartment'
      });
      executeTestsPassed = executeTestsPassed && marketInsightsPassed;
    }
    
    // Find translation tool
    const translationTool = tools.find(tool => tool.name === 'translation');
    if (translationTool) {
      const translationPassed = await testExecuteTool('translation', {
        text: 'Welcome to our real estate platform',
        targetLanguage: 'ar'
      });
      executeTestsPassed = executeTestsPassed && translationPassed;
    }
    
    // Test error handling
    const errorHandlingPassed = await testErrorHandling();
    executeTestsPassed = executeTestsPassed && errorHandlingPassed;
    
    // Final result
    console.log('\n-----------------------------------');
    if (executeTestsPassed) {
      console.log('✅ All MCP server tests passed!');
      return true;
    } else {
      console.error('❌ Some MCP server tests failed.');
      return false;
    }
  } catch (error) {
    console.error(`\n❌ Test execution error: ${error.message}`);
    return false;
  }
}

// Check if MCP server is running
console.log('Checking if MCP server is running...');
makeRequest('/mcp/health')
  .then(() => {
    console.log('✅ MCP server is running\n');
    runTests().then(success => {
      if (!success) {
        process.exit(1);
      }
    });
  })
  .catch(error => {
    console.error(`❌ MCP server is not running: ${error.message}`);
    console.error('\nPlease start the MCP server with:');
    console.error('  cd ide/mcp_server');
    console.error('  npm install');
    console.error('  npx ts-node index.ts');
    process.exit(1);
  });
