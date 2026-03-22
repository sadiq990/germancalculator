export interface Kunde {
  id: string;
  name: string;
  color: string;
  defaultHourlyRate?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Projekt {
  id: string;
  kundeId: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface Aufgabe {
  id: string;
  projektId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
