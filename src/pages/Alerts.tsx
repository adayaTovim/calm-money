import { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { AlertTriangle, Clock, TrendingDown, Info } from 'lucide-react';
import { useT } from '../i18n/useT';

interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info';
  icon: typeof AlertTriangle;
  title: string;
  message: string;
}

export function AlertsPage() {
  const { filteredIncomes, totalIncome, freeMoney, pendingIncome } = useStore();
  const t = useT();
  const income = totalIncome();
  const free = freeMoney();
  const pending = pendingIncome();
  const incomes = filteredIncomes();

  const alerts = useMemo((): Alert[] => {
    const list: Alert[] = [];
    const freeMoneyPct = income > 0 ? free / income : 0;
    const pendingPct = (income + pending) > 0 ? pending / (income + pending) : 0;

    if (free < 0) {
      list.push({ id: 'deficit', type: 'danger', icon: TrendingDown, title: t.alert_deficit_title, message: t.alert_deficit(Math.abs(free).toLocaleString()) });
    }

    if (freeMoneyPct >= 0 && freeMoneyPct < 0.1 && income > 0) {
      list.push({ id: 'low-margin', type: 'warning', icon: AlertTriangle, title: t.alert_low_margin_title, message: t.alert_low_margin(Math.round(freeMoneyPct * 100)) });
    }

    const overdueCount = incomes.filter((i) => {
      const ms = new Date(i.date).getTime();
      if (isNaN(ms)) return false;
      const daysAgo = (Date.now() - ms) / 86400000;
      return i.status === 'pending' && daysAgo > 30;
    }).length;

    if (overdueCount > 0) {
      list.push({ id: 'overdue', type: 'warning', icon: Clock, title: t.alert_overdue_title, message: t.alert_overdue(overdueCount) });
    }

    if (pendingPct > 0.5) {
      list.push({ id: 'pending-heavy', type: 'warning', icon: Clock, title: t.alert_pending_heavy_title, message: t.alert_pending_heavy(Math.round(pendingPct * 100)) });
    }

    if (list.length === 0) {
      list.push({ id: 'all-good', type: 'info', icon: Info, title: t.alert_good_title, message: t.alert_good });
    }

    return list;
  }, [income, free, pending, incomes, t]);

  const styles = {
    danger: { bg: 'bg-calm-red-light border-calm-red/20', icon: 'text-calm-red' },
    warning: { bg: 'bg-calm-amber-light border-calm-amber/20', icon: 'text-calm-amber' },
    info: { bg: 'bg-calm-blue-light border-calm-blue/20', icon: 'text-calm-blue' },
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{t.alerts_title}</h1>
        <p className="text-gray-400 text-sm mt-0.5">{t.alerts_sub}</p>
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
