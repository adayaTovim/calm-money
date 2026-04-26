import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileSpreadsheet, Check, AlertCircle, ArrowLeft } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { parseExcelFile } from '../utils/excel';
import type { ParsedExcelData } from '../utils/excel';
import type { Income, Expense } from '../types';

export function UploadPage() {
  const navigate = useNavigate();
  const { addIncome, addExpense } = useStore();
  const [parsed, setParsed] = useState<ParsedExcelData | null>(null);
  const [editedIncomes, setEditedIncomes] = useState<Income[]>([]);
  const [editedExpenses, setEditedExpenses] = useState<Expense[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setLoading(true); setError('');
    try {
      const data = await parseExcelFile(file);
      setParsed(data);
      setEditedIncomes(data.incomes);
      setEditedExpenses(data.expenses);
    } catch {
      setError('Could not read this file. Make sure it is an .xlsx or .xls file.');
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

  const save = () => {
    editedIncomes.forEach(({ id: _, ...rest }) => addIncome(rest));
    editedExpenses.forEach(({ id: _, ...rest }) => addExpense(rest));
    setDone(true);
    setTimeout(() => navigate('/'), 1500);
  };

  if (done) {
    return (
      <div className="p-6 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 bg-calm-green-light rounded-full flex items-center justify-center mb-4">
          <Check size={28} className="text-calm-green" />
        </div>
        <h2 className="text-xl font-semibold text-gray-700">Imported successfully!</h2>
        <p className="text-gray-400 text-sm mt-1">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600">
        <ArrowLeft size={15} /> Back
      </button>
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Upload Excel file</h1>
        <p className="text-gray-400 text-sm mt-0.5">We'll extract income and expenses automatically. You can review and edit before saving.</p>
      </div>

      {!parsed && (
        <Card
          className="border-2 border-dashed border-beige-300 text-center py-14 cursor-pointer hover:border-calm-blue hover:bg-calm-blue-light/30 transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          <div onDrop={onDrop} onDragOver={(e) => e.preventDefault()}>
            <FileSpreadsheet size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="font-medium text-gray-600">Drop your Excel file here</p>
            <p className="text-sm text-gray-400 mt-1">or click to browse — .xlsx / .xls</p>
            {loading && <p className="text-sm text-calm-blue mt-3">Reading file...</p>}
            {error && (
              <div className="flex items-center gap-2 justify-center text-calm-red mt-3 text-sm">
                <AlertCircle size={15} /> {error}
              </div>
            )}
          </div>
          <input ref={inputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={onInput} />
        </Card>
      )}

      {parsed && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-calm-green font-medium">
            <Check size={16} /> Found {editedIncomes.length} income rows and {editedExpenses.length} expense rows
          </div>

          {editedIncomes.length > 0 && (
            <Card>
              <h3 className="font-semibold text-gray-700 mb-3">Income ({editedIncomes.length})</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {editedIncomes.map((inc, i) => (
                  <div key={inc.id} className="flex items-center gap-2 text-sm">
                    <input type="number" value={inc.amount}
                      onChange={(e) => setEditedIncomes((arr) => arr.map((x, j) => j === i ? { ...x, amount: +e.target.value } : x))}
                      className="w-24 border border-beige-200 rounded-lg px-2 py-1 text-right" />
                    <input value={inc.source}
                      onChange={(e) => setEditedIncomes((arr) => arr.map((x, j) => j === i ? { ...x, source: e.target.value } : x))}
                      placeholder="Source" className="flex-1 border border-beige-200 rounded-lg px-2 py-1" />
                    <input type="date" value={inc.date}
                      onChange={(e) => setEditedIncomes((arr) => arr.map((x, j) => j === i ? { ...x, date: e.target.value } : x))}
                      className="border border-beige-200 rounded-lg px-2 py-1" />
                    <button onClick={() => setEditedIncomes((arr) => arr.filter((_, j) => j !== i))}
                      className="text-calm-red hover:opacity-70 px-1">✕</button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {editedExpenses.length > 0 && (
            <Card>
              <h3 className="font-semibold text-gray-700 mb-3">Expenses ({editedExpenses.length})</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {editedExpenses.map((exp, i) => (
                  <div key={exp.id} className="flex items-center gap-2 text-sm">
                    <input type="number" value={exp.amount}
                      onChange={(e) => setEditedExpenses((arr) => arr.map((x, j) => j === i ? { ...x, amount: +e.target.value } : x))}
                      className="w-24 border border-beige-200 rounded-lg px-2 py-1 text-right" />
                    <input value={exp.category}
                      onChange={(e) => setEditedExpenses((arr) => arr.map((x, j) => j === i ? { ...x, category: e.target.value } : x))}
                      placeholder="Category" className="w-28 border border-beige-200 rounded-lg px-2 py-1" />
                    <input value={exp.supplier || ''}
                      onChange={(e) => setEditedExpenses((arr) => arr.map((x, j) => j === i ? { ...x, supplier: e.target.value } : x))}
                      placeholder="Supplier" className="flex-1 border border-beige-200 rounded-lg px-2 py-1" />
                    <button onClick={() => setEditedExpenses((arr) => arr.filter((_, j) => j !== i))}
                      className="text-calm-red hover:opacity-70 px-1">✕</button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="flex gap-3">
            <button onClick={save}
              className="flex items-center gap-2 bg-calm-blue text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-600 transition-colors">
              <Upload size={16} /> Import all
            </button>
            <button onClick={() => { setParsed(null); setEditedIncomes([]); setEditedExpenses([]); }}
              className="border border-beige-200 px-5 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-beige-50 transition-colors">
              Upload different file
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
