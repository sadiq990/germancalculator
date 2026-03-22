import { TAX_CONFIG } from '../config/taxRates';
import type { TaxInput, TaxResult } from '../types/tax.types';

export function calculateTaxes(input: TaxInput): TaxResult {
  const {
    bruttoMonthly,
    kirchensteuer,
    kirchensteuerSatz,
    kvBeitragssatz,
    hasKinder,
    isMiniJob
  } = input;

  if (isMiniJob || bruttoMonthly <= TAX_CONFIG.miniJobLimit) {
    return {
      bruttoMonthly,
      lohnsteuer: 0,
      solidaritaetszuschlag: 0,
      kirchensteuer: 0,
      krankenversicherung: 0,
      pflegeversicherung: 0,
      rentenversicherung: 0,
      arbeitslosenversicherung: 0,
      totalDeductions: 0,
      nettoMonthly: bruttoMonthly,
      effectiveTaxRate: 0,
      yearlyNetto: bruttoMonthly * 12,
      yearlyBrutto: bruttoMonthly * 12
    };
  }

  const isBayernOrBaden = kirchensteuerSatz === 0.08;

  // Social Security (Employee Share)
  const kvBasis = Math.min(bruttoMonthly, TAX_CONFIG.bbgKvPv);
  const rvBasis = Math.min(bruttoMonthly, TAX_CONFIG.bbgRvAlv);
  
  const kv = kvBasis * (kvBeitragssatz / 2); // default e.g. 14.6% / 2 + zusatz / 2
  const pvRate = (TAX_CONFIG.pflegeversicherung / 2) + (hasKinder ? 0 : TAX_CONFIG.pflegeKinderlos - TAX_CONFIG.pflegeversicherung);
  const pv = kvBasis * pvRate;
  const rv = rvBasis * (TAX_CONFIG.rentenversicherung / 2);
  const av = rvBasis * (TAX_CONFIG.arbeitslosenversicherung / 2);

  // Wage tax (Mocked simplified progression 2026)
  let lohnsteuer = 0;
  const yearlyBrutto = bruttoMonthly * 12;
  if (yearlyBrutto > TAX_CONFIG.grundfreibetrag) {
    const taxableIncome = yearlyBrutto - TAX_CONFIG.grundfreibetrag;
    const taxRate = 0.14 + (taxableIncome * 0.000002);
    lohnsteuer = (taxableIncome * taxRate) / 12;
  }

  // Kirchensteuer & Soli
  let ks = 0;
  if (kirchensteuer) {
    ks = lohnsteuer * kirchensteuerSatz;
  }
  
  let soli = 0;
  if (yearlyBrutto > TAX_CONFIG.soliFreigrenze) {
    soli = lohnsteuer * TAX_CONFIG.soliSatz;
  }

  const totalDeductions = lohnsteuer + ks + soli + kv + pv + rv + av;
  const nettoMonthly = bruttoMonthly - totalDeductions;

  return {
    bruttoMonthly,
    lohnsteuer,
    solidaritaetszuschlag: soli,
    kirchensteuer: ks,
    krankenversicherung: kv,
    pflegeversicherung: pv,
    rentenversicherung: rv,
    arbeitslosenversicherung: av,
    totalDeductions,
    nettoMonthly,
    effectiveTaxRate: bruttoMonthly > 0 ? (totalDeductions / bruttoMonthly) * 100 : 0,
    yearlyNetto: nettoMonthly * 12,
    yearlyBrutto
  };
}
