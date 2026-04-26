import { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { AlertTriangle, Clock, TrendingDown, Info } from 'lucide-react';

interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info';
  icon: typeof AlertTriangle;
  title: string;
  message: string;
}

export function AlertsPage() {
  const { filteredIncomes, totalIncome, totalExpenses, freeMoney, pendingIncome } = useStore();
  const income = totalIncome();
  const expenses = totalExpenses();
  const free = freeMoney();
  const pending = pendingIncome();
  const incomes = filteredIncomes();

  const alerts = useMemo((): Alert[] => {
    const list: Alert[] = [];
    const freeMoneyPct = income > 0 ? free / income : 0;
    const pendingPct = (income + pending) > 0 ? pending / (income + pending) : 0;

    if (free < 0) {
      list.push({ id: 'deficit', type: 'danger', icon: TrendingDown, title: 'Deficit Risk', message: `Your expenses exceed income by ₪${Math.abs(free).toLocaleString()}. Immediate action recommended.` });
    }

    if (freeMoneyPct >= 0 && freeMoneyPct < 0.1 && income > 0) {
      list.push({ id: 'low-margin', type: 'warning', icon: AlertTriangle, title: 'Low Free Money', message: `Only ${Math.round(freeMoneyPct * 100)}% of income remains free. Avoid non-essential spending.` });
    }

    const overdueCount = incomes.filter((i) => {
      const daysAgo = (Date.now() - new Date(i.date).getTime()) / 86400000;
      return i.status === 'pending' && daysAgo > 30;
    }).length;

    if (overdueCount > 0) {
      list.push({ id: 'overdue', type: 'warning', icon: Clock, title: 'Delayed Payments', message: `${overdueCount} pending income ${overdueCount === 1 ? 'entry is' : 'entries are'} over 30 days old. Follow up with your clients.` });
    }

    if (pendingPct > 0.5) {
      list.push({ id: 'pending-heavy', type: 'warning', icon: Clock, title: 'High Pending Income', message: `${Math.round(pendingPct * 100)}% of expected income is still unpaid. This affects your cash flow.` });
    }

    if (list.length === 0) {
      list.push({ id: 'all-good', type: 'info', icon: Info, title: 'All looks good', message: 'No critical alerts at the moment. Keep it up!' });
    }

    return list;
  }, [income, expenses, free, pending, incomes]);

  const styles = {
    danger: { bg: 'bg-calm-red-light border-calm-red/20', icon: 'text-calm-red' },
    warning: { bg: 'bg-calm-amber-light border-calm-amber/20', icon: 'text-calm-amber' },
    info: { bg: 'bg-calm-blue-light border-calm-blue/20', icon: 'text-calm-blue' },
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Alerts</h1>
        <p className="text-gray-400 text-sm mt-0.5">Things that need your attention</p>
      </div>
      {alerts.map((a) => {
        const s = styles[a.type];
        const Icon = a.icon;
        return (
          <Card key={a.id} className={`border ${s.bg}`}>
            <div className="flex items-start gap-3">
              <Icon size={18} className={`${s.icon} shrink-0 mt-0.5`} />
              <div>
                <p className="font-semibold text-gray-800 text-sm">{a.title}</p>
                <p className="text-gray-500 text-sm mt-0.5">{a.message}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
