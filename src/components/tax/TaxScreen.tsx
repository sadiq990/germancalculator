import React from 'react';
import { PageTransition } from '../layout/PageTransition';
import { useTranslation } from '../../hooks/useTranslation';
import { useTaxCalculator } from '../../hooks/useTaxCalculator';
import { BruttoInput } from './BruttoInput';
import { SteuerklasseSelector } from './SteuerklasseSelector';
import { TaxResultCard } from './TaxResultCard';
import { AITaxExplainer } from './AITaxExplainer';
import { Toggle } from '../ui/Toggle';

export const TaxScreen: React.FC = () => {
  const { t } = useTranslation();
  const { taxProfile, updateTaxProfile, result } = useTaxCalculator();

  return (
    <PageTransition>
      <div className="flex flex-col gap-6 p-4 max-w-2xl mx-auto w-full pb-24">
        <h1 className="text-2xl font-bold">{t('nav.tax')} Calculator 2026</h1>
        
        <BruttoInput 
          value={taxProfile.bruttoMonthly} 
          onChange={(val) => updateTaxProfile({ bruttoMonthly: val })} 
        />
        
        <SteuerklasseSelector 
          value={taxProfile.steuerklasse} 
          onChange={(val) => updateTaxProfile({ steuerklasse: val })} 
        />

        <div className="flex items-center justify-between bg-white dark:bg-dark-surface p-4 rounded-xl border border-neutral-100 dark:border-dark-border">
          <span className="font-medium text-neutral-900 dark:text-dark-text">{t('tax.kirchensteuer')}</span>
          <Toggle 
            checked={taxProfile.kirchensteuer} 
            onChange={(checked) => updateTaxProfile({ kirchensteuer: checked })} 
          />
        </div>

        <div className="flex items-center justify-between bg-white dark:bg-dark-surface p-4 rounded-xl border border-neutral-100 dark:border-dark-border">
          <span className="font-medium text-neutral-900 dark:text-dark-text">{t('tax.kinder')}</span>
          <Toggle 
            checked={taxProfile.hasKinder} 
            onChange={(checked) => updateTaxProfile({ hasKinder: checked })} 
          />
        </div>

        <TaxResultCard result={result} />
        
        <AITaxExplainer result={result} />
      </div>
    </PageTransition>
  );
};
