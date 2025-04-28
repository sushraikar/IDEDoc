# Real Estate AI Platform Documentation Bundle

## Overview
This documentation bundle contains comprehensive technical documentation for the Real Estate AI Platform, a SaaS solution designed for UAE real estate agencies. The platform leverages AI technologies including LangChain, LangGraph, and vector databases to provide intelligent property matching, multilingual communication, and automated proposal generation.

## Directory Structure

### Core Documentation
- `docs/solution_design_document.md` - Comprehensive solution design document
- `docs/research_notes.md` - Research notes on technical components
- `docs/test_plan.md` - Test plan following IEEE-829 outline
- `docs/operational_runbooks.md` - Operational procedures and runbooks
- `docs/developer_guide.md` - Developer onboarding and reference guide
- `docs/cicd_and_iac.md` - CI/CD pipeline and Infrastructure as Code documentation
- `docs/security_compliance.md` - Security controls and compliance documentation

### API Specifications
- `api/api.yaml` - OpenAPI 3.0 specification
- `api/schema.graphql` - GraphQL schema

### Database Documentation
- `db/ERD.png` - Entity Relationship Diagram
- `db/erd_generator.py` - Script used to generate the ERD
- `db/data_dictionary.xlsx` - Data dictionary with table and column definitions

### Architectural Decision Records
- `docs/adr/001-use-langchain-langgraph-for-multilingual-chatbot.md`
- `docs/adr/002-use-pgvector-for-vector-similarity-search.md`
- `docs/adr/003-multilingual-support-strategy.md`
- `docs/adr/004-database-schema-design.md`
- `docs/adr/005-observability-strategy-with-langfuse.md`
- `docs/adr/006-aws-infrastructure-architecture.md`
- `docs/adr/007-deployment-strategy.md`

### Diagrams
- `diagrams/deployment_architecture.png` - System deployment architecture
- `diagrams/deployment_diagram.py` - Script to generate deployment diagram
- `diagrams/property_search_sequence.png` - Property search sequence diagram
- `diagrams/property_search_sequence.py` - Script to generate property search sequence
- `diagrams/proposal_generation_sequence.png` - Proposal generation sequence diagram
- `diagrams/proposal_generation_sequence.py` - Script to generate proposal sequence

### Project Management
- `todo.md` - Task checklist with completion status

## Key Components

### Solution Architecture
The platform follows a microservices architecture deployed on AWS using Kubernetes (EKS). Key components include:
- Frontend Layer: React-based web application
- API Layer: RESTful and GraphQL APIs
- Service Layer: Microservices for different functional areas
- AI Layer: LangChain/LangGraph for LLM orchestration
- Data Layer: PostgreSQL with pgvector extension
- Integration Layer: Connectors to external data sources

### AI Components
- Multilingual Chatbot (EN/AR/FR)
- Semantic Property Search
- AI-Generated Proposals
- Vector Similarity Search

### Security & Compliance
- UAE PDPL Compliance
- Data Protection Controls
- Identity and Access Management
- Network Security
- Application Security
- AI-Specific Security Measures

### DevOps
- CI/CD Pipeline with GitHub Actions and Argo CD
- Infrastructure as Code with Terraform
- Kubernetes Configuration with Kustomize
- Monitoring with Prometheus, Grafana, and Langfuse
