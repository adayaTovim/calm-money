import { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { generateInsights } from '../utils/insights';
import { Plus } from 'lucide-react';
import { useT } from '../i18n/useT';

export function InsightsPage() {
  const { totalIncome, totalExpenses, freeMoney, pendingIncome, filteredExpenses, addTask } = useStore();
  const t = useT();
  const income = totalIncome();
  const expenses = totalExpenses();
  const free = freeMoney();
  const pending = pendingIncome();

  const expList = filteredExpenses();
  const categoryMap: Record<string, number> = {};
  expList.forEach((e) => { categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount; });
  const topCat = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0];

  const insights = useMemo(() =>
    generateInsights({
      totalIncome: income, totalExpenses: expenses, freeMoney: free, pendingIncome: pending,
      topCategory: topCat ? { name: topCat[0], pct: expenses > 0 ? Math.round(topCat[1] / expenses * 100) : 0 } : undefined,
    }), [income, expenses, free, pending, topCat]);

  const typeStyles = {
    danger: { bg: 'bg-calm-red-light border-calm-red/20', dot: 'bg-calm-red', label: t.critical },
    warning: { bg: 'bg-calm-amber-light border-calm-amber/20', dot: 'bg-calm-amber', label: t.warning },
    success: { bg: 'bg-calm-green-light border-calm-green/20', dot: 'bg-calm-green', label: t.good },
    info: { bg: 'bg-calm-blue-light border-calm-blue/20', dot: 'bg-calm-blue', label: t.info },
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{t.insights_title}</h1>
        <p className="text-gray-400 text-sm mt-0.5">{t.insights_sub}</p>
      </div>

      {insights.length === 0 && (
        <Card className="text-center py-10">
          <p className="text-3xl mb-3">🌿</p>
          <p className="text-gray-500">{t.insights_empty}</p>
        </Card>
      )}

      {insights.map((ins) => {
        const s = typeStyles[ins.type];
        return (
          <Card key={ins.id} className={`border ${s.bg}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <span className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${s.dot}`} />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-800">{ins.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.bg} border`}>{s.label}</span>
                  </div>
                  <p className="text-gray-500 text-sm">{ins.observation}</p>
                  <p className="text-gray-700 text-sm mt-2 font-medium">→ {ins.action}</p>
                </div>
              </div>
              <button
                onClick={() => addTask(ins.action, ins.id)}
                title={t.add_as_task}
                className="shrink-0 p-2 hover:bg-white/60 rounded-lg text-gray-400 hover:text-calm-blue transition-colors">
                <Plus size={16} />
              </button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
