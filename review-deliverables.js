#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('Reviewing all deliverables for UAE Real-Estate AI Windsurf IDE Package...');
console.log('----------------------------------------------------------------');

// Define required files and their minimum sizes
const requiredFiles = [
  { path: 'setup.md', minSize: 2000, description: 'Setup Guide' },
  { path: 'windsurf_flows.md', minSize: 5000, description: 'Windsurf Flow JSON Snippets' },
  { path: 'troubleshooting.md', minSize: 2000, description: 'Troubleshooting Guide' },
  { path: 'mcp_server/index.ts', minSize: 1000, description: 'MCP Server Implementation' },
  { path: '.github/workflows/ide-lint.yml', minSize: 500, description: 'GitHub Workflow File' },
  { path: 'scripts/validate-flows.js', minSize: 500, description: 'Flow Validation Script' },
  { path: 'scripts/test-mcp-server.js', minSize: 500, description: 'MCP Server Test Script' }
];

// Define required content patterns
const contentPatterns = [
  { file: 'setup.md', pattern: /Download and Installation/, description: 'Download and installation instructions' },
  { file: 'setup.md', pattern: /MCP Server Setup/, description: 'MCP server setup instructions' },
  { file: 'windsurf_flows.md', pattern: /```json/, description: 'JSON code blocks' },
  { file: 'windsurf_flows.md', pattern: /flow_init_backend/, description: 'Backend initialization flow' },
  { file: 'windsurf_flows.md', pattern: /flow_pgvector_migration/, description: 'PGVector migration flow' },
  { file: 'windsurf_flows.md', pattern: /flow_langfuse_trace/, description: 'Langfuse tracing flow' },
  { file: 'windsurf_flows.md', pattern: /flow_deploy_helm/, description: 'Helm deployment flow' },
  { file: 'windsurf_flows.md', pattern: /flow_write_adr/, description: 'ADR writing flow' },
  { file: 'troubleshooting.md', pattern: /MCP Server Connection Problems/, description: 'MCP server troubleshooting section' },
  { file: 'troubleshooting.md', pattern: /AI Flow Execution Errors/, description: 'Flow execution troubleshooting section' },
  { file: 'mcp_server/index.ts', pattern: /class.*implements MCPServer/, description: 'MCP Server class implementation' },
  { file: 'mcp_server/index.ts', pattern: /interface MCPTool/, description: 'MCPTool interface' },
  { file: 'mcp_server/index.ts', pattern: /class.*implements MCPTool/, description: 'Tool implementations' },
  { file: '.github/workflows/ide-lint.yml', pattern: /name: IDE Lint and Validation/, description: 'Workflow name' },
  { file: '.github/workflows/ide-lint.yml', pattern: /validate-flow/i, description: 'Flow validation step' }
];

// Check if all required files exist and meet minimum size requirements
let missingFiles = [];
let undersizedFiles = [];
let fileStats = [];

for (const file of requiredFiles) {
  const filePath = path.join(__dirname, '..', file.path);
  
  if (!fs.existsSync(filePath)) {
    missingFiles.push(file);
    continue;
  }
  
  const stats = fs.statSync(filePath);
  const fileSize = stats.size;
  
  if (fileSize < file.minSize) {
    undersizedFiles.push({
      ...file,
      actualSize: fileSize
    });
  }
  
  fileStats.push({
    path: file.path,
    description: file.description,
    size: fileSize,
    lastModified: stats.mtime
  });
}

// Check for required content patterns
let missingPatterns = [];

for (const pattern of contentPatterns) {
  const filePath = path.join(__dirname, '..', pattern.file);
  
  if (!fs.existsSync(filePath)) {
    // File already reported as missing
    continue;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  if (!pattern.pattern.test(content)) {
    missingPatterns.push(pattern);
  }
}

// Count the number of Flow JSON snippets
let flowCount = 0;
const flowsFilePath = path.join(__dirname, '..', 'windsurf_flows.md');

if (fs.existsSync(flowsFilePath)) {
  const flowsContent = fs.readFileSync(flowsFilePath, 'utf8');
  const jsonMatches = flowsContent.match(/```json\n([\s\S]*?)\n```/g);
  flowCount = jsonMatches ? jsonMatches.length : 0;
}

// Count the number of MCP tools
let toolCount = 0;
const mcpServerPath = path.join(__dirname, '..', 'mcp_server/index.ts');

if (fs.existsSync(mcpServerPath)) {
  const mcpServerContent = fs.readFileSync(mcpServerPath, 'utf8');
  const toolMatches = mcpServerContent.match(/class\s+(\w+)\s+implements\s+MCPTool/g);
  toolCount = toolMatches ? toolMatches.length : 0;
}

// Print review results
console.log('File Status:');
console.log('------------');

if (missingFiles.length === 0 && undersizedFiles.length === 0) {
  console.log('✅ All required files exist and meet minimum size requirements');
} else {
  if (missingFiles.length > 0) {
    console.log('❌ Missing files:');
    missingFiles.forEach(file => {
      console.log(`   - ${file.path} (${file.description})`);
    });
  }
  
  if (undersizedFiles.length > 0) {
    console.log('❌ Files that do not meet minimum size requirements:');
    undersizedFiles.forEach(file => {
      console.log(`   - ${file.path}: ${file.actualSize} bytes (minimum: ${file.minSize} bytes)`);
    });
  }
}

console.log('\nContent Verification:');
console.log('--------------------');

if (missingPatterns.length === 0) {
  console.log('✅ All required content patterns found');
} else {
  console.log('❌ Missing content patterns:');
  missingPatterns.forEach(pattern => {
    console.log(`   - ${pattern.file}: ${pattern.description}`);
  });
}

console.log('\nComponent Counts:');
console.log('----------------');
console.log(`Flow JSON snippets: ${flowCount} (minimum required: 5)`);
console.log(`MCP tools: ${toolCount} (minimum required: 3)`);

if (flowCount < 5) {
  console.log('❌ Not enough Flow JSON snippets (minimum 5 required)');
}

if (toolCount < 3) {
  console.log('❌ Not enough MCP tools (minimum 3 required)');
}

console.log('\nFile Details:');
console.log('------------');
fileStats.forEach(file => {
  console.log(`${file.path}:`);
  console.log(`   Description: ${file.description}`);
  console.log(`   Size: ${file.size} bytes`);
  console.log(`   Last Modified: ${file.lastModified}`);
  console.log('');
});

// Generate summary report
const summary = {
  timestamp: new Date().toISOString(),
  totalFiles: requiredFiles.length,
  missingFiles: missingFiles.length,
  undersizedFiles: undersizedFiles.length,
  missingPatterns: missingPatterns.length,
  flowCount,
  toolCount,
  fileStats,
  status: (missingFiles.length === 0 && 
           undersizedFiles.length === 0 && 
           missingPatterns.length === 0 && 
           flowCount >= 5 && 
           toolCount >= 3) ? 'PASS' : 'FAIL'
};

// Write summary report
const reportPath = path.join(__dirname, '..', 'review_report.json');
fs.writeFileSync(reportPath, JSON.stringify(summary, null, 2));

console.log(`Review report written to: ${reportPath}`);
console.log('\nOverall Status:');
console.log('--------------');

if (summary.status === 'PASS') {
  console.log('✅ All deliverables meet requirements');
  console.log('\nThe UAE Real-Estate AI Windsurf IDE Package is ready for delivery!');
} else {
  console.log('❌ Some deliverables do not meet requirements');
  console.log('\nPlease address the issues above before delivery.');
  process.exit(1);
}
