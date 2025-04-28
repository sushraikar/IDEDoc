# 004. Database Schema Design

## Status

Accepted

## Date

2025-04-27

## Decision Makers

- Solution Architect
- Database Administrator
- Backend Developer

## Context and Problem Statement

The Real Estate AI Operating System requires a robust database schema to store and manage various types of data including user information, property listings, leads, proposals, vector embeddings, and chat logs. How should we design the database schema to ensure data integrity, performance, scalability, and support for both relational and vector data?

## Decision Drivers

- Need to support both relational data and vector embeddings
- Performance requirements for property search and analytics
- Scalability to handle growing data volumes
- Data integrity and relationship management
- Support for multilingual content
- Compliance with UAE PDPL regulations

## Considered Options

- Option 1: Fully normalized relational schema
- Option 2: Partially denormalized schema with JSON columns for flexibility
- Option 3: Hybrid relational schema with dedicated vector tables

## Decision

Chosen option: "Option 3: Hybrid relational schema with dedicated vector tables", because it provides the best balance of relational integrity, performance, and support for vector embeddings while maintaining a clear and maintainable structure.

## Consequences

### Positive

- Clear separation of concerns between relational data and vector embeddings
- Optimized storage and indexing for different data types
- Ability to leverage PostgreSQL's relational features for data integrity
- Support for efficient vector similarity search with pgvector
- Simplified queries for common operations
- Maintainable schema that follows database best practices

### Negative

- More complex schema compared to a fully normalized approach
- Requires careful management of relationships between tables
- May require more storage space due to some redundancy
- Potential performance considerations for complex joins

## Validation

The implementation will be validated through:
1. Performance testing of common query patterns
2. Data integrity checks across related tables
3. Load testing with realistic data volumes
4. Verification of vector search performance with pgvector

## Pros and Cons of the Options

### Option 1: Fully normalized relational schema

- Good, because it minimizes data redundancy
- Good, because it enforces strict data integrity
- Good, because it follows traditional database design principles
- Bad, because it may require complex joins for common queries
- Bad, because it may not be optimized for vector operations
- Bad, because it could lead to performance issues at scale

### Option 2: Partially denormalized schema with JSON columns for flexibility

- Good, because it offers flexibility for evolving data structures
- Good, because it can reduce join complexity for some queries
- Good, because it allows for schema evolution without migrations
- Bad, because it makes data validation more challenging
- Bad, because it can lead to data inconsistency
- Bad, because it may complicate reporting and analytics
- Bad, because JSON operations can be less efficient than relational queries

### Option 3: Hybrid relational schema with dedicated vector tables

- Good, because it optimizes for both relational and vector operations
- Good, because it maintains clear relationships between entities
- Good, because it supports efficient vector similarity search
- Good, because it follows a logical organization of data
- Neutral, because it introduces some complexity in schema design
- Bad, because it requires careful management of related data

## References

- Solution Design Document, Section 4.2: Database Architecture
- ADR-002: Use pgvector for Vector Similarity Search
- Database ERD and Data Dictionary
