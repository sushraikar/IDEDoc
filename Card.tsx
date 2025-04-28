'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CardProps {
  title: string;
  description: string;
  href: string;
  icon?: string;
  className?: string;
}

export default function Card({ title, description, href, icon, className }: CardProps) {
  return (
    <Link href={href} className={`block no-underline ${className || ''}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full transition-all hover:shadow-md hover:border-[#0F52BA] hover:translate-y-[-2px]">
        <div className="flex items-start">
          {icon && (
            <div className="mr-4 flex-shrink-0">
              <Image 
                src={icon} 
                alt={`${title} icon`} 
                width={40} 
                height={40} 
                className="text-[#0F52BA]"
              />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface CardGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function CardGrid({ children, columns = 3, className }: CardGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6 my-8 ${className || ''}`}>
      {children}
    </div>
  );
}
