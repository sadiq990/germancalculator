// ══════════════════════════════════════════════════
// FILE: src/config/taxRates.ts
// PURPOSE: Centralized tax configuration for Germany (2026)
// ══════════════════════════════════════════════════

export const TAX_CONFIG = {
  year: 2026,
  lastUpdated: "2026-01-01",

  // Rentenversicherung
  rentenversicherung: 0.186,

  // Arbeitslosenversicherung
  arbeitslosenversicherung: 0.026,

  // Pflegeversicherung
  pflegeversicherung: 0.034,
  pflegeKinderlos: 0.040,

  // Krankenversicherung Zusatzbeitrag (ortalama)
  kvZusatzbeitrag: 0.029,

  // Kirchensteuer
  kirchensteuerBayern: 0.08,
  kirchensteuerSonst: 0.09,

  // Mini/Midi job
  miniJobLimit: 556,
  midiJobLimit: 2000,

  // Beitragsbemessungsgrenzen (aylıq)
  bbgKvPv: 5812.50,
  bbgRvAlv: 8450,

  // Solidaritätszuschlag
  soliFreigrenze: 20350,
  soliSatz: 0.055,

  // Lohnsteuer
  grundfreibetrag: 12348,

  // Mindestlohn
  mindestlohn: 13.90,
} as const;

export const AI_DISCLAIMER = {
  de: "⚠️ Schätzung basierend auf Steuerjahr 2026. Ohne Gewähr.",
  en: "⚠️ Estimate based on tax year 2026. No liability assumed.",
  tr: "⚠️ 2026 vergi yılı baz alınarak hesaplanmıştır. Garanti verilmez.",
  fr: "⚠️ Estimation basée sur l'année fiscale 2026. Aucune responsabilité assumée.",
} as const;
