// ══════════════════════════════════════════════════
// FILE: src/navigation/RootNavigator.tsx
// PURPOSE: Root navigation — stack wrapping tabs + onboarding modal
// ══════════════════════════════════════════════════

import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '@shared/hooks/useColorScheme';
import { useSettingsStore } from '@store/settingsStore';
import type { RootStackParamList, RootTabParamList } from './types';
import { HomeScreen } from '@features/timer/screens/HomeScreen';
import { ReportScreen } from '@features/reports/screens/ReportScreen';
import { SettingsScreen } from '@features/settings/screens/SettingsScreen';
import { OnboardingScreen } from '@features/onboarding/screens/OnboardingScreen';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

function TabIcon({
  focused,
  icon,
  theme,
}: {
  focused: boolean;
  icon: string;
  theme: ReturnType<typeof useColorScheme>;
}) {
  return (
    <Text
      style={{
        fontSize: 22,
        color: focused ? theme.colors.primary : theme.colors.gray400,
      }}
    >
      {icon}
    </Text>
  );
}

function MainTabs() {
  const theme = useColorScheme();
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.isDark ? theme.colors.gray50 : theme.colors.white,
          borderTopColor: theme.colors.gray200,
          borderTopWidth: 1,
          height: theme.layout.tabBarHeight,
          paddingBottom: 16,
          paddingTop: 8,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.gray400,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="⏱" theme={theme} />
          ),
          tabBarAccessibilityLabel: t('accessibility.tab_home'),
        }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="📄" theme={theme} />
          ),
          tabBarAccessibilityLabel: t('accessibility.tab_reports'),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="⚙️" theme={theme} />
          ),
          tabBarAccessibilityLabel: t('accessibility.tab_settings'),
        }}
      />
    </Tab.Navigator>
  );
}

export const RootNavigator: React.FC = () => {
  const theme = useColorScheme();
  const onboardingCompleted = useSettingsStore((s) => s.settings.onboardingCompleted);

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={{
        dark: theme.isDark,
        colors: {
          primary: theme.colors.primary,
          background: theme.isDark ? '#0F0F0F' : theme.colors.gray50,
          card: theme.isDark ? theme.colors.gray50 : theme.colors.white,
          text: theme.colors.gray800,
          border: theme.colors.gray200,
          notification: theme.colors.danger,
        },
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!onboardingCompleted && (
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{ animation: 'fade' }}
          />
        )}
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
