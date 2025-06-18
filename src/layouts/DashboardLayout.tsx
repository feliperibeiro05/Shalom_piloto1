import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';
import { Navbar } from '../components/dashboard/Navbar';

export const DashboardLayout: React.FC = () => {
  const [isSidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar 
        isExpanded={isSidebarExpanded} 
        onToggle={() => setSidebarExpanded(!isSidebarExpanded)} 
      />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}