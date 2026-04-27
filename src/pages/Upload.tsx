import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileSpreadsheet, Check, AlertCircle, ArrowLeft, Download, RefreshCw } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { parseExcelFile, downloadTemplate } from '../utils/excel';
import type { ParsedExcelData } from '../utils/excel';
import type { Income, Expense } from '../types';
import { useT } from '../i18n/useT';

const CATEGORIES = ['Rent', 'Salaries', 'Marketing', 'Software', 'Equipment', 'Travel', 'Utilities', 'Taxes', 'Other'];

export function UploadPage() {
  const navigate = useNavigate();
  const { addIncome, addExpense } = useStore();
  const t = useT();
  const [parsed, setParsed] = useState<ParsedExcelData | null>(null);
  const [editedIncomes, setEditedIncomes] = useState<Income[]>([]);
  const [editedExpenses, setEditedExpenses] = useState<Expense[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [activeTab, setActiveTab] = useState<'income' | 'expense'>('income');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setLoading(true); setError('');
    try {
      const data = await parseExcelFile(file);
      setParsed(data);
      setEditedIncomes(data.incomes);
      setEditedExpenses(data.expenses);
      setActiveTab(data.incomes.length > 0 ? 'income' : 'expense');
    } catch {
      setError(t.upload_error);
    }
    setLoading(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const save = (skipReview = false) => {
    const incomes = skipReview ? (parsed?.incomes ?? []) : editedIncomes;
    const expenses = skipReview ? (parsed?.expenses ?? []) : editedExpenses;
    incomes.forEach(({ id: _, ...rest }) => addIncome(rest));
    expenses.forEach(({ id: _, ...rest }) => addExpense(rest));
    setDone(true);
    setTimeout(() => navigate('/'), 1500);
  };

  const reset = () => {
    setParsed(null);
    setEditedIncomes([]);
    setEditedExpenses([]);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  if (done) {
    return (
      <div className="p-6 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 bg-calm-green-light rounded-full flex items-center justify-center mb-4">
          <Check size={28} className="text-calm-green" />
        </div>
        <h2 className="text-xl font-semibold text-gray-700">{t.import_success}</h2>
        <p className="text-gray-400 text-sm mt-1">{t.redirecting}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-5">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600">
        <ArrowLeft size={15} className="rtl:rotate-180" /> {t.back}
      </button>

      <div>
        <h1 className="text-2xl font-bold text-gray-800">{t.upload_title}</h1>
        <p className="text-gray-400 text-sm mt-0.5">{t.upload_sub}</p>
      </div>

      {/* Template download */}
      <Card className="flex items-center justify-between gap-4 py-3">
        <div>
          <p className="text-sm font-medium text-gray-700">{t.upload_template}</p>
          <p className="text-xs text-gray-400">{t.upload_template_desc}</p>
        </div>
        <button onClick={downloadTemplate}
          className="flex items-center gap-2 border border-beige-200 px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-beige-50 transition-colors shrink-0">
          <Download size={15} /> {t.upload_template}
        </button>
      </Card>

      {/* Drop zone */}
      {!parsed && (
        <Card
          className="border-2 border-dashed border-beige-300 text-center py-12 cursor-pointer hover:border-calm-blue hover:bg-calm-blue-light/20 transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          <div onDrop={onDrop} onDragOver={(e) => e.preventDefault()}>
            <FileSpreadsheet size={44} className="text-gray-300 mx-auto mb-3" />
            <p className="font-medium text-gray-600 mb-1">{t.upload_drop}</p>
            <p className="text-sm text-gray-400">{t.upload_browse}</p>
            {loading && (
              <div className="flex items-center justify-center gap-2 text-calm-blue mt-4 text-sm">
                <RefreshCw size={14} className="animate-spin" /> {t.upload_reading}
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 justify-center text-calm-red mt-4 text-sm">
                <AlertCircle size={15} /> {error}
              </div>
            )}
          </div>
          <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={onInput} />
        </Card>
      )}

      {/* Preview */}
      {parsed && (
        <div className="space-y-4">
          {/* Summary bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-calm-green font-medium">
              <Check size={16} />
              {t.upload_found(editedIncomes.length, editedExpenses.length)}
            </div>
            {parsed.skipped > 0 && (
              <span className="text-xs text-gray-400">{t.upload_skipped(parsed.skipped)}</span>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-beige-100 rounded-xl p-1 w-fit">
            {(['income', 'expense'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab ? 'bg-white shadow-sm text-gray-700' : 'text-gray-400 hover:text-gray-600'
                }`}>
                {tab === 'income' ? t.upload_tab_income(editedIncomes.length) : t.upload_tab_expense(editedExpenses.length)}
              </button>
            ))}
          </div>

          {/* Income table */}
          {activeTab === 'income' && (
            <Card>
              {editedIncomes.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-6">{t.no_income_yet}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-gray-400 border-b border-beige-100">
                        <th className="text-start pb-2 font-medium">{t.amount_label}</th>
                        <th className="text-start pb-2 font-medium">{t.upload_source}</th>
                        <th className="text-start pb-2 font-medium">{t.date_label}</th>
                        <th className="text-start pb-2 font-medium">{t.upload_status}</th>
                        <th className="pb-2" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-beige-100">
                      {editedIncomes.map((inc, i) => (
                        <tr key={inc.id} className="group">
                          <td className="py-2 pe-2">
                            <input type="number" value={inc.amount}
                              onChange={(e) => setEditedIncomes((arr) => arr.map((x, j) => j === i ? { ...x, amount: +e.target.value } : x))}
                              className="w-24 border border-beige-200 rounded-lg px-2 py-1 text-right focus:outline-none focus:ring-1 focus:ring-calm-blue/30" />
                          </td>
                          <td className="py-2 pe-2">
                            <input value={inc.source}
                              onChange={(e) => setEditedIncomes((arr) => arr.map((x, j) => j === i ? { ...x, source: e.target.value } : x))}
                              className="w-full min-w-[120px] border border-beige-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-calm-blue/30" />
                          </td>
                          <td className="py-2 pe-2">
                            <input type="date" value={inc.date}
                              onChange={(e) => setEditedIncomes((arr) => arr.map((x, j) => j === i ? { ...x, date: e.target.value } : x))}
                              className="border border-beige-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-calm-blue/30" />
                          </td>
                          <td className="py-2 pe-2">
                            <select value={inc.status}
                              onChange={(e) => setEditedIncomes((arr) => arr.map((x, j) => j === i ? { ...x, status: e.target.value as Income['status'] } : x))}
                              className="border border-beige-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-calm-blue/30">
                              <option value="received">{t.received}</option>
                              <option value="pending">{t.pending_status}</option>
                            </select>
                          </td>
                          <td className="py-2">
                            <button onClick={() => setEditedIncomes((arr) => arr.filter((_, j) => j !== i))}
                              className="text-gray-300 hover:text-calm-red transition-colors px-1">✕</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}

          {/* Expenses table */}
          {activeTab === 'expense' && (
            <Card>
              {editedExpenses.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-6">{t.no_expenses_yet2}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs text-gray-400 border-b border-beige-100">
                        <th className="text-start pb-2 font-medium">{t.amount_label}</th>
                        <th className="text-start pb-2 font-medium">{t.upload_category}</th>
                        <th className="text-start pb-2 font-medium">{t.upload_supplier}</th>
                        <th className="text-start pb-2 font-medium">{t.date_label}</th>
                        <th className="text-start pb-2 font-medium">{t.upload_status}</th>
                        <th className="pb-2" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-beige-100">
                      {editedExpenses.map((exp, i) => (
                        <tr key={exp.id} className="group">
                          <td className="py-2 pe-2">
                            <input type="number" value={exp.amount}
                              onChange={(e) => setEditedExpenses((arr) => arr.map((x, j) => j === i ? { ...x, amount: +e.target.value } : x))}
                              className="w-24 border border-beige-200 rounded-lg px-2 py-1 text-right focus:outline-none focus:ring-1 focus:ring-calm-blue/30" />
                          </td>
                          <td className="py-2 pe-2">
                            <select value={exp.category}
                              onChange={(e) => setEditedExpenses((arr) => arr.map((x, j) => j === i ? { ...x, category: e.target.value } : x))}
                              className="border border-beige-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-calm-blue/30">
                              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                            </select>
                          </td>
                          <td className="py-2 pe-2">
                            <input value={exp.supplier || ''}
                              onChange={(e) => setEditedExpenses((arr) => arr.map((x, j) => j === i ? { ...x, supplier: e.target.value } : x))}
                              className="w-full min-w-[100px] border border-beige-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-calm-blue/30" />
                          </td>
                          <td className="py-2 pe-2">
                            <input type="date" value={exp.date}
                              onChange={(e) => setEditedExpenses((arr) => arr.map((x, j) => j === i ? { ...x, date: e.target.value } : x))}
                              className="border border-beige-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-calm-blue/30" />
                          </td>
                          <td className="py-2 pe-2">
                            <select value={exp.status ?? 'paid'}
                              onChange={(e) => setEditedExpenses((arr) => arr.map((x, j) => j === i ? { ...x, status: e.target.value as Expense['status'] } : x))}
                              className="border border-beige-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-calm-blue/30">
                              <option value="paid">{t.paid}</option>
                              <option value="upcoming">{t.upcoming}</option>
                            </select>
                          </td>
                          <td className="py-2">
                            <button onClick={() => setEditedExpenses((arr) => arr.filter((_, j) => j !== i))}
                              className="text-gray-300 hover:text-calm-red transition-colors px-1">✕</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <button onClick={() => save(false)}
              className="flex items-center gap-2 bg-calm-blue text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-600 transition-colors">
              <Upload size={16} /> {t.upload_review}
            </button>
            <button onClick={() => save(true)}
              className="flex items-center gap-2 bg-calm-green text-white px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity">
              <Check size={16} /> {t.upload_auto_import}
            </button>
            <button onClick={reset}
              className="border border-beige-200 px-5 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-beige-50 transition-colors">
              {t.upload_different}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
