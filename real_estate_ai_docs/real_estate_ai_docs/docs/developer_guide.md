# Developer Onboarding Guide for Real Estate AI Platform

## Table of Contents

1. [Introduction](#introduction)
2. [System Overview](#system-overview)
3. [Development Environment Setup](#development-environment-setup)
4. [Architecture Overview](#architecture-overview)
5. [Codebase Structure](#codebase-structure)
6. [Development Workflow](#development-workflow)
7. [Testing Guidelines](#testing-guidelines)
8. [Deployment Process](#deployment-process)
9. [AI Components Guide](#ai-components-guide)
10. [Database Guide](#database-guide)
11. [API Documentation](#api-documentation)
12. [Troubleshooting](#troubleshooting)
13. [Best Practices](#best-practices)
14. [Resources and References](#resources-and-references)

## Introduction

Welcome to the Real Estate AI Platform development team! This guide will help you get started with developing and contributing to our platform. It covers everything from setting up your development environment to understanding the architecture and workflows.

### Purpose of this Guide

This guide aims to:
- Help new developers get up to speed quickly
- Provide a reference for common development tasks
- Ensure consistent development practices
- Document key architectural decisions and patterns

### Target Audience

This guide is intended for:
- New developers joining the team
- External contributors
- Technical stakeholders who need to understand the system

## System Overview

The Real Estate AI Platform is a comprehensive SaaS solution for UAE real estate agencies. It leverages AI to enhance property search, lead management, and proposal generation.

### Key Features

- **Multilingual Chatbot**: Conversational interface in English, Arabic, and French
- **Semantic Property Search**: Vector-based property matching using natural language
- **AI-Generated Proposals**: Customized property proposals for leads
- **Lead Management**: Tracking and nurturing of potential clients
- **Analytics Dashboard**: Insights into property trends and sales performance

### Technology Stack

- **Frontend**: React, TypeScript, Material UI
- **Backend**: Node.js, Express, Python (for AI components)
- **AI Framework**: LangChain, LangGraph
- **Database**: PostgreSQL with pgvector extension
- **Infrastructure**: AWS (EKS, RDS, S3, CloudFront)
- **CI/CD**: GitHub Actions, Argo CD
- **Monitoring**: Prometheus, Grafana, Langfuse

## Development Environment Setup

### Prerequisites

- Git
- Docker and Docker Compose
- Node.js (v20+)
- Python (v3.10+)
- kubectl
- AWS CLI
- Code editor (VS Code recommended)

### Initial Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-org/real-estate-ai.git
   cd real-estate-ai
   ```

2. **Install Dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   
   # Install AI service dependencies
   cd ../ai-service
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Set Up Environment Variables**
   ```bash
   # Copy example environment files
   cp .env.example .env
   
   # Edit .env with your local configuration
   # You'll need to set up local database credentials and API keys
   ```

4. **Start Local Development Environment**
   ```bash
   # Start all services using Docker Compose
   docker-compose up -d
   
   # Or start individual components
   cd frontend
   npm run dev
   
   cd ../backend
   npm run dev
   
   cd ../ai-service
   python app.py
   ```

5. **Verify Setup**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - AI Service: http://localhost:5000
   - GraphQL Playground: http://localhost:8000/graphql

### Local Database Setup

1. **Set Up PostgreSQL with pgvector**
   ```bash
   # Using Docker (recommended)
   docker run --name real-estate-db \
     -e POSTGRES_PASSWORD=yourpassword \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_DB=real_estate_ai \
     -p 5432:5432 \
     -d ankane/pgvector
   ```

2. **Initialize Database Schema**
   ```bash
   # Run migrations
   cd backend
   npm run migrate
   
   # Seed with test data
   npm run seed
   ```

### IDE Configuration

1. **VS Code Extensions**
   - ESLint
   - Prettier
   - Docker
   - Python
   - PostgreSQL
   - GitLens

2. **Recommended Settings**
   ```json
   {
     "editor.formatOnSave": true,
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": true
     },
     "python.linting.enabled": true,
     "python.linting.pylintEnabled": true
   }
   ```

## Architecture Overview

The Real Estate AI Platform follows a microservices architecture deployed on Kubernetes. For a visual representation, refer to the deployment diagram in `/diagrams/deployment_architecture.png`.

### Key Components

- **Frontend**: React-based SPA served through CloudFront
- **API Service**: Main backend service handling REST and GraphQL requests
- **Auth Service**: Handles authentication and authorization
- **Chat Service**: Manages chatbot conversations using LangChain/LangGraph
- **Proposal Service**: Generates property proposals using AI
- **Analytics Service**: Processes and serves analytics data
- **Database**: PostgreSQL with pgvector for vector similarity search
- **Cache**: Redis for session management and caching
- **Object Storage**: S3 for storing documents and images

### Communication Patterns

- **Synchronous Communication**: REST and GraphQL APIs
- **Asynchronous Communication**: Message queues for background processing
- **Event-Driven Architecture**: For certain workflows like notification processing

### Key Workflows

1. **Property Search**: See sequence diagram in `/diagrams/property_search_sequence.png`
2. **Proposal Generation**: See sequence diagram in `/diagrams/proposal_generation_sequence.png`

## Codebase Structure

### Repository Organization

```
real-estate-ai/
├── frontend/                # React frontend application
├── backend/                 # Main API service (Node.js)
├── services/                # Microservices
│   ├── auth-service/        # Authentication service
│   ├── chat-service/        # Chatbot service
│   ├── proposal-service/    # Proposal generation service
│   └── analytics-service/   # Analytics service
├── ai/                      # AI components
│   ├── models/              # Model definitions and fine-tuning
│   ├── prompts/             # LLM prompts
│   └── embeddings/          # Embedding generation
├── database/                # Database migrations and seeds
├── infrastructure/          # IaC with Terraform
│   ├── modules/             # Terraform modules
│   ├── environments/        # Environment-specific configurations
│   └── scripts/             # Infrastructure scripts
├── k8s/                     # Kubernetes manifests
├── docs/                    # Documentation
└── scripts/                 # Utility scripts
```

### Frontend Structure

```
frontend/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Common components
│   │   ├── layout/          # Layout components
│   │   └── [feature]/       # Feature-specific components
│   ├── pages/               # Page components
│   ├── hooks/               # Custom React hooks
│   ├── context/             # React context providers
│   ├── services/            # API service clients
│   ├── utils/               # Utility functions
│   ├── styles/              # Global styles
│   ├── locales/             # Internationalization files
│   ├── types/               # TypeScript type definitions
│   ├── App.tsx              # Main application component
│   └── index.tsx            # Entry point
├── package.json             # Dependencies and scripts
└── tsconfig.json            # TypeScript configuration
```

### Backend Structure

```
backend/
├── src/
│   ├── api/                 # API routes
│   │   ├── controllers/     # Route controllers
│   │   ├── middlewares/     # Express middlewares
│   │   ├── validators/      # Request validators
│   │   └── routes/          # Route definitions
│   ├── graphql/             # GraphQL schema and resolvers
│   ├── services/            # Business logic services
│   ├── models/              # Data models
│   ├── repositories/        # Data access layer
│   ├── utils/               # Utility functions
│   ├── config/              # Configuration
│   └── app.js               # Application setup
├── migrations/              # Database migrations
├── seeds/                   # Database seed data
├── tests/                   # Tests
├── package.json             # Dependencies and scripts
└── .env.example             # Example environment variables
```

### AI Service Structure

```
ai-service/
├── app.py                   # Main application entry point
├── src/
│   ├── chains/              # LangChain chains
│   ├── graphs/              # LangGraph definitions
│   ├── models/              # Model interfaces
│   ├── embeddings/          # Embedding generation
│   ├── prompts/             # Prompt templates
│   ├── utils/               # Utility functions
│   └── config.py            # Configuration
├── tests/                   # Tests
└── requirements.txt         # Python dependencies
```

## Development Workflow

### Git Workflow

We follow a GitHub Flow workflow:

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes and Commit**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```
   
   We follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `style:` for formatting changes
   - `refactor:` for code refactoring
   - `test:` for adding tests
   - `chore:` for maintenance tasks

3. **Push Changes**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create Pull Request**
   - Create a PR on GitHub
   - Fill in the PR template
   - Request reviews from team members
   - Link to related issues

5. **Code Review**
   - Address review comments
   - Make requested changes
   - Push additional commits

6. **Merge**
   - PR will be merged after approval
   - Delete the feature branch after merging

### Issue Tracking

We use GitHub Issues for tracking work:

- **Bug Reports**: Use the bug report template
- **Feature Requests**: Use the feature request template
- **Tasks**: General development tasks

Label issues appropriately:
- `bug`: Bug reports
- `feature`: New features
- `enhancement`: Improvements to existing features
- `documentation`: Documentation updates
- `technical-debt`: Code quality improvements

### Code Quality

We maintain code quality through:

1. **Linting**
   ```bash
   # Frontend and backend
   npm run lint
   
   # AI service
   flake8 .
   ```

2. **Formatting**
   ```bash
   # Frontend and backend
   npm run format
   
   # AI service
   black .
   ```

3. **Type Checking**
   ```bash
   # Frontend and backend
   npm run type-check
   
   # AI service
   mypy .
   ```

4. **Pre-commit Hooks**
   We use pre-commit hooks to enforce code quality checks before commits.

## Testing Guidelines

### Testing Approach

We follow a comprehensive testing approach:

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test interactions between components
- **End-to-End Tests**: Test complete user flows
- **AI Component Tests**: Test LLM chains and embeddings

### Running Tests

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test

# AI service tests
cd ai-service
pytest
```

### Writing Tests

#### Frontend Tests (React)

```javascript
// Example component test using React Testing Library
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PropertyCard from './PropertyCard';

test('displays property details correctly', () => {
  const property = {
    id: '1',
    title: 'Luxury Apartment',
    price: 2000000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1500,
  };
  
  render(<PropertyCard property={property} />);
  
  expect(screen.getByText('Luxury Apartment')).toBeInTheDocument();
  expect(screen.getByText('AED 2,000,000')).toBeInTheDocument();
  expect(screen.getByText('3 Beds')).toBeInTheDocument();
  expect(screen.getByText('2 Baths')).toBeInTheDocument();
  expect(screen.getByText('1,500 sq ft')).toBeInTheDocument();
});
```

#### Backend Tests (Node.js)

```javascript
// Example API test using Jest and Supertest
const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');

describe('Property API', () => {
  beforeAll(async () => {
    await db.migrate.latest();
    await db.seed.run();
  });
  
  afterAll(async () => {
    await db.destroy();
  });
  
  it('should return a list of properties', async () => {
    const response = await request(app)
      .get('/api/properties')
      .set('Authorization', `Bearer ${testToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.data[0]).toHaveProperty('id');
    expect(response.body.data[0]).toHaveProperty('title');
  });
});
```

#### AI Component Tests (Python)

```python
# Example LLM chain test
import pytest
from langchain.schema import HumanMessage
from src.chains.property_search import create_property_search_chain

def test_property_search_chain():
    chain = create_property_search_chain()
    
    # Test with a simple query
    result = chain.invoke({"query": "Find me a 2-bedroom apartment in Downtown Dubai"})
    
    # Verify the result structure
    assert "properties" in result
    assert len(result["properties"]) > 0
    assert "embedding" in result
    
    # Verify the query understanding
    assert "bedrooms" in result["understood_parameters"]
    assert result["understood_parameters"]["bedrooms"] == 2
    assert "location" in result["understood_parameters"]
    assert "Downtown Dubai" in result["understood_parameters"]["location"]
```

### Test Coverage

We aim for:
- 80%+ code coverage for backend services
- 70%+ code coverage for frontend components
- 90%+ code coverage for critical AI components

Run coverage reports:
```bash
# Backend
cd backend
npm run test:coverage

# Frontend
cd frontend
npm run test:coverage

# AI service
cd ai-service
pytest --cov=src
```

## Deployment Process

Our deployment process follows GitOps principles using GitHub Actions and Argo CD. For detailed procedures, refer to the Operational Runbooks.

### Environments

- **Development**: Automatic deployment from the `develop` branch
- **Staging**: Automatic deployment from the `staging` branch
- **Production**: Manual approval required for deployment from the `main` branch

### CI/CD Pipeline

1. **Continuous Integration**
   - Triggered on pull requests and pushes to main branches
   - Runs linting, type checking, and tests
   - Builds Docker images
   - Performs security scans

2. **Continuous Deployment**
   - Updates Kubernetes manifests in the GitOps repository
   - Argo CD detects changes and syncs with the cluster
   - Performs canary deployment for production

### Monitoring Deployments

- Check deployment status in Argo CD dashboard
- Monitor application logs in Grafana
- Check application health in Prometheus
- Monitor LLM performance in Langfuse

## AI Components Guide

### LangChain and LangGraph

Our AI components are built using LangChain and LangGraph. For detailed architecture decisions, refer to ADR-001.

#### Key Components

1. **Chatbot Agent**
   - Implemented using LangGraph for stateful conversation management
   - Supports multiple languages (EN/AR/FR)
   - Integrates with vector database for property search

2. **Embedding Service**
   - Generates embeddings for properties and user queries
   - Uses OpenAI's text-embedding-3-large model
   - Stored in PostgreSQL using pgvector

3. **Proposal Generator**
   - Uses LangChain for structured content generation
   - Customizes proposals based on lead preferences
   - Generates content in multiple languages

### Working with Prompts

Prompts are stored in the `ai/prompts` directory and follow a templated approach:

```python
# Example prompt template
from langchain.prompts import ChatPromptTemplate

property_search_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are a real estate assistant helping to find properties.
Extract search parameters from the user's query.
Parameters to extract:
- Property type (apartment, villa, townhouse, etc.)
- Location
- Price range
- Number of bedrooms
- Number of bathrooms
- Other amenities or features
Return a JSON object with the extracted parameters."""),
    ("human", "{query}")
])
```

### Testing AI Components

1. **Unit Testing Chains and Graphs**
   - Test individual components with mock inputs
   - Verify output structure and content

2. **Integration Testing**
   - Test end-to-end flows with realistic inputs
   - Verify interactions with databases and other services

3. **Evaluation**
   - Use Langfuse for tracking performance metrics
   - Collect user feedback for continuous improvement

### Debugging AI Components

1. **Enable Verbose Output**
   ```python
   import langchain
   langchain.debug = True
   ```

2. **Use Langfuse Tracing**
   ```python
   from langfuse import Langfuse
   
   langfuse = Langfuse()
   trace = langfuse.trace(name="debug_session")
   
   # Add trace to your chain
   chain.invoke(input, config={"callbacks": [trace.getHandler()]})
   ```

3. **Inspect Intermediate Outputs**
   - Use the LangChain callback system to log intermediate steps
   - Check Langfuse traces for detailed execution flow

## Database Guide

### Database Schema

Our database uses PostgreSQL with the pgvector extension. For a complete schema diagram, refer to the ERD in `/db/ERD.png`.

Key tables include:
- `users`: User accounts and authentication
- `properties`: Real estate property listings
- `leads`: Potential clients
- `proposals`: Generated property proposals
- `embeddings`: Vector embeddings for semantic search

### Working with Migrations

We use Knex.js for database migrations:

```bash
# Create a new migration
cd backend
npx knex migrate:make migration_name

# Run migrations
npx knex migrate:latest

# Rollback migrations
npx knex migrate:rollback
```

### Working with pgvector

1. **Creating Vector Columns**
   ```sql
   -- Add vector column to a table
   ALTER TABLE embeddings ADD COLUMN vector vector(1536);
   ```

2. **Creating Vector Indexes**
   ```sql
   -- Create an index for L2 distance (Euclidean)
   CREATE INDEX ON embeddings USING ivfflat (vector vector_l2_ops) WITH (lists = 100);
   
   -- Create an index for cosine similarity
   CREATE INDEX ON embeddings USING hnsw (vector vector_cosine_ops) WITH (m = 16, ef_construction = 64);
   ```

3. **Querying Vector Similarity**
   ```sql
   -- Find similar properties using cosine similarity
   SELECT p.* 
   FROM properties p
   JOIN embeddings e ON p.id = e.property_id
   ORDER BY e.vector <=> '[0.1, 0.2, ...]'
   LIMIT 10;
   ```

### Database Best Practices

1. **Use Transactions**
   ```javascript
   // Example transaction in Knex.js
   await db.transaction(async (trx) => {
     const leadId = await trx('leads').insert(leadData).returning('id');
     await trx('lead_notes').insert({ lead_id: leadId, content: 'Initial contact' });
   });
   ```

2. **Optimize Queries**
   - Use indexes for frequently queried columns
   - Use EXPLAIN ANALYZE to identify slow queries
   - Consider denormalization for performance-critical paths

3. **Handle Vector Operations Efficiently**
   - Store embeddings in a separate table
   - Use appropriate index types based on similarity measure
   - Adjust index parameters based on dataset size

## API Documentation

### REST API

Our REST API follows OpenAPI 3.0 specification. The full API documentation is available at `/api/api.yaml`.

#### Key Endpoints

- **Authentication**
  - `POST /api/auth/login`: User login
  - `POST /api/auth/register`: User registration
  - `POST /api/auth/refresh`: Refresh access token

- **Properties**
  - `GET /api/properties`: List properties
  - `GET /api/properties/{id}`: Get property details
  - `POST /api/properties`: Create property
  - `PUT /api/properties/{id}`: Update property
  - `DELETE /api/properties/{id}`: Delete property
  - `POST /api/properties/search`: Search properties

- **Leads**
  - `GET /api/leads`: List leads
  - `GET /api/leads/{id}`: Get lead details
  - `POST /api/leads`: Create lead
  - `PUT /api/leads/{id}`: Update lead
  - `DELETE /api/leads/{id}`: Delete lead

- **Proposals**
  - `GET /api/proposals`: List proposals
  - `GET /api/proposals/{id}`: Get proposal details
  - `POST /api/proposals`: Create proposal
  - `PUT /api/proposals/{id}`: Update proposal
  - `DELETE /api/proposals/{id}`: Delete proposal

### GraphQL API

Our GraphQL API schema is available at `/api/schema.graphql`.

#### Example Queries

```graphql
# Get property details with related data
query GetProperty($id: ID!) {
  property(id: $id) {
    id
    title
    description
    price
    area
    bedrooms
    bathrooms
    status
    location {
      address
      community
      city
      coordinates {
        latitude
        longitude
      }
    }
    features {
      name
      value
    }
    images {
      url
      isFloorPlan
    }
  }
}

# Search properties with filters
query SearchProperties($input: PropertySearchInput!) {
  searchProperties(input: $input) {
    totalCount
    properties {
      id
      title
      price
      bedrooms
      bathrooms
      area
      thumbnailUrl
    }
  }
}
```

#### Example Mutations

```graphql
# Create a new lead
mutation CreateLead($input: LeadInput!) {
  createLead(input: $input) {
    id
    firstName
    lastName
    email
    phone
    status
    assignedTo {
      id
      name
    }
  }
}

# Generate a proposal
mutation GenerateProposal($input: ProposalGenerationInput!) {
  generateProposal(input: $input) {
    id
    title
    status
    pdfUrl
    webUrl
    sections {
      title
      content
      type
    }
  }
}
```

### API Authentication

All API endpoints (except public ones) require authentication:

1. **Bearer Token Authentication**
   ```
   Authorization: Bearer <access_token>
   ```

2. **API Key Authentication** (for service-to-service communication)
   ```
   X-API-Key: <api_key>
   ```

## Troubleshooting

### Common Issues and Solutions

#### Frontend Issues

1. **Build Errors**
   - Check for TypeScript errors
   - Verify dependencies are installed
   - Clear node_modules and reinstall

2. **API Connection Issues**
   - Verify API URL in environment variables
   - Check CORS configuration
   - Verify authentication token

#### Backend Issues

1. **Database Connection Errors**
   - Verify database credentials
   - Check network connectivity
   - Ensure database service is running

2. **API Errors**
   - Check request format and parameters
   - Verify authentication
   - Check server logs for detailed errors

#### AI Service Issues

1. **LLM API Errors**
   - Check API keys and rate limits
   - Verify prompt format
   - Check for token limit exceeded errors

2. **Embedding Generation Issues**
   - Verify embedding model configuration
   - Check input text formatting
   - Verify vector dimensions match database schema

### Debugging Tools

1. **Frontend Debugging**
   - React Developer Tools browser extension
   - Redux DevTools for state management
   - Browser console for JavaScript errors

2. **Backend Debugging**
   - Use logging with appropriate log levels
   - API testing tools like Postman
   - Database query analyzers

3. **AI Component Debugging**
   - LangChain debugging mode
   - Langfuse for tracing LLM calls
   - Jupyter notebooks for interactive testing

### Logging

We use structured logging across all services:

```javascript
// Backend logging example
const logger = require('./utils/logger');

logger.info('Operation completed', { 
  userId: user.id,
  operation: 'property_search',
  duration: 235
});

logger.error('Operation failed', {
  userId: user.id,
  operation: 'proposal_generation',
  error: error.message,
  stack: error.stack
});
```

```python
# AI service logging example
import logging
logger = logging.getLogger(__name__)

logger.info("Processing query", extra={
    "query": query,
    "user_id": user_id,
    "trace_id": trace_id
})

logger.error("LLM processing failed", extra={
    "error": str(e),
    "model": model_name,
    "trace_id": trace_id
})
```

## Best Practices

### Code Style

1. **JavaScript/TypeScript**
   - Follow Airbnb JavaScript Style Guide
   - Use TypeScript for type safety
   - Use ESLint and Prettier for formatting

2. **Python**
   - Follow PEP 8 style guide
   - Use type hints
   - Use Black for formatting and Flake8 for linting

3. **SQL**
   - Use consistent casing (snake_case for tables and columns)
   - Include comments for complex queries
   - Use parameterized queries to prevent SQL injection

### Performance Optimization

1. **Frontend**
   - Use React.memo for expensive components
   - Implement virtualization for long lists
   - Optimize bundle size with code splitting

2. **Backend**
   - Use appropriate database indexes
   - Implement caching for frequent queries
   - Use pagination for large result sets

3. **AI Components**
   - Cache embeddings for frequent queries
   - Use streaming responses for LLM outputs
   - Optimize prompts to reduce token usage

### Security Best Practices

1. **Authentication and Authorization**
   - Use JWT with appropriate expiration
   - Implement role-based access control
   - Validate all user inputs

2. **Data Protection**
   - Encrypt sensitive data at rest
   - Use HTTPS for all communications
   - Implement proper error handling to avoid leaking information

3. **AI-Specific Security**
   - Implement prompt injection protection
   - Validate and sanitize user inputs to LLMs
   - Monitor for unusual patterns in LLM usage

## Resources and References

### Documentation

- [Solution Architecture Document](/docs/solution_architecture.md)
- [API Documentation](/api/api.yaml and /api/schema.graphql)
- [Database ERD](/db/ERD.png)
- [Architectural Decision Records](/docs/adr/)

### External Resources

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [LangChain Documentation](https://js.langchain.com/docs/)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [pgvector Documentation](https://github.com/pgvector/pgvector)

### Learning Resources

- [LangChain Cookbook](https://github.com/langchain-ai/langchain/tree/master/cookbook)
- [React Patterns](https://reactpatterns.com/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [PostgreSQL Performance Tuning](https://www.postgresql.org/docs/current/performance-tips.html)

### Team Resources

- [Team Wiki](https://wiki.example.com/real-estate-ai)
- [Design System](https://design.example.com)
- [Project Roadmap](https://roadmap.example.com)
- [Team Communication Channels](https://slack.example.com)
