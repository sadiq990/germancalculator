import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { SummaryBar } from './SummaryBar';
import { OvertimeWidget } from './OvertimeWidget';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Calendar, PieChart, TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';

export const OverviewScreen: React.FC = () => {
  const { t } = useTranslation();
  const [period, setPeriod] = React.useState('week');

  const tabs = [
    { id: 'day', label: t('overview.day', 'Day') },
    { id: 'week', label: t('overview.week', 'Week') },
    { id: 'month', label: t('overview.month', 'Month') },
    { id: 'year', label: t('overview.year', 'Year') }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto w-full py-4 space-y-8 pb-32 px-2"
    >
      {/* Header */}
      <div className="flex flex-col gap-1 px-2">
        <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">
          {t('overview.title', 'Dashboard')}
        </h1>
        <p className="text-neutral-500 dark:text-ios-gray-2 text-sm">
          {t('overview.subtitle', 'Your productivity at a glance')}
        </p>
      </div>

      {/* Segmented Control */}
      <div className="mx-2 p-1 bg-neutral-200/50 dark:bg-ios-dark-4 rounded-ios-md flex gap-1 h-11">
        {tabs.map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setPeriod(tab.id)}
            className={`
              flex-1 flex items-center justify-center text-xs font-bold transition-all rounded-[8px]
              ${period === tab.id ? 'bg-white dark:bg-ios-dark-5 shadow-sm dark:text-white' : 'text-neutral-500'}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
        <OvertimeWidget period={period} />
        
        <Card className="p-6 flex flex-col gap-4 glass shadow-ios">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-neutral-400 dark:text-ios-gray-1 uppercase tracking-[0.2em] flex items-center gap-2">
              <PieChart size={14} />
              Activity Distribution
            </h3>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center py-8 gap-4 opacity-50">
             <BarChart3 size={48} className="text-neutral-300" />
             <p className="text-xs font-medium text-neutral-400 text-center px-8">
               {t('overview.no_chart_data', 'Not enough data to generate analytics for this period.')}
             </p>
          </div>
        </Card>
      </div>

      {/* Mini Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-2">
         <MiniStat label="Earnings" value="€2,450" icon={<TrendingUp size={16} />} color="text-ios-green" />
         <MiniStat label="Avg. Day" value="8.2h" icon={<Calendar size={16} />} color="text-ios-blue" />
         <MiniStat label="Projects" value="4" icon={<BarChart3 size={16} />} color="text-ios-purple" />
         <MiniStat label="Productivity" value="92%" icon={<TrendingUp size={16} />} color="text-ios-orange" />
      </div>

      <SummaryBar />
    </motion.div>
  );
};

const MiniStat = ({ label, value, icon, color }: { label: string, value: string, icon: React.ReactNode, color: string }) => (
  <Card className="p-4 flex flex-col gap-2 glass shadow-sm border-none">
    <div className={`${color} opacity-80`}>{icon}</div>
    <div>
      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">{label}</p>
      <p className="text-lg font-bold dark:text-white">{value}</p>
    </div>
  </Card>
);
