import React from 'react';
import { Card } from '../ui/Card';
import { useTranslation } from '../../hooks/useTranslation';
import type { TaxResult } from '../../types/tax.types';

export const TaxResultCard: React.FC<{ result: TaxResult }> = ({ result }) => {
  const { t } = useTranslation();
  
  const formatMoney = (val: number) => 
    new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(val);

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/20 dark:from-primary/10 dark:border-primary/30">
      <div className="flex flex-col items-center justify-center mb-6">
        <span className="text-sm font-medium text-neutral-500 dark:text-dark-text-secondary uppercase tracking-wider">{t('tax.netto')}</span>
        <span className="text-4xl sm:text-5xl font-bold text-success mt-1">{formatMoney(result.nettoMonthly)}</span>
        <span className="text-sm text-neutral-500 mt-2">
          Effektivbelastung: <span className="font-semibold text-danger">{result.effectiveTaxRate.toFixed(1)}%</span>
        </span>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between pb-2 border-b border-neutral-200 dark:border-dark-border/50">
          <span className="text-neutral-600 dark:text-dark-text-secondary">{t('tax.brutto')}</span>
          <span className="font-medium text-neutral-900 dark:text-dark-text">{formatMoney(result.bruttoMonthly)}</span>
        </div>
        <div className="flex justify-between text-danger pb-2 border-b border-neutral-200 dark:border-dark-border/50">
          <span>{t('tax.lohnsteuer')} + {t('tax.soli')} + {t('tax.kirchensteuer')}</span>
          <span>-{formatMoney(result.lohnsteuer + result.solidaritaetszuschlag + result.kirchensteuer)}</span>
        </div>
        <div className="flex justify-between text-danger pb-2 border-b border-neutral-200 dark:border-dark-border/50">
          <span>SV-Abgaben (KV, RV, AV, PV)</span>
          <span>-{formatMoney(result.krankenversicherung + result.rentenversicherung + result.arbeitslosenversicherung + result.pflegeversicherung)}</span>
        </div>
      </div>
    </Card>
  );
};
