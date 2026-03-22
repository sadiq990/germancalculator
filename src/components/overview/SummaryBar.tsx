import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

export const SummaryBar: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-dark-surface border-t border-neutral-200 dark:border-dark-border p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
      <div className="flex justify-between items-center max-w-3xl mx-auto text-sm">
        <div className="flex flex-col items-center">
          <span className="text-neutral-500 font-medium text-xs md:text-sm">Σ Zeit</span>
          <span className="font-bold text-base md:text-lg text-neutral-900 dark:text-dark-text">0.00 h</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-neutral-500 font-medium text-xs md:text-sm">Σ Verdienst</span>
          <span className="font-bold text-base md:text-lg text-success">0,00 €</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-neutral-500 font-medium text-xs md:text-sm">Σ {t('overtime.balance')}</span>
          <span className="font-bold text-base md:text-lg text-warning">0.00 h</span>
        </div>
      </div>
    </div>
  );
};
