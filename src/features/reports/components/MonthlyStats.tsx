// ══════════════════════════════════════════════════
// FILE: src/features/reports/components/MonthlyStats.tsx
// PURPOSE: Monthly totals card — hours, sessions, earnings
// ══════════════════════════════════════════════════

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useColorScheme } from '@shared/hooks/useColorScheme';
import { Typography } from '@shared/components/Typography';
import { Card } from '@shared/components/Card';
import { Spacing } from '@theme/spacing';
import { formatMinutesAsHHMM } from '@shared/utils/timeUtils';
import { formatCurrencyDE } from '@shared/utils/formatUtils';
import type { MonthlyReport } from '@core/types/models';
import type { Theme } from '@theme/index';

interface MonthlyStatsProps {
  report: MonthlyReport;
}

export const MonthlyStats: React.FC<MonthlyStatsProps> = ({ report }) => {
  const theme = useColorScheme();
  const styles = makeStyles(theme);

  return (
    <Card>
      <View style={styles.row}>
        <StatItem
          label="Gesamtstunden"
          value={formatMinutesAsHHMM(report.totalMinutes)}
          theme={theme}
          large
        />
        <StatItem
          label="Schichten"
          value={String(report.sessionCount)}
          theme={theme}
        />
        {report.earnings !== null && (
          <StatItem
            label="Vergütung (ca.)"
            value={formatCurrencyDE(report.earnings)}
            theme={theme}
          />
        )}
      </View>
    </Card>
  );
};

interface StatItemProps {
  label: string;
  value: string;
  theme: Theme;
  large?: boolean;
}

function StatItem({ label, value, theme, large = false }: StatItemProps) {
  return (
    <View style={{ flex: large ? 1.5 : 1, alignItems: 'center' }}>
      <Typography
        variant={large ? 'title2' : 'title3'}
        color={theme.colors.primary}
        style={{ marginBottom: 2 }}
      >
        {value}
      </Typography>
      <Typography variant="caption1" color={theme.colors.gray600}>
        {label}
      </Typography>
    </View>
  );
}

function makeStyles(_theme: Theme) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: Spacing.sm,
    },
  });
}
