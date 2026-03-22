import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { SideNav } from './SideNav';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F2F2F7] dark:bg-black">
      {/* Desktop Sidebar */}
      <SideNav />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen relative md:ml-64">
        <Header />
        
        <main className="flex-1 overflow-x-hidden pt-16 pb-24 md:pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>

        {/* Mobile View Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};
