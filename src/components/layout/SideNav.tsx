import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Timer, List, BarChart3, Calculator, Settings, Sparkles, Share2, LogOut } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

export const SideNav: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Timer, label: t('nav.timer') },
    { path: '/entries', icon: List, label: t('nav.entries') },
    { path: '/overview', icon: BarChart3, label: t('nav.overview') },
    { path: '/tax', icon: Calculator, label: t('nav.tax') },
    { path: '/ai', icon: Sparkles, label: t('nav.ai'), premium: true },
    { path: '/export', icon: Share2, label: t('nav.export') },
    { path: '/settings', icon: Settings, label: t('nav.settings') },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 glass border-r dark:border-ios-dark-4 z-50">
      <div className="flex items-center gap-3 px-6 h-20">
        <div className="w-10 h-10 bg-ios-blue rounded-ios-md flex items-center justify-center shadow-ios">
          <Sparkles className="text-white" size={24} />
        </div>
        <h1 className="font-bold text-xl tracking-tight dark:text-white">Standly</h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`
                group relative flex items-center gap-3 px-4 py-3 rounded-ios-md text-sm font-medium transition-all
                ${isActive 
                  ? 'bg-ios-blue text-white shadow-ios' 
                  : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-ios-dark-4'
                }
              `}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
              {item.premium && !isActive && (
                <span className="ml-auto px-1.5 py-0.5 rounded-full bg-ios-purple/10 text-ios-purple text-[10px] font-bold uppercase tracking-wider">
                  Pro
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-6 border-t dark:border-ios-dark-4">
        <div className="flex items-center gap-3 p-3 rounded-ios-md bg-neutral-100 dark:bg-ios-dark-4">
          <div className="w-8 h-8 rounded-full bg-ios-orange flex items-center justify-center text-white text-xs font-bold">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate dark:text-white">John Doe</p>
            <p className="text-[10px] text-neutral-500 truncate">Premium Member</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
