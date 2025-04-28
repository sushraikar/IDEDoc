'use client';

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ClipboardCopy, Check, Code } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
}

interface CodeTabsProps {
  children: React.ReactElement<CodeBlockProps>[];
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, filename }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-6 rounded-lg overflow-hidden">
      {filename && (
        <div className="flex items-center bg-gray-800 text-gray-200 px-4 py-2 text-sm font-mono">
          <Code size={16} className="mr-2" />
          <span>{filename}</span>
        </div>
      )}
      <div className="absolute right-2 top-2 z-10">
        <button
          onClick={handleCopy}
          className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white transition-colors"
          aria-label="Copy code"
          title="Copy code"
        >
          {copied ? <Check size={16} /> : <ClipboardCopy size={16} />}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{ margin: 0, borderRadius: filename ? '0 0 0.5rem 0.5rem' : '0.5rem' }}
        showLineNumbers={true}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export const CodeTabs: React.FC<CodeTabsProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  // Extract filenames from children to use as tab labels
  const tabLabels = React.Children.map(children, (child) => {
    return child.props.filename || child.props.language.toUpperCase();
  });

  return (
    <div className="my-6">
      <div className="flex border-b border-gray-200 mb-0">
        {tabLabels.map((label, index) => (
          <button
            key={index}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === index
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(index)}
          >
            {label}
          </button>
        ))}
      </div>
      {React.Children.map(children, (child, index) => {
        if (index === activeTab) {
          return child;
        }
        return null;
      })}
    </div>
  );
};

export default CodeBlock;
