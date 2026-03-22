import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Timer, List, BarChart3, Calculator, Settings, Sparkles, Share2 } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

export const BottomNav: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Timer, label: t('nav.timer') },
    { path: '/entries', icon: List, label: t('nav.entries') },
    { path: '/ai', icon: Sparkles, label: t('nav.ai'), highlight: true },
    { path: '/tax', icon: Calculator, label: t('nav.tax') },
    { path: '/settings', icon: Settings, label: t('nav.settings') },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-heavy z-50 border-t border-neutral-200 dark:border-ios-dark-4 safe-padding-b">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform"
            >
              <div className={`
                p-1.5 rounded-full transition-all
                ${isActive ? 'text-ios-blue' : 'text-neutral-400 dark:text-neutral-500'}
                ${item.highlight && !isActive ? 'bg-ios-blue/10 text-ios-blue' : ''}
              `}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`
                text-[10px] font-medium tracking-tight
                ${isActive ? 'text-ios-blue' : 'text-neutral-500'}
              `}>
                {item.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="bottomTab"
                  className="absolute -top-[1px] left-1/4 right-1/4 h-[2px] bg-ios-blue rounded-full"
                />
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
