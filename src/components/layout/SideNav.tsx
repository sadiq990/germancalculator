import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { PlayCircle, List, BarChart2, Calculator, Download, Settings, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

export const SideNav: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: t('nav.timer'), icon: PlayCircle },
    { path: '/entries', label: t('nav.entries'), icon: List },
    { path: '/overview', label: t('nav.overview'), icon: BarChart2 },
    { path: '/tax', label: t('nav.tax'), icon: Calculator },
    { path: '/export', label: t('nav.export'), icon: Download },
    { path: '/ai', label: t('nav.ai'), icon: Bot },
    { path: '/settings', label: t('nav.settings'), icon: Settings },
  ];

  return (
    <nav className="hidden sm:flex flex-col w-64 bg-white dark:bg-dark-surface border-r border-neutral-200 dark:border-dark-border h-full overflow-y-auto z-20 transition-colors">
      <ul className="flex flex-col gap-2 p-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <li key={item.path}>
              <button
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors relative
                  ${isActive 
                    ? 'text-primary bg-primary/10 dark:bg-primary/20' 
                    : 'text-neutral-600 hover:bg-neutral-100 dark:text-dark-text-secondary dark:hover:bg-dark-border dark:hover:text-dark-text'}
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="sideNavIndicator"
                    className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r"
                  />
                )}
                <Icon className={`w-5 h-5 ${isActive ? 'fill-primary/20' : ''}`} />
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
