# Dockerfile for UAE Real-Estate AI MCP Server

# Stage 1: Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Stage 2: Production stage
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup -S mcp && adduser -S mcp -G mcp

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

# Install production dependencies only
RUN npm ci --only=production

# Create directory for logs with appropriate permissions
RUN mkdir -p /app/logs && chown -R mcp:mcp /app/logs

# Switch to non-root user
USER mcp

# Expose MCP server port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the MCP server
CMD ["node", "dist/index.js"]
