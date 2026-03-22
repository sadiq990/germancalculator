import React from 'react';
import { Card } from '../ui/Card';
import { useTranslation } from '../../hooks/useTranslation';
import { Clock } from 'lucide-react';

export const OvertimeWidget: React.FC<{ period: string }> = ({ period }) => {
  const { t } = useTranslation();

  return (
    <Card className="p-4 flex flex-col gap-2 relative overflow-hidden bg-white dark:bg-dark-surface">
      <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-warning/10 dark:from-warning/20 to-transparent pointer-events-none" />
      
      <div className="flex items-center gap-2 text-warning mb-1">
        <Clock className="w-5 h-5" />
        <h3 className="font-semibold">{t('overtime.balance')}</h3>
      </div>
      
      <div className="flex items-end justify-between z-10">
        <div>
          <span className="text-3xl font-bold text-neutral-900 dark:text-dark-text">+0.00</span>
          <span className="text-sm text-neutral-500 ml-1">Std</span>
        </div>
        <div className="text-right text-xs text-neutral-500 dark:text-dark-text-secondary flex flex-col">
          <span>{t('overtime.iststunden')}: 0.00</span>
          <span>{t('overtime.sollstunden')}: 0.00</span>
        </div>
      </div>
    </Card>
  );
};
