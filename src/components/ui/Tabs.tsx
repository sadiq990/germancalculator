import React from 'react';
import { motion } from 'framer-motion';

export interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeId, onChange, className = '' }) => {
  return (
    <div className={`flex w-full overflow-x-auto no-scrollbar border-b border-neutral-200 dark:border-dark-border ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeId === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              relative flex-1 py-3 px-1 text-center text-sm font-medium transition-colors
              ${isActive ? 'text-primary' : 'text-neutral-500 hover:text-neutral-700 dark:text-dark-text-secondary dark:hover:text-dark-text'}
            `}
          >
            {tab.label}
            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute left-0 right-0 bottom-0 h-0.5 bg-primary"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
