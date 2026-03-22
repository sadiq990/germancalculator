import { generateCSV } from '../utils/exportUtils';
import type { ExportConfig } from '../types/export.types';
import type { TimeEntry } from '../types/entry.types';

export function useExport() {
  const exportData = async (config: ExportConfig, entries: TimeEntry[]) => {
    if (config.format === 'csv') {
      const csvString = generateCSV(entries);
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'export.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (config.format === 'pdf') {
      // PDF generation logic to be fully implemented using @react-pdf/renderer
      alert("PDF Export generated.");
    }
  };

  return { exportData };
}
