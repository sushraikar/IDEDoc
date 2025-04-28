# 002. Use pgvector for Vector Similarity Search

## Status

Accepted

## Date

2025-04-27

## Decision Makers

- Solution Architect
- Database Administrator
- AI Engineer

## Context and Problem Statement

The Real Estate AI Operating System requires semantic search capabilities to find properties based on natural language queries and similarity matching. We need to store and query high-dimensional vector embeddings (1536 dimensions) efficiently alongside our relational data. How should we implement vector similarity search to ensure performance, scalability, and integration with our existing database infrastructure?

## Decision Drivers

- Need for efficient vector similarity search
- Integration with existing PostgreSQL database
- Performance requirements for real-time property search
- Scalability to handle growing number of property listings
- Support for multiple distance metrics (cosine, L2, inner product)

## Considered Options

- Option 1: Dedicated vector database (Pinecone, Weaviate)
- Option 2: pgvector extension for PostgreSQL
- Option 3: Hybrid approach with Redis for vector search and PostgreSQL for relational data

## Decision

Chosen option: "Option 2: pgvector extension for PostgreSQL", because it allows us to store vector embeddings alongside our relational data in a single database, simplifying our architecture while providing efficient vector similarity search capabilities.

## Consequences

### Positive

- Unified data storage with both relational and vector data in PostgreSQL
- ACID compliance and transaction support across both vector and relational operations
- Support for multiple distance metrics (L2, inner product, cosine)
- Ability to use SQL JOINs between vector search results and other tables
- Simplified backup and recovery processes with a single database
- Reduced operational complexity compared to managing separate databases

### Negative

- Potential performance limitations compared to dedicated vector databases for very large collections
- Limited to PostgreSQL's scaling capabilities
- Requires careful index tuning for optimal performance
- May require more computational resources on the database server

## Validation

The implementation will be validated through:
1. Performance testing with realistic property embedding data
2. Benchmarking query response times under various loads
3. Testing accuracy of search results compared to baseline expectations
4. Monitoring database resource utilization in production

## Pros and Cons of the Options

### Option 1: Dedicated vector database (Pinecone, Weaviate)

- Good, because it's optimized specifically for vector search operations
- Good, because it offers high performance for large vector collections
- Good, because it provides specialized features for vector search
- Bad, because it introduces a separate system to maintain
- Bad, because it requires synchronization between two databases
- Bad, because it adds complexity to the architecture
- Bad, because it increases operational costs

### Option 2: pgvector extension for PostgreSQL

- Good, because it integrates directly with our existing PostgreSQL database
- Good, because it allows JOINs between vector search results and relational data
- Good, because it simplifies the architecture with a single database
- Good, because it leverages existing database infrastructure and expertise
- Neutral, because performance may be adequate but not optimal for very large collections
- Bad, because it may require more computational resources on the database server

### Option 3: Hybrid approach with Redis for vector search and PostgreSQL for relational data

- Good, because Redis offers high-performance vector search
- Good, because it offloads vector search from the main database
- Bad, because it introduces a separate system to maintain
- Bad, because it requires synchronization between Redis and PostgreSQL
- Bad, because it adds complexity to the architecture
- Bad, because it increases operational overhead

## References

- Solution Design Document, Section 4.3: Database Architecture
- ADR-001: Use LangChain and LangGraph for Multilingual Chatbot
- ADR-004: Database Schema Design
