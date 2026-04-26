import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Check, X, ArrowUpDown, SlidersHorizontal } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import type { Expense } from '../types';

function fmt(n: number) { return '₪' + n.toLocaleString('he-IL', { maximumFractionDigits: 0 }); }

const EDIT_CATEGORIES = ['Rent', 'Salaries', 'Marketing', 'Software', 'Equipment', 'Travel', 'Utilities', 'Taxes', 'Other'];

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

  // Filters
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterSupplier, setFilterSupplier] = useState('all');

  const categories = useMemo(() => [...new Set(expenses.map((e) => e.category))].sort(), [expenses]);
  const suppliers = useMemo(() => [...new Set(expenses.map((e) => e.supplier).filter(Boolean))].sort() as string[], [expenses]);

  const startEdit = (exp: Expense) => { setEditId(exp.id); setEditData(exp); };
  const saveEdit = () => { if (editId) updateExpense(editId, editData); setEditId(null); };

  const toggleSort = (field: SortField) => {
    if (sortBy === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(field); setSortDir('asc'); }
  };

  const filtered = useMemo(() => {
    return expenses
      .filter((e) => filterCategory === 'all' || e.category === filterCategory)
      .filter((e) => filterSupplier === 'all' || e.supplier === filterSupplier);
  }, [expenses, filterCategory, filterSupplier]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'date') cmp = a.date.localeCompare(b.date);
      else if (sortBy === 'category') cmp = a.category.localeCompare(b.category);
      else if (sortBy === 'amount') cmp = a.amount - b.amount;
      else if (sortBy === 'supplier') cmp = (a.supplier || '').localeCompare(b.supplier || '');
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortBy, sortDir]);

  const activeFilters = (filterCategory !== 'all' ? 1 : 0) + (filterSupplier !== 'all' ? 1 : 0);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Expenses</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {sorted.length} of {expenses.length} entries
            {activeFilters > 0 && <span className="ml-1 text-calm-blue">· {activeFilters} filter{activeFilters > 1 ? 's' : ''} active</span>}
          </p>
        </div>
        <button onClick={() => navigate('/expenses/add')}
          className="flex items-center gap-2 bg-calm-blue text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors">
          <Plus size={16} /> Add expense
        </button>
      </div>

      {expenses.length > 0 && (
        <Card className="space-y-4">
          {/* Filters */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1 mb-2">
              <SlidersHorizontal size={12} /> Filter
            </p>
            <div className="flex flex-wrap gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1.5">Category</p>
                <div className="flex gap-1.5 flex-wrap">
                  <button onClick={() => setFilterCategory('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      filterCategory === 'all' ? 'bg-calm-blue-light border-calm-blue text-calm-blue' : 'border-beige-200 text-gray-400 hover:bg-beige-100'
                    }`}>
                    All
                  </button>
                  {categories.map((c) => (
                    <button key={c} onClick={() => setFilterCategory(c)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        filterCategory === c ? 'bg-calm-blue-light border-calm-blue text-calm-blue' : 'border-beige-200 text-gray-400 hover:bg-beige-100'
                      }`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {suppliers.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">Supplier</p>
                  <div className="flex gap-1.5 flex-wrap">
                    <button onClick={() => setFilterSupplier('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        filterSupplier === 'all' ? 'bg-calm-blue-light border-calm-blue text-calm-blue' : 'border-beige-200 text-gray-400 hover:bg-beige-100'
                      }`}>
                      All
                    </button>
                    {suppliers.map((s) => (
                      <button key={s} onClick={() => setFilterSupplier(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          filterSupplier === s ? 'bg-calm-blue-light border-calm-blue text-calm-blue' : 'border-beige-200 text-gray-400 hover:bg-beige-100'
                        }`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeFilters > 0 && (
                <div className="flex items-end">
                  <button onClick={() => { setFilterCategory('all'); setFilterSupplier('all'); }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-calm-red border border-calm-red/30 hover:bg-calm-red-light transition-colors">
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sort */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1 mb-2">
              <ArrowUpDown size={12} /> Sort
            </p>
            <div className="flex gap-1.5 flex-wrap">
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
          </div>
        </Card>
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

      {expenses.length > 0 && sorted.length === 0 && (
        <Card className="text-center py-8">
          <p className="text-gray-400">No entries match your filters.</p>
          <button onClick={() => { setFilterCategory('all'); setFilterSupplier('all'); }}
            className="mt-3 text-sm text-calm-blue hover:underline">Clear filters</button>
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
                    {EDIT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
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
