// ══════════════════════════════════════════════════
// FILE: src/features/onboarding/screens/OnboardingScreen.tsx
// PURPOSE: Full-screen onboarding modal — 3 slides for German tax-compliant users
// ══════════════════════════════════════════════════

import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '@shared/hooks/useColorScheme';
import { Typography } from '@shared/components/Typography';
import { useSettingsStore } from '@store/settingsStore';
import { Spacing, BorderRadius } from '@theme/spacing';
import { TAX_CONFIG } from '../../../config/taxRates';
import type { Theme } from '@theme/index';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TOTAL_SLIDES = 3;

interface OnboardingScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
}

interface SlideData {
  icon: string;
  titleKey: string;
  bodyKey: string;
}

const SLIDES: SlideData[] = [
  { icon: '⏱', titleKey: 'onboarding.step1_title', bodyKey: 'onboarding.step1_body' },
  { icon: '📄', titleKey: 'onboarding.step2_title', bodyKey: 'onboarding.step2_body' },
  { icon: '🛡️', titleKey: 'onboarding.step3_title', bodyKey: 'onboarding.step3_body' },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const theme = useColorScheme();
  const insets = useSafeAreaInsets();
  const styles = makeStyles(theme, insets);
  const updateSettings = useSettingsStore((s) => s.updateSettings);

  const slideX = useRef(new Animated.Value(0)).current;
  const [currentStep, setCurrentStep] = useState(0);

  const goToSlide = useCallback(
    (index: number) => {
      Animated.timing(slideX, {
        toValue: -index * SCREEN_WIDTH,
        duration: 350,
        useNativeDriver: true,
      }).start();
      setCurrentStep(index);
    },
    [slideX],
  );

  const handleNext = useCallback(() => {
    if (currentStep < TOTAL_SLIDES - 1) {
      goToSlide(currentStep + 1);
    }
  }, [currentStep, goToSlide]);

  const handleComplete = useCallback(async () => {
    await updateSettings({ onboardingCompleted: true });
    navigation.replace('MainTabs');
  }, [updateSettings, navigation]);

  const handleSkip = useCallback(async () => {
    await updateSettings({ onboardingCompleted: true });
    navigation.replace('MainTabs');
  }, [updateSettings, navigation]);

  const isLastSlide = currentStep === TOTAL_SLIDES - 1;

  return (
    <View style={styles.container}>
      {/* Skip button */}
      {!isLastSlide && (
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => void handleSkip()}
          accessibilityRole="button"
          accessibilityLabel={t('onboarding.dismiss')}
        >
          <Typography variant="subhead" color={theme.colors.gray400}>
            {t('onboarding.dismiss')}
          </Typography>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <Animated.View
        style={[
          styles.slidesContainer,
          { transform: [{ translateX: slideX }] },
        ]}
      >
        {SLIDES.map((slide, index) => (
          <View key={index} style={styles.slide}>
            <View style={styles.slideContent}>
              {/* Icon */}
              <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryLight }]}>
                <Typography variant="display" style={styles.iconText}>
                  {slide.icon}
                </Typography>
              </View>

              {/* Title */}
              <Typography variant="title1" style={styles.title}>
                {t(slide.titleKey)}
              </Typography>

              {/* Body */}
              <Typography
                variant="body"
                color={theme.colors.gray600}
                style={styles.body}
              >
                {slide.bodyKey === 'onboarding.step3_body' 
                  ? t(slide.bodyKey, { limit: TAX_CONFIG.miniJobLimit }) 
                  : t(slide.bodyKey)}
              </Typography>
            </View>
          </View>
        ))}
      </Animated.View>

      {/* Bottom section: dots + button */}
      <View style={styles.bottomSection}>
        {/* Progress dots */}
        <View style={styles.dotsContainer}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === currentStep
                      ? theme.colors.primary
                      : theme.colors.gray200,
                  width: index === currentStep ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        {/* CTA button */}
        {isLastSlide ? (
          <TouchableOpacity
            style={[styles.ctaButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => void handleComplete()}
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel={t('onboarding.lets_go')}
          >
            <Typography variant="headline" color={theme.colors.white}>
              {t('onboarding.lets_go')}
            </Typography>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.ctaButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleNext}
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel={t('common.next')}
          >
            <Typography variant="headline" color={theme.colors.white}>
              {t('common.next')}
            </Typography>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

function makeStyles(theme: Theme, insets: { top: number; bottom: number }) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.isDark ? '#0F0F0F' : theme.colors.white,
    },
    skipButton: {
      position: 'absolute',
      top: insets.top + Spacing.md,
      right: Spacing.md,
      zIndex: 10,
      padding: Spacing.sm,
    },
    slidesContainer: {
      flex: 1,
      flexDirection: 'row',
      width: SCREEN_WIDTH * TOTAL_SLIDES,
    },
    slide: {
      width: SCREEN_WIDTH,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: Spacing.xl,
    },
    slideContent: {
      alignItems: 'center',
      maxWidth: 320,
    },
    iconContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.xxl,
    },
    iconText: {
      fontSize: 52,
    },
    title: {
      textAlign: 'center',
      marginBottom: Spacing.md,
    },
    body: {
      textAlign: 'center',
      lineHeight: 22,
    },
    bottomSection: {
      paddingHorizontal: Spacing.md,
      paddingBottom: insets.bottom + Spacing.lg,
      gap: Spacing.lg,
    },
    dotsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    dot: {
      height: 8,
      borderRadius: 4,
    },
    ctaButton: {
      height: 56,
      borderRadius: BorderRadius.sm,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
  });
}
