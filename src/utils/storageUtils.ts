import Dexie, { type Table } from 'dexie';
import type { TimeEntry, EntryTemplate } from '../types/entry.types';
import type { Sondertag } from '../types/sondertag.types';
import type { Kunde, Projekt, Aufgabe } from '../types/kunde.types';

export class AppDatabase extends Dexie {
  entries!: Table<TimeEntry, string>;
  templates!: Table<EntryTemplate, string>;
  sondertage!: Table<Sondertag, string>;
  kunden!: Table<Kunde, string>;
  projekte!: Table<Projekt, string>;
  aufgaben!: Table<Aufgabe, string>;

  constructor() {
    super('GermanyCalculatorDB');
    this.version(1).stores({
      entries: 'id, date, kundeId, projektId, type',
      templates: 'id, name',
      sondertage: 'id, date, type',
      kunden: 'id, name',
      projekte: 'id, kundeId',
      aufgaben: 'id, projektId'
    });
  }
}

export const db = new AppDatabase();
