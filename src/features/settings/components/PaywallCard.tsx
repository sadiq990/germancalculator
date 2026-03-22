// ══════════════════════════════════════════════════
// FILE: src/features/settings/components/PaywallCard.tsx
// PURPOSE: Pro upgrade card — feature list, price points, coming soon CTA
// ══════════════════════════════════════════════════

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useColorScheme } from '@shared/hooks/useColorScheme';
import { Typography } from '@shared/components/Typography';
import { Button } from '@shared/components/Button';
import { useTranslation } from 'react-i18next';
import { Spacing, BorderRadius } from '@theme/spacing';
import type { Theme } from '@theme/index';

interface PaywallCardProps {
  isPro: boolean;
  onUpgrade: () => void;
}

const getProFeatures = (t: ReturnType<typeof useTranslation>['t']) => [
  { icon: '✓', label: t('paywall.feature_no_watermark') },
  { icon: '✓', label: t('paywall.feature_logo') },
  { icon: '✓', label: t('paywall.feature_csv') },
  { icon: '✓', label: t('paywall.feature_employers') },
  { icon: '✓', label: t('paywall.feature_wage') },
] as const;

export const PaywallCard: React.FC<PaywallCardProps> = ({ isPro, onUpgrade }) => {
  const { t } = useTranslation();
  const theme = useColorScheme();
  const styles = makeStyles(theme);
  const PRO_FEATURES = getProFeatures(t);

  if (isPro) {
    return (
      <View style={styles.card}>
        <View style={styles.proActive}>
          <Typography variant="title3" color={theme.colors.success}>
            ✓ {t('settings.pro_active')}
          </Typography>
          <Typography variant="subhead" color={theme.colors.gray600} style={styles.proSubtitle}>
            {t('paywall.current_plan')}: {t('paywall.pro_plan')}
          </Typography>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Typography variant="title3">{t('app.name')}</Typography>
        <View style={[styles.badge, { backgroundColor: theme.colors.primaryLight }]}>
          <Typography variant="caption2" color={theme.colors.primary}>
            {t('common.pro').toUpperCase()}
          </Typography>
        </View>
      </View>

      <Typography variant="subhead" color={theme.colors.gray600} style={styles.subtitle}>
        {t('paywall.subtitle')}
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
            {t('paywall.subscribe_monthly')}
          </Typography>
          <Typography variant="headline">{t('paywall.monthly_price')}</Typography>
        </View>
        <View style={[styles.priceOption, styles.priceOptionHighlighted, { borderColor: theme.colors.primary, backgroundColor: theme.colors.primaryLight }]}>
          <Typography variant="footnote" color={theme.colors.primary}>
            {t('paywall.yearly_price')} · {t('paywall.yearly_save')}
          </Typography>
          <Typography variant="headline" color={theme.colors.primary}>
            {t('paywall.yearly_price')}
          </Typography>
        </View>
      </View>

      <Button
        label={t('paywall.coming_soon')}
        onPress={onUpgrade}
        variant="primary"
        fullWidth
        disabled
        accessibilityLabel={t('paywall.coming_soon')}
      />

      <Typography
        variant="caption2"
        color={theme.colors.gray400}
        style={styles.disclaimer}
      >
        {t('paywall.cancel_anytime')}
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
