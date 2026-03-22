import React from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, PiggyBank } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useEntryStore } from '../../store/useEntryStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { formatMinutesAsHHMM } from '../../utils/timeUtils';
import { formatCurrency } from '../../utils/taxUtils';

export const SummaryBar: React.FC = () => {
  const { t } = useTranslation();
  const entries = useEntryStore(state => state.entries);
  const hourlyRate = useSettingsStore(state => state.hourlyRate);

  const totalMinutes = entries.reduce((acc, entry) => acc + entry.duration, 0);
  const totalEarnings = (totalMinutes / 60) * hourlyRate;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-72 md:right-8 z-30">
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="glass-heavy rounded-ios-xl shadow-2xl border border-white/20 dark:border-white/5 p-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-6 px-2">
          <StatItem 
            icon={<Clock size={16} className="text-ios-blue" />} 
            label={t('overview.total_time', 'Total Time')}
            value={formatMinutesAsHHMM(totalMinutes)}
          />
          <div className="w-[1px] h-8 bg-neutral-200 dark:bg-ios-dark-4 hidden sm:block" />
          <StatItem 
            icon={<TrendingUp size={16} className="text-ios-green" />} 
            label={t('overview.earnings', 'Earnings')}
            value={formatCurrency(totalEarnings)}
          />
        </div>

        <div className="hidden sm:flex items-center gap-3 bg-ios-blue/10 px-4 py-2 rounded-full border border-ios-blue/20">
           <PiggyBank size={18} className="text-ios-blue" />
           <span className="text-xs font-bold text-ios-blue uppercase tracking-tight">Financial Summary</span>
        </div>
      </motion.div>
    </div>
  );
};

const StatItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex flex-col">
    <div className="flex items-center gap-1.5 opacity-60">
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 dark:text-ios-gray-1">
        {label}
      </span>
    </div>
    <span className="text-lg font-mono font-bold dark:text-white leading-tight">
      {value}
    </span>
  </div>
);
