# Troubleshooting Guide for UAE Real-Estate AI in Windsurf Editor

This guide addresses common issues you might encounter when working with the UAE Real-Estate AI Operating System in Windsurf Editor.

## Table of Contents

1. [Installation Issues](#installation-issues)
2. [Windsurf Editor Configuration](#windsurf-editor-configuration)
3. [MCP Server Connection Problems](#mcp-server-connection-problems)
4. [AI Flow Execution Errors](#ai-flow-execution-errors)
5. [Performance Optimization](#performance-optimization)
6. [Common Error Messages](#common-error-messages)

## Installation Issues

### Problem: Windsurf Editor fails to install

**Symptoms:**
- Installation process terminates unexpectedly
- Error messages about missing dependencies
- Installer hangs indefinitely

**Solutions:**

1. **Check system requirements:**
   - Ensure your system meets the minimum requirements (8GB RAM, 2GB disk space)
   - Verify your operating system is supported (Windows 10/11, macOS 10.15+, Ubuntu 20.04+)

2. **Clear temporary files:**
   ```bash
   # Windows
   del %TEMP%\windsurf_* /F /Q
   
   # macOS/Linux
   rm -rf /tmp/windsurf_*
   ```

3. **Run as administrator/with sudo:**
   - Windows: Right-click installer and select "Run as administrator"
   - macOS: Use `sudo` when necessary
   - Linux: Use `sudo` for installation commands

4. **Disable antivirus temporarily:**
   - Some antivirus software may block installation
   - Temporarily disable and retry installation
   - Remember to re-enable after installation

### Problem: Missing dependencies after installation

**Symptoms:**
- Windsurf Editor launches but features are missing
- Error messages about missing Node.js or TypeScript

**Solutions:**

1. **Install Node.js manually:**
   - Download and install Node.js 18+ from [nodejs.org](https://nodejs.org/)
   - Restart Windsurf Editor after installation

2. **Repair Windsurf installation:**
   - Windows: Use "Apps & Features" to repair Windsurf
   - macOS: Reinstall Windsurf
   - Linux: Run `sudo apt-get install --reinstall windsurf` (for Debian-based systems)

## Windsurf Editor Configuration

### Problem: Cascade AI assistant not working

**Symptoms:**
- Cascade panel is empty or shows errors
- AI responses are not generated
- "Model unavailable" error messages

**Solutions:**

1. **Check internet connection:**
   - Ensure you have a stable internet connection
   - Try accessing other online services to verify connectivity

2. **Verify account authentication:**
   - Check if you're properly logged in to Windsurf
   - Go to Settings > Account to verify your login status
   - Re-authenticate if necessary

3. **Reset Cascade:**
   - Open Command Palette (Cmd/Ctrl+Shift+P)
   - Type "Reset Cascade" and select the command
   - Restart Windsurf Editor

4. **Check API limits:**
   - You may have reached your API usage limits
   - Check your usage in Settings > Usage
   - Consider upgrading your plan if necessary

### Problem: Unable to import AI Flows

**Symptoms:**
- Error when trying to import Flow JSON snippets
- "Invalid flow format" error messages
- Flows import but don't work correctly

**Solutions:**

1. **Verify JSON format:**
   - Ensure the JSON is properly formatted with no syntax errors
   - Use a JSON validator to check for syntax issues
   - Make sure the JSON follows Windsurf's Flow format

2. **Check Flow compatibility:**
   - Ensure the Flow is compatible with your Windsurf version
   - Update Windsurf to the latest version if necessary

3. **Import flows one at a time:**
   - Instead of importing all flows at once, try importing them individually
   - This helps identify which specific flow is causing issues

4. **Clear Flow cache:**
   ```bash
   # Windows
   del %APPDATA%\Windsurf\Flows\Cache\* /F /Q
   
   # macOS
   rm -rf ~/Library/Application\ Support/Windsurf/Flows/Cache/*
   
   # Linux
   rm -rf ~/.config/windsurf/Flows/Cache/*
   ```

## MCP Server Connection Problems

### Problem: MCP server connection fails

**Symptoms:**
- "Unable to connect to MCP server" error
- Tools from MCP server not appearing in Cascade
- Timeout errors when trying to use MCP tools

**Solutions:**

1. **Check if MCP server is running:**
   - Verify the server is running with:
   ```bash
   # Check if process is running
   ps aux | grep mcp_server
   
   # Or check if port is in use
   netstat -tuln | grep 3000
   ```

2. **Verify MCP server configuration:**
   - Open Cascade settings
   - Check MCP server configuration
   - Ensure URL or command is correct
   - For URL-based configuration, make sure the URL is accessible

3. **Check for port conflicts:**
   - Ensure no other service is using the same port (default: 3000)
   - Try changing the port in the MCP server configuration:
   ```typescript
   // In index.ts
   const PORT = process.env.PORT || 3001; // Change to different port
   ```

4. **Restart MCP server:**
   - Stop the current server process
   - Start it again with:
   ```bash
   cd /path/to/mcp_server
   npm start
   ```

5. **Check firewall settings:**
   - Ensure your firewall allows connections to the MCP server port
   - Add an exception for Windsurf and the MCP server if necessary

### Problem: MCP tools not appearing in Cascade

**Symptoms:**
- MCP server is running but tools don't appear in Cascade
- "No tools available" message in Cascade

**Solutions:**

1. **Refresh MCP tools:**
   - In Cascade, click the refresh button next to MCP tools
   - Alternatively, restart Cascade

2. **Check MCP server logs:**
   - Look for any error messages in the MCP server console
   - Fix any issues reported in the logs

3. **Verify tool registration:**
   - Ensure tools are properly registered in the MCP server
   - Check the `constructor` method in the `RealEstateAIMCPServer` class
   - Make sure all tools are added to the `tools` array

4. **Test MCP server API directly:**
   - Use curl or Postman to test the MCP server API:
   ```bash
   curl http://localhost:3000/mcp/list-tools
   ```
   - This should return a JSON list of available tools

## AI Flow Execution Errors

### Problem: Flow execution fails or produces unexpected results

**Symptoms:**
- Flow execution stops unexpectedly
- Actions in the flow are skipped
- Error messages during flow execution

**Solutions:**

1. **Check flow JSON structure:**
   - Verify all required fields are present
   - Ensure action types are supported
   - Check for typos in action names or parameters

2. **Examine flow execution logs:**
   - Open Developer Tools in Windsurf (Cmd/Ctrl+Shift+I)
   - Check the Console tab for error messages
   - Look for specific action failures

3. **Execute flow step by step:**
   - Use the "Debug Flow" option to execute one step at a time
   - Identify which specific step is failing

4. **Verify file paths and permissions:**
   - Ensure file paths in the flow are correct
   - Check that Windsurf has permission to access those paths
   - Use absolute paths when necessary

### Problem: Flow actions timeout

**Symptoms:**
- "Action timeout" error messages
- Flow execution takes too long and fails
- Some actions complete but others timeout

**Solutions:**

1. **Increase timeout settings:**
   - Open Settings > AI Features > Flows
   - Increase the "Action Timeout" value
   - Try 60000 (60 seconds) or higher for complex actions

2. **Optimize resource-intensive actions:**
   - Break down complex actions into smaller steps
   - Reduce the scope of database queries or API calls
   - Use pagination for large data sets

3. **Check system resources:**
   - Ensure your system has enough memory and CPU available
   - Close other resource-intensive applications
   - Consider upgrading hardware for complex workflows

## Performance Optimization

### Problem: Slow Windsurf Editor performance with UAE Real-Estate AI

**Symptoms:**
- Editor becomes sluggish when working with the project
- High CPU or memory usage
- Long loading times for project files

**Solutions:**

1. **Optimize project indexing:**
   - Add large data files to `.windsurfignore`
   - Exclude unnecessary directories from indexing
   - Example `.windsurfignore` file:
   ```
   node_modules
   dist
   .git
   data/large_datasets
   ```

2. **Reduce MCP server resource usage:**
   - Implement caching for frequently used data
   - Optimize database queries
   - Use pagination for large result sets

3. **Adjust Windsurf settings:**
   - Open Settings > Performance
   - Reduce "Maximum Memory Usage"
   - Disable "Background Indexing" if not needed

4. **Split large files:**
   - Break down large TypeScript files into smaller modules
   - Use proper code organization with separate files for different components

## Common Error Messages

### "Failed to initialize MCP server: EADDRINUSE"

**Cause:** The port the MCP server is trying to use is already in use by another process.

**Solutions:**
1. Find and stop the process using the port:
   ```bash
   # Find process using port 3000
   lsof -i :3000
   
   # Kill the process
   kill -9 <PID>
   ```

2. Change the port in the MCP server configuration:
   ```typescript
   // In index.ts
   const PORT = process.env.PORT || 3001; // Use a different port
   ```

### "Error: Cannot find module '@types/node'"

**Cause:** TypeScript dependencies are missing.

**Solutions:**
1. Install the required dependencies:
   ```bash
   npm install --save-dev @types/node
   ```

2. Ensure your `package.json` includes the necessary dependencies:
   ```json
   "devDependencies": {
     "@types/node": "^18.0.0",
     "typescript": "^4.9.0"
   }
   ```

### "SyntaxError: Unexpected token in JSON at position X"

**Cause:** Invalid JSON syntax in Flow definitions.

**Solutions:**
1. Validate your JSON using a JSON validator
2. Check for missing commas, brackets, or quotes
3. Ensure all string values are properly quoted
4. Look for trailing commas (not allowed in JSON)

### "Error: EACCES: permission denied"

**Cause:** Insufficient permissions to access files or directories.

**Solutions:**
1. Check file and directory permissions
2. Run Windsurf with appropriate permissions
3. Ensure the user has write access to project directories

### "TypeError: Cannot read property 'X' of undefined"

**Cause:** Trying to access a property of an undefined object, often due to asynchronous code issues.

**Solutions:**
1. Add proper null/undefined checks:
   ```typescript
   if (object && object.property) {
     // Safe to use object.property
   }
   ```

2. Use optional chaining:
   ```typescript
   const value = object?.property?.nestedProperty;
   ```

3. Ensure promises are properly awaited:
   ```typescript
   const result = await asyncFunction();
   // Now safe to use result
   ```

## Additional Resources

If you continue to experience issues not covered in this guide, please refer to:

1. [Windsurf Documentation](https://docs.windsurf.com/)
2. [Windsurf Community Forums](https://community.windsurf.com/)
3. [MCP Server Documentation](https://docs.windsurf.com/mcp)
4. [TypeScript Documentation](https://www.typescriptlang.org/docs/)

For project-specific issues, contact the UAE Real-Estate AI project team at support@uae-realestate-ai.example.com.
