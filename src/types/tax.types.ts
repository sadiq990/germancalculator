export type Steuerklasse = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';

export interface TaxInput {
  bruttoMonthly: number;
  steuerklasse: Steuerklasse;
  kirchensteuer: boolean;
  kirchensteuerSatz: number;      // 0.08 or 0.09
  kvBeitragssatz: number;         // e.g. 0.168 for TK
  bundesland: string;
  hasKinder: boolean;
  kinderanzahl: number;
  isMiniJob: boolean;
  isMidiJob: boolean;
}

export interface TaxResult {
  bruttoMonthly: number;
  lohnsteuer: number;
  solidaritaetszuschlag: number;
  kirchensteuer: number;
  krankenversicherung: number;
  pflegeversicherung: number;
  rentenversicherung: number;
  arbeitslosenversicherung: number;
  totalDeductions: number;
  nettoMonthly: number;
  effectiveTaxRate: number;
  yearlyNetto: number;
  yearlyBrutto: number;
}
