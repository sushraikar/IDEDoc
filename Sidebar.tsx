'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, FileText, Book, Code, Database, GitBranch, BarChart2, Terminal, Users, GitPullRequest, Shield } from 'lucide-react';

interface SidebarProps {
  type: 'docs' | 'ide';
}

interface SidebarItem {
  title: string;
  href?: string;
  icon?: React.ReactNode;
  children?: SidebarItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ type }) => {
  // Define sidebar items based on type
  const items: SidebarItem[] = type === 'docs' 
    ? [
        {
          title: 'Documentation',
          icon: <Book className="w-5 h-5" />,
          children: [
            { title: 'Solution Design Document', href: '/docs/solution-design', icon: <FileText className="w-4 h-4" /> },
            { title: 'API Reference', href: '/docs/api-reference', icon: <Code className="w-4 h-4" /> },
            { title: 'Database Documentation', href: '/docs/database', icon: <Database className="w-4 h-4" /> },
            { title: 'Architecture Decisions', href: '/docs/architecture-decisions', icon: <GitBranch className="w-4 h-4" /> },
            { title: 'Technical Diagrams', href: '/docs/technical-diagrams', icon: <BarChart2 className="w-4 h-4" /> },
            { title: 'Test Plan', href: '/docs/test-plan', icon: <Terminal className="w-4 h-4" /> },
            { title: 'Operational Runbooks', href: '/docs/operational-runbooks', icon: <Terminal className="w-4 h-4" /> },
            { title: 'Developer Guide', href: '/docs/developer-guide', icon: <Users className="w-4 h-4" /> },
            { title: 'CI/CD Documentation', href: '/docs/cicd', icon: <GitPullRequest className="w-4 h-4" /> },
            { title: 'Security & Compliance', href: '/docs/security', icon: <Shield className="w-4 h-4" /> },
          ]
        }
      ]
    : [
        {
          title: 'Windsurf IDE',
          icon: <Code className="w-5 h-5" />,
          children: [
            { title: 'Setup Guide', href: '/ide/setup-guide', icon: <FileText className="w-4 h-4" /> },
            { title: 'Flow Snippets', href: '/ide/flow-snippets', icon: <GitBranch className="w-4 h-4" /> },
            { title: 'MCP Server', href: '/ide/mcp-server', icon: <Terminal className="w-4 h-4" /> },
            { title: 'Troubleshooting', href: '/ide/troubleshooting', icon: <Shield className="w-4 h-4" /> },
            { title: 'Validation Tools', href: '/ide/validation-tools', icon: <Terminal className="w-4 h-4" /> },
          ]
        }
      ];

  // Track expanded state for each item
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'Documentation': true,
    'Windsurf IDE': true
  });

  const toggleExpand = (title: string) => {
    setExpanded(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  // Render sidebar items recursively
  const renderItems = (items: SidebarItem[], level = 0) => {
    return items.map((item, index) => {
      const hasChildren = item.children && item.children.length > 0;
      const isExpanded = expanded[item.title];
      
      return (
        <div key={index} className="mb-1">
          {item.href ? (
            <a 
              href={item.href}
              className={`
                flex items-center px-3 py-2 text-sm rounded-md
                ${level === 0 ? 'font-medium' : 'font-normal'}
                hover:bg-gray-100 text-gray-900
              `}
              style={{ paddingLeft: `${(level * 0.5) + 0.75}rem` }}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              <span>{item.title}</span>
            </a>
          ) : (
            <button
              onClick={() => toggleExpand(item.title)}
              className={`
                flex items-center justify-between w-full px-3 py-2 text-sm rounded-md
                ${level === 0 ? 'font-medium' : 'font-normal'}
                hover:bg-gray-100 text-gray-900
              `}
              style={{ paddingLeft: `${(level * 0.5) + 0.75}rem` }}
            >
              <span className="flex items-center">
                {item.icon && <span className="mr-2">{item.icon}</span>}
                <span>{item.title}</span>
              </span>
              {hasChildren && (
                isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
          
          {hasChildren && isExpanded && (
            <div className="mt-1">
              {renderItems(item.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="py-4">
      <div className="mb-6">
        <a 
          href={type === 'docs' ? '/docs' : '/ide'} 
          className="text-lg font-bold text-blue-600 hover:text-blue-800"
        >
          {type === 'docs' ? 'Documentation' : 'Windsurf IDE'}
        </a>
      </div>
      
      <nav className="space-y-1">
        {renderItems(items)}
      </nav>
      
      <div className="mt-8 pt-6 border-t border-gray-200">
        <a 
          href={type === 'docs' ? '/ide' : '/docs'}
          className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-900 hover:bg-gray-100"
        >
          {type === 'docs' 
            ? <><Code className="w-5 h-5 mr-2" /> Switch to Windsurf IDE</>
            : <><Book className="w-5 h-5 mr-2" /> Switch to Documentation</>
          }
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
