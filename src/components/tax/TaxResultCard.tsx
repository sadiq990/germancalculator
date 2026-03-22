import React from 'react';
import { Card } from '../ui/Card';
import { useTranslation } from '../../hooks/useTranslation';
import { formatCurrency } from '../../utils/taxUtils';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowDownRight, Info, PieChart } from 'lucide-react';
import type { TaxResult } from '../../types/tax.types';

interface TaxResultCardProps {
  result: TaxResult;
}

export const TaxResultCard: React.FC<TaxResultCardProps> = ({ result }) => {
  const { t } = useTranslation();

  return (
    <Card className="p-0 overflow-hidden border-none shadow-ios-hover glass-heavy rounded-ios-xl">
      {/* Premium Header */}
      <div className="bg-ios-blue p-6 text-white overflow-hidden relative">
        <div className="relative z-10">
          <p className="text-ios-blue-light text-sm font-semibold uppercase tracking-wider opacity-80">
            {t('tax.net_monthly', 'Net Monthly Earnings')}
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold mt-1 tracking-tight">
            {formatCurrency(result.netMonthly)}
          </h2>
        </div>
        {/* Abstract Background Shape */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-ios-indigo/20 rounded-full -ml-8 -mb-8 blur-xl" />
      </div>

      <div className="p-6 space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-ios-lg bg-ios-green/10 flex flex-col gap-1">
             <div className="flex items-center gap-2 text-ios-green">
               <TrendingUp size={16} />
               <span className="text-[10px] font-bold uppercase tracking-widest">Efficiency</span>
             </div>
             <p className="text-xl font-bold dark:text-white">{(100 - result.effectiveTaxRate).toFixed(1)}%</p>
          </div>
          <div className="p-4 rounded-ios-lg bg-ios-red/10 flex flex-col gap-1">
             <div className="flex items-center gap-2 text-ios-red">
               <ArrowDownRight size={16} />
               <span className="text-[10px] font-bold uppercase tracking-widest">Deductions</span>
             </div>
             <p className="text-xl font-bold dark:text-white">{result.effectiveTaxRate.toFixed(1)}%</p>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-neutral-400 dark:text-ios-gray-1 uppercase tracking-widest flex items-center gap-2">
            <PieChart size={14} />
            {t('tax.breakdown', 'Detailed Breakdown')}
          </h3>
          
          <div className="space-y-4">
            <BreakdownRow label={t('tax.wage_tax', 'Wage Tax')} value={result.lohnsteuer} />
            <BreakdownRow label={t('tax.social_security', 'Social Security')} value={result.sozialvers} />
            {result.kirchensteuer > 0 && (
              <BreakdownRow label={t('tax.church_tax', 'Church Tax')} value={result.kirchensteuer} />
            )}
            {result.soli > 0 && (
              <BreakdownRow label={t('tax.soli', 'Solidarity Surcharge')} value={result.soli} />
            )}
            
            <div className="pt-2 border-t dark:border-ios-dark-4">
               <BreakdownRow label={t('tax.total_deductions', 'Total Deductions')} value={result.totalDeductions} isTotal />
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="flex gap-3 p-4 rounded-ios-lg bg-neutral-100 dark:bg-ios-dark-4 items-start">
          <Info size={18} className="text-ios-blue mt-0.5 shrink-0" />
          <p className="text-xs text-neutral-500 dark:text-ios-gray-2 leading-relaxed">
            {t('tax.disclaimer', 'This calculation is an estimate for 2026. Actual results may vary based on specific local factors.')}
          </p>
        </div>
      </div>
    </Card>
  );
};

const BreakdownRow = ({ label, value, isTotal = false }: { label: string, value: number, isTotal?: boolean }) => (
  <div className="flex justify-between items-center group">
    <span className={`text-sm ${isTotal ? 'font-bold dark:text-white' : 'text-neutral-600 dark:text-ios-gray-2 group-hover:text-ios-blue'}`}>
      {label}
    </span>
    <span className={`text-sm font-mono ${isTotal ? 'font-bold text-ios-red' : 'font-medium dark:text-neutral-300'}`}>
      {formatCurrency(value)}
    </span>
  </div>
);
