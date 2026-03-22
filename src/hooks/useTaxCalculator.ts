import { useTaxStore } from '../store/useTaxStore';
import { calculateTaxes } from '../utils/taxUtils';
import { useMemo } from 'react';

export function useTaxCalculator() {
  const taxProfile = useTaxStore(state => state.taxProfile);
  const updateTaxProfile = useTaxStore(state => state.updateTaxProfile);

  const result = useMemo(() => {
    return calculateTaxes(taxProfile);
  }, [taxProfile]);

  return { taxProfile, updateTaxProfile, result };
}
