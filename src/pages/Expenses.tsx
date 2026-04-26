import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { FilterBar, getDateRange } from '../components/ui/FilterBar';
import type { TimePreset } from '../components/ui/FilterBar';
import type { Expense } from '../types';

function fmt(n: number) { return '₪' + n.toLocaleString('he-IL', { maximumFractionDigits: 0 }); }

const EDIT_CATEGORIES = ['Rent', 'Salaries', 'Marketing', 'Software', 'Equipment', 'Travel', 'Utilities', 'Taxes', 'Other'];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'paid', label: 'Paid' },
  { value: 'upcoming', label: 'Upcoming' },
];

export function ExpensesPage() {
  const navigate = useNavigate();
  const { filteredExpenses, deleteExpense, updateExpense } = useStore();
  const expenses = filteredExpenses();

  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Expense>>({});

  const [timePreset, setTimePreset] = useState<TimePreset>('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');

  const categories = useMemo(() =>
    [...new Set(expenses.map((e) => e.category))].sort(),
    [expenses]
  );

  const startEdit = (exp: Expense) => { setEditId(exp.id); setEditData(exp); };
  const saveEdit = () => { if (editId) updateExpense(editId, editData); setEditId(null); };

  const filtered = useMemo(() => {
    const range = getDateRange(timePreset);
    return expenses
      .filter((e) => filterCategory === 'all' || e.category === filterCategory)
      .filter((e) => filterStatus === 'all' || (e.status ?? 'paid') === filterStatus)
      .filter((e) => !range || (e.date >= range.from && e.date <= range.to))
      .filter((e) => !search || (e.supplier || '').toLowerCase().includes(search.toLowerCase()));
  }, [expenses, filterCategory, filterStatus, timePreset, search]);

  // default sort: date desc
  const sorted = useMemo(() =>
    [...filtered].sort((a, b) => b.date.localeCompare(a.date)),
    [filtered]
  );

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Expenses</h1>
          <p className="text-gray-400 text-sm mt-0.5">{sorted.length} of {expenses.length} entries</p>
        </div>
        <button onClick={() => navigate('/expenses/add')}
          className="flex items-center gap-2 bg-calm-blue text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors">
          <Plus size={16} /> Add expense
        </button>
      </div>

      {/* Filter bar */}
      {expenses.length > 0 && (
        <FilterBar
          categories={categories}
          filterCategory={filterCategory}
          onCategoryChange={setFilterCategory}
          timePreset={timePreset}
          onTimeChange={setTimePreset}
          statusOptions={STATUS_OPTIONS}
          filterStatus={filterStatus}
          onStatusChange={setFilterStatus}
          searchPlaceholder="Search supplier..."
          searchValue={search}
          onSearchChange={setSearch}
        />
      )}

      {/* Empty state */}
      {expenses.length === 0 && (
        <Card className="text-center py-10">
          <p className="text-gray-400 mb-4">No expense entries yet.</p>
          <button onClick={() => navigate('/expenses/add')}
            className="flex items-center gap-2 mx-auto bg-calm-blue text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors">
            <Plus size={16} /> Add your first expense
          </button>
        </Card>
      )}

      {expenses.length > 0 && sorted.length === 0 && (
        <Card className="text-center py-8">
          <p className="text-gray-400">No entries match your filters.</p>
        </Card>
      )}

      {/* List */}
      <div className="space-y-2">
        {sorted.map((exp) =>
          editId === exp.id ? (
            <Card key={exp.id}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400">Amount (₪)</label>
                  <input type="number" value={editData.amount}
                    onChange={(e) => setEditData((d) => ({ ...d, amount: +e.target.value }))}
                    className="w-full border border-beige-200 rounded-lg px-3 py-1.5 text-sm mt-1" />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Category</label>
                  <select value={editData.category}
                    onChange={(e) => setEditData((d) => ({ ...d, category: e.target.value }))}
                    className="w-full border border-beige-200 rounded-lg px-3 py-1.5 text-sm mt-1">
                    {EDIT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400">Supplier</label>
                  <input value={editData.supplier || ''}
                    onChange={(e) => setEditData((d) => ({ ...d, supplier: e.target.value }))}
                    className="w-full border border-beige-200 rounded-lg px-3 py-1.5 text-sm mt-1" />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Date</label>
                  <input type="date" value={editData.date}
                    onChange={(e) => setEditData((d) => ({ ...d, date: e.target.value }))}
                    className="w-full border border-beige-200 rounded-lg px-3 py-1.5 text-sm mt-1" />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Status</label>
                  <select value={editData.status ?? 'paid'}
                    onChange={(e) => setEditData((d) => ({ ...d, status: e.target.value as Expense['status'] }))}
                    className="w-full border border-beige-200 rounded-lg px-3 py-1.5 text-sm mt-1">
                    <option value="paid">Paid</option>
                    <option value="upcoming">Upcoming</option>
                  </select>
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
                  <Badge type={(exp.status ?? 'paid') === 'paid' ? 'success' : 'warning'}>
                    {(exp.status ?? 'paid') === 'paid' ? 'Paid' : 'Upcoming'}
                  </Badge>
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
