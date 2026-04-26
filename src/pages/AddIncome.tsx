import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { useT } from '../i18n/useT';
import type { Income } from '../types';

const EMPTY: Omit<Income, 'id'> = {
  amount: 0, source: '', date: new Date().toISOString().slice(0, 10), status: 'received', notes: '',
};

export function AddIncome() {
  const navigate = useNavigate();
  const addIncome = useStore((s) => s.addIncome);
  const t = useT();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');

  const set = (key: keyof typeof EMPTY, val: unknown) => setForm((f) => ({ ...f, [key]: val }));

  const submit = () => {
    if (!form.amount || form.amount <= 0) { setError(t.amount_error); return; }
    addIncome(form);
    navigate('/income');
  };

  return (
    <div className="p-4 md:p-6 max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-5">
        <ArrowLeft size={15} className="rtl:rotate-180" /> {t.back}
      </button>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">{t.add_income_title}</h1>
      <p className="text-gray-400 text-sm mb-6">{t.add_income_sub}</p>

      <Card className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">{t.amount_label} *</label>
          <input type="number" min="0" placeholder={t.amount_placeholder}
            value={form.amount || ''}
            onChange={(e) => set('amount', parseFloat(e.target.value) || 0)}
            className="w-full border border-beige-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-calm-blue/30" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">{t.source_label} <span className="text-gray-300">({t.cancel})</span></label>
          <input placeholder={t.source_placeholder}
            value={form.source}
            onChange={(e) => set('source', e.target.value)}
            className="w-full border border-beige-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-calm-blue/30" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">{t.date_label}</label>
          <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)}
            className="w-full border border-beige-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-calm-blue/30" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">{t.status_label}</label>
          <div className="flex gap-3">
            {(['received', 'pending'] as const).map((s) => (
              <button key={s}
                onClick={() => set('status', s)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                  form.status === s
                    ? s === 'received' ? 'bg-calm-green-light border-calm-green text-calm-green' : 'bg-calm-amber-light border-calm-amber text-calm-amber'
                    : 'border-beige-200 text-gray-400 hover:bg-beige-50'
                }`}>
                {s === 'received' ? `✓ ${t.received}` : `⏳ ${t.pending_status}`}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-calm-red">{error}</p>}

        <button onClick={submit}
          className="w-full bg-calm-blue text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors">
          {t.add_income_btn}
        </button>
      </Card>
    </div>
  );
}
