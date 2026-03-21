// ══════════════════════════════════════════════════
// FILE: src/features/settings/components/LanguagePicker.tsx
// PURPOSE: Language selection component — plug-and-play locale switching
// ══════════════════════════════════════════════════

import React, { useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useColorScheme } from '@shared/hooks/useColorScheme';
import { Typography } from '@shared/components/Typography';
import { Spacing, BorderRadius } from '@theme/spacing';
import { SUPPORTED_LOCALES } from '@locales/i18n';
import type { SupportedLocale } from '@core/types/models';
import type { Theme } from '@theme/index';

interface LanguagePickerProps {
  selected: SupportedLocale;
  onSelect: (locale: SupportedLocale) => void;
}

export const LanguagePicker: React.FC<LanguagePickerProps> = ({
  selected,
  onSelect,
}) => {
  const theme = useColorScheme();
  const styles = makeStyles(theme);

  const handleSelect = useCallback(
    (locale: SupportedLocale) => {
      onSelect(locale);
    },
    [onSelect],
  );

  return (
    <View style={styles.container}>
      {SUPPORTED_LOCALES.map((locale) => {
        const isSelected = locale.code === selected;
        return (
          <TouchableOpacity
            key={locale.code}
            onPress={() => handleSelect(locale.code)}
            style={[
              styles.option,
              isSelected && { backgroundColor: theme.colors.primaryLight, borderColor: theme.colors.primary },
            ]}
            accessibilityRole="radio"
            accessibilityLabel={`${locale.flag} ${locale.label}`}
            accessibilityState={{ selected: isSelected }}
          >
            <Typography variant="body" style={styles.flag}>
              {locale.flag}
            </Typography>
            <Typography
              variant="subhead"
              color={isSelected ? theme.colors.primary : theme.colors.gray800}
            >
              {locale.label}
            </Typography>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      gap: Spacing.sm,
      padding: Spacing.md,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      padding: Spacing.md,
      borderRadius: BorderRadius.sm,
      borderWidth: 1.5,
      borderColor: theme.colors.gray200,
    },
    flag: {
      fontSize: 20,
    },
  });
}
