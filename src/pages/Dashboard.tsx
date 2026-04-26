import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { TrendingUp, TrendingDown, Wallet, Clock, Plus, Upload } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { generateInsights, calcHealthScore } from '../utils/insights';

const CATEGORY_COLORS = ['#4a90b8', '#5a9f7a', '#c8922a', '#9b7ec8', '#c0504d', '#4ab8a0'];

function fmt(n: number) {
  return '₪' + n.toLocaleString('he-IL', { maximumFractionDigits: 0 });
}

export function Dashboard() {
  const navigate = useNavigate();
  const {
    filteredIncomes, filteredExpenses, totalIncome, totalExpenses,
    freeMoney, pendingIncome, dateFrom, dateTo, setDateRange,
  } = useStore();

  const incomes = filteredIncomes();
  const expenses = filteredExpenses();
  const income = totalIncome();
  const expensesTotal = totalExpenses();
  const free = freeMoney();
  const pending = pendingIncome();

  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => { map[e.category] = (map[e.category] || 0) + e.amount; });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value, pct: expensesTotal > 0 ? Math.round((value / expensesTotal) * 100) : 0 }))
      .sort((a, b) => b.value - a.value);
  }, [expenses, expensesTotal]);

  const topCategory = categoryBreakdown[0];
  const insights = useMemo(() =>
    generateInsights({ totalIncome: income, totalExpenses: expensesTotal, freeMoney: free, pendingIncome: pending, topCategory: topCategory ? { name: topCategory.name, pct: topCategory.pct } : undefined }),
    [income, expensesTotal, free, pending, topCategory]
  );
  const healthScore = useMemo(() =>
    calcHealthScore({ totalIncome: income, totalExpenses: expensesTotal, freeMoney: free, pendingIncome: pending }),
    [income, expensesTotal, free, pending]
  );

  const freeColor = free < 0 ? 'text-calm-red' : free / (income || 1) < 0.1 ? 'text-calm-amber' : 'text-calm-green';
  const freeBg = free < 0 ? 'bg-calm-red-light' : free / (income || 1) < 0.1 ? 'bg-calm-amber-light' : 'bg-calm-green-light';

  const barData = [
    { name: 'Income', amount: income, fill: '#5a9f7a' },
    { name: 'Expenses', amount: expensesTotal, fill: '#c0504d' },
    { name: 'Free', amount: Math.max(0, free), fill: '#4a90b8' },
  ];

  const scoreColor = healthScore >= 75 ? 'text-calm-green' : healthScore >= 50 ? 'text-calm-amber' : 'text-calm-red';
  const scoreLabel = healthScore >= 75 ? 'Good' : healthScore >= 50 ? 'Fair' : 'Needs Attention';
  const hasData = incomes.length > 0 || expenses.length > 0;

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-4 md:space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-0.5">Your financial overview</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <input type="date" value={dateFrom} onChange={(e) => setDateRange(e.target.value, dateTo)}
            className="flex-1 sm:flex-none border border-beige-200 rounded-lg px-2 py-1.5 bg-white text-gray-600 text-xs md:text-sm" />
          <span className="text-gray-400">→</span>
          <input type="date" value={dateTo} onChange={(e) => setDateRange(dateFrom, e.target.value)}
            className="flex-1 sm:flex-none border border-beige-200 rounded-lg px-2 py-1.5 bg-white text-gray-600 text-xs md:text-sm" />
        </div>
      </div>

      {/* Empty state */}
      {!hasData && (
        <Card className="text-center py-10 md:py-12">
          <p className="text-3xl mb-3">🌿</p>
          <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">Let's get started</h2>
          <p className="text-gray-400 text-sm mb-6">Add your income and expenses to see your financial picture.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button onClick={() => navigate('/income/add')}
              className="flex items-center justify-center gap-2 bg-calm-blue text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors">
              <Plus size={16} /> Add income
            </button>
            <button onClick={() => navigate('/upload')}
              className="flex items-center justify-center gap-2 border border-beige-200 bg-white text-gray-600 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-beige-50 transition-colors">
              <Upload size={16} /> Upload Excel
            </button>
          </div>
        </Card>
      )}

      {hasData && (
        <>
          {/* Free Money hero */}
          <Card className={`${freeBg} border-0 text-center py-6 md:py-8`}>
            <p className="text-xs md:text-sm font-medium text-gray-500 mb-1 uppercase tracking-wide">Free Money This Month</p>
            <p className={`text-4xl md:text-5xl font-bold ${freeColor} mb-2`}>{fmt(free)}</p>
            <p className="text-gray-400 text-sm">This is what you can safely use</p>
          </Card>

          {/* Summary cards — 2 cols on mobile, 4 on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { label: 'Total Income', value: income, icon: TrendingUp, color: 'text-calm-green', bg: 'bg-calm-green-light' },
              { label: 'Total Expenses', value: expensesTotal, icon: TrendingDown, color: 'text-calm-red', bg: 'bg-calm-red-light' },
              { label: 'Balance', value: income - expensesTotal, icon: Wallet, color: 'text-calm-blue', bg: 'bg-calm-blue-light' },
              { label: 'Pending', value: pending, icon: Clock, color: 'text-calm-amber', bg: 'bg-calm-amber-light' },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <Card key={label} className="p-4">
                <div className={`w-7 h-7 md:w-8 md:h-8 ${bg} rounded-lg flex items-center justify-center mb-2 md:mb-3`}>
                  <Icon size={14} className={color} />
                </div>
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className={`text-lg md:text-xl font-bold ${color}`}>{fmt(value)}</p>
              </Card>
            ))}
          </div>

          {/* Charts — stack on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <h3 className="text-sm font-semibold text-gray-600 mb-4">Income vs Expenses</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={barData} barSize={36}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip formatter={(v) => fmt(Number(v))} />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {barData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <h3 className="text-sm font-semibold text-gray-600 mb-4">Expense Categories</h3>
              {categoryBreakdown.length === 0 ? (
                <div className="h-[180px] flex items-center justify-center text-gray-300 text-sm">No expenses yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={categoryBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65}
                      label={(props) => { const d = categoryBreakdown.find((c) => c.name === props.name); return d ? `${d.name} ${d.pct}%` : ''; }}
                      labelLine={false}>
                      {categoryBreakdown.map((_, i) => <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => fmt(Number(v))} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Card>
          </div>

          {/* Top 3 categories */}
          {categoryBreakdown.length > 0 && (
            <Card>
              <h3 className="text-sm font-semibold text-gray-600 mb-4">Top Expense Categories</h3>
              <div className="space-y-3">
                {categoryBreakdown.slice(0, 3).map((c, i) => (
                  <div key={c.name} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ backgroundColor: CATEGORY_COLORS[i] }}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700 truncate">{c.name}</span>
                        <span className="text-gray-400 shrink-0 ml-2">{fmt(c.value)} · {c.pct}%</span>
                      </div>
                      <div className="h-1.5 bg-beige-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${c.pct}%`, backgroundColor: CATEGORY_COLORS[i] }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Insights */}
          {insights.length > 0 && (
            <Card>
              <h3 className="text-sm font-semibold text-gray-600 mb-4">Insights & Actions</h3>
              <div className="space-y-3">
                {insights.map((ins) => {
                  const bg = { danger: 'bg-calm-red-light border-calm-red/20', warning: 'bg-calm-amber-light border-calm-amber/20', success: 'bg-calm-green-light border-calm-green/20', info: 'bg-calm-blue-light border-calm-blue/20' }[ins.type];
                  const dot = { danger: 'bg-calm-red', warning: 'bg-calm-amber', success: 'bg-calm-green', info: 'bg-calm-blue' }[ins.type];
                  return (
                    <div key={ins.id} className={`rounded-xl border p-4 ${bg}`}>
                      <div className="flex items-start gap-2">
                        <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${dot}`} />
                        <div>
                          <p className="font-medium text-gray-700 text-sm">{ins.title}</p>
                          <p className="text-gray-500 text-sm mt-0.5">{ins.observation}</p>
                          <p className="text-gray-700 text-sm mt-1 font-medium">→ {ins.action}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Health Score */}
          <Card className="flex items-center gap-4 md:gap-6">
            <div className="text-center shrink-0">
              <div className={`text-3xl md:text-4xl font-bold ${scoreColor}`}>{healthScore}</div>
              <div className="text-xs text-gray-400 mt-1">/ 100</div>
            </div>
            <div>
              <p className="font-semibold text-gray-700 text-sm md:text-base">Financial Health Score</p>
              <p className={`text-sm font-medium ${scoreColor}`}>{scoreLabel}</p>
              <p className="text-xs text-gray-400 mt-1 hidden sm:block">
                Based on your free money ratio, pending income, and expense balance this period.
              </p>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
