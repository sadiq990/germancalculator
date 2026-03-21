// ══════════════════════════════════════════════════
// FILE: src/core/services/analyticsService.ts
// PURPOSE: Analytics stub — wire Amplitude/PostHog/Firebase here in future sprint
// ══════════════════════════════════════════════════

// All methods are no-ops in this version.
// Architecture ensures analytics calls are present throughout the app —
// wiring a real provider requires only implementing these methods.

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, string | number | boolean>;
}

export const analyticsService = {
  /**
   * Track a named event with optional properties.
   * Wire to Firebase Analytics, Amplitude, or PostHog here.
   */
  track(_event: AnalyticsEvent): void {
    // TODO: implement when analytics provider is chosen
    // Example: amplitude.logEvent(event.name, event.properties)
  },

  /**
   * Identify a user — called once after onboarding completes.
   */
  identify(_userId: string, _traits?: Record<string, string>): void {
    // TODO: implement user identification
  },

  /**
   * Screen view tracking — called by navigation listener.
   */
  screen(_screenName: string): void {
    // TODO: implement screen tracking
  },

  /**
   * Named event constants — prevent typos in event names.
   */
  Events: {
    SESSION_STARTED: 'session_started',
    SESSION_STOPPED: 'session_stopped',
    SESSION_DELETED: 'session_deleted',
    PDF_EXPORTED: 'pdf_exported',
    CSV_EXPORTED: 'csv_exported',
    SETTINGS_CHANGED: 'settings_changed',
    PAYWALL_VIEWED: 'paywall_viewed',
    ONBOARDING_COMPLETED: 'onboarding_completed',
    NOTE_ADDED: 'note_added',
    REMINDER_SET: 'reminder_set',
    BACKUP_EXPORTED: 'backup_exported',
    BACKUP_IMPORTED: 'backup_imported',
  } as const,
} as const;
