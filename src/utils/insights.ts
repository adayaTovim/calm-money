import type { InsightRule } from '../types';

interface InsightInput {
  totalIncome: number;
  totalExpenses: number;
  freeMoney: number;
  pendingIncome: number;
  topCategory?: { name: string; pct: number };
}

export function generateInsights(data: InsightInput): InsightRule[] {
  const { totalIncome, totalExpenses, freeMoney, pendingIncome, topCategory } = data;
  const results: InsightRule[] = [];

  const freeMoneyPct = totalIncome > 0 ? freeMoney / totalIncome : 0;
  const pendingPct = (totalIncome + pendingIncome) > 0 ? pendingIncome / (totalIncome + pendingIncome) : 0;

  if (freeMoney < 0) {
    results.push({
      id: 'deficit',
      type: 'danger',
      title: 'Risk of Deficit',
      observation: 'Your expenses exceed your income this period.',
      action: 'Stop non-critical spending immediately and review your largest expense categories.',
    });
  } else if (totalExpenses > totalIncome && freeMoney >= 0) {
    results.push({
      id: 'overspending',
      type: 'danger',
      title: 'Overspending Alert',
      observation: 'Expenses are higher than received income.',
      action: 'Reduce spending in your highest expense category.',
    });
  }

  if (freeMoney >= 0 && freeMoneyPct < 0.1 && freeMoney >= 0) {
    results.push({
      id: 'low-margin',
      type: 'warning',
      title: 'Low Free Money',
      observation: 'Less than 10% of income is available as free money.',
      action: 'Avoid non-essential spending this month.',
    });
  }

  if (pendingPct > 0.3) {
    results.push({
      id: 'pending-risk',
      type: 'warning',
      title: 'High Pending Income',
      observation: `${Math.round(pendingPct * 100)}% of your expected income is still unpaid.`,
      action: 'Follow up with clients on outstanding invoices.',
    });
  }

  if (topCategory && topCategory.pct > 40) {
    results.push({
      id: 'category-concentration',
      type: 'info',
      title: `High Spend: ${topCategory.name}`,
      observation: `${topCategory.name} accounts for ${topCategory.pct}% of your expenses.`,
      action: `Review your ${topCategory.name} expenses and see where you can cut back.`,
    });
  }

  if (freeMoney > 0 && freeMoneyPct > 0.2) {
    results.push({
      id: 'good-condition',
      type: 'success',
      title: 'Good Financial Health',
      observation: `You have ${Math.round(freeMoneyPct * 100)}% of income available as free money.`,
      action: 'Consider setting aside some of this into savings.',
    });
  }

  const priority = { danger: 0, warning: 1, info: 2, success: 3 };
  return results.sort((a, b) => priority[a.type] - priority[b.type]).slice(0, 5);
}

export function calcHealthScore(data: InsightInput): number {
  const { totalIncome, totalExpenses, freeMoney, pendingIncome } = data;
  if (totalIncome === 0 && totalExpenses === 0) return 0;

  let score = 100;
  const freeMoneyPct = totalIncome > 0 ? freeMoney / totalIncome : -1;
  const pendingPct = (totalIncome + pendingIncome) > 0 ? pendingIncome / (totalIncome + pendingIncome) : 0;

  if (freeMoney < 0) score -= 40;
  else if (freeMoneyPct < 0.1) score -= 20;
  else if (freeMoneyPct < 0.2) score -= 10;

  if (pendingPct > 0.5) score -= 20;
  else if (pendingPct > 0.3) score -= 10;

  return Math.max(0, Math.min(100, score));
}
