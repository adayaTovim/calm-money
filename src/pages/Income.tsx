import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { FilterBar, getDateRange } from '../components/ui/FilterBar';
import type { TimePreset } from '../components/ui/FilterBar';
import type { Income } from '../types';

function fmt(n: number) {
  return '₪' + n.toLocaleString('he-IL', { maximumFractionDigits: 0 });
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'received', label: 'Received' },
  { value: 'pending', label: 'Pending' },
];

export function IncomePage() {
  const navigate = useNavigate();
  const { incomes, deleteIncome, updateIncome } = useStore();

  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Income>>({});

  const [timePreset, setTimePreset] = useState<TimePreset>('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');

  const startEdit = (inc: Income) => { setEditId(inc.id); setEditData(inc); };
  const saveEdit = () => { if (editId) updateIncome(editId, editData); setEditId(null); };

  const filtered = useMemo(() => {
    const range = getDateRange(timePreset);
    return incomes
      .filter((i) => filterStatus === 'all' || i.status === filterStatus)
      .filter((i) => !range || (i.date >= range.from && i.date <= range.to))
      .filter((i) => !search || (i.source || '').toLowerCase().includes(search.toLowerCase()));
  }, [incomes, filterStatus, timePreset, search]);

  // default sort: date desc
  const sorted = useMemo(() =>
    [...filtered].sort((a, b) => b.date.localeCompare(a.date)),
    [filtered]
  );

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Income</h1>
          <p className="text-gray-400 text-sm mt-0.5">{sorted.length} of {incomes.length} entries</p>
        </div>
        <button onClick={() => navigate('/income/add')}
          className="flex items-center gap-2 bg-calm-blue text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors">
          <Plus size={16} /> Add income
        </button>
      </div>

      {/* Filter bar */}
      {incomes.length > 0 && (
        <FilterBar
          timePreset={timePreset}
          onTimeChange={setTimePreset}
          statusOptions={STATUS_OPTIONS}
          filterStatus={filterStatus}
          onStatusChange={setFilterStatus}
          searchPlaceholder="Search source..."
          searchValue={search}
          onSearchChange={setSearch}
        />
      )}

      {/* Empty state */}
      {incomes.length === 0 && (
        <Card className="text-center py-10">
          <p className="text-gray-400 mb-4">No income entries yet.</p>
          <button onClick={() => navigate('/income/add')}
            className="flex items-center gap-2 mx-auto bg-calm-blue text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors">
            <Plus size={16} /> Add your first income
          </button>
        </Card>
      )}

      {incomes.length > 0 && sorted.length === 0 && (
        <Card className="text-center py-8">
          <p className="text-gray-400">No entries match your filters.</p>
        </Card>
      )}

      {/* List */}
      <div className="space-y-2">
        {sorted.map((inc) =>
          editId === inc.id ? (
            <Card key={inc.id}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400">Amount (₪)</label>
                  <input type="number" value={editData.amount}
                    onChange={(e) => setEditData((d) => ({ ...d, amount: +e.target.value }))}
                    className="w-full border border-beige-200 rounded-lg px-3 py-1.5 text-sm mt-1" />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Source</label>
                  <input value={editData.source}
                    onChange={(e) => setEditData((d) => ({ ...d, source: e.target.value }))}
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
                  <select value={editData.status}
                    onChange={(e) => setEditData((d) => ({ ...d, status: e.target.value as Income['status'] }))}
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
