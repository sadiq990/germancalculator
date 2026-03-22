import React from 'react';
import { Select } from '../ui/Select';
import { useKundeStore } from '../../store/useKundeStore';
import { useTranslation } from '../../hooks/useTranslation';

interface QuickKundeSelectProps {
  value: string | null;
  onChange: (id: string | null) => void;
  disabled?: boolean;
}

export const QuickKundeSelect: React.FC<QuickKundeSelectProps> = ({ value, onChange, disabled }) => {
  const kunden = useKundeStore(state => state.kunden);
  const { t } = useTranslation();

  const options = [
    { value: '', label: `-- ${t('timer.select_client')} --` },
    ...kunden.map(k => ({ value: k.id, label: k.name }))
  ];

  return (
    <div className="w-full max-w-xs mx-auto mb-6">
      <Select
        options={options}
        value={value || ''}
        onChange={(e) => onChange(e.target.value || null)}
        disabled={disabled}
      />
    </div>
  );
};
