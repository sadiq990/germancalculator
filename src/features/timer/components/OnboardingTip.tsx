// ══════════════════════════════════════════════════
// FILE: src/features/timer/components/OnboardingTip.tsx
// PURPOSE: 3-step inline onboarding — dismisses permanently on completion
// ══════════════════════════════════════════════════

import React, { useState, useRef, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useLanguage } from '@shared/hooks/useLanguage';
import { useColorScheme } from '@shared/hooks/useColorScheme';
import { Typography } from '@shared/components/Typography';
import { Card } from '@shared/components/Card';
import { Spacing, BorderRadius } from '@theme/spacing';
import type { Theme } from '@theme/index';

interface OnboardingStep {
  emoji: string;
  title: string;
  body: string;
}



interface OnboardingTipProps {
  onComplete: () => void;
}

export const OnboardingTip: React.FC<OnboardingTipProps> = ({ onComplete }) => {
  const theme = useColorScheme();
  const { t } = useLanguage();
  const styles = makeStyles(theme);
  const [step, setStep] = useState(0);

  const STEPS: OnboardingStep[] = [
    {
      emoji: '▶',
      title: t('onboarding.tip_step1_title', 'Arbeitszeit erfassen'),
      body: t('onboarding.tip_step1_body', 'Tippe STARTEN wenn du anfängst zu arbeiten'),
    },
    {
      emoji: '⏹',
      title: t('onboarding.tip_step2_title', 'Schicht beenden'),
      body: t('onboarding.tip_step2_body', 'Tippe STOPPEN wenn du fertig bist'),
    },
    {
      emoji: '📄',
      title: t('onboarding.tip_step3_title', 'Stundenzettel exportieren'),
      body: t('onboarding.tip_step3_body', 'Exportiere deinen Stundenzettel am Monatsende als PDF'),
    },
  ];
  const opacity = useRef(new Animated.Value(1)).current;

  const currentStep = STEPS[step];

  const handleNext = useCallback(() => {
    if (step < STEPS.length - 1) {
      // Cross-fade to next step
      Animated.timing(opacity, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
        setStep((s) => s + 1);
        Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: true }).start();
      });
    } else {
      onComplete();
    }
  }, [step, opacity, onComplete]);

  if (currentStep === undefined) return null;

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity }}>
        <Card accentColor={theme.colors.primary}>
          <View style={styles.stepContent}>
            <Typography variant="title3" style={styles.emoji}>
              {currentStep.emoji}
            </Typography>
            <View style={styles.textBlock}>
              <Typography variant="headline" style={styles.title}>
                {currentStep.title}
              </Typography>
              <Typography
                variant="subhead"
                color={theme.colors.gray600}
                style={styles.body}
              >
                {currentStep.body}
              </Typography>
            </View>
          </View>

          <View style={styles.footer}>
            <View style={styles.dots}>
              {STEPS.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    { backgroundColor: i === step ? theme.colors.primary : theme.colors.gray200 },
                  ]}
                />
              ))}
            </View>
            <TouchableOpacity
              onPress={handleNext}
              style={styles.nextButton}
              accessibilityRole="button"
              accessibilityLabel={step < STEPS.length - 1 ? t('common.next') : t('common.done', 'Alles klar!')}
            >
              <Typography variant="subhead" color={theme.colors.primary}>
                {step < STEPS.length - 1 ? `${t('common.next')} →` : t('common.done', 'Alles klar!')}
              </Typography>
            </TouchableOpacity>
          </View>
        </Card>
      </Animated.View>
    </View>
  );
};

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      marginBottom: Spacing.md,
    },
    stepContent: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: Spacing.md,
      marginBottom: Spacing.md,
    },
    emoji: {
      fontSize: 28,
      width: 36,
      textAlign: 'center',
    },
    textBlock: { flex: 1 },
    title: { marginBottom: Spacing.xs },
    body: { lineHeight: 20 },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    dots: {
      flexDirection: 'row',
      gap: Spacing.xs,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    nextButton: {
      minHeight: 36,
      justifyContent: 'center',
      paddingHorizontal: Spacing.sm,
    },
  });
}
