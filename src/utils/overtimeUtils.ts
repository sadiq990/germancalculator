import { formatMinutesAsHHMM } from './timeUtils';

export function calculateOvertime(actualMinutes: number, targetMinutes: number): number {
  return actualMinutes - targetMinutes;
}

export function getOvertimeDisplay(minutes: number): { text: string; isPositive: boolean } {
  const isPositive = minutes > 0;
  const sign = isPositive ? '+' : '';
  return {
    text: `${sign}${formatMinutesAsHHMM(Math.abs(minutes))}`,
    isPositive
  };
}
