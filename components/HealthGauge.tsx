import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { HealthScoreData } from '../types';

interface HealthGaugeProps {
  data: HealthScoreData;
}

const HealthGauge: React.FC<HealthGaugeProps> = ({ data }) => {
  // Visual logic: 0-100 score mapped to a 180 degree semi-circle
  const score = Math.min(Math.max(data.score, 0), 100);
  
  // Determine color based on score
  let color = '#EF4444'; // Red-500
  let label = 'Critique';
  let bgColor = '#FEE2E2'; // Red-100

  if (score >= 50 && score < 80) {
    color = '#F59E0B'; // Amber-500
    label = 'Attention';
    bgColor = '#FEF3C7'; // Amber-100
  } else if (score >= 80) {
    color = '#10B981'; // Emerald-500
    label = 'Excellente';
    bgColor = '#D1FAE5'; // Emerald-100
  }

  const chartData = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];

  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        
      <div className="flex justify-between items-start mb-4 z-10">
        <div>
          <h3 className="text-gray-900 font-semibold text-lg">Santé Financière</h3>
          <p className="text-gray-500 text-sm mt-1">Calculé sur 12 indicateurs</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide border`} style={{ backgroundColor: bgColor, color: color, borderColor: 'transparent' }}>
          {label}
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative min-h-[160px]">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="70%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={85}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
              cornerRadius={5}
            >
              <Cell key="score" fill={color} />
              <Cell key="remaining" fill="#F3F4F6" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Centered Score */}
        <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center mt-4">
          <span className="text-4xl font-bold text-gray-900 tracking-tight">{score}</span>
          <span className="text-gray-400 text-xl font-medium">/100</span>
        </div>
      </div>

      <div className="mt-4 z-10">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Facteurs d'impact</h4>
        <div className="space-y-2">
          {data.factors.map((factor, idx) => (
            <div key={idx} className="flex items-center text-sm">
              <div className={`w-1.5 h-1.5 rounded-full mr-2 ${factor.impact === 'positive' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
              <span className="text-gray-600 flex-1 truncate">{factor.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthGauge;