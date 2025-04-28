#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('Validating Windsurf Flow JSON snippets...');

// Read the windsurf_flows.md file
const flowsFilePath = path.join(__dirname, '..', 'windsurf_flows.md');
const flowsFile = fs.readFileSync(flowsFilePath, 'utf8');

// Extract JSON snippets
const jsonRegex = /```json\n([\s\S]*?)\n```/g;
let match;
let validFlows = 0;
let invalidFlows = 0;
let flowDetails = [];

while ((match = jsonRegex.exec(flowsFile)) !== null) {
  try {
    const jsonContent = match[1];
    const parsed = JSON.parse(jsonContent);
    
    // Validate flow structure
    if (!parsed.name || !parsed.description || !parsed.uid || !Array.isArray(parsed.actions)) {
      console.error(`❌ Invalid flow structure: ${parsed.name || 'Unnamed flow'}`);
      console.error('   Missing required fields (name, description, uid, or actions)');
      invalidFlows++;
      flowDetails.push({
        name: parsed.name || 'Unnamed flow',
        valid: false,
        reason: 'Missing required fields'
      });
      continue;
    }
    
    // Validate actions
    let invalidActions = [];
    for (const [index, action] of parsed.actions.entries()) {
      if (!action.type) {
        invalidActions.push({index, reason: 'Missing type'});
        continue;
      }
      
      // Validate specific action types
      switch (action.type) {
        case 'createFile':
          if (!action.path || !action.content) {
            invalidActions.push({index, reason: 'createFile action missing path or content'});
          }
          break;
        case 'createDirectory':
          if (!action.path) {
            invalidActions.push({index, reason: 'createDirectory action missing path'});
          }
          break;
        case 'updateFile':
          if (!action.path || !action.updates) {
            invalidActions.push({index, reason: 'updateFile action missing path or updates'});
          }
          break;
        case 'executeCommand':
          if (!action.command) {
            invalidActions.push({index, reason: 'executeCommand action missing command'});
          }
          break;
      }
    }
    
    if (invalidActions.length > 0) {
      console.error(`❌ Flow "${parsed.name}" has ${invalidActions.length} invalid actions:`);
      invalidActions.forEach(ia => {
        console.error(`   - Action #${ia.index + 1}: ${ia.reason}`);
      });
      invalidFlows++;
      flowDetails.push({
        name: parsed.name,
        valid: false,
        reason: `${invalidActions.length} invalid actions`,
        invalidActions
      });
      continue;
    }
    
    console.log(`✅ Valid flow: ${parsed.name}`);
    console.log(`   UID: ${parsed.uid}`);
    console.log(`   Actions: ${parsed.actions.length}`);
    validFlows++;
    flowDetails.push({
      name: parsed.name,
      valid: true,
      uid: parsed.uid,
      actionCount: parsed.actions.length
    });
  } catch (error) {
    console.error(`❌ JSON parsing error: ${error.message}`);
    invalidFlows++;
    flowDetails.push({
      name: 'Unknown (JSON parsing error)',
      valid: false,
      reason: error.message
    });
  }
}

console.log('\nValidation summary:');
console.log(`Total flows found: ${validFlows + invalidFlows}`);
console.log(`Valid flows: ${validFlows}`);
console.log(`Invalid flows: ${invalidFlows}`);

// Write validation report
const reportPath = path.join(__dirname, '..', 'flow_validation_report.json');
fs.writeFileSync(reportPath, JSON.stringify({
  timestamp: new Date().toISOString(),
  totalFlows: validFlows + invalidFlows,
  validFlows,
  invalidFlows,
  flows: flowDetails
}, null, 2));

console.log(`\nDetailed validation report written to: ${reportPath}`);

if (invalidFlows > 0) {
  console.error('\n❌ Validation failed. Please fix the issues above.');
  process.exit(1);
} else {
  console.log('\n✅ All flows are valid!');
}
