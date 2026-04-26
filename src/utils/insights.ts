export type InsightId = 'deficit' | 'overspending' | 'low-margin' | 'pending-risk' | 'category-concentration' | 'good-condition';

export interface InsightRule {
  id: InsightId;
  type: 'danger' | 'warning' | 'success' | 'info';
  data: { pct?: number; categoryName?: string; categoryPct?: number };
}

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
    results.push({ id: 'deficit', type: 'danger', data: {} });
  } else if (totalExpenses > totalIncome) {
    results.push({ id: 'overspending', type: 'danger', data: {} });
  }

  if (freeMoney >= 0 && freeMoneyPct < 0.1) {
    results.push({ id: 'low-margin', type: 'warning', data: {} });
  }

  if (pendingPct > 0.3) {
    results.push({ id: 'pending-risk', type: 'warning', data: { pct: Math.round(pendingPct * 100) } });
  }

  if (topCategory && topCategory.pct > 40) {
    results.push({ id: 'category-concentration', type: 'info', data: { categoryName: topCategory.name, categoryPct: topCategory.pct } });
  }

  if (freeMoney > 0 && freeMoneyPct > 0.2) {
    results.push({ id: 'good-condition', type: 'success', data: { pct: Math.round(freeMoneyPct * 100) } });
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
