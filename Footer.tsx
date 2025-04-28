'use client';

import React from 'react';
import { Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">UAE Real-Estate AI Platform</h3>
            <p className="text-gray-600">
              Comprehensive documentation and development resources for the UAE Real-Estate AI Operating System.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/docs" className="text-blue-600 hover:text-blue-800">Documentation</a></li>
              <li><a href="/docs/api-reference" className="text-blue-600 hover:text-blue-800">API Reference</a></li>
              <li><a href="/docs/architecture-decisions" className="text-blue-600 hover:text-blue-800">Architecture Decisions</a></li>
              <li><a href="/ide" className="text-blue-600 hover:text-blue-800">Windsurf IDE</a></li>
              <li><a href="/ide/troubleshooting" className="text-blue-600 hover:text-blue-800">Troubleshooting</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://github.com/uae-realestate-ai/documentation" 
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github size={16} className="mr-2" />
                  GitHub Repository
                </a>
              </li>
              <li><a href="/docs/security" className="text-blue-600 hover:text-blue-800">Security & Compliance</a></li>
              <li><a href="/docs/developer-guide" className="text-blue-600 hover:text-blue-800">Developer Guide</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} UAE Real-Estate AI Platform. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-gray-700">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-gray-700">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
