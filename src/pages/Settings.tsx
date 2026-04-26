import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

export function SettingsPage() {
  const { incomes, expenses, tasks } = useStore();
  const [confirmed, setConfirmed] = useState(false);

  const clearAll = () => {
    localStorage.removeItem('calm-money-store');
    window.location.reload();
  };

  return (
    <div className="p-6 max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-400 text-sm mt-0.5">Manage your data</p>
      </div>

      <Card>
        <h2 className="font-semibold text-gray-700 mb-3">Data summary</h2>
        <ul className="text-sm text-gray-500 space-y-1">
          <li>{incomes.length} income entries</li>
          <li>{expenses.length} expense entries</li>
          <li>{tasks.length} tasks</li>
        </ul>
        <p className="text-xs text-gray-400 mt-3">All data is stored locally on this device.</p>
      </Card>

      <Card className="border border-calm-red/20">
        <h2 className="font-semibold text-calm-red mb-2">Clear all data</h2>
        <p className="text-sm text-gray-400 mb-4">This will permanently delete all your income, expenses, and tasks. This cannot be undone.</p>
        {!confirmed ? (
          <button onClick={() => setConfirmed(true)}
            className="flex items-center gap-2 border border-calm-red text-calm-red px-4 py-2 rounded-xl text-sm hover:bg-calm-red-light transition-colors">
            <Trash2 size={15} /> Clear all data
          </button>
        ) : (
          <div className="flex gap-3">
            <button onClick={clearAll}
              className="bg-calm-red text-white px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
              Yes, delete everything
            </button>
            <button onClick={() => setConfirmed(false)}
              className="border border-beige-200 px-4 py-2 rounded-xl text-sm text-gray-500 hover:bg-beige-50 transition-colors">
              Cancel
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
