import React from 'react';
import { FinancialMetric } from '../types';
import { Icons } from './Icons';

interface MetricCardProps {
  metric: FinancialMetric;
  icon: React.ElementType;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric, icon: Icon }) => {
  const isPositive = metric.trendDirection === 'up';
  
  // Formatting currency
  const formattedValue = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(metric.value);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between h-full group">
      <div className="flex justify-between items-start mb-2">
        <div className="p-2 bg-gray-50 rounded-lg text-gray-500 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
          <Icon size={20} weight="duotone" />
        </div>
        
        <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
           metric.trendDirection === 'up' 
             ? (metric.id === 'expenses' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600')
             : (metric.id === 'expenses' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600')
        }`}>
          {metric.trendDirection === 'up' ? <Icons.TrendUp className="mr-1" /> : <Icons.TrendDown className="mr-1" />}
          {Math.abs(metric.trendValue)}%
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-500">{metric.label}</h4>
        <div className="mt-1 flex items-baseline">
          <span className="text-2xl font-bold text-gray-900 tracking-tight">{formattedValue}</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">{metric.trendLabel}</p>
      </div>
    </div>
  );
};

export default MetricCard;