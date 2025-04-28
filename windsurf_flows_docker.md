# Windsurf Flow JSON Snippets for Docker Environment

This document provides Flow JSON snippets for the UAE Real-Estate AI Platform that are compatible with the Docker containerized environment. These snippets can be imported into the Windsurf Editor to create AI flows that interact with the containerized MCP server.

## 1. Backend Initialization Flow

This flow initializes the backend services in the Docker environment.

```json
{
  "id": "backend-init-docker",
  "name": "Backend Initialization (Docker)",
  "description": "Initialize backend services in Docker environment",
  "nodes": [
    {
      "id": "start",
      "type": "trigger",
      "position": { "x": 100, "y": 100 },
      "data": {
        "name": "Start"
      }
    },
    {
      "id": "check-docker",
      "type": "tool",
      "position": { "x": 100, "y": 200 },
      "data": {
        "name": "Check Docker Status",
        "toolName": "SystemTool",
        "parameters": {
          "command": "docker ps | grep uae-realestate"
        }
      }
    },
    {
      "id": "docker-running-check",
      "type": "condition",
      "position": { "x": 100, "y": 300 },
      "data": {
        "name": "Docker Running?",
        "condition": "result.exitCode === 0"
      }
    },
    {
      "id": "start-docker",
      "type": "tool",
      "position": { "x": 300, "y": 400 },
      "data": {
        "name": "Start Docker Containers",
        "toolName": "SystemTool",
        "parameters": {
          "command": "cd /path/to/windsurf-ide-package/ide && docker-compose up -d"
        }
      }
    },
    {
      "id": "wait-for-startup",
      "type": "tool",
      "position": { "x": 100, "y": 500 },
      "data": {
        "name": "Wait for Startup",
        "toolName": "SystemTool",
        "parameters": {
          "command": "sleep 10"
        }
      }
    },
    {
      "id": "check-mcp-health",
      "type": "tool",
      "position": { "x": 100, "y": 600 },
      "data": {
        "name": "Check MCP Server Health",
        "toolName": "HttpTool",
        "parameters": {
          "url": "http://localhost:3000/health",
          "method": "GET"
        }
      }
    },
    {
      "id": "health-check-result",
      "type": "condition",
      "position": { "x": 100, "y": 700 },
      "data": {
        "name": "Health Check Result",
        "condition": "result.status === 200 && result.body.status === 'ok'"
      }
    },
    {
      "id": "success-output",
      "type": "output",
      "position": { "x": 100, "y": 800 },
      "data": {
        "name": "Success",
        "output": "Backend services initialized successfully in Docker environment"
      }
    },
    {
      "id": "error-output",
      "type": "output",
      "position": { "x": 300, "y": 800 },
      "data": {
        "name": "Error",
        "output": "Failed to initialize backend services in Docker environment"
      }
    }
  ],
  "edges": [
    { "id": "e1", "source": "start", "target": "check-docker" },
    { "id": "e2", "source": "check-docker", "target": "docker-running-check" },
    { "id": "e3", "source": "docker-running-check", "target": "start-docker", "label": "No" },
    { "id": "e4", "source": "docker-running-check", "target": "wait-for-startup", "label": "Yes" },
    { "id": "e5", "source": "start-docker", "target": "wait-for-startup" },
    { "id": "e6", "source": "wait-for-startup", "target": "check-mcp-health" },
    { "id": "e7", "source": "check-mcp-health", "target": "health-check-result" },
    { "id": "e8", "source": "health-check-result", "target": "success-output", "label": "Yes" },
    { "id": "e9", "source": "health-check-result", "target": "error-output", "label": "No" }
  ]
}
```

## 2. PGVector Migration Flow

This flow performs database migrations for the pgvector extension in the Docker environment.

```json
{
  "id": "pgvector-migration-docker",
  "name": "PGVector Migration (Docker)",
  "description": "Run database migrations for pgvector in Docker environment",
  "nodes": [
    {
      "id": "start",
      "type": "trigger",
      "position": { "x": 100, "y": 100 },
      "data": {
        "name": "Start"
      }
    },
    {
      "id": "check-postgres",
      "type": "tool",
      "position": { "x": 100, "y": 200 },
      "data": {
        "name": "Check Postgres Container",
        "toolName": "SystemTool",
        "parameters": {
          "command": "docker ps | grep uae-realestate-postgres"
        }
      }
    },
    {
      "id": "postgres-running-check",
      "type": "condition",
      "position": { "x": 100, "y": 300 },
      "data": {
        "name": "Postgres Running?",
        "condition": "result.exitCode === 0"
      }
    },
    {
      "id": "run-migration",
      "type": "tool",
      "position": { "x": 100, "y": 400 },
      "data": {
        "name": "Run Migration",
        "toolName": "SystemTool",
        "parameters": {
          "command": "docker exec uae-realestate-postgres psql -U postgres -d vectordb -c \"CREATE EXTENSION IF NOT EXISTS vector; CREATE TABLE IF NOT EXISTS property_embeddings (id SERIAL PRIMARY KEY, property_id TEXT UNIQUE, embedding vector(1536), metadata JSONB);\""
        }
      }
    },
    {
      "id": "migration-result",
      "type": "condition",
      "position": { "x": 100, "y": 500 },
      "data": {
        "name": "Migration Result",
        "condition": "result.exitCode === 0"
      }
    },
    {
      "id": "success-output",
      "type": "output",
      "position": { "x": 100, "y": 600 },
      "data": {
        "name": "Success",
        "output": "PGVector migration completed successfully in Docker environment"
      }
    },
    {
      "id": "error-output",
      "type": "output",
      "position": { "x": 300, "y": 600 },
      "data": {
        "name": "Error",
        "output": "Failed to run PGVector migration in Docker environment"
      }
    },
    {
      "id": "start-postgres",
      "type": "tool",
      "position": { "x": 300, "y": 400 },
      "data": {
        "name": "Start Postgres Container",
        "toolName": "SystemTool",
        "parameters": {
          "command": "cd /path/to/windsurf-ide-package/ide && docker-compose up -d postgres"
        }
      }
    }
  ],
  "edges": [
    { "id": "e1", "source": "start", "target": "check-postgres" },
    { "id": "e2", "source": "check-postgres", "target": "postgres-running-check" },
    { "id": "e3", "source": "postgres-running-check", "target": "run-migration", "label": "Yes" },
    { "id": "e4", "source": "postgres-running-check", "target": "start-postgres", "label": "No" },
    { "id": "e5", "source": "start-postgres", "target": "run-migration" },
    { "id": "e6", "source": "run-migration", "target": "migration-result" },
    { "id": "e7", "source": "migration-result", "target": "success-output", "label": "Yes" },
    { "id": "e8", "source": "migration-result", "target": "error-output", "label": "No" }
  ]
}
```

## 3. Langfuse Tracing Flow

This flow configures Langfuse tracing in the Docker environment.

```json
{
  "id": "langfuse-tracing-docker",
  "name": "Langfuse Tracing (Docker)",
  "description": "Configure Langfuse tracing in Docker environment",
  "nodes": [
    {
      "id": "start",
      "type": "trigger",
      "position": { "x": 100, "y": 100 },
      "data": {
        "name": "Start"
      }
    },
    {
      "id": "check-env",
      "type": "tool",
      "position": { "x": 100, "y": 200 },
      "data": {
        "name": "Check Environment Variables",
        "toolName": "SystemTool",
        "parameters": {
          "command": "docker exec uae-realestate-mcp-server env | grep LANGFUSE"
        }
      }
    },
    {
      "id": "env-check-result",
      "type": "condition",
      "position": { "x": 100, "y": 300 },
      "data": {
        "name": "Environment Variables Set?",
        "condition": "result.stdout.includes('LANGFUSE_PUBLIC_KEY') && result.stdout.includes('LANGFUSE_SECRET_KEY')"
      }
    },
    {
      "id": "update-env",
      "type": "tool",
      "position": { "x": 300, "y": 400 },
      "data": {
        "name": "Update Environment Variables",
        "toolName": "SystemTool",
        "parameters": {
          "command": "cd /path/to/windsurf-ide-package/ide && echo \"LANGFUSE_PUBLIC_KEY=your_langfuse_public_key\nLANGFUSE_SECRET_KEY=your_langfuse_secret_key\nLANGFUSE_HOST=https://cloud.langfuse.com\" >> .env"
        }
      }
    },
    {
      "id": "restart-container",
      "type": "tool",
      "position": { "x": 300, "y": 500 },
      "data": {
        "name": "Restart MCP Server Container",
        "toolName": "SystemTool",
        "parameters": {
          "command": "cd /path/to/windsurf-ide-package/ide && docker-compose restart mcp-server"
        }
      }
    },
    {
      "id": "verify-tracing",
      "type": "tool",
      "position": { "x": 100, "y": 400 },
      "data": {
        "name": "Verify Tracing",
        "toolName": "HttpTool",
        "parameters": {
          "url": "http://localhost:3000/tracing/status",
          "method": "GET"
        }
      }
    },
    {
      "id": "tracing-result",
      "type": "condition",
      "position": { "x": 100, "y": 500 },
      "data": {
        "name": "Tracing Enabled?",
        "condition": "result.status === 200 && result.body.enabled === true"
      }
    },
    {
      "id": "success-output",
      "type": "output",
      "position": { "x": 100, "y": 600 },
      "data": {
        "name": "Success",
        "output": "Langfuse tracing configured successfully in Docker environment"
      }
    },
    {
      "id": "error-output",
      "type": "output",
      "position": { "x": 300, "y": 600 },
      "data": {
        "name": "Error",
        "output": "Failed to configure Langfuse tracing in Docker environment"
      }
    }
  ],
  "edges": [
    { "id": "e1", "source": "start", "target": "check-env" },
    { "id": "e2", "source": "check-env", "target": "env-check-result" },
    { "id": "e3", "source": "env-check-result", "target": "verify-tracing", "label": "Yes" },
    { "id": "e4", "source": "env-check-result", "target": "update-env", "label": "No" },
    { "id": "e5", "source": "update-env", "target": "restart-container" },
    { "id": "e6", "source": "restart-container", "target": "verify-tracing" },
    { "id": "e7", "source": "verify-tracing", "target": "tracing-result" },
    { "id": "e8", "source": "tracing-result", "target": "success-output", "label": "Yes" },
    { "id": "e9", "source": "tracing-result", "target": "error-output", "label": "No" }
  ]
}
```

## 4. Helm Deployment Flow

This flow deploys the Docker containers to a Kubernetes cluster using Helm.

```json
{
  "id": "helm-deployment-docker",
  "name": "Helm Deployment (Docker)",
  "description": "Deploy Docker containers to Kubernetes using Helm",
  "nodes": [
    {
      "id": "start",
      "type": "trigger",
      "position": { "x": 100, "y": 100 },
      "data": {
        "name": "Start"
      }
    },
    {
      "id": "check-helm",
      "type": "tool",
      "position": { "x": 100, "y": 200 },
      "data": {
        "name": "Check Helm Installation",
        "toolName": "SystemTool",
        "parameters": {
          "command": "helm version"
        }
      }
    },
    {
      "id": "helm-check-result",
      "type": "condition",
      "position": { "x": 100, "y": 300 },
      "data": {
        "name": "Helm Installed?",
        "condition": "result.exitCode === 0"
      }
    },
    {
      "id": "build-docker-images",
      "type": "tool",
      "position": { "x": 100, "y": 400 },
      "data": {
        "name": "Build Docker Images",
        "toolName": "SystemTool",
        "parameters": {
          "command": "cd /path/to/windsurf-ide-package/ide && docker-compose build"
        }
      }
    },
    {
      "id": "tag-images",
      "type": "tool",
      "position": { "x": 100, "y": 500 },
      "data": {
        "name": "Tag Docker Images",
        "toolName": "SystemTool",
        "parameters": {
          "command": "docker tag uae-realestate-mcp-server:latest your-registry/uae-realestate-mcp-server:latest && docker tag ankane/pgvector:latest your-registry/uae-realestate-postgres:latest"
        }
      }
    },
    {
      "id": "push-images",
      "type": "tool",
      "position": { "x": 100, "y": 600 },
      "data": {
        "name": "Push Docker Images",
        "toolName": "SystemTool",
        "parameters": {
          "command": "docker push your-registry/uae-realestate-mcp-server:latest && docker push your-registry/uae-realestate-postgres:latest"
        }
      }
    },
    {
      "id": "deploy-helm",
      "type": "tool",
      "position": { "x": 100, "y": 700 },
      "data": {
        "name": "Deploy with Helm",
        "toolName": "SystemTool",
        "parameters": {
          "command": "cd /path/to/windsurf-ide-package/ide/helm && helm upgrade --install uae-realestate-ai . --set image.repository=your-registry/uae-realestate-mcp-server --set image.tag=latest --set postgres.image.repository=your-registry/uae-realestate-postgres --set postgres.image.tag=latest"
        }
      }
    },
    {
      "id": "deployment-result",
      "type": "condition",
      "position": { "x": 100, "y": 800 },
      "data": {
        "name": "Deployment Successful?",
        "condition": "result.exitCode === 0"
      }
    },
    {
      "id": "success-output",
      "type": "output",
      "position": { "x": 100, "y": 900 },
      "data": {
        "name": "Success",
        "output": "Docker containers deployed to Kubernetes successfully using Helm"
      }
    },
    {
      "id": "error-output",
      "type": "output",
      "position": { "x": 300, "y": 900 },
      "data": {
        "name": "Error",
        "output": "Failed to deploy Docker containers to Kubernetes using Helm"
      }
    },
    {
      "id": "install-helm",
      "type": "tool",
      "position": { "x": 300, "y": 400 },
      "data": {
        "name": "Install Helm",
        "toolName": "SystemTool",
        "parameters": {
          "command": "curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash"
        }
      }
    }
  ],
  "edges": [
    { "id": "e1", "source": "start", "target": "check-helm" },
    { "id": "e2", "source": "check-helm", "target": "helm-check-result" },
    { "id": "e3", "source": "helm-check-result", "target": "build-docker-images", "label": "Yes" },
    { "id": "e4", "source": "helm-check-result", "target": "install-helm", "label": "No" },
    { "id": "e5", "source": "install-helm", "target": "build-docker-images" },
    { "id": "e6", "source": "build-docker-images", "target": "tag-images" },
    { "id": "e7", "source": "tag-images", "target": "push-images" },
    { "id": "e8", "source": "push-images", "target": "deploy-helm" },
    { "id": "e9", "source": "deploy-helm", "target": "deployment-result" },
    { "id": "e10", "source": "deployment-result", "target": "success-output", "label": "Yes" },
    { "id": "e11", "source": "deployment-result", "target": "error-output", "label": "No" }
  ]
}
```

## 5. ADR Writing Flow

This flow generates an Architectural Decision Record (ADR) for Docker containerization.

```json
{
  "id": "adr-docker-containerization",
  "name": "ADR for Docker Containerization",
  "description": "Generate an Architectural Decision Record for Docker containerization",
  "nodes": [
    {
      "id": "start",
      "type": "trigger",
      "position": { "x": 100, "y": 100 },
      "data": {
        "name": "Start"
      }
    },
    {
      "id": "gather-context",
      "type": "tool",
      "position": { "x": 100, "y": 200 },
      "data": {
        "name": "Gather Context",
        "toolName": "PropertyAnalysisTool",
        "parameters": {
          "analysisType": "context"
        }
      }
    },
    {
      "id": "generate-adr",
      "type": "tool",
      "position": { "x": 100, "y": 300 },
      "data": {
        "name": "Generate ADR",
        "toolName": 
(Content truncated due to size limit. Use line ranges to read in chunks)