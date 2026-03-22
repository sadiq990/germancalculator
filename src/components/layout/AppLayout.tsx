import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { SideNav } from './SideNav';

export const AppLayout: React.FC = () => {
  return (
    <div className="flex flex-col h-[100dvh] w-full bg-neutral-50 dark:bg-dark-bg text-neutral-900 dark:text-dark-text overflow-hidden transition-colors">
      <Header />
      <div className="flex flex-1 overflow-hidden relative">
        <SideNav />
        <main className="flex-1 h-full overflow-y-auto bg-neutral-50 dark:bg-dark-bg scroll-smooth pb-16 sm:pb-0 relative">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
};
