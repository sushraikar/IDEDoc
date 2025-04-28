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
   - Generates embeddings for properties and 
(Content truncated due to size limit. Use line ranges to read in chunks)