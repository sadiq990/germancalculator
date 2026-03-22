// ══════════════════════════════════════════════════
// FILE: src/features/settings/screens/SettingsScreen.tsx
// PURPOSE: Full settings screen with profile, theme, language, reminders, data management
// ══════════════════════════════════════════════════

import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '@shared/hooks/useColorScheme';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Typography } from '@shared/components/Typography';
import { ConfirmDialog } from '@shared/components/ConfirmDialog';
import {
  SettingsRow,
  SettingsDivider,
  SettingsSection,
} from '../components/SettingsRow';
import { LanguagePicker } from '../components/LanguagePicker';
import { EmployerManager } from '../components/EmployerManager';
import { PaywallCard } from '../components/PaywallCard';
import { useSettingsStore } from '@store/settingsStore';
import { useSettings } from '../hooks/useSettings';
import { Spacing } from '@theme/spacing';
import type { SupportedLocale } from '@core/types/models';
import type { Theme } from '@theme/index';
import Constants from 'expo-constants';

const getThemeOptions = (t: ReturnType<typeof useTranslation>['t']) => [
  { value: 'system', label: t('settings.theme_system') },
  { value: 'light', label: t('settings.theme_light') },
  { value: 'dark', label: t('settings.theme_dark') },
] as const;

type ThemeOption = 'system' | 'light' | 'dark';

export const SettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const theme = useColorScheme();
  const styles = makeStyles(theme);
  const THEME_OPTIONS = getThemeOptions(t);

  const { settings, updateSettings, employers, addEmployer, updateEmployer, deleteEmployer, setDefaultEmployer, loadSettings } =
    useSettingsStore();

  const { isExporting, isClearing, exportBackup, clearAllData } = useSettings();

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [showEmployerManager, setShowEmployerManager] = useState(false);
  const [nameInput, setNameInput] = useState(settings.displayName);
  
  const defaultEmployer = employers.find((e) => e.isDefault) ?? employers[0];

  const handleNameBlur = useCallback(() => {
    if (nameInput !== settings.displayName) {
      void updateSettings({ displayName: nameInput });
    }
  }, [nameInput, settings.displayName, updateSettings]);

  const handleThemeChange = useCallback(
    (newTheme: ThemeOption) => {
      void updateSettings({ theme: newTheme });
    },
    [updateSettings],
  );

  const handleLocaleChange = useCallback(
    (locale: SupportedLocale) => {
      void updateSettings({ locale });
      setShowLanguagePicker(false);
    },
    [updateSettings],
  );

  const handleReminderToggle = useCallback(
    (value: boolean) => {
      void updateSettings({ reminderEnabled: value });
    },
    [updateSettings],
  );

  const handleClearConfirm = useCallback(async () => {
    setShowClearConfirm(false);
    await clearAllData();
    await loadSettings();
  }, [clearAllData, loadSettings]);

  const themeLabel = THEME_OPTIONS.find((opt) => opt.value === settings.theme)?.label ?? t('settings.theme_system');

  const appVersion =
    Constants.expoConfig?.version ?? '1.0.0';

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <Typography variant="title1" style={styles.title}>
          {t('settings.title')}
        </Typography>

        {/* PROFILE */}
        <SettingsSection title={t('settings.profile')}>
          <View style={styles.inputRow}>
            <Typography variant="subhead" color={theme.colors.gray600} style={styles.inputLabel}>
              {t('settings.display_name')}
            </Typography>
            <TextInput
              value={nameInput}
              onChangeText={setNameInput}
              onBlur={handleNameBlur}
              placeholder={t('settings.display_name_placeholder')}
              placeholderTextColor={theme.colors.gray400}
              style={[styles.textInput, { color: theme.colors.gray800, borderColor: theme.colors.gray200 }]}
              returnKeyType="done"
              maxLength={60}
              accessibilityLabel={t('settings.display_name')}
            />
          </View>
        </SettingsSection>

        {/* PRO */}
        <SettingsSection title={t('settings.pro_section')}>
          <PaywallCard isPro={settings.isPro} onUpgrade={() => {}} />
        </SettingsSection>

        {/* APPEARANCE */}
        <SettingsSection title={t('settings.theme')}>
          {THEME_OPTIONS.map((opt, idx) => (
            <React.Fragment key={opt.value}>
              <SettingsRow
                label={opt.label}
                onPress={() => handleThemeChange(opt.value)}
                value={settings.theme === opt.value ? '✓' : ''}
              />
              {idx < THEME_OPTIONS.length - 1 && <SettingsDivider />}
            </React.Fragment>
          ))}
        </SettingsSection>

        {/* LANGUAGE */}
        <SettingsSection title={t('settings.language')}>
          <SettingsRow
            label={t('settings.language')}
            onPress={() => setShowLanguagePicker(!showLanguagePicker)}
            value={settings.locale.toUpperCase()}
            chevron
          />
          {showLanguagePicker && (
            <LanguagePicker
              selected={settings.locale}
              onSelect={handleLocaleChange}
            />
          )}
        </SettingsSection>

        {/* REMINDERS */}
        <SettingsSection title={t('settings.reminders')}>
          <SettingsRow
            label={t('settings.reminder_toggle')}
            toggle
            toggleValue={settings.reminderEnabled}
            onToggle={handleReminderToggle}
          />
          {settings.reminderEnabled && (
            <>
              <SettingsDivider />
              <SettingsRow
                label={t('settings.reminder_time')}
                value={settings.reminderTime}
                chevron
                onPress={() => {
                  // Alert is removed to avoid hardcoded strings and use better UX later
                }}
              />
            </>
          )}
        </SettingsSection>

        {/* EMPLOYERS */}
        <SettingsSection title={t('settings.employer')}>
          <SettingsRow
            label={t('settings.employers_section')}
            onPress={() => setShowEmployerManager(!showEmployerManager)}
            chevron
            value={defaultEmployer?.name ?? t('common.unknown')}
          />
          {showEmployerManager && (
            <View style={styles.employerSection}>
              <EmployerManager
                employers={employers}
                isPro={settings.isPro}
                onAdd={(emp) => void addEmployer(emp)}
                onSetDefault={(id) => void setDefaultEmployer(id)}
                onDelete={(id) => void deleteEmployer(id)}
              />
            </View>
          )}
        </SettingsSection>

        {/* DATA */}
        <SettingsSection title={t('settings.data')}>
          <SettingsRow
            label={t('settings.export_json')}
            onPress={() => void exportBackup()}
            chevron
            disabled={isExporting}
            value={isExporting ? '...' : ''}
          />
          <SettingsDivider />
          <SettingsRow
            label={t('settings.clear_data')}
            onPress={() => setShowClearConfirm(true)}
            destructive
            disabled={isClearing}
          />
        </SettingsSection>

        {/* ABOUT */}
        <SettingsSection title={t('settings.about')}>
          <SettingsRow label={t('settings.version')} value={appVersion} />
          <SettingsDivider />
          <SettingsRow label={t('app.name')} value="© 2026" />
        </SettingsSection>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Confirm clear data dialog */}
      <ConfirmDialog
        visible={showClearConfirm}
        title={t('settings.clear_data_confirm_title')}
        message={t('settings.clear_data_confirm_message')}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        onConfirm={() => void handleClearConfirm()}
        onCancel={() => setShowClearConfirm(false)}
        destructive
      />
    </ScreenWrapper>
  );
};

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    scroll: { flex: 1 },
    title: {
      paddingVertical: Spacing.md,
    },
    inputRow: {
      padding: Spacing.md,
    },
    inputLabel: {
      marginBottom: Spacing.sm,
    },
    textInput: {
      borderWidth: 1,
      borderRadius: 6,
      padding: Spacing.sm,
      fontSize: 15,
      minHeight: 44,
    },
    employerSection: {
      padding: Spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.gray200,
    },
    bottomPadding: {
      height: Spacing.xxl,
    },
  });
}
