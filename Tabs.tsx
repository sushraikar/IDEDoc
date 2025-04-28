'use client';

import React, { useState } from 'react';
import { Tab } from 'lucide-react';

interface TabsProps {
  tabs: {
    label: string;
    content: React.ReactNode;
  }[];
  defaultTab?: number;
}

const Tabs: React.FC<TabsProps> = ({ tabs, defaultTab = 0 }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className="my-6">
      <div className="flex border-b border-gray-200 mb-4 overflow-x-auto">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === index
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab(index)}
            aria-selected={activeTab === index}
            role="tab"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {tabs[activeTab].content}
      </div>
    </div>
  );
};

export default Tabs;
