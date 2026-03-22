// ══════════════════════════════════════════════════
// FILE: src/features/timer/components/DailyStats.tsx
// PURPOSE: Today's total hours and warning banners
// ══════════════════════════════════════════════════

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useColorScheme } from '@shared/hooks/useColorScheme';
import { Typography } from '@shared/components/Typography';
import { Spacing, BorderRadius } from '@theme/spacing';
import { formatMinutesAsHHMM } from '@shared/utils/timeUtils';
import type { LegalWarning } from '@shared/utils/validationUtils';
import type { Theme } from '@theme/index';

interface DailyStatsProps {
  todayMinutes: number;
  warnings: LegalWarning[];
  onDismissWarning?: (type: LegalWarning['type']) => void;
}

export const DailyStats: React.FC<DailyStatsProps> = ({
  todayMinutes,
  warnings,
  onDismissWarning,
}) => {
  const theme = useColorScheme();
  const styles = makeStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.statRow}>
        <Typography variant="subhead" color={theme.colors.gray600}>
          Heute gesamt
        </Typography>
        <Typography variant="headline" color={theme.colors.gray900}>
          {formatMinutesAsHHMM(todayMinutes)}
        </Typography>
      </View>

      {warnings.map((warning) => (
        <WarningBanner
          key={warning.type}
          warning={warning}
          theme={theme}
          {...(onDismissWarning !== undefined ? { onDismiss: onDismissWarning } : {})}
        />
      ))}
    </View>
  );
};

interface WarningBannerProps {
  warning: LegalWarning;
  theme: Theme;
  onDismiss?: (type: LegalWarning['type']) => void;
}

function WarningBanner({ warning, theme, onDismiss }: WarningBannerProps) {
  const { label, bgColor, textColor } = getWarningStyle(warning, theme);

  return (
    <View style={[{ backgroundColor: bgColor, borderRadius: BorderRadius.sm, padding: Spacing.sm, marginTop: Spacing.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
      <Typography variant="footnote" color={textColor} style={{ flex: 1 }}>
        {label}
      </Typography>
      {onDismiss !== undefined && (
        <TouchableOpacity
          onPress={() => onDismiss(warning.type)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Warnung schließen"
        >
          <Typography variant="footnote" color={textColor}>
            ✕
          </Typography>
        </TouchableOpacity>
      )}
    </View>
  );
}

function getWarningStyle(
  warning: LegalWarning,
  theme: Theme,
): { label: string; bgColor: string; textColor: string } {
  switch (warning.type) {
    case 'daily_overwork':
      return {
        label: 'Du hast heute mehr als 10 Stunden gearbeitet.',
        bgColor: theme.colors.dangerLight,
        textColor: theme.colors.danger,
      };
    case 'weekly_overwork':
      return {
        label: 'Achtung: Über 48h/Woche (§3 ArbZG)',
        bgColor: theme.colors.dangerLight,
        textColor: theme.colors.danger,
      };
    case 'minijob_approaching':
      return {
        label: 'Du näherst dich dem monatlichen Minijob-Limit (520 €/Jahr).',
        bgColor: theme.colors.warningLight,
        textColor: theme.colors.warning,
      };
    case 'break_reminder':
      return {
        label: 'Hast du eine Pause gemacht? Deutsche Arbeitsgesetze schreiben Pausen vor.',
        bgColor: theme.colors.warningLight,
        textColor: theme.colors.warning,
      };
  }
}

function makeStyles(_theme: Theme) {
  return StyleSheet.create({
    container: {
      marginBottom: Spacing.md,
    },
    statRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: Spacing.sm,
    },
  });
}
