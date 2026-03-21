// ══════════════════════════════════════════════════
// FILE: src/features/reports/components/MonthPicker.tsx
// PURPOSE: Month/year selector for report filtering
// ══════════════════════════════════════════════════

import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useColorScheme } from '@shared/hooks/useColorScheme';
import { Typography } from '@shared/components/Typography';
import { Spacing, BorderRadius } from '@theme/spacing';
import { getPastMonths } from '@shared/utils/dateUtils';
import type { ReportFilter } from '@core/types/models';
import type { Theme } from '@theme/index';

interface MonthPickerProps {
  selected: ReportFilter;
  onSelect: (filter: ReportFilter) => void;
}

export const MonthPicker: React.FC<MonthPickerProps> = ({ selected, onSelect }) => {
  const theme = useColorScheme();
  const styles = makeStyles(theme);

  const months = getPastMonths(13); // Show 13 months rolling

  const handleSelect = useCallback(
    (month: number, year: number) => {
      onSelect({ month, year });
    },
    [onSelect],
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
      accessibilityRole="menu"
    >
      {months.map((m) => {
        const isSelected = m.month === selected.month && m.year === selected.year;
        return (
          <TouchableOpacity
            key={`${m.year}-${m.month}`}
            onPress={() => handleSelect(m.month, m.year)}
            style={[
              styles.chip,
              isSelected && { backgroundColor: theme.colors.primary },
            ]}
            accessibilityRole="menuitem"
            accessibilityLabel={m.label}
            accessibilityState={{ selected: isSelected }}
          >
            <Typography
              variant="subhead"
              color={isSelected ? theme.colors.white : theme.colors.gray800}
            >
              {m.label}
            </Typography>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    scroll: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      gap: Spacing.sm,
    },
    chip: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.full,
      backgroundColor: theme.colors.gray100,
      borderWidth: 1,
      borderColor: theme.colors.gray200,
      minHeight: 36,
      justifyContent: 'center',
    },
  });
}
