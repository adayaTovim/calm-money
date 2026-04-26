import * as XLSX from 'xlsx';
import type { Income, Expense } from '../types';

const uid = () => Math.random().toString(36).slice(2, 10);

function toDateStr(raw: unknown): string {
  if (!raw) return new Date().toISOString().slice(0, 10);
  if (typeof raw === 'number') {
    const d = XLSX.SSF.parse_date_code(raw);
    if (d) return `${d.y}-${String(d.m).padStart(2, '0')}-${String(d.d).padStart(2, '0')}`;
  }
  const d = new Date(String(raw));
  return isNaN(d.getTime()) ? new Date().toISOString().slice(0, 10) : d.toISOString().slice(0, 10);
}

export interface ParsedExcelData {
  incomes: Income[];
  expenses: Expense[];
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

        workbook.SheetNames.forEach((name) => {
          const sheet = workbook.Sheets[name];
          const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });
          const lowerName = name.toLowerCase();

          rows.forEach((row) => {
            const keys = Object.keys(row).map((k) => k.toLowerCase());
            const get = (candidates: string[]) => {
              const key = Object.keys(row).find((k) => candidates.includes(k.toLowerCase()));
              return key ? row[key] : '';
            };

            const amount = parseFloat(String(get(['amount', 'סכום', 'total', 'הכנסה', 'הוצאה']) || '0'));
            if (!amount || isNaN(amount)) return;

            if (lowerName.includes('income') || lowerName.includes('הכנס') || keys.some((k) => ['source', 'מקור'].includes(k))) {
              incomes.push({
                id: uid(),
                amount: Math.abs(amount),
                source: String(get(['source', 'מקור', 'description', 'תיאור']) || ''),
                date: toDateStr(get(['date', 'תאריך'])),
                status: 'received',
                notes: String(get(['notes', 'הערות']) || ''),
              });
            } else {
              expenses.push({
                id: uid(),
                amount: Math.abs(amount),
                category: String(get(['category', 'קטגוריה', 'type', 'סוג']) || 'General'),
                supplier: String(get(['supplier', 'ספק', 'vendor', 'description', 'תיאור']) || ''),
                date: toDateStr(get(['date', 'תאריך'])),
                notes: String(get(['notes', 'הערות']) || ''),
              });
            }
          });
        });

        resolve({ incomes, expenses });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
