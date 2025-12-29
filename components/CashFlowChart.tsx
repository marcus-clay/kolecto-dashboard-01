import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CashFlowDataPoint } from '../types';

interface CashFlowChartProps {
  chartData: Record<string, CashFlowDataPoint[]>;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white text-gray-900 text-xs p-3 rounded-lg shadow-xl border border-gray-100">
        <p className="font-semibold mb-2">{label}</p>
        <div className="space-y-1">
            <p className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
                Solde: {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(payload[0].value)}
            </p>
             <p className="flex items-center text-gray-500">
                <span className="w-2 h-2 rounded-full bg-red-400 mr-2"></span>
                Sorties: {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(payload[1].value)}
            </p>
        </div>
      </div>
    );
  }
  return null;
};

const CashFlowChart: React.FC<CashFlowChartProps> = ({ chartData }) => {
  const [chartPeriod, setChartPeriod] = useState<string>('Ce semestre');
  const data = chartData[chartPeriod] || [];
  const periodLabel = chartPeriod === 'Ce semestre' ? '6 mois' : '12 mois';

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h3 className="text-gray-900 font-semibold text-lg">Evolution de la Trésorerie</h3>
           <p className="text-gray-500 text-sm">Entrées vs Sorties sur {periodLabel}</p>
        </div>
        <select
          value={chartPeriod}
          onChange={(e) => setChartPeriod(e.target.value)}
          className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg p-2 focus:ring-2 focus:ring-primary-500 focus:outline-none cursor-pointer hover:bg-gray-100 transition-colors"
        >
            <option value="Ce semestre">Ce semestre</option>
            <option value="Cette année">Cette année</option>
        </select>
      </div>
      
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 5,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
            <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#9CA3AF', fontSize: 12}} 
                dy={10}
            />
            <YAxis 
                hide 
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#E5E7EB', strokeWidth: 1 }} />
            <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#4F46E5" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorAmount)" 
                activeDot={{ r: 6, fill: '#4F46E5', stroke: '#fff', strokeWidth: 2 }}
            />
            <Area 
                type="monotone" 
                dataKey="expenses" 
                stroke="#EF4444" 
                strokeWidth={2} 
                strokeDasharray="4 4"
                fill="none" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center text-sm text-gray-500">
            <span className="w-2 h-2 rounded-full bg-indigo-600 mr-2"></span>
            Solde disponible
        </div>
        <div className="flex items-center text-sm text-gray-500">
            <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
            Sorties prévues
        </div>
      </div>
    </div>
  );
};

export default CashFlowChart;