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
  Alert,
} from 'react-native';
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

const THEME_OPTIONS = [
  { value: 'system', label: 'Automatisch' },
  { value: 'light', label: 'Hell' },
  { value: 'dark', label: 'Dunkel' },
] as const;

type ThemeOption = 'system' | 'light' | 'dark';

export const SettingsScreen: React.FC = () => {
  const theme = useColorScheme();
  const styles = makeStyles(theme);

  const { settings, updateSettings, employers, addEmployer, updateEmployer, deleteEmployer, setDefaultEmployer, loadSettings } =
    useSettingsStore();

  const { isExporting, isClearing, exportBackup, clearAllData } = useSettings();

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [showEmployerManager, setShowEmployerManager] = useState(false);
  const [nameInput, setNameInput] = useState(settings.displayName);
  const [rateInput, setRateInput] = useState(
    settings.displayName, // will be properly set from employer
  );

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

  const themeLabel = THEME_OPTIONS.find((t) => t.value === settings.theme)?.label ?? 'Automatisch';

  const appVersion =
    Constants.expoConfig?.version ?? '1.0.0';

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <Typography variant="title1" style={styles.title}>
          Einstellungen
        </Typography>

        {/* PROFILE */}
        <SettingsSection title="Profil">
          <View style={styles.inputRow}>
            <Typography variant="subhead" color={theme.colors.gray600} style={styles.inputLabel}>
              Anzeigename
            </Typography>
            <TextInput
              value={nameInput}
              onChangeText={setNameInput}
              onBlur={handleNameBlur}
              placeholder="Dein Name für den Stundenzettel"
              placeholderTextColor={theme.colors.gray400}
              style={[styles.textInput, { color: theme.colors.gray800, borderColor: theme.colors.gray200 }]}
              returnKeyType="done"
              maxLength={60}
              accessibilityLabel="Anzeigename"
            />
          </View>
        </SettingsSection>

        {/* PRO */}
        <SettingsSection title="Stundenrechner Pro">
          <PaywallCard isPro={settings.isPro} onUpgrade={() => {}} />
        </SettingsSection>

        {/* APPEARANCE */}
        <SettingsSection title="Erscheinungsbild">
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
        <SettingsSection title="Sprache">
          <SettingsRow
            label="Sprache"
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
        <SettingsSection title="Erinnerungen">
          <SettingsRow
            label="Schichterinnerungen"
            toggle
            toggleValue={settings.reminderEnabled}
            onToggle={handleReminderToggle}
          />
          {settings.reminderEnabled && (
            <>
              <SettingsDivider />
              <SettingsRow
                label="Erinnerungszeit"
                value={settings.reminderTime}
                chevron
                onPress={() => {
                  // Native time picker would go here
                  Alert.alert('Erinnerungszeit', `Aktuell: ${settings.reminderTime}`);
                }}
              />
            </>
          )}
        </SettingsSection>

        {/* EMPLOYERS */}
        <SettingsSection title="Arbeitgeber">
          <SettingsRow
            label="Arbeitgeber verwalten"
            onPress={() => setShowEmployerManager(!showEmployerManager)}
            chevron
            value={defaultEmployer?.name ?? 'Kein Arbeitgeber'}
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
        <SettingsSection title="Datenverwaltung">
          <SettingsRow
            label="Datensicherung exportieren"
            onPress={() => void exportBackup()}
            chevron
            disabled={isExporting}
            value={isExporting ? '...' : ''}
          />
          <SettingsDivider />
          <SettingsRow
            label="Alle Daten löschen"
            onPress={() => setShowClearConfirm(true)}
            destructive
            disabled={isClearing}
          />
        </SettingsSection>

        {/* ABOUT */}
        <SettingsSection title="Info">
          <SettingsRow label="Version" value={appVersion} />
          <SettingsDivider />
          <SettingsRow label="Stundenrechner Pro" value="© 2025" />
        </SettingsSection>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Confirm clear data dialog */}
      <ConfirmDialog
        visible={showClearConfirm}
        title="Wirklich alles löschen?"
        message="Alle Schichten und Einstellungen werden unwiderruflich gelöscht."
        confirmLabel="Löschen"
        cancelLabel="Abbrechen"
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
