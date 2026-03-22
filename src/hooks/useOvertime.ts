import { useMemo } from 'react';
import { useEntryStore } from '../store/useEntryStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { calculateOvertime } from '../utils/overtimeUtils';

export function useOvertime(periodStart: string, periodEnd: string) {
  const entries = useEntryStore(state => state.entries);
  const sollStundenArr = useSettingsStore(state => state.settings.sollStunden);
  
  return useMemo(() => {
    // Temporary logic calculating absolute duration
    const actualMinutes = entries
      .filter(e => e.date >= periodStart && e.date <= periodEnd)
      .reduce((acc, entry) => acc + entry.duration, 0);
      
    // Properly calculating target hours within a specific string requires deeper date-looping logic.
    // We default to 0 for stub
    const targetMinutes = 0; 
    
    return {
      actualMinutes,
      targetMinutes,
      overtimeMinutes: calculateOvertime(actualMinutes, targetMinutes)
    };
  }, [entries, sollStundenArr, periodStart, periodEnd]);
}
