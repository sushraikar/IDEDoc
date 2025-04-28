# Windsurf Editor Setup Guide for Docker

This guide provides step-by-step instructions for setting up the UAE Real-Estate AI Platform in a Docker environment. Using Docker containers ensures consistent behavior across different systems and simplifies the setup process.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Docker Engine](https://docs.docker.com/engine/install/) (version 20.10.0 or later)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0.0 or later)
- [Git](https://git-scm.com/downloads) (version 2.30.0 or later)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/uae-realestate-ai/windsurf-ide-package.git
cd windsurf-ide-package
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# MCP Server Configuration
MCP_SERVER_PORT=3000

# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=vectordb
POSTGRES_PORT=5432

# API Keys
BAYUT_API_KEY=your_bayut_api_key
PROPERTY_FINDER_API_KEY=your_property_finder_api_key
DLD_API_KEY=your_dld_api_key
OPENAI_API_KEY=your_openai_api_key

# Langfuse Configuration (Optional)
LANGFUSE_PUBLIC_KEY=your_langfuse_public_key
LANGFUSE_SECRET_KEY=your_langfuse_secret_key
LANGFUSE_HOST=https://cloud.langfuse.com
```

Replace the placeholder API keys with your actual keys.

### 3. Start the Docker Containers

Run the following command to start all the required services:

```bash
docker-compose up -d
```

This command will:
- Build and start the MCP server container
- Start a PostgreSQL container with pgvector extension
- Initialize the database with required schemas
- Set up networking between containers

### 4. Verify the Installation

Check if all containers are running properly:

```bash
docker-compose ps
```

You should see all services in the "Up" state.

Test the MCP server connection:

```bash
curl http://localhost:3000/health
```

You should receive a response like:
```json
{"status":"ok"}
```

### 5. Configure Windsurf Editor

1. Open the Windsurf Editor application
2. Go to Settings > MCP Servers
3. Add a new MCP server with the following details:
   - Name: UAE Real-Estate AI
   - URL: http://localhost:3000
   - Authentication: None (or Bearer Token if you've configured authentication)
4. Click "Test Connection" to verify the connection is successful
5. Click "Save" to add the MCP server

## Container Architecture

The Docker setup includes the following containers:

1. **MCP Server**: Node.js application that provides the Model Context Protocol server
   - Exposes port 3000 for API access
   - Contains all the tools for property search, analysis, market insights, proposal generation, and translation

2. **PostgreSQL Database**: Database with pgvector extension for vector similarity search
   - Stores property embeddings and metadata
   - Provides vector search capabilities for property matching

## Data Persistence

The Docker setup uses volumes to ensure data persistence:

- `postgres-data`: Stores PostgreSQL database files
- `mcp-server-logs`: Stores MCP server logs

These volumes ensure that your data is preserved even if the containers are stopped or removed.

## Stopping the Services

To stop all services while preserving data:

```bash
docker-compose down
```

To stop all services and remove all data:

```bash
docker-compose down -v
```

## Updating the Services

To update to the latest version:

```bash
git pull
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Resource Requirements

The Docker containers require the following minimum resources:

- CPU: 2 cores
- RAM: 4GB
- Disk: 10GB

For optimal performance, we recommend:

- CPU: 4 cores
- RAM: 8GB
- Disk: 20GB

## Security Considerations

The default setup is configured for local development. For production use, consider the following security enhancements:

1. Enable authentication for the MCP server
2. Use Docker Secrets for managing sensitive information
3. Configure TLS for encrypted communication
4. Implement network isolation with Docker networks
5. Regularly update container images to include security patches

## Next Steps

After completing the setup, proceed to the [Flow Snippets](flow-snippets.html) section to learn how to use the UAE Real-Estate AI Platform with the Windsurf Editor.
