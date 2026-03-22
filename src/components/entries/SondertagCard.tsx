import React from 'react';
import { Card } from '../ui/Card';
import type { Sondertag } from '../../types/sondertag.types';
import { useTranslation } from '../../hooks/useTranslation';

export const SondertagCard: React.FC<{ sondertag: Sondertag }> = ({ sondertag }) => {
  const { t } = useTranslation();
  return (
    <Card className="mb-3 p-4 flex items-center justify-between border-l-4 border-l-primary pointer-events-auto">
      <div>
        <p className="font-semibold text-neutral-900 dark:text-dark-text">{sondertag.date}</p>
        <p className="text-sm text-neutral-500 dark:text-dark-text-secondary">
          {t(`sondertage.${sondertag.type}`)} - {Math.round(sondertag.durationMinutes / 60 * 10) / 10}h
        </p>
      </div>
    </Card>
  );
};
