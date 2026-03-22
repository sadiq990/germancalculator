import React from 'react';
import { PageTransition } from '../layout/PageTransition';
import { useTranslation } from '../../hooks/useTranslation';
import { SummaryBar } from './SummaryBar';
import { OvertimeWidget } from './OvertimeWidget';
import { Tabs } from '../ui/Tabs';

export const OverviewScreen: React.FC = () => {
  const { t } = useTranslation();
  const [period, setPeriod] = React.useState('week');

  const tabs = [
    { id: 'day', label: 'Tag' },
    { id: 'week', label: 'Woche' },
    { id: 'month', label: 'Monat' },
    { id: 'year', label: 'Jahr' }
  ];

  return (
    <PageTransition>
      <div className="flex flex-col h-full bg-neutral-50 dark:bg-dark-bg relative">
        <div className="sticky top-0 z-10 bg-white dark:bg-dark-surface shadow-sm">
          <Tabs tabs={tabs} activeId={period} onChange={setPeriod} />
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 pb-28">
          <OvertimeWidget period={period} />
          
          <div className="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-sm border border-neutral-100 dark:border-dark-border text-center">
            <p className="text-neutral-500 dark:text-dark-text-secondary">Chart & Timeline Data for {period}</p>
          </div>
        </div>

        <SummaryBar />
      </div>
    </PageTransition>
  );
};
