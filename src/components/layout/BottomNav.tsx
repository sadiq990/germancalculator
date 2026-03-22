import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { PlayCircle, List, BarChart2, Calculator, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export const BottomNav: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: t('nav.timer'), icon: PlayCircle },
    { path: '/entries', label: t('nav.entries'), icon: List },
    { path: '/overview', label: t('nav.overview'), icon: BarChart2 },
    { path: '/tax', label: t('nav.tax'), icon: Calculator },
    { path: '/settings', label: t('nav.settings'), icon: Settings },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-dark-surface border-t border-neutral-200 dark:border-dark-border z-40 pb-safe">
      <ul className="flex h-full text-xs font-medium">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <li key={item.path} className="flex-1">
              <button
                onClick={() => navigate(item.path)}
                className={`w-full h-full flex flex-col items-center justify-center gap-1 transition-colors relative
                  ${isActive ? 'text-primary' : 'text-neutral-500 hover:text-neutral-900 dark:text-dark-text-secondary dark:hover:text-dark-text'}
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-primary"
                  />
                )}
                <Icon className={`w-5 h-5 ${isActive ? 'fill-primary/20' : ''}`} />
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
