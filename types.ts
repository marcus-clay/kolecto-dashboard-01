export type TrendDirection = 'up' | 'down' | 'neutral';

export interface FinancialMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  trendValue: number;
  trendDirection: TrendDirection;
  trendLabel: string; // e.g. "vs mois dernier"
  status: 'good' | 'warning' | 'danger' | 'neutral';
}

export interface Alert {
  id: string;
  type: 'danger' | 'warning' | 'info';
  title: string;
  description: string;
  actionLabel?: string;
}

export interface CashFlowDataPoint {
  date: string;
  amount: number;
  expenses: number;
}

export interface HealthScoreData {
  score: number; // 0-100
  factors: {
    label: string;
    impact: 'positive' | 'negative';
  }[];
}