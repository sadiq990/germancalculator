// ══════════════════════════════════════════════════
// FILE: src/features/settings/components/PaywallCard.tsx
// PURPOSE: Pro upgrade card — feature list, price points, coming soon CTA
// ══════════════════════════════════════════════════

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useColorScheme } from '@shared/hooks/useColorScheme';
import { Typography } from '@shared/components/Typography';
import { Button } from '@shared/components/Button';
import { Spacing, BorderRadius } from '@theme/spacing';
import type { Theme } from '@theme/index';

interface PaywallCardProps {
  isPro: boolean;
  onUpgrade: () => void;
}

const PRO_FEATURES = [
  { icon: '✓', label: 'Stundenzettel ohne Wasserzeichen' },
  { icon: '✓', label: 'Eigenes Arbeitgeberlogo' },
  { icon: '✓', label: 'CSV-Export' },
  { icon: '✓', label: 'Mehrere Arbeitgeber' },
  { icon: '✓', label: 'Einkommensberechnung' },
] as const;

export const PaywallCard: React.FC<PaywallCardProps> = ({ isPro, onUpgrade }) => {
  const theme = useColorScheme();
  const styles = makeStyles(theme);

  if (isPro) {
    return (
      <View style={styles.card}>
        <View style={styles.proActive}>
          <Typography variant="title3" color={theme.colors.success}>
            ✓ Stundenrechner Pro aktiv
          </Typography>
          <Typography variant="subhead" color={theme.colors.gray600} style={styles.proSubtitle}>
            Alle Funktionen freigeschaltet
          </Typography>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Typography variant="title3">Stundenrechner Pro</Typography>
        <View style={[styles.badge, { backgroundColor: theme.colors.primaryLight }]}>
          <Typography variant="caption2" color={theme.colors.primary}>
            PREMIUM
          </Typography>
        </View>
      </View>

      <Typography variant="subhead" color={theme.colors.gray600} style={styles.subtitle}>
        Alles für professionelles Zeittracking
      </Typography>

      <View style={styles.features}>
        {PRO_FEATURES.map((feature) => (
          <View key={feature.label} style={styles.featureRow}>
            <Typography variant="subhead" color={theme.colors.success}>
              {feature.icon}
            </Typography>
            <Typography variant="subhead" color={theme.colors.gray800}>
              {feature.label}
            </Typography>
          </View>
        ))}
      </View>

      <View style={styles.pricing}>
        <View style={styles.priceOption}>
          <Typography variant="footnote" color={theme.colors.gray600}>
            Monatlich
          </Typography>
          <Typography variant="headline">€2,99 / Monat</Typography>
        </View>
        <View style={[styles.priceOption, styles.priceOptionHighlighted, { borderColor: theme.colors.primary, backgroundColor: theme.colors.primaryLight }]}>
          <Typography variant="footnote" color={theme.colors.primary}>
            Jährlich · Spare 44%
          </Typography>
          <Typography variant="headline" color={theme.colors.primary}>
            €19,99 / Jahr
          </Typography>
        </View>
      </View>

      <Button
        label="Bald verfügbar"
        onPress={onUpgrade}
        variant="primary"
        fullWidth
        disabled
        accessibilityLabel="Pro-Version abonnieren — bald verfügbar"
      />

      <Typography
        variant="caption2"
        color={theme.colors.gray400}
        style={styles.disclaimer}
      >
        Jederzeit kündbar · Preise inkl. MwSt.
      </Typography>
    </View>
  );
};

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.colors.gray100,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.gray200,
      marginBottom: Spacing.md,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.xs,
    },
    badge: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: 2,
      borderRadius: BorderRadius.xs,
    },
    subtitle: {
      marginBottom: Spacing.md,
    },
    features: {
      gap: Spacing.sm,
      marginBottom: Spacing.lg,
    },
    featureRow: {
      flexDirection: 'row',
      gap: Spacing.sm,
      alignItems: 'center',
    },
    pricing: {
      gap: Spacing.sm,
      marginBottom: Spacing.lg,
    },
    priceOption: {
      padding: Spacing.md,
      borderRadius: BorderRadius.sm,
      borderWidth: 1,
      borderColor: theme.colors.gray200,
    },
    priceOptionHighlighted: {
      borderWidth: 2,
    },
    disclaimer: {
      textAlign: 'center',
      marginTop: Spacing.md,
    },
    proActive: {
      alignItems: 'center',
      paddingVertical: Spacing.md,
    },
    proSubtitle: {
      marginTop: Spacing.sm,
    },
  });
}
