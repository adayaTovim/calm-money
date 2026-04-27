import * as XLSX from 'xlsx';
import type { Income, Expense } from '../types';

const uid = () => Math.random().toString(36).slice(2, 10);

function toDateStr(raw: unknown): string {
  if (!raw) return new Date().toISOString().slice(0, 10);
  if (typeof raw === 'number') {
    const d = XLSX.SSF.parse_date_code(raw);
    if (d) return `${d.y}-${String(d.m).padStart(2, '0')}-${String(d.d).padStart(2, '0')}`;
  }
  const s = String(raw).trim();
  // Try dd/mm/yyyy (common Israeli format)
  const dmyMatch = s.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})$/);
  if (dmyMatch) {
    const y = dmyMatch[3].length === 2 ? '20' + dmyMatch[3] : dmyMatch[3];
    return `${y}-${dmyMatch[2].padStart(2, '0')}-${dmyMatch[1].padStart(2, '0')}`;
  }
  const d = new Date(s);
  return isNaN(d.getTime()) ? new Date().toISOString().slice(0, 10) : d.toISOString().slice(0, 10);
}

// Keywords for auto-categorization
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  Rent: ['rent', 'שכר דירה', 'שכירות', 'דמי שכירות'],
  Salaries: ['salary', 'שכר', 'משכורת', 'עובד', 'payroll'],
  Marketing: ['marketing', 'שיווק', 'פרסום', 'advertising', 'google ads', 'facebook'],
  Software: ['software', 'תוכנה', 'saas', 'subscription', 'מנוי', 'microsoft', 'adobe', 'zoom'],
  Utilities: ['electricity', 'חשמל', 'water', 'מים', 'internet', 'אינטרנט', 'phone', 'טלפון', 'gas', 'גז'],
  Travel: ['fuel', 'דלק', 'parking', 'חניה', 'travel', 'נסיעות', 'taxi', 'uber', 'wolt'],
  Taxes: ['tax', 'מס', 'vat', 'מעמ', 'ביטוח לאומי', 'bituach'],
  Equipment: ['equipment', 'ציוד', 'computer', 'מחשב', 'printer', 'מדפסת'],
};

function guessCategory(description: string): string {
  const lower = description.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k))) return cat;
  }
  return 'Other';
}

export interface ParsedExcelData {
  incomes: Income[];
  expenses: Expense[];
  skipped: number;
}

export function parseExcelFile(file: File): Promise<ParsedExcelData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target!.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const incomes: Income[] = [];
        const expenses: Expense[] = [];
        let skipped = 0;

        workbook.SheetNames.forEach((name) => {
          const sheet = workbook.Sheets[name];
          const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

          rows.forEach((row) => {
            const get = (candidates: string[]) => {
              const key = Object.keys(row).find((k) =>
                candidates.some((c) => k.toLowerCase().trim() === c.toLowerCase())
              );
              return key ? row[key] : '';
            };

            // Try to find amount
            const rawAmount = get([
              'amount', 'סכום', 'total', 'sum', 'הכנסה', 'הוצאה',
              'credit', 'debit', 'זכות', 'חובה', ' סכום העסקה', 'amount nis'
            ]);
            const amount = parseFloat(String(rawAmount).replace(/[,\s]/g, ''));
            if (!rawAmount || isNaN(amount) || amount === 0) { skipped++; return; }

            const description = String(
              get(['description', 'תיאור', 'source', 'מקור', 'supplier', 'ספק', 'name', 'שם', 'פירוט']) || ''
            ).trim();

            const date = toDateStr(get(['date', 'תאריך', 'value date', 'תאריך ערך', 'transaction date']));

            // Detect type: explicit type column, sheet name, or sign of amount
            const typeCol = String(get(['type', 'סוג', 'transaction type', 'סוג עסקה']) || '').toLowerCase();
            const sheetLower = name.toLowerCase();

            const isIncomeByType = typeCol.includes('income') || typeCol.includes('הכנסה') || typeCol.includes('credit') || typeCol.includes('זכות');
            const isExpenseByType = typeCol.includes('expense') || typeCol.includes('הוצאה') || typeCol.includes('debit') || typeCol.includes('חובה');
            const isIncomeBySheet = sheetLower.includes('income') || sheetLower.includes('הכנסה');
            const isExpenseBySheet = sheetLower.includes('expense') || sheetLower.includes('הוצאה');

            // Positive = income, negative = expense (common bank format)
            let isIncome: boolean;
            if (isIncomeByType) isIncome = true;
            else if (isExpenseByType) isIncome = false;
            else if (isIncomeBySheet) isIncome = true;
            else if (isExpenseBySheet) isIncome = false;
            else isIncome = amount > 0; // fallback: sign-based

            if (isIncome) {
              incomes.push({
                id: uid(),
                amount: Math.abs(amount),
                source: description,
                date,
                status: 'received',
              });
            } else {
              const category = get(['category', 'קטגוריה']) as string
                || guessCategory(description);
              expenses.push({
                id: uid(),
                amount: Math.abs(amount),
                category: String(category) || 'Other',
                supplier: description,
                date,
                status: 'paid',
              });
            }
          });
        });

        resolve({ incomes, expenses, skipped });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

// ─── EXPORT ────────────────────────────────────────────────────────────────

interface ExportData {
  incomes: Income[];
  expenses: Expense[];
  dateFrom: string;
  dateTo: string;
}

function setColWidths(ws: XLSX.WorkSheet, widths: number[]) {
  ws['!cols'] = widths.map((w) => ({ wch: w }));
}

export function exportToExcel(data: ExportData) {
  const { incomes, expenses, dateFrom, dateTo } = data;
  const wb = XLSX.utils.book_new();
  const period = `${dateFrom} → ${dateTo}`;

  // ── 1. Summary sheet ──────────────────────────────────────────────────────
  const totalIncome = incomes.filter((i) => i.status === 'received').reduce((s, i) => s + i.amount, 0);
  const totalPending = incomes.filter((i) => i.status === 'pending').reduce((s, i) => s + i.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const freeMoney = totalIncome - totalExpenses;
  const freeMoneyPct = totalIncome > 0 ? Math.round((freeMoney / totalIncome) * 100) : 0;
  const healthScore = (() => {
    if (totalIncome === 0 && totalExpenses === 0) return 0;
    let score = 100;
    const pct = totalIncome > 0 ? freeMoney / totalIncome : -1;
    if (freeMoney < 0) score -= 40;
    else if (pct < 0.1) score -= 20;
    else if (pct < 0.2) score -= 10;
    const pendingPct = (totalIncome + totalPending) > 0 ? totalPending / (totalIncome + totalPending) : 0;
    if (pendingPct > 0.5) score -= 20;
    else if (pendingPct > 0.3) score -= 10;
    return Math.max(0, Math.min(100, score));
  })();

  const summaryRows = [
    ['Calm Money — Financial Report'],
    [`Period: ${period}`],
    [],
    ['Metric', 'Value'],
    ['Total Income (received)', totalIncome],
    ['Pending Income', totalPending],
    ['Total Expenses', totalExpenses],
    ['Balance', totalIncome - totalExpenses],
    ['Free Money', freeMoney],
    ['Free Money %', `${freeMoneyPct}%`],
    ['Financial Health Score', `${healthScore} / 100`],
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
  setColWidths(wsSummary, [30, 20]);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

  // ── 2. Income sheet ────────────────────────────────────────────────────────
  const incomeRows = [
    ['Amount (₪)', 'Source', 'Date', 'Status'],
    ...incomes.map((i) => [i.amount, i.source, i.date, i.status]),
    [],
    ['Total Received', totalIncome],
    ['Total Pending', totalPending],
  ];
  const wsIncome = XLSX.utils.aoa_to_sheet(incomeRows);
  setColWidths(wsIncome, [14, 30, 14, 12]);
  XLSX.utils.book_append_sheet(wb, wsIncome, 'Income');

  // ── 3. Expenses sheet ─────────────────────────────────────────────────────
  const expenseRows = [
    ['Amount (₪)', 'Category', 'Supplier', 'Date', 'Status'],
    ...expenses.map((e) => [e.amount, e.category, e.supplier ?? '', e.date, e.status ?? 'paid']),
    [],
    ['Total', totalExpenses],
  ];
  const wsExpenses = XLSX.utils.aoa_to_sheet(expenseRows);
  setColWidths(wsExpenses, [14, 16, 28, 14, 12]);
  XLSX.utils.book_append_sheet(wb, wsExpenses, 'Expenses');

  // ── 4. Category breakdown ─────────────────────────────────────────────────
  const catMap: Record<string, number> = {};
  expenses.forEach((e) => { catMap[e.category] = (catMap[e.category] || 0) + e.amount; });
  const catRows = [
    ['Category', 'Amount (₪)', '% of Expenses'],
    ...Object.entries(catMap)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, amt]) => [cat, amt, totalExpenses > 0 ? `${Math.round((amt / totalExpenses) * 100)}%` : '0%']),
  ];
  const wsCat = XLSX.utils.aoa_to_sheet(catRows);
  setColWidths(wsCat, [20, 16, 18]);
  XLSX.utils.book_append_sheet(wb, wsCat, 'By Category');

  // ── 5. Monthly breakdown ──────────────────────────────────────────────────
  const monthMap: Record<string, { income: number; expenses: number }> = {};
  incomes.filter((i) => i.status === 'received').forEach((i) => {
    const m = i.date.slice(0, 7);
    if (!monthMap[m]) monthMap[m] = { income: 0, expenses: 0 };
    monthMap[m].income += i.amount;
  });
  expenses.forEach((e) => {
    const m = e.date.slice(0, 7);
    if (!monthMap[m]) monthMap[m] = { income: 0, expenses: 0 };
    monthMap[m].expenses += e.amount;
  });
  const monthRows = [
    ['Month', 'Income (₪)', 'Expenses (₪)', 'Free Money (₪)', 'Free Money %'],
    ...Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, { income, expenses: exp }]) => {
        const free = income - exp;
        const pct = income > 0 ? `${Math.round((free / income) * 100)}%` : '—';
        return [month, income, exp, free, pct];
      }),
  ];
  const wsMonthly = XLSX.utils.aoa_to_sheet(monthRows);
  setColWidths(wsMonthly, [12, 14, 16, 16, 14]);
  XLSX.utils.book_append_sheet(wb, wsMonthly, 'By Month');

  const filename = `calm-money-report-${dateFrom}-${dateTo}.xlsx`;
  XLSX.writeFile(wb, filename);
}

// ─── TEMPLATE ───────────────────────────────────────────────────────────────

// Generate a template Excel file for download
export function downloadTemplate() {
  const wb = XLSX.utils.book_new();

  const incomeData = [
    ['Amount', 'Source', 'Date', 'Status'],
    [5000, 'Client A', '01/04/2026', 'received'],
    [3000, 'Client B', '15/04/2026', 'pending'],
  ];
  const expenseData = [
    ['Amount', 'Category', 'Supplier', 'Date', 'Status'],
    [1500, 'Rent', 'Landlord', '01/04/2026', 'paid'],
    [800, 'Software', 'Adobe', '05/04/2026', 'paid'],
    [300, 'Travel', 'Fuel', '10/04/2026', 'upcoming'],
  ];

  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(incomeData), 'Income');
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(expenseData), 'Expenses');
  XLSX.writeFile(wb, 'calm-money-template.xlsx');
}
