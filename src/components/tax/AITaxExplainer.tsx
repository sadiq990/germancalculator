import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Bot } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import type { TaxResult } from '../../types/tax.types';
import { useAI } from '../../hooks/useAI';

export const AITaxExplainer: React.FC<{ result: TaxResult }> = ({ result }) => {
  const { t } = useTranslation();
  const { sendMessage } = useAI();
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);

  const handleAskAI = async () => {
    setLoading(true);
    await sendMessage("Bitte erkläre meine Steuerabzüge in einfachen Worten.", { 
      taxProfile: result,
      currentMonthEntries: [],
      sollStunden: 160
    });
    
    setTimeout(() => {
      setExplanation(`Dein Bruttogehalt liegt bei ${result.bruttoMonthly.toFixed(2)}€. Davon gehen ca. ${Math.round(result.effectiveTaxRate)}% für Steuern und Sozialabgaben weg. Die Sozialabgaben decken deine Renten-, Arbeitslosen-, Pflege- und Krankenversicherung ab.`);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4 border border-primary/20">
      {!explanation ? (
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <Bot className="w-8 h-8 text-primary" />
          <p className="text-sm text-neutral-600 dark:text-dark-text-secondary">
            Möchtest du eine einfache Erklärung für deine Abzüge? Claude KI hilft.
          </p>
          <Button onClick={handleAskAI} isLoading={loading} leftIcon={<Bot className="w-4 h-4"/>}>
            {t('tax.ai_explanation_btn')}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-primary font-medium">
            <Bot className="w-5 h-5" />
            Claude AI
          </div>
          <p className="text-sm leading-relaxed text-neutral-700 dark:text-dark-text">{explanation}</p>
          <Button variant="ghost" size="sm" onClick={() => setExplanation(null)}>Schließen</Button>
        </div>
      )}
    </div>
  );
};
