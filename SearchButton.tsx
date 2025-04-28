'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import SearchPanel from './SearchPanel';

const SearchButton: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const openSearch = () => {
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
  };

  // Handle keyboard shortcut (Ctrl+K or Cmd+K) to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <button
        onClick={openSearch}
        className="flex items-center px-3 py-2 text-sm text-gray-500 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Search"
      >
        <Search className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">Search</span>
        <span className="hidden sm:inline ml-2 text-xs text-gray-400">Ctrl+K</span>
      </button>

      <SearchPanel isOpen={isSearchOpen} onClose={closeSearch} />
    </>
  );
};

export default SearchButton;
