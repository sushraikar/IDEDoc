# Windsurf Editor Setup Guide

This guide will help you set up Windsurf Editor and configure it for the UAE Real-Estate AI Operating System project.

## Table of Contents

1. [Download and Installation](#download-and-installation)
2. [Enabling Cascade and AI Flows](#enabling-cascade-and-ai-flows)
3. [First Project Walkthrough](#first-project-walkthrough)
4. [MCP Server Setup](#mcp-server-setup)

## Download and Installation

### System Requirements

- **Operating System**: Windows 10/11, macOS 10.15+, or Ubuntu 20.04+
- **RAM**: 8GB minimum, 16GB recommended
- **Disk Space**: 2GB minimum
- **Internet Connection**: Required for AI features

### Download Links

1. **macOS**:
   - [Download Windsurf for macOS](https://windsurf.com/download/mac)
   - Supports Intel and Apple Silicon (M1/M2/M3)

2. **Windows**:
   - [Download Windsurf for Windows](https://windsurf.com/download/windows)
   - Requires Windows 10 or later

3. **Linux**:
   - [Download Windsurf for Linux](https://windsurf.com/download/linux)
   - Available as .deb and .AppImage

### Installation Steps

#### macOS

1. Download the .dmg file from the link above
2. Open the .dmg file
3. Drag Windsurf to your Applications folder
4. Open Windsurf from your Applications folder
5. If prompted about security, go to System Preferences > Security & Privacy and click "Open Anyway"

#### Windows

1. Download the .exe installer from the link above
2. Run the installer
3. Follow the installation wizard
4. Launch Windsurf from the Start menu or desktop shortcut

#### Linux

1. Download the appropriate package (.deb or .AppImage)
2. For .deb:
   ```bash
   sudo dpkg -i windsurf_*.deb
   sudo apt-get install -f
   ```
3. For .AppImage:
   ```bash
   chmod +x Windsurf-*.AppImage
   ./Windsurf-*.AppImage
   ```

## Enabling Cascade and AI Flows

Cascade is Windsurf's AI assistant that powers AI Flows. Here's how to enable and use it:

1. **Open Windsurf** and complete the initial setup (account creation/login)

2. **Access Cascade**:
   - Press `Cmd/Ctrl+L` or
   - Click the Cascade icon in the top right corner of the Windsurf window

3. **Enable AI Flows**:
   - Open Windsurf Settings (`Cmd/Ctrl+,`)
   - Navigate to "AI Features"
   - Ensure "Enable AI Flows" is checked
   - Select your preferred model (GPT-4 recommended for best results)

4. **Verify Cascade is Working**:
   - Type "Hello" in the Cascade panel
   - You should receive a response from the AI

## First Project Walkthrough

Let's create a simple project to test Windsurf's features with the UAE Real-Estate AI Operating System:

1. **Create a New Project**:
   - Click "File" > "New Project" or use `Cmd/Ctrl+Shift+N`
   - Select "Empty Project"
   - Choose a location for your project
   - Name it "UAE-RealEstate-AI-Test"

2. **Initialize the Project**:
   - Open Cascade (`Cmd/Ctrl+L`)
   - Type: "Initialize a new Node.js project with TypeScript for a real estate AI application"
   - Review the suggested actions and click "Accept"
   - Cascade will set up the basic project structure

3. **Explore the Project Structure**:
   - Examine the created files in the Explorer panel
   - Note the TypeScript configuration, package.json, and initial source files

4. **Use AI Flows to Add Features**:
   - Open Cascade again
   - Type: "Create a simple API endpoint for property search using Express"
   - Observe how Cascade creates the necessary files and explains the implementation

5. **Run the Project**:
   - Open the integrated terminal (`Ctrl+` `)
   - Run `npm install` to install dependencies
   - Run `npm start` to start the development server
   - Verify the server is running correctly

## MCP Server Setup

Model Context Protocol (MCP) servers extend Windsurf's capabilities by providing custom tools. Let's set up a Postgres MCP server for our real estate project:

### Prerequisites

- Node.js 16+ and npm installed
- Basic knowledge of TypeScript
- PostgreSQL installed (or access to a PostgreSQL database)

### Setup Steps

1. **Clone the Sample Postgres MCP Server**:
   ```bash
   git clone https://github.com/windsurf-examples/postgres-mcp-server.git
   cd postgres-mcp-server
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Database Connection**:
   - Create a `.env` file in the project root:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/real_estate_db
   PORT=3000
   ```
   - Replace the connection string with your PostgreSQL credentials

4. **Build and Run the MCP Server**:
   ```bash
   npm run build
   npm start
   ```
   - You should see output indicating the server is running on port 3000

5. **Configure Windsurf to Use the MCP Server**:
   - Open Windsurf
   - Open Cascade (`Cmd/Ctrl+L`)
   - Click the settings icon in Cascade
   - Select "Configure MCP"
   - Add the following configuration:
   ```json
   {
     "mcpServers": {
       "postgres-mcp": {
         "url": "http://localhost:3000"
       }
     }
   }
   ```
   - Click "Save"

6. **Test the MCP Connection**:
   - In Cascade, type: "Query the properties table in our database"
   - Cascade should use the MCP server to execute the query
   - You should see the results returned from your PostgreSQL database

7. **Explore Available MCP Tools**:
   - In Cascade, type: "What MCP tools are available?"
   - Cascade will list the tools provided by your MCP server
   - These typically include database queries, schema inspection, and data manipulation

### Sample MCP Server Features

The Postgres MCP server provides the following tools:

- **queryDatabase**: Execute SQL queries against your PostgreSQL database
- **describeTable**: Get schema information about a specific table
- **listTables**: List all tables in the database
- **insertData**: Insert new records into a table
- **updateData**: Update existing records in a table

These tools enable Cascade to interact directly with your real estate database, making it easier to develop and test your application.

## Next Steps

Now that you have Windsurf set up with Cascade, AI Flows, and MCP, you're ready to start developing the UAE Real-Estate AI Operating System. Refer to the other documentation files for specific implementation details:

- `windsurf_flows.md` for AI Flow JSON snippets
- `mcp_server/` directory for MCP server implementation
- `troubleshooting.md` for common issues and solutions

Happy coding with Windsurf! 🏄‍♂️
