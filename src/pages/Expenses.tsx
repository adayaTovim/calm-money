import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Check, X, ArrowUpDown } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import type { Expense } from '../types';

function fmt(n: number) { return '₪' + n.toLocaleString('he-IL', { maximumFractionDigits: 0 }); }

const CATEGORIES = ['Rent', 'Salaries', 'Marketing', 'Software', 'Equipment', 'Travel', 'Utilities', 'Taxes', 'Other'];

type SortField = 'date' | 'category' | 'amount' | 'supplier';
type SortDir = 'asc' | 'desc';

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: 'date', label: 'Date' },
  { value: 'category', label: 'Category' },
  { value: 'amount', label: 'Amount' },
  { value: 'supplier', label: 'Supplier' },
];

export function ExpensesPage() {
  const navigate = useNavigate();
  const { filteredExpenses, deleteExpense, updateExpense } = useStore();
  const expenses = filteredExpenses();
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Expense>>({});
  const [sortBy, setSortBy] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const startEdit = (exp: Expense) => { setEditId(exp.id); setEditData(exp); };
  const saveEdit = () => { if (editId) updateExpense(editId, editData); setEditId(null); };

  const toggleSort = (field: SortField) => {
    if (sortBy === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(field); setSortDir('asc'); }
  };

  const sorted = useMemo(() => {
    return [...expenses].sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'date') cmp = a.date.localeCompare(b.date);
      else if (sortBy === 'category') cmp = a.category.localeCompare(b.category);
      else if (sortBy === 'amount') cmp = a.amount - b.amount;
      else if (sortBy === 'supplier') cmp = (a.supplier || '').localeCompare(b.supplier || '');
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [expenses, sortBy, sortDir]);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Expenses</h1>
          <p className="text-gray-400 text-sm mt-0.5">{expenses.length} entries</p>
        </div>
        <button onClick={() => navigate('/expenses/add')}
          className="flex items-center gap-2 bg-calm-blue text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors">
          <Plus size={16} /> Add expense
        </button>
      </div>

      {/* Sort bar */}
      {expenses.length > 1 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-400 flex items-center gap-1"><ArrowUpDown size={12} /> Sort by:</span>
          {SORT_OPTIONS.map(({ value, label }) => (
            <button key={value} onClick={() => toggleSort(value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                sortBy === value
                  ? 'bg-calm-blue-light border-calm-blue text-calm-blue'
                  : 'border-beige-200 text-gray-400 hover:bg-beige-100'
              }`}>
              {label} {sortBy === value ? (sortDir === 'asc' ? '↑' : '↓') : ''}
            </button>
          ))}
        </div>
      )}

      {expenses.length === 0 && (
        <Card className="text-center py-10">
          <p className="text-gray-400 mb-4">No expense entries yet.</p>
          <button onClick={() => navigate('/expenses/add')}
            className="flex items-center gap-2 mx-auto bg-calm-blue text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors">
            <Plus size={16} /> Add your first expense
          </button>
        </Card>
      )}

      <div className="space-y-2">
        {sorted.map((exp) =>
          editId === exp.id ? (
            <Card key={exp.id}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400">Amount (₪)</label>
                  <input type="number" value={editData.amount} onChange={(e) => setEditData((d) => ({ ...d, amount: +e.target.value }))}
                    className="w-full border border-beige-200 rounded-lg px-3 py-1.5 text-sm mt-1" />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Category</label>
                  <select value={editData.category} onChange={(e) => setEditData((d) => ({ ...d, category: e.target.value }))}
                    className="w-full border border-beige-200 rounded-lg px-3 py-1.5 text-sm mt-1">
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400">Supplier</label>
                  <input value={editData.supplier || ''} onChange={(e) => setEditData((d) => ({ ...d, supplier: e.target.value }))}
                    className="w-full border border-beige-200 rounded-lg px-3 py-1.5 text-sm mt-1" />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Date</label>
                  <input type="date" value={editData.date} onChange={(e) => setEditData((d) => ({ ...d, date: e.target.value }))}
                    className="w-full border border-beige-200 rounded-lg px-3 py-1.5 text-sm mt-1" />
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={saveEdit} className="flex items-center gap-1 bg-calm-green text-white px-3 py-1.5 rounded-lg text-sm"><Check size={14} /> Save</button>
                <button onClick={() => setEditId(null)} className="flex items-center gap-1 border border-beige-200 px-3 py-1.5 rounded-lg text-sm text-gray-500"><X size={14} /> Cancel</button>
              </div>
            </Card>
          ) : (
            <Card key={exp.id} className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-gray-800">{fmt(exp.amount)}</span>
                  <span className="text-xs bg-beige-100 text-gray-500 px-2 py-0.5 rounded-full">{exp.category}</span>
                </div>
                <p className="text-sm text-gray-400 truncate">{exp.supplier || '—'} · {exp.date}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => startEdit(exp)} className="p-2 hover:bg-beige-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"><Pencil size={15} /></button>
                <button onClick={() => deleteExpense(exp.id)} className="p-2 hover:bg-calm-red-light rounded-lg text-gray-400 hover:text-calm-red transition-colors"><Trash2 size={15} /></button>
              </div>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
