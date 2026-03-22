import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { TimerScreen } from './components/timer/TimerScreen';
import { EntryList } from './components/entries/EntryList';
import { OverviewScreen } from './components/overview/OverviewScreen';
import { TaxScreen } from './components/tax/TaxScreen';
import { ExportScreen } from './components/export/ExportScreen';
import { SettingsScreen } from './components/settings/SettingsScreen';
import { AIChat } from './components/ai/AIChat';
import { PaywallModal } from './components/paywall/PaywallModal';
import { ToastProvider } from './components/ui/Toast';

export const App = () => {
  return (
    <BrowserRouter>
      <ToastProvider />
      <PaywallModal />
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<TimerScreen />} />
          <Route path="/entries" element={<EntryList />} />
          <Route path="/overview" element={<OverviewScreen />} />
          <Route path="/tax" element={<TaxScreen />} />
          <Route path="/export" element={<ExportScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/ai" element={<AIChat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
