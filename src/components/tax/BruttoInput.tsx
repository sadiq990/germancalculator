import React from 'react';
import { Input } from '../ui/Input';
import { useTranslation } from '../../hooks/useTranslation';

interface BruttoInputProps {
  value: number;
  onChange: (val: number) => void;
}

export const BruttoInput: React.FC<BruttoInputProps> = ({ value, onChange }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white dark:bg-dark-surface p-4 rounded-xl border border-neutral-100 dark:border-dark-border">
      <Input 
        type="number"
        label={`${t('tax.brutto')} (Monatlich)`}
        value={value || ''}
        placeholder="z.B. 3500"
        onChange={e => onChange(Number(e.target.value))}
        rightIcon={<span className="text-neutral-500 font-medium font-mono">€</span>}
        className="text-xl font-semibold"
      />
    </div>
  );
};
