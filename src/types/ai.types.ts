export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AIContext {
  currentMonthEntries: unknown[]; // Typing will map to TimeEntry[] when assembled
  taxProfile: unknown;            // Maps to TaxInput if applicable
  sollStunden: unknown;           // Maps to SollStunden[]
  customContext?: string;
}
