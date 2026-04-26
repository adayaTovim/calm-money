import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import type { Expense } from '../types';

function fmt(n: number) { return '₪' + n.toLocaleString('he-IL', { maximumFractionDigits: 0 }); }

const EDIT_CATEGORIES = ['Rent', 'Salaries', 'Marketing', 'Software', 'Equipment', 'Travel', 'Utilities', 'Taxes', 'Other'];

type SortField = 'date' | 'amount' | 'category' | 'supplier';

export function ExpensesPage() {
  const navigate = useNavigate();
  const { filteredExpenses, deleteExpense, updateExpense } = useStore();
  const expenses = filteredExpenses();

  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Expense>>({});

  const [sortBy, setSortBy] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'upcoming'>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const categories = useMemo(() => ['all', ...[...new Set(expenses.map((e) => e.category))].sort()], [expenses]);

  const startEdit = (exp: Expense) => { setEditId(exp.id); setEditData(exp); };
  const saveEdit = () => { if (editId) updateExpense(editId, editData); setEditId(null); };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [field, dir] = e.target.value.split(':');
    setSortBy(field as SortField);
    setSortDir(dir as 'asc' | 'desc');
  };

  const filtered = useMemo(() => {
    return expenses
      .filter((e) => filterCategory === 'all' || e.category === filterCategory)
      .filter((e) => filterStatus === 'all' || (e.status ?? 'paid') === filterStatus)
      .filter((e) => !dateFrom || e.date >= dateFrom)
      .filter((e) => !dateTo || e.date <= dateTo);
  }, [expenses, filterCategory, filterStatus, dateFrom, dateTo]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'date') cmp = a.date.localeCompare(b.date);
      else if (sortBy === 'amount') cmp = a.amount - b.amount;
      else if (sortBy === 'category') cmp = a.category.localeCompare(b.category);
      else if (sortBy === 'supplier') cmp = (a.supplier || '').localeCompare(b.supplier || '');
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortBy, sortDir]);

  const activeFilters = (filterCategory !== 'all' ? 1 : 0) + (filterStatus !== 'all' ? 1 : 0) + (dateFrom ? 1 : 0) + (dateTo ? 1 : 0);
  const clearFilters = () => { setFilterCategory('all'); setFilterStatus('all'); setDateFrom(''); setDateTo(''); };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      {/* Header */}
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

      {/* Filter + Sort bar */}
      {expenses.length > 0 && (
        <Card className="flex flex-wrap items-end gap-4">
          {/* Category dropdown */}
          <div className="min-w-[150px]">
            <label className="block text-xs text-gray-400 mb-1.5">Category</label>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full border border-beige-200 rounded-lg px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-calm-blue/30">
              {categories.map((c) => (
                <option key={c} value={c}>{c === 'all' ? 'All categories' : c}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="min-w-[140px]">
            <label className="block text-xs text-gray-400 mb-1.5">Status</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
              className="w-full border border-beige-200 rounded-lg px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-calm-blue/30">
              <option value="all">All</option>
              <option value="paid">Paid</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>

          {/* Date from */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">From date</label>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
              className="border border-beige-200 rounded-lg px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-calm-blue/30" />
          </div>

          {/* Date to */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">To date</label>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
              className="border border-beige-200 rounded-lg px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-calm-blue/30" />
          </div>

          {/* Sort */}
          <div className="min-w-[180px]">
            <label className="block text-xs text-gray-400 mb-1.5">Sort by</label>
            <select value={`${sortBy}:${sortDir}`} onChange={handleSortChange}
              className="w-full border border-beige-200 rounded-lg px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-calm-blue/30">
              <option value="date:desc">Date — newest first</option>
              <option value="date:asc">Date — oldest first</option>
              <option value="amount:desc">Amount — high to low</option>
              <option value="amount:asc">Amount — low to high</option>
              <option value="category:asc">Category — A to Z</option>
              <option value="supplier:asc">Supplier — A to Z</option>
            </select>
          </div>

          {activeFilters > 0 && (
            <button onClick={clearFilters}
              className="px-3 py-2 rounded-lg text-xs font-medium text-calm-red border border-calm-red/30 hover:bg-calm-red-light transition-colors self-end">
              Clear filters
            </button>
          )}
        </Card>
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
          <button onClick={clearFilters} className="mt-2 text-sm text-calm-blue hover:underline">Clear filters</button>
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
