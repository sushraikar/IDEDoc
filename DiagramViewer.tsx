'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Download, Maximize } from 'lucide-react';

interface DiagramViewerProps {
  src: string;
  alt: string;
  caption?: string;
  interactive?: boolean;
}

const DiagramViewer: React.FC<DiagramViewerProps> = ({ 
  src, 
  alt, 
  caption, 
  interactive = false 
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [fullscreen, setFullscreen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = alt.replace(/\s+/g, '_').toLowerCase() + '.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleToggleFullscreen = () => {
    setFullscreen(!fullscreen);
    if (!fullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !interactive) return;
    
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!interactive) return;
    
    e.preventDefault();
    if (e.deltaY < 0) {
      setScale(prev => Math.min(prev + 0.1, 3));
    } else {
      setScale(prev => Math.max(prev - 0.1, 0.5));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && fullscreen) {
        setFullscreen(false);
        document.body.style.overflow = '';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [fullscreen]);

  return (
    <div className={`diagram-viewer ${fullscreen ? 'fixed inset-0 z-50 bg-white bg-opacity-95 p-8' : 'relative my-6'}`}>
      <div 
        ref={containerRef}
        className={`relative overflow-hidden border border-gray-200 rounded-lg ${
          interactive ? 'cursor-move' : ''
        } ${fullscreen ? 'h-full' : 'max-h-[600px]'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
      >
        <div 
          className="transform-gpu transition-transform duration-100"
          style={{ 
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transformOrigin: 'center',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <img 
            ref={imageRef}
            src={src} 
            alt={alt} 
            className="max-w-full max-h-full object-contain"
          />
        </div>
        
        {interactive && (
          <div className="absolute bottom-4 right-4 flex space-x-2 bg-white bg-opacity-75 p-2 rounded-lg shadow">
            <button 
              onClick={handleZoomIn}
              className="p-2 rounded-md hover:bg-gray-200 transition-colors"
              aria-label="Zoom in"
              title="Zoom in"
            >
              <ZoomIn size={20} />
            </button>
            <button 
              onClick={handleZoomOut}
              className="p-2 rounded-md hover:bg-gray-200 transition-colors"
              aria-label="Zoom out"
              title="Zoom out"
            >
              <ZoomOut size={20} />
            </button>
            <button 
              onClick={handleReset}
              className="p-2 rounded-md hover:bg-gray-200 transition-colors"
              aria-label="Reset view"
              title="Reset view"
            >
              <RotateCw size={20} />
            </button>
            <button 
              onClick={handleDownload}
              className="p-2 rounded-md hover:bg-gray-200 transition-colors"
              aria-label="Download image"
              title="Download image"
            >
              <Download size={20} />
            </button>
            <button 
              onClick={handleToggleFullscreen}
              className="p-2 rounded-md hover:bg-gray-200 transition-colors"
              aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
              title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              <Maximize size={20} />
            </button>
          </div>
        )}
      </div>
      
      {caption && (
        <p className="text-center text-sm text-gray-600 mt-2">{caption}</p>
      )}
    </div>
  );
};

export default DiagramViewer;
