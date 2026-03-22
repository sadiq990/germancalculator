export function timeToDecimal(timeStr: string): number {
  if (!timeStr) return 0;
  const [hours = 0, minutes = 0] = timeStr.split(':').map(Number);
  return hours + (minutes / 60);
}

export function decimalToTime(decimal: number): string {
  const hours = Math.floor(decimal);
  const minutes = Math.round((decimal - hours) * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function formatMinutesAsHHMM(totalMinutes: number): string {
  const h = Math.floor(Math.abs(totalMinutes) / 60);
  const m = Math.floor(Math.abs(totalMinutes) % 60);
  const sign = totalMinutes < 0 ? '-' : '';
  return `${sign}${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function diffInMinutes(start: string, end: string): number {
  if (!start || !end) return 0;
  const [h1 = 0, m1 = 0] = start.split(':').map(Number);
  const [h2 = 0, m2 = 0] = end.split(':').map(Number);
  const total1 = h1 * 60 + m1;
  let total2 = h2 * 60 + m2;
  
  if (total2 < total1) {
    total2 += 24 * 60; // overnight boundary
  }
  
  return total2 - total1;
}
