'use client';

import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import { Search, X } from 'lucide-react';

interface SearchResult {
  title: string;
  excerpt: string;
  url: string;
  category: string;
}

interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Mock search function - in a real implementation, this would search through actual content
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock results based on query
    const mockResults: SearchResult[] = [
      {
        title: 'Solution Architecture',
        excerpt: `...${searchQuery} is a key component of the solution architecture...`,
        url: '/docs/solution-design',
        category: 'Documentation'
      },
      {
        title: 'API Reference',
        excerpt: `...endpoints related to ${searchQuery} are documented here...`,
        url: '/docs/api-reference',
        category: 'Documentation'
      },
      {
        title: 'Database Schema',
        excerpt: `...${searchQuery} is stored in the database with the following structure...`,
        url: '/docs/database',
        category: 'Documentation'
      },
      {
        title: 'Windsurf Flow Snippets',
        excerpt: `...${searchQuery} functionality can be implemented using these flow snippets...`,
        url: '/ide/flow-snippets',
        category: 'IDE'
      },
      {
        title: 'MCP Server',
        excerpt: `...${searchQuery} is handled by the MCP server through dedicated tools...`,
        url: '/ide/mcp-server',
        category: 'IDE'
      }
    ].filter(result => 
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      result.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setResults(mockResults);
    setIsLoading(false);
    setSelectedIndex(-1);
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    performSearch(searchQuery);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;
    
    // Handle keyboard navigation
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      window.location.href = results[selectedIndex].url;
      onClose();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, results, selectedIndex]);

  // Focus search input when panel opens
  useEffect(() => {
    if (isOpen) {
      const searchInput = document.getElementById('search-input');
      if (searchInput) {
        searchInput.focus();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-2xl mx-auto mt-20 rounded-lg shadow-xl">
        <div className="p-4">
          <div className="flex items-center mb-4">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              id="search-input"
              type="search"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full p-2 text-gray-900 focus:outline-none text-lg"
              placeholder="Search documentation..."
              autoFocus
            />
            <button onClick={onClose} className="ml-2 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : results.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {results.map((result, index) => (
                  <li 
                    key={index}
                    className={`py-3 px-2 hover:bg-gray-50 ${selectedIndex === index ? 'bg-blue-50' : ''}`}
                  >
                    <a 
                      href={result.url} 
                      className="block"
                      onClick={onClose}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">{result.title}</h3>
                        <span className="text-sm text-gray-500">{result.category}</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600" 
                         dangerouslySetInnerHTML={{ 
                           __html: result.excerpt.replace(
                             new RegExp(query, 'gi'), 
                             match => `<mark class="bg-yellow-200">${match}</mark>`
                           )
                         }} 
                      />
                    </a>
                  </li>
                ))}
              </ul>
            ) : query ? (
              <div className="py-8 text-center text-gray-500">
                No results found for "{query}"
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                Type to start searching
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-200 text-sm text-gray-500">
            <div className="flex justify-between">
              <div>
                <span className="inline-flex items-center mr-3">
                  <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-md mr-1">↑</kbd>
                  <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-md">↓</kbd>
                  <span className="ml-2">to navigate</span>
                </span>
                <span className="inline-flex items-center">
                  <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-md">Enter</kbd>
                  <span className="ml-2">to select</span>
                </span>
              </div>
              <div>
                <span className="inline-flex items-center">
                  <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded-md">Esc</kbd>
                  <span className="ml-2">to close</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;
