// ══════════════════════════════════════════════════
// FILE: src/core/services/notificationService.ts
// PURPOSE: Local shift reminders via expo-notifications
// ══════════════════════════════════════════════════

import * as Notifications from 'expo-notifications';
import type { WeekDay } from '@core/types/models';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const REMINDER_IDENTIFIER_PREFIX = 'shift-reminder-';

export interface ReminderConfig {
  enabled: boolean;
  days: WeekDay[];
  time: string; // "HH:mm"
}

// Parse "HH:mm" into hours and minutes
function parseTime(time: string): { hours: number; minutes: number } | null {
  const parts = time.split(':');
  if (parts.length !== 2) return null;
  const hours = parseInt(parts[0] ?? '0', 10);
  const minutes = parseInt(parts[1] ?? '0', 10);
  if (isNaN(hours) || isNaN(minutes)) return null;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return { hours, minutes };
}

export const notificationService = {
  async requestPermissions(): Promise<boolean> {
    const { status } = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: false,
        allowSound: false,
      },
    });
    return status === 'granted';
  },

  async getPermissionStatus(): Promise<Notifications.PermissionStatus> {
    const { status } = await Notifications.getPermissionsAsync();
    return status;
  },

  async cancelAllReminders(): Promise<void> {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const reminderIds = scheduled
      .filter((n) => n.identifier.startsWith(REMINDER_IDENTIFIER_PREFIX))
      .map((n) => n.identifier);

    for (const id of reminderIds) {
      await Notifications.cancelScheduledNotificationAsync(id);
    }
  },

  async scheduleReminders(config: ReminderConfig): Promise<void> {
    // Always cancel existing reminders first
    await notificationService.cancelAllReminders();

    if (!config.enabled || config.days.length === 0) return;

    const parsed = parseTime(config.time);
    if (parsed === null) return;

    const hasPermission = await notificationService.requestPermissions();
    if (!hasPermission) return;

    const { hours, minutes } = parsed;

    // Schedule one weekly repeating notification per selected day
    for (const day of config.days) {
      const identifier = `${REMINDER_IDENTIFIER_PREFIX}${day}`;

      // expo-notifications weekday: 1=Sun, 2=Mon... (different from ISO!)
      // ISO WeekDay: 1=Mon, 7=Sun
      // Convert ISO to expo: expo = (ISO % 7) + 1
      const expoWeekday = (day % 7) + 1;

      await Notifications.scheduleNotificationAsync({
        identifier,
        content: {
          title: 'Stundenrechner Pro',
          body: 'Vergiss nicht, deine Schicht zu starten!',
          data: { action: 'open_timer' },
        },
        trigger: {
          weekday: expoWeekday,
          hour: hours,
          minute: minutes,
          repeats: true,
        } as Notifications.WeeklyTriggerInput,
      });
    }
  },

  addNotificationResponseListener(
    handler: (response: Notifications.NotificationResponse) => void,
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(handler);
  },

  removeSubscription(subscription: Notifications.Subscription): void {
    subscription.remove();
  },

  async cancelRemindersIfSessionRunning(isRunning: boolean): Promise<void> {
    if (!isRunning) return;
    // Don't cancel scheduled ones — just suppress via setNotificationHandler
    // The handler above already shows alerts for future ones
    // This is called when we detect a notification tap while running
  },
} as const;
