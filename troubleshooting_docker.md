# Troubleshooting Guide for Docker Environment

This guide provides solutions to common issues you might encounter when working with the UAE Real-Estate AI Platform in a Docker containerized environment. If you're experiencing problems, follow the troubleshooting steps below to resolve them.

## Common Docker-Related Issues and Solutions

This section covers the most common issues encountered when working with the Docker containerized environment for the UAE Real-Estate AI Platform.

### Docker Container Startup Issues

#### Symptoms:
* Docker containers fail to start
* `docker-compose up` command returns errors
* Services are not accessible after startup

#### Possible Causes:
* Docker Engine not running
* Port conflicts
* Insufficient permissions
* Missing environment variables
* Incorrect Docker Compose configuration

#### Solutions:

1. **Verify Docker Engine is running:**
   ```bash
   docker info
   ```
   If Docker is not running, start it with:
   ```bash
   # On Linux
   sudo systemctl start docker
   
   # On macOS/Windows
   # Start Docker Desktop application
   ```

2. **Check for port conflicts:**
   ```bash
   sudo lsof -i :3000
   sudo lsof -i :5432
   ```
   If other services are using these ports, either stop those services or modify the `.env` file to use different ports:
   ```
   MCP_SERVER_PORT=3001
   POSTGRES_PORT=5433
   ```

3. **Check Docker Compose logs:**
   ```bash
   docker-compose logs
   ```
   Look for specific error messages that might indicate the cause of the issue.

4. **Verify environment variables:**
   ```bash
   cat .env
   ```
   Ensure all required environment variables are set in the `.env` file.

5. **Restart Docker Engine:**
   ```bash
   # On Linux
   sudo systemctl restart docker
   
   # On macOS/Windows
   # Restart Docker Desktop application
   ```

6. **Rebuild containers:**
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

### MCP Server Connection Issues in Docker

#### Symptoms:
* AI Flows fail with "Unable to connect to MCP server" error
* Tools are not available in the Windsurf Editor
* Connection timeout errors when executing flows

#### Possible Causes:
* MCP server container is not running
* Incorrect server URL configuration
* Network connectivity issues between containers
* Docker network issues

#### Solutions:

1. **Verify MCP server container is running:**
   ```bash
   docker ps | grep uae-realestate-mcp-server
   ```
   If not running, start it with:
   ```bash
   docker-compose up -d mcp-server
   ```

2. **Check MCP server container logs:**
   ```bash
   docker logs uae-realestate-mcp-server
   ```
   Look for error messages that might indicate why the server is not responding.

3. **Test server connectivity from host:**
   ```bash
   curl http://localhost:3000/health
   ```
   You should receive a response like:
   ```json
   {"status":"ok"}
   ```

4. **Check Docker network:**
   ```bash
   docker network ls
   docker network inspect uae-realestate-network
   ```
   Ensure both the MCP server and PostgreSQL containers are connected to the same network.

5. **Restart the MCP server container:**
   ```bash
   docker-compose restart mcp-server
   ```

6. **Check if the server is listening on the correct interface:**
   ```bash
   docker exec uae-realestate-mcp-server netstat -tulpn | grep 3000
   ```
   The server should be listening on 0.0.0.0:3000.

7. **Verify Windsurf Editor configuration:**
   Ensure the MCP server URL in your Windsurf Editor settings is set to:
   ```
   http://localhost:3000
   ```
   If you've changed the port in the `.env` file, use that port instead.

### Database Connectivity Issues in Docker

#### Symptoms:
* MCP server logs show database connection errors
* Property search returns no results
* "Connection refused" errors in MCP server logs

#### Possible Causes:
* PostgreSQL container is not running
* Incorrect database connection string
* Database initialization failed
* pgvector extension not installed

#### Solutions:

1. **Verify PostgreSQL container is running:**
   ```bash
   docker ps | grep uae-realestate-postgres
   ```
   If not running, start it with:
   ```bash
   docker-compose up -d postgres
   ```

2. **Check PostgreSQL container logs:**
   ```bash
   docker logs uae-realestate-postgres
   ```
   Look for error messages related to startup or initialization.

3. **Verify database connection from MCP server:**
   ```bash
   docker exec uae-realestate-mcp-server curl http://postgres:5432
   ```
   This should return a response (even if it's an error message about the protocol).

4. **Check if pgvector extension is installed:**
   ```bash
   docker exec uae-realestate-postgres psql -U postgres -d vectordb -c "SELECT * FROM pg_extension WHERE extname = 'vector';"
   ```
   If not installed, install it with:
   ```bash
   docker exec uae-realestate-postgres psql -U postgres -d vectordb -c "CREATE EXTENSION vector;"
   ```

5. **Verify database schema:**
   ```bash
   docker exec uae-realestate-postgres psql -U postgres -d vectordb -c "\dt"
   ```
   Ensure the required tables exist.

6. **Recreate the database container:**
   ```bash
   docker-compose down -v postgres
   docker-compose up -d postgres
   ```
   Note: This will delete all data in the database.

### Docker Volume and Persistence Issues

#### Symptoms:
* Data is lost after container restart
* Database is empty after restarting containers
* Changes to configuration don't persist

#### Possible Causes:
* Volumes not properly configured
* Permissions issues with volume mounts
* Volumes accidentally deleted

#### Solutions:

1. **Check Docker volumes:**
   ```bash
   docker volume ls | grep uae-realestate
   ```
   Ensure the required volumes exist.

2. **Inspect volume details:**
   ```bash
   docker volume inspect uae-realestate-postgres-data
   ```
   Verify the mount point and configuration.

3. **Check volume permissions:**
   ```bash
   docker run --rm -v uae-realestate-postgres-data:/data alpine ls -la /data
   ```
   Ensure the permissions allow the PostgreSQL user to write to the volume.

4. **Backup data before making changes:**
   ```bash
   docker exec uae-realestate-postgres pg_dump -U postgres -d vectordb > backup.sql
   ```

5. **Restore from backup if needed:**
   ```bash
   cat backup.sql | docker exec -i uae-realestate-postgres psql -U postgres -d vectordb
   ```

6. **Recreate volumes if necessary:**
   ```bash
   docker-compose down -v
   docker volume create uae-realestate-postgres-data
   docker volume create uae-realestate-mcp-logs
   docker-compose up -d
   ```
   Note: This will delete all existing data.

### Docker Resource Constraints

#### Symptoms:
* Containers crash unexpectedly
* Performance degradation
* "Out of memory" errors in logs

#### Possible Causes:
* Insufficient CPU allocation
* Insufficient memory allocation
* Disk space limitations

#### Solutions:

1. **Check container resource usage:**
   ```bash
   docker stats
   ```
   Monitor CPU, memory, and I/O usage.

2. **Increase Docker resource allocation:**
   In Docker Desktop settings, increase CPU, memory, and disk space allocation.

3. **Set explicit resource limits in docker-compose.yml:**
   ```yaml
   services:
     mcp-server:
       # ... other configuration ...
       deploy:
         resources:
           limits:
             cpus: '1'
             memory: 1G
           reservations:
             cpus: '0.5'
             memory: 512M
   ```

4. **Check disk space:**
   ```bash
   df -h
   ```
   Ensure sufficient disk space is available.

5. **Clean up unused Docker resources:**
   ```bash
   docker system prune -a
   ```
   This removes unused containers, networks, images, and volumes.

### Docker Networking Issues

#### Symptoms:
* Containers cannot communicate with each other
* External services cannot access containers
* DNS resolution failures

#### Possible Causes:
* Network configuration issues
* Firewall blocking connections
* DNS configuration problems

#### Solutions:

1. **Inspect Docker network:**
   ```bash
   docker network inspect uae-realestate-network
   ```
   Verify that all containers are connected to the network.

2. **Test network connectivity between containers:**
   ```bash
   docker exec uae-realestate-mcp-server ping postgres
   ```
   This should return successful ping responses.

3. **Check DNS resolution:**
   ```bash
   docker exec uae-realestate-mcp-server nslookup postgres
   ```
   This should resolve to the PostgreSQL container's IP address.

4. **Recreate the Docker network:**
   ```bash
   docker-compose down
   docker network rm uae-realestate-network
   docker-compose up -d
   ```

5. **Check host firewall settings:**
   Ensure that the firewall allows connections to the Docker subnet.

6. **Verify port mappings:**
   ```bash
   docker-compose ps
   ```
   Ensure that the ports are correctly mapped from the host to the containers.

### Docker Image Build Issues

#### Symptoms:
* `docker-compose build` fails
* Error messages during image build
* Containers fail to start after build

#### Possible Causes:
* Missing dependencies
* Syntax errors in Dockerfile
* Network issues during build
* Insufficient permissions

#### Solutions:

1. **Check Dockerfile syntax:**
   Ensure there are no syntax errors in the Dockerfile.

2. **Build with verbose output:**
   ```bash
   docker-compose build --no-cache --progress=plain
   ```
   This provides more detailed output during the build process.

3. **Check network connectivity during build:**
   Ensure that the build environment has internet access to download dependencies.

4. **Verify build context:**
   Ensure that all required files are included in the build context.

5. **Check for permission issues:**
   ```bash
   ls -la
   ```
   Ensure that the current user has permission to read all files in the build context.

6. **Try building individual services:**
   ```bash
   docker-compose build mcp-server
   ```
   This can help identify which service is causing the build to fail.

## Advanced Troubleshooting

For more complex issues, you may need to use advanced Docker troubleshooting techniques:

### Accessing Container Shell

To access a shell inside a container for debugging:

```bash
docker exec -it uae-realestate-mcp-server /bin/sh
```

### Viewing Container Logs

To view real-time logs from a container:

```bash
docker logs -f uae-realestate-mcp-server
```

### Inspecting Container Configuration

To view detailed container configuration:

```bash
docker inspect uae-realestate-mcp-server
```

### Checking Container Health

To check the health status of containers:

```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Health}}"
```

### Debugging Network Issues

To debug network connectivity issues:

```bash
docker run --rm --network uae-realestate-network nicolaka/netshoot
```

This starts a container with network troubleshooting tools.

## Getting Help

If you're unable to resolve an issue using this guide, please:

1. Collect logs from all containers:
   ```bash
   docker-compose logs > docker-logs.txt
   ```

2. Export container details:
   ```bash
   docker inspect uae-realestate-mcp-server > mcp-server-details.txt
   docker inspect uae-realestate-postgres > postgres-details.txt
   ```

3. Contact support with these files and a detailed description of the issue.

Remember that most Docker-related issues can be resolved by ensuring proper configuration, sufficient resources, and correct networking setup.
