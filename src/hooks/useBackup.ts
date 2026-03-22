import { db } from '../utils/storageUtils';

export function useBackup() {
  const createBackup = async () => {
    try {
      const data = {
        entries: await db.entries.toArray(),
        sondertage: await db.sondertage.toArray(),
        kunden: await db.kunden.toArray(),
        templates: await db.templates.toArray()
      };
      
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Backup failed', e);
    }
  };

  const importBackup = async (file: File) => {
    const text = await file.text();
    const data = JSON.parse(text);
    
    if (data.entries) await db.entries.bulkPut(data.entries);
    if (data.sondertage) await db.sondertage.bulkPut(data.sondertage);
    if (data.kunden) await db.kunden.bulkPut(data.kunden);
    
    alert('Import erfolgreich abgeschlossen. Bitte App neuladen.');
  };

  return { createBackup, importBackup };
}
