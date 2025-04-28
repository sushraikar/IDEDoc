# Website Structure and Navigation Design

## Overview
This document outlines the structure and navigation design for the UAE Real-Estate AI Platform website, which consolidates both the documentation bundle and the Windsurf IDE package into a single interactive website.

## Site Map

```
Home
├── Documentation
│   ├── Solution Design
│   │   ├── Overview
│   │   ├── Architecture
│   │   └── Requirements
│   ├── API Reference
│   │   ├── REST API
│   │   └── GraphQL Schema
│   ├── Database
│   │   ├── ERD Diagram
│   │   └── Data Dictionary
│   ├── Architecture Decisions
│   │   ├── ADR 001: LangChain & LangGraph
│   │   ├── ADR 002: pgvector
│   │   ├── ADR 003: Multilingual Support
│   │   ├── ADR 004: Database Schema
│   │   ├── ADR 005: Observability
│   │   ├── ADR 006: AWS Infrastructure
│   │   └── ADR 007: Deployment Strategy
│   ├── Technical Diagrams
│   │   ├── Deployment Architecture
│   │   ├── Property Search Sequence
│   │   └── Proposal Generation Sequence
│   ├── Developer Guide
│   ├── Operations
│   │   ├── Runbooks
│   │   └── CI/CD Pipeline
│   └── Security & Compliance
├── Windsurf IDE
│   ├── Setup Guide
│   ├── Flow JSON Snippets
│   │   ├── Backend Initialization
│   │   ├── PGVector Migration
│   │   ├── Langfuse Tracing
│   │   ├── Helm Deployment
│   │   └── ADR Writing
│   ├── MCP Server
│   │   ├── Overview
│   │   ├── Implementation
│   │   ├── API Reference
│   │   └── Interactive Demo
│   ├── Troubleshooting
│   └── Validation Tools
└── Resources
    ├── Downloads
    ├── Search
    └── About
```

## Navigation Design

### Primary Navigation
- **Top Navigation Bar**: Main sections (Documentation, Windsurf IDE, Resources)
- **Logo**: Links to home page
- **Search Bar**: Global search functionality
- **Download Button**: Quick access to download packages

### Secondary Navigation
- **Left Sidebar**: Context-sensitive navigation based on current section
  - Collapsible categories
  - Highlighted current page
  - Breadcrumb trail at top

### Mobile Navigation
- **Hamburger Menu**: Expands to show all navigation options
- **Bottom Navigation Bar**: Quick access to main sections
- **Collapsible Sections**: To conserve space on smaller screens

## Page Templates

### Home Page
- Hero section with project overview
- Quick links to most important sections
- Visual navigation cards for main sections
- Latest updates or news

### Documentation Pages
- Left sidebar with documentation navigation
- Main content area with documentation
- Right sidebar with table of contents for current page
- Code snippets with syntax highlighting and copy button
- Interactive diagrams where applicable

### Windsurf IDE Pages
- Left sidebar with IDE package navigation
- Main content area with IDE documentation
- Interactive elements for Flow JSON snippets
- Live demo sections for MCP server

### Resource Pages
- Download links with descriptions
- Search results page
- About page with project information

## Interactive Elements

### Documentation Section
- **Interactive ERD Diagram**: Zoom, pan, highlight tables
- **Collapsible Sections**: For long documentation pages
- **Code Highlighting**: For all code snippets
- **Copy to Clipboard**: For code blocks
- **API Explorer**: Interactive REST API documentation

### Windsurf IDE Section
- **Flow Visualizer**: Interactive visualization of Flow JSON snippets
- **MCP Server Demo**: Live interaction with MCP server tools
- **Syntax Highlighting**: For TypeScript and JSON code
- **Collapsible Troubleshooting Sections**: Organized by problem type

## Color Scheme and Branding

### Primary Colors
- **Primary Blue**: #0F52BA (UAE blue)
- **Secondary Green**: #00A36C (Success/positive actions)
- **Accent Gold**: #D4AF37 (Highlights and accents)

### Secondary Colors
- **Dark Gray**: #333333 (Text and headers)
- **Light Gray**: #F5F5F5 (Backgrounds)
- **Medium Gray**: #CCCCCC (Borders and dividers)

### Typography
- **Headings**: Poppins (Sans-serif)
- **Body Text**: Inter (Sans-serif)
- **Code**: JetBrains Mono (Monospace)

## Responsive Design Breakpoints
- **Mobile**: 0-640px
- **Tablet**: 641px-1024px
- **Desktop**: 1025px+

## Accessibility Considerations
- High contrast mode
- Keyboard navigation support
- Screen reader compatibility
- Alternative text for all images and diagrams
- ARIA labels for interactive elements
