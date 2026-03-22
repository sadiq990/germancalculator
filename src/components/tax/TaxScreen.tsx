import React from 'react';
import { useTaxStore } from '../../store/useTaxStore';
import { useTranslation } from '../../hooks/useTranslation';
import { BruttoInput } from './BruttoInput';
import { SteuerklasseSelector } from './SteuerklasseSelector';
import { TaxResultCard } from './TaxResultCard';
import { AITaxExplainer } from './AITaxExplainer';
import { motion } from 'framer-motion';
import { Calculator, Info, Settings2, Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';

export const TaxScreen: React.FC = () => {
  const { t } = useTranslation();
  const { result } = useTaxStore();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto w-full py-4 space-y-8 pb-20 sm:pb-8 px-2"
    >
      {/* Header section */}
      <div className="flex flex-col gap-2 px-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-ios-md bg-ios-blue text-white shadow-ios">
            <Calculator size={24} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">
            {t('tax.title', 'Tax Calculator')}
          </h1>
        </div>
        <p className="text-neutral-500 dark:text-ios-gray-2 text-sm max-w-lg">
          {t('tax.description', 'Calculate your net income for 2026 based on the latest German tax regulations.')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Input Column */}
        <div className="lg:col-span-2 space-y-6">
          <section className="space-y-4">
             <div className="flex items-center justify-between px-2">
               <h3 className="text-[10px] font-bold text-neutral-400 dark:text-ios-gray-1 uppercase tracking-[0.2em]">
                 Input Parameters
               </h3>
               <Settings2 size={14} className="text-neutral-300" />
             </div>
             
             <Card className="p-6 space-y-8 glass shadow-ios">
               <BruttoInput />
               <SteuerklasseSelector />
               
               <div className="p-4 rounded-ios-lg bg-ios-blue/5 border border-ios-blue/10 flex items-start gap-3">
                 <Info size={16} className="text-ios-blue shrink-0 mt-0.5" />
                 <p className="text-[10px] sm:text-xs text-ios-blue leading-relaxed font-medium">
                   Settings like Church Tax and Health Insurance specifics can be adjusted in the <b>Global Settings</b>.
                 </p>
               </div>
             </Card>
          </section>

          <section className="hidden lg:block">
            <AITaxExplainer />
          </section>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between px-2">
             <h3 className="text-[10px] font-bold text-neutral-400 dark:text-ios-gray-1 uppercase tracking-[0.2em]">
               Real-time Projection
             </h3>
             <div className="flex items-center gap-1.5 text-ios-green">
               <span className="w-1.5 h-1.5 rounded-full bg-ios-green animate-pulse" />
               <span className="text-[10px] font-bold uppercase tracking-wider">Live</span>
             </div>
          </div>
          
          <TaxResultCard result={result} />

          {/* Mobile visible AI Explainer */}
          <section className="lg:hidden">
            <AITaxExplainer />
          </section>
        </div>
      </div>
    </motion.div>
  );
};
