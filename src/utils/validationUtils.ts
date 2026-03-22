export function isValidTimeFormat(timeStr: string): boolean {
  return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeStr);
}

export function isEndTimeAfterStartTime(start: string, end: string): boolean {
  if (!isValidTimeFormat(start) || !isValidTimeFormat(end)) return false;
  // If end is before start, it implies crossing midnight
  return start !== end; 
}
