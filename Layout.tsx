'use client';

import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  sidebarContent?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showSidebar = false, 
  sidebarContent 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex flex-1">
        {showSidebar && (
          <aside 
            className={`
              fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 pt-16 pb-4
              transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:z-auto
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
          >
            <div className="h-full overflow-y-auto px-4">
              {sidebarContent}
            </div>
          </aside>
        )}
        
        <main className={`flex-1 px-4 py-8 sm:px-6 lg:px-8 ${showSidebar ? 'lg:ml-0' : ''}`}>
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
      
      <Footer />
      
      {/* Overlay for mobile sidebar */}
      {showSidebar && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default Layout;
