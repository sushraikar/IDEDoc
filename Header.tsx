'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import GlobalSearch from '@/components/ui/GlobalSearch';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      className={`sticky top-0 z-30 w-full transition-all duration-200 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white/95'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="mr-4 p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden"
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <a href="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">UAE Real-Estate AI</span>
            </a>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="/docs" className="text-gray-600 hover:text-blue-600 font-medium">Documentation</a>
            <a href="/ide" className="text-gray-600 hover:text-blue-600 font-medium">Windsurf IDE</a>
          </nav>
          
          <div className="flex items-center">
            <GlobalSearch />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
