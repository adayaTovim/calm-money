import { Search, ChevronDown } from 'lucide-react';
import { subMonths, startOfMonth, endOfMonth, startOfYear, endOfYear, format } from 'date-fns';
import { useT } from '../../i18n/useT';

export type TimePreset = 'all' | 'this-month' | 'last-month' | 'last-3-months' | 'this-year';

export function getDateRange(preset: TimePreset): { from: string; to: string } | null {
  const now = new Date();
  const f = (d: Date) => format(d, 'yyyy-MM-dd');
  if (preset === 'all') return null;
  if (preset === 'this-month') return { from: f(startOfMonth(now)), to: f(endOfMonth(now)) };
  if (preset === 'last-month') {
    const last = subMonths(now, 1);
    return { from: f(startOfMonth(last)), to: f(endOfMonth(last)) };
  }
  if (preset === 'last-3-months') return { from: f(subMonths(now, 3)), to: f(now) };
  if (preset === 'this-year') return { from: f(startOfYear(now)), to: f(endOfYear(now)) };
  return null;
}

interface PillSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}

function PillSelect({ value, onChange, options }: PillSelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-beige-200 rounded-full ps-4 pe-9 py-2.5 text-sm text-gray-600 shadow-sm cursor-pointer hover:border-calm-blue/40 focus:outline-none focus:border-calm-blue focus:ring-2 focus:ring-calm-blue/20 transition-colors"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  );
}

interface FilterBarProps {
  categories?: string[];
  filterCategory?: string;
  onCategoryChange?: (v: string) => void;
  timePreset: TimePreset;
  onTimeChange: (v: TimePreset) => void;
  statusOptions: { value: string; label: string }[];
  filterStatus: string;
  onStatusChange: (v: string) => void;
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (v: string) => void;
}

export function FilterBar({
  categories, filterCategory, onCategoryChange,
  timePreset, onTimeChange,
  statusOptions, filterStatus, onStatusChange,
  searchPlaceholder, searchValue, onSearchChange,
}: FilterBarProps) {
  const t = useT();

  const timeOptions: { value: TimePreset; label: string }[] = [
    { value: 'all', label: t.all_time },
    { value: 'this-month', label: t.this_month },
    { value: 'last-month', label: t.last_month },
    { value: 'last-3-months', label: t.last_3_months },
    { value: 'this-year', label: t.this_year },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap w-full">
      {categories && onCategoryChange && (
        <PillSelect
          value={filterCategory ?? 'all'}
          onChange={onCategoryChange}
          options={[
            { value: 'all', label: t.all_categories },
            ...categories.map((c) => ({ value: c, label: c })),
          ]}
        />
      )}

      <PillSelect
        value={timePreset}
        onChange={(v) => onTimeChange(v as TimePreset)}
        options={timeOptions}
      />

      <PillSelect
        value={filterStatus}
        onChange={onStatusChange}
        options={statusOptions}
      />

      <div className="relative w-full sm:w-auto sm:ms-auto">
        <Search size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder={searchPlaceholder ?? t.search_source}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-white border border-beige-200 rounded-full ps-9 pe-4 py-2.5 text-sm text-gray-600 shadow-sm w-full sm:w-52 focus:outline-none focus:border-calm-blue focus:ring-2 focus:ring-calm-blue/20 transition-colors placeholder:text-gray-300"
        />
      </div>
    </div>
  );
}
