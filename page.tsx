import Layout from '@/components/layout/Layout';
import Sidebar from '@/components/layout/Sidebar';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { CardGrid, Card } from '@/components/ui/Card';

export default function Home() {
  return (
    <Layout>
      <div className="py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            UAE Real-Estate AI Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive documentation and development resources for the AI-powered SaaS platform 
            serving UAE real-estate agencies.
          </p>
        </div>

        {/* Main Sections */}
        <CardGrid columns={2}>
          <Card
            title="Documentation"
            description="Explore the complete documentation bundle including solution design, API reference, database schema, architecture decisions, and more."
            href="/docs"
            icon="/icons/docs.svg"
          />
          <Card
            title="Windsurf IDE"
            description="Access the Windsurf IDE package with setup guides, Flow JSON snippets, MCP server implementation, and troubleshooting resources."
            href="/ide"
            icon="/icons/ide.svg"
          />
        </CardGrid>

        {/* Quick Links */}
        <h2 className="text-2xl font-bold text-gray-900 mt-16 mb-6">Quick Links</h2>
        <CardGrid columns={3}>
          <Card
            title="Solution Design"
            description="Understand the technical blueprint covering architecture, requirements, and implementation approach."
            href="/docs/solution-design"
          />
          <Card
            title="API Reference"
            description="Explore the REST API and GraphQL schema specifications."
            href="/docs/api-reference"
          />
          <Card
            title="Database Schema"
            description="View the entity relationship diagram and data dictionary."
            href="/docs/database"
          />
          <Card
            title="Setup Guide"
            description="Step-by-step instructions for setting up the Windsurf Editor environment."
            href="/ide/setup-guide"
          />
          <Card
            title="Flow Snippets"
            description="Ready-to-use Flow JSON snippets for common development tasks."
            href="/ide/flow-snippets"
          />
          <Card
            title="MCP Server"
            description="Model Context Protocol server implementation and API reference."
            href="/ide/mcp-server"
          />
        </CardGrid>

        {/* Resources */}
        <h2 className="text-2xl font-bold text-gray-900 mt-16 mb-6">Resources</h2>
        <CardGrid columns={3}>
          <Card
            title="Downloads"
            description="Download the complete documentation bundle and Windsurf IDE package."
            href="/resources/downloads"
          />
          <Card
            title="Search"
            description="Search across all documentation and resources."
            href="/resources/search"
          />
          <Card
            title="About"
            description="Learn more about the UAE Real-Estate AI Platform project."
            href="/resources/about"
          />
        </CardGrid>
      </div>
    </Layout>
  );
}
