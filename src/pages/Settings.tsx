import { useState } from 'react';
import { Trash2, Download } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { useT } from '../i18n/useT';
import type { Lang } from '../i18n/translations';
import { exportToExcel } from '../utils/excel';
import { format, startOfMonth, endOfMonth } from 'date-fns';

export function SettingsPage() {
  const { incomes, expenses, tasks, language, setLanguage } = useStore();
  const handleExport = () => {
    const now = new Date();
    exportToExcel({
      incomes,
      expenses,
      dateFrom: format(startOfMonth(now), 'yyyy-MM-dd'),
      dateTo: format(endOfMonth(now), 'yyyy-MM-dd'),
      t,
    });
  };
  const t = useT();
  const [confirmed, setConfirmed] = useState(false);

  const clearAll = () => {
    localStorage.removeItem('calm-money-store');
    window.location.reload();
  };

  return (
    <div className="p-4 md:p-6 max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{t.settings_title}</h1>
        <p className="text-gray-400 text-sm mt-0.5">{t.settings_sub}</p>
      </div>

      {/* Language switcher */}
      <Card>
        <h2 className="font-semibold text-gray-700 mb-3">{t.language}</h2>
        <div className="flex gap-3">
          {(['en', 'he'] as Lang[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                language === lang
                  ? 'bg-calm-blue-light border-calm-blue text-calm-blue'
                  : 'border-beige-200 text-gray-400 hover:bg-beige-50'
              }`}
            >
              {lang === 'en' ? '🇺🇸 English' : '🇮🇱 עברית'}
            </button>
          ))}
        </div>
      </Card>

      {/* Export */}
      <Card className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold text-gray-700 mb-1">{t.export_btn}</h2>
          <p className="text-xs text-gray-400">{t.export_desc}</p>
        </div>
        <button onClick={handleExport}
          className="flex items-center gap-2 bg-calm-blue text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors shrink-0">
          <Download size={15} /> {t.export_btn}
        </button>
      </Card>

      <Card>
        <h2 className="font-semibold text-gray-700 mb-3">{t.data_summary}</h2>
        <ul className="text-sm text-gray-500 space-y-1">
          <li>{t.income_entries(incomes.length)}</li>
          <li>{t.expense_entries(expenses.length)}</li>
          <li>{t.task_entries(tasks.length)}</li>
        </ul>
        <p className="text-xs text-gray-400 mt-3">{t.local_storage_note}</p>
      </Card>

      <Card className="border border-calm-red/20">
        <h2 className="font-semibold text-calm-red mb-2">{t.clear_data}</h2>
        <p className="text-sm text-gray-400 mb-4">{t.clear_data_desc}</p>
        {!confirmed ? (
          <button onClick={() => setConfirmed(true)}
            className="flex items-center gap-2 border border-calm-red text-calm-red px-4 py-2 rounded-xl text-sm hover:bg-calm-red-light transition-colors">
            <Trash2 size={15} /> {t.clear_data}
          </button>
        ) : (
          <div className="flex gap-3">
            <button onClick={clearAll}
              className="bg-calm-red text-white px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
              {t.clear_confirm}
            </button>
            <button onClick={() => setConfirmed(false)}
              className="border border-beige-200 px-4 py-2 rounded-xl text-sm text-gray-500 hover:bg-beige-50 transition-colors">
              {t.cancel}
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
