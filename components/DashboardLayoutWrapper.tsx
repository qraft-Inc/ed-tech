'use client';

import { useState, useEffect } from 'react';

interface DashboardLayoutWrapperProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export default function DashboardLayoutWrapper({ children, sidebar }: DashboardLayoutWrapperProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Listen for sidebar state changes
    const checkCollapsed = () => {
      const saved = localStorage.getItem('sidebarCollapsed');
      setIsCollapsed(saved === 'true');
    };

    checkCollapsed();

    // Poll for changes (since we can't directly communicate between components)
    const interval = setInterval(checkCollapsed, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {sidebar}
      <main 
        className="flex-1 overflow-y-auto bg-gray-50 transition-all duration-300"
        style={{ 
          marginLeft: typeof window !== 'undefined' && window.innerWidth >= 1024 
            ? (isCollapsed ? '80px' : '256px') 
            : '0' 
        }}
      >
        {children}
      </main>
    </div>
  );
}
