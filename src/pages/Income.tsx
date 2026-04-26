import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Check, X, ArrowUpDown } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import type { Income } from '../types';

function fmt(n: number) {
  return '₪' + n.toLocaleString('he-IL', { maximumFractionDigits: 0 });
}

type SortField = 'date' | 'source' | 'status' | 'amount';
type SortDir = 'asc' | 'desc';

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: 'date', label: 'Date' },
  { value: 'source', label: 'Source' },
  { value: 'status', label: 'Paid / Pending' },
  { value: 'amount', label: 'Amount' },
];

export function IncomePage() {
  const navigate = useNavigate();
  const { filteredIncomes, deleteIncome, updateIncome } = useStore();
  const incomes = filteredIncomes();
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Income>>({});
  const [sortBy, setSortBy] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const startEdit = (inc: Income) => { setEditId(inc.id); setEditData(inc); };
  const saveEdit = () => {
    if (editId) updateIncome(editId, editData);
    setEditId(null);
  };

  const toggleSort = (field: SortField) => {
    if (sortBy === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(field); setSortDir('asc'); }
  };

  const sorted = useMemo(() => {
    return [...incomes].sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'date') cmp = a.date.localeCompare(b.date);
      else if (sortBy === 'source') cmp = (a.source || '').localeCompare(b.source || '');
      else if (sortBy === 'status') cmp = a.status.localeCompare(b.status);
      else if (sortBy === 'amount') cmp = a.amount - b.amount;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [incomes, sortBy, sortDir]);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Income</h1>
          <p className="text-gray-400 text-sm mt-0.5">{incomes.length} entries</p>
        </div>
        <button onClick={() => navigate('/income/add')}
          className="flex items-center gap-2 bg-calm-blue text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors">
          <Plus size={16} /> Add income
        </button>
      </div>

      {/* Sort bar */}
      {incomes.length > 1 && (
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

      {incomes.length === 0 && (
        <Card className="text-center py-10">
          <p className="text-gray-400 mb-4">No income entries yet.</p>
          <button onClick={() => navigate('/income/add')}
            className="flex items-center gap-2 mx-auto bg-calm-blue text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors">
            <Plus size={16} /> Add your first income
          </button>
        </Card>
      )}

      <div className="space-y-2">
        {sorted.map((inc) =>
          editId === inc.id ? (
            <Card key={inc.id}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400">Amount (₪)</label>
                  <input type="number" value={editData.amount} onChange={(e) => setEditData((d) => ({ ...d, amount: +e.target.value }))}
                    className="w-full border border-beige-200 rounded-lg px-3 py-1.5 text-sm mt-1" />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Source</label>
                  <input value={editData.source} onChange={(e) => setEditData((d) => ({ ...d, source: e.target.value }))}
                    className="w-full border border-beige-200 rounded-lg px-3 py-1.5 text-sm mt-1" />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Date</label>
                  <input type="date" value={editData.date} onChange={(e) => setEditData((d) => ({ ...d, date: e.target.value }))}
                    className="w-full border border-beige-200 rounded-lg px-3 py-1.5 text-sm mt-1" />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Status</label>
                  <select value={editData.status} onChange={(e) => setEditData((d) => ({ ...d, status: e.target.value as Income['status'] }))}
                    className="w-full border border-beige-200 rounded-lg px-3 py-1.5 text-sm mt-1">
                    <option value="received">Received</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={saveEdit} className="flex items-center gap-1 bg-calm-green text-white px-3 py-1.5 rounded-lg text-sm"><Check size={14} /> Save</button>
                <button onClick={() => setEditId(null)} className="flex items-center gap-1 border border-beige-200 px-3 py-1.5 rounded-lg text-sm text-gray-500"><X size={14} /> Cancel</button>
              </div>
            </Card>
          ) : (
            <Card key={inc.id} className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-gray-800">{fmt(inc.amount)}</span>
                  <Badge type={inc.status === 'received' ? 'success' : 'warning'}>
                    {inc.status === 'received' ? 'Received' : 'Pending'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 truncate">{inc.source || '—'} · {inc.date}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => startEdit(inc)} className="p-2 hover:bg-beige-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"><Pencil size={15} /></button>
                <button onClick={() => deleteIncome(inc.id)} className="p-2 hover:bg-calm-red-light rounded-lg text-gray-400 hover:text-calm-red transition-colors"><Trash2 size={15} /></button>
              </div>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
