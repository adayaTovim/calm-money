import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { useT } from '../i18n/useT';
import type { Expense } from '../types';
import { addMonths, format } from 'date-fns';

const CATEGORIES = ['Rent', 'Salaries', 'Marketing', 'Software', 'Equipment', 'Travel', 'Utilities', 'Taxes', 'Other'];

const EMPTY: Omit<Expense, 'id'> = {
  amount: 0, category: 'Other', supplier: '', date: new Date().toISOString().slice(0, 10), status: 'paid', notes: '',
};

const uid = () => Math.random().toString(36).slice(2, 10);

export function AddExpense() {
  const navigate = useNavigate();
  const addExpense = useStore((s) => s.addExpense);
  const t = useT();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [customCat, setCustomCat] = useState('');
  const [recurring, setRecurring] = useState(false);
  const [months, setMonths] = useState(3);
  const [success, setSuccess] = useState('');

  const set = (key: keyof typeof EMPTY, val: unknown) => setForm((f) => ({ ...f, [key]: val }));

  const submit = () => {
    if (!form.amount || form.amount <= 0) { setError(t.amount_error); return; }
    const category = form.category === '__custom__' ? customCat || 'Other' : form.category;

    if (recurring && months > 1) {
      const groupId = uid();
      for (let i = 0; i < months; i++) {
        const date = format(addMonths(new Date(form.date), i), 'yyyy-MM-dd');
        addExpense({ ...form, category, date, recurringGroupId: groupId });
      }
      setSuccess(t.recurring_success(months));
      setTimeout(() => navigate('/expenses'), 1200);
    } else {
      addExpense({ ...form, category });
      navigate('/expenses');
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-lg mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-5">
        <ArrowLeft size={15} className="rtl:rotate-180" /> {t.back}
      </button>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">{t.add_expense_title}</h1>
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
          <label className="block text-sm font-medium text-gray-600 mb-1">{t.category_label} *</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => set('category', c)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                  form.category === c ? 'bg-calm-blue-light border-calm-blue text-calm-blue' : 'border-beige-200 text-gray-400 hover:bg-beige-50'
                }`}>
                {c}
              </button>
            ))}
            <button onClick={() => set('category', '__custom__')}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                form.category === '__custom__' ? 'bg-calm-blue-light border-calm-blue text-calm-blue' : 'border-beige-200 text-gray-400 hover:bg-beige-50'
              }`}>
              {t.custom}
            </button>
          </div>
          {form.category === '__custom__' && (
            <input placeholder={t.category_placeholder} value={customCat} onChange={(e) => setCustomCat(e.target.value)}
              className="w-full border border-beige-200 rounded-xl px-4 py-2.5 text-sm mt-2 focus:outline-none focus:ring-2 focus:ring-calm-blue/30" />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">{t.supplier_label} <span className="text-gray-300">(optional)</span></label>
          <input placeholder={t.supplier_placeholder}
            value={form.supplier}
            onChange={(e) => set('supplier', e.target.value)}
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
            {(['paid', 'upcoming'] as const).map((s) => (
              <button key={s} onClick={() => set('status', s)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                  form.status === s
                    ? s === 'paid' ? 'bg-calm-green-light border-calm-green text-calm-green' : 'bg-calm-amber-light border-calm-amber text-calm-amber'
                    : 'border-beige-200 text-gray-400 hover:bg-beige-50'
                }`}>
                {s === 'paid' ? `✓ ${t.paid}` : `⏳ ${t.upcoming}`}
              </button>
            ))}
          </div>
        </div>

        {/* Recurring toggle */}
        <div className={`rounded-xl border p-4 transition-colors ${recurring ? 'bg-calm-blue-light border-calm-blue/30' : 'border-beige-200'}`}>
          <button onClick={() => setRecurring((r) => !r)}
            className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <RefreshCw size={16} className={recurring ? 'text-calm-blue' : 'text-gray-400'} />
              <div className="text-start">
                <p className={`text-sm font-medium ${recurring ? 'text-calm-blue' : 'text-gray-600'}`}>{t.recurring_label}</p>
                <p className="text-xs text-gray-400">{t.recurring_desc}</p>
              </div>
            </div>
            <div className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${recurring ? 'bg-calm-blue' : 'bg-gray-200'}`}>
              <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${recurring ? 'translate-x-4' : ''}`} />
            </div>
          </button>

          {recurring && (
            <div className="mt-4">
              <label className="block text-xs text-gray-500 mb-2">{t.recurring_months}</label>
              <div className="flex gap-2">
                {[2, 3, 6, 12].map((n) => (
                  <button key={n} onClick={() => setMonths(n)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      months === n ? 'bg-calm-blue text-white border-calm-blue' : 'border-beige-200 text-gray-500 hover:bg-beige-50'
                    }`}>
                    {n}
                  </button>
                ))}
                <input type="number" min="2" max="60" value={months}
                  onChange={(e) => setMonths(Math.max(2, parseInt(e.target.value) || 2))}
                  className="w-16 border border-beige-200 rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-calm-blue/30" />
              </div>
            </div>
          )}
        </div>

        {error && <p className="text-sm text-calm-red">{error}</p>}

        {success ? (
          <div className="flex items-center justify-center gap-2 bg-calm-green-light text-calm-green py-3 rounded-xl font-medium">
            <Check size={16} /> {success}
          </div>
        ) : (
          <button onClick={submit}
            className="w-full bg-calm-blue text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors">
            {recurring ? `${t.add_expense_btn} (×${months})` : t.add_expense_btn}
          </button>
        )}
      </Card>
    </div>
  );
}
