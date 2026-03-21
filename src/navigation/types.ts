// ══════════════════════════════════════════════════
// FILE: src/navigation/types.ts
// PURPOSE: React Navigation type definitions for type-safe navigation
// ══════════════════════════════════════════════════

export type RootTabParamList = {
  Home: undefined;
  Reports: undefined;
  Settings: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
};

export type ReportStackParamList = {
  ReportMain: undefined;
};

export type SettingsStackParamList = {
  SettingsMain: undefined;
  EmployerManager: undefined;
  Paywall: undefined;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}
