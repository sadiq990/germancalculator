import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import type { Steuerklasse } from '../../types/tax.types';

interface SteuerklasseSelectorProps {
  value: Steuerklasse;
  onChange: (val: Steuerklasse) => void;
}

export const SteuerklasseSelector: React.FC<SteuerklasseSelectorProps> = ({ value, onChange }) => {
  const { t } = useTranslation();
  const klassen: Steuerklasse[] = ['I', 'II', 'III', 'IV', 'V', 'VI'];

  return (
    <div className="bg-white dark:bg-dark-surface p-4 rounded-xl border border-neutral-100 dark:border-dark-border">
      <label className="block text-sm font-medium text-neutral-900 dark:text-dark-text-secondary mb-3">
        {t('tax.steuerklasse')}
      </label>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {klassen.map(klasse => (
          <button
            key={klasse}
            onClick={() => onChange(klasse)}
            className={`
              py-2 rounded-lg font-medium transition-colors border
              ${value === klasse 
                ? 'bg-primary border-primary text-white' 
                : 'bg-neutral-50 border-neutral-200 dark:bg-dark-bg dark:border-dark-border text-neutral-600 dark:text-dark-text hover:bg-neutral-100 dark:hover:bg-dark-surface'}
            `}
          >
            {klasse}
          </button>
        ))}
      </div>
    </div>
  );
};
