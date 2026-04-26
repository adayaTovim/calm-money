export type IncomeStatus = 'received' | 'pending';
export type ServiceType = 'Management' | 'Engineer' | 'Support';

export interface Income {
  id: string;
  amount: number;
  source: string;
  date: string;
  status: IncomeStatus;
  notes?: string;
}

export type ExpenseStatus = 'paid' | 'upcoming';

export interface Expense {
  id: string;
  amount: number;
  category: string;
  supplier?: string;
  date: string;
  status: ExpenseStatus;
  notes?: string;
}

export interface Task {
  id: string;
  text: string;
  done: boolean;
  insightId?: string;
  createdAt: string;
}

export interface InsightRule {
  id: string;
  type: 'danger' | 'warning' | 'success' | 'info';
  title: string;
  observation: string;
  action: string;
}

export type DateRange = { from: string; to: string };
