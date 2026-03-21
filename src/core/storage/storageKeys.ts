// ══════════════════════════════════════════════════
// FILE: src/core/storage/storageKeys.ts
// PURPOSE: Centralized storage key constants — prevents typo bugs and collisions
// ══════════════════════════════════════════════════

export const STORAGE_KEYS = {
  // AsyncStorage keys (non-sensitive)
  SESSIONS: '@stundenrechner/sessions',
  ACTIVE_SESSION_ID: '@stundenrechner/active_session_id',
  ONBOARDING_COMPLETED: '@stundenrechner/onboarding_completed',
  PDF_EXPORT_COUNT: '@stundenrechner/pdf_export_count',

  // Used by i18n for locale preference
  USER_LOCALE: '@stundenrechner/user_locale',

  // SecureStore keys (sensitive / settings)
  SETTINGS: 'stundenrechner_settings',
  EMPLOYERS: 'stundenrechner_employers',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
