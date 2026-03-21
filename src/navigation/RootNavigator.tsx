// ══════════════════════════════════════════════════
// FILE: src/navigation/RootNavigator.tsx
// PURPOSE: Root navigation setup — bottom tabs with native stack per tab
// ══════════════════════════════════════════════════

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from '@shared/hooks/useColorScheme';
import type { RootTabParamList } from './types';
import { HomeScreen } from '@features/timer/screens/HomeScreen';
import { ReportScreen } from '@features/reports/screens/ReportScreen';
import { SettingsScreen } from '@features/settings/screens/SettingsScreen';

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

export const RootNavigator: React.FC = () => {
  const theme = useColorScheme();
  const { t } = useTranslation();

  return (
    <NavigationContainer
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
    </NavigationContainer>
  );
};
