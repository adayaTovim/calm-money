import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { Layout } from './components/layout/Layout';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { IncomePage } from './pages/Income';
import { AddIncome } from './pages/AddIncome';
import { ExpensesPage } from './pages/Expenses';
import { AddExpense } from './pages/AddExpense';
import { UploadPage } from './pages/Upload';
import { InsightsPage } from './pages/Insights';
import { TasksPage } from './pages/Tasks';
import { AlertsPage } from './pages/Alerts';
import { SettingsPage } from './pages/Settings';

function AppRoutes() {
  const onboardingDone = useStore((s) => s.onboardingDone);

  if (!onboardingDone) {
    return <Onboarding />;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/income" element={<IncomePage />} />
        <Route path="/income/add" element={<AddIncome />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/expenses/add" element={<AddExpense />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  const language = useStore((s) => s.language);

  // Set lang and dir on <html> so Safari iOS uses the correct locale for date pickers
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
  }, [language]);

  return (
    <div lang={language} dir={language === 'he' ? 'rtl' : 'ltr'} className="min-h-screen">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </div>
  );
}
