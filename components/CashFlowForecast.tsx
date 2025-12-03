import React, { useState, useMemo } from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Icons } from './Icons';

// Types pour les scénarios
interface Scenario {
  id: string;
  label: string;
  type: 'expense' | 'income' | 'delay';
  amount?: number;
  description: string;
  active: boolean;
}

// Données de base prévisionnelles (6 prochains mois)
const BASE_FORECAST_DATA = [
  { month: 'Nov', income: 22000, expense: 16000, initialBalance: 24500 },
  { month: 'Déc', income: 28000, expense: 19000 },
  { month: 'Jan', income: 18000, expense: 15000 },
  { month: 'Fév', income: 21000, expense: 16000 },
  { month: 'Mar', income: 25000, expense: 17000 },
  { month: 'Avr', income: 23000, expense: 16000 },
];

const CashFlowForecast: React.FC = () => {
  // État des scénarios
  const [scenarios, setScenarios] = useState<Scenario[]>([
    { id: 'hiring', label: 'Recrutement Dev Senior', type: 'expense', amount: 4500, description: 'Coût mensuel chargé (Jan+)', active: false },
    { id: 'late_payment', label: 'Retard Client Majeur', type: 'delay', amount: 8000, description: 'Décalage paiement TechSolutions de Déc à Fév', active: false },
    { id: 'invest', label: 'Achat Matériel', type: 'expense', amount: 3000, description: 'Investissement unique en Décembre', active: false },
    { id: 'grant', label: 'Subvention Innovation', type: 'income', amount: 10000, description: 'Encaissement prévu en Mars', active: false },
  ]);

  const toggleScenario = (id: string) => {
    setScenarios(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  // Calcul dynamique des données du graphique
  const chartData = useMemo(() => {
    let currentBalance = BASE_FORECAST_DATA[0].initialBalance || 0;

    return BASE_FORECAST_DATA.map((item, index) => {
      let { income, expense } = item;
      const monthIndex = index; // 0 = Nov, 1 = Déc, etc.

      // Application des scénarios
      
      // 1. Recrutement (Expense récurrente à partir de Janvier - index 2)
      if (scenarios.find(s => s.id === 'hiring')?.active && monthIndex >= 2) {
        expense += 4500;
      }

      // 2. Investissement (Expense unique en Décembre - index 1)
      if (scenarios.find(s => s.id === 'invest')?.active && monthIndex === 1) {
        expense += 3000;
      }

      // 3. Subvention (Income unique en Mars - index 4)
      if (scenarios.find(s => s.id === 'grant')?.active && monthIndex === 4) {
        income += 10000;
      }

      // 4. Retard Paiement (Retire de Déc, Ajoute en Fév)
      if (scenarios.find(s => s.id === 'late_payment')?.active) {
        if (monthIndex === 1) income -= 8000; // Déc
        if (monthIndex === 3) income += 8000; // Fév
      }

      // Mise à jour de la balance cumulée
      if (index === 0) {
        // Pour le premier mois, on part de la balance initiale + variation du mois
        currentBalance = currentBalance + (income - expense);
      } else {
        currentBalance = currentBalance + (income - expense);
      }

      return {
        ...item,
        projectedIncome: income,
        projectedExpense: expense,
        projectedBalance: currentBalance,
        isNegative: currentBalance < 0,
        isLow: currentBalance < 5000 && currentBalance >= 0
      };
    });
  }, [scenarios]);

  // Détection du point le plus bas
  const lowestPoint = Math.min(...chartData.map(d => d.projectedBalance));
  const hasCashCrunch = lowestPoint < 0;

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Colonne Gauche: Graphique */}
      <div className="flex-1 space-y-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-gray-900 font-semibold text-lg flex items-center gap-2">
                        <Icons.Chart className="text-indigo-600" size={20} weight="duotone"/>
                        Projection à 6 mois
                    </h3>
                    <p className="text-sm text-gray-500">Solde prévisionnel basé sur les encours et scénarios.</p>
                </div>
                {hasCashCrunch && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg border border-red-100 animate-pulse">
                        <Icons.Alert size={18} weight="fill" />
                        <span className="text-xs font-bold">Alerte Trésorerie Détectée</span>
                    </div>
                )}
            </div>

            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                    <YAxis hide />
                    <Tooltip 
                        contentStyle={{ 
                            borderRadius: '12px', 
                            border: '1px solid #E5E7EB', 
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            backgroundColor: '#FFFFFF',
                            color: '#111827'
                        }}
                        itemStyle={{ color: '#374151' }}
                        labelStyle={{ color: '#111827', fontWeight: 600, marginBottom: '0.5rem' }}
                        cursor={{fill: '#F9FAFB'}}
                        formatter={(value: any, name: any) => {
                            if (name === 'Solde') return [new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value), name];
                            return [new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value), name === 'projectedIncome' ? 'Entrées' : 'Sorties'];
                        }}
                    />
                    <ReferenceLine y={0} stroke="#9CA3AF" strokeDasharray="3 3" />
                    
                    {/* Barres Entrées / Sorties */}
                    <Bar dataKey="projectedIncome" name="Entrées" barSize={12} fill="#10B981" radius={[4, 4, 0, 0]} stackId="a" />
                    <Bar dataKey="projectedExpense" name="Sorties" barSize={12} fill="#EF4444" radius={[4, 4, 0, 0]} stackId="b" />

                    {/* Ligne de Solde */}
                    <Line 
                        type="monotone" 
                        dataKey="projectedBalance" 
                        name="Solde" 
                        stroke="#4F46E5" 
                        strokeWidth={3} 
                        dot={(props: any) => {
                            const { cx, cy, payload } = props;
                            if (payload.isNegative) return <circle cx={cx} cy={cy} r={5} fill="#EF4444" stroke="white" strokeWidth={2} />;
                            if (payload.isLow) return <circle cx={cx} cy={cy} r={5} fill="#F59E0B" stroke="white" strokeWidth={2} />;
                            return <circle cx={cx} cy={cy} r={4} fill="#4F46E5" stroke="white" strokeWidth={2} />;
                        }}
                    />
                </ComposedChart>
                </ResponsiveContainer>
            </div>
             <div className="flex justify-center gap-6 mt-2">
                <div className="flex items-center text-xs text-gray-500">
                    <span className="w-3 h-1 rounded-full bg-emerald-500 mr-2"></span>
                    Entrées prévues
                </div>
                <div className="flex items-center text-xs text-gray-500">
                    <span className="w-3 h-1 rounded-full bg-red-500 mr-2"></span>
                    Sorties prévues
                </div>
                <div className="flex items-center text-xs text-gray-500">
                    <span className="w-3 h-1 rounded-full bg-indigo-600 mr-2"></span>
                    Solde cumulé
                </div>
            </div>
        </div>

        {/* Détail mensuel compact */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            {chartData.map((d, i) => (
                <div key={i} className={`p-3 rounded-xl border ${d.isNegative ? 'bg-red-50 border-red-100' : d.isLow ? 'bg-amber-50 border-amber-100' : 'bg-white border-gray-200'} flex flex-col items-center justify-center text-center`}>
                    <span className="text-xs font-semibold text-gray-500 mb-1">{d.month}</span>
                    <span className={`text-sm font-bold ${d.isNegative ? 'text-red-600' : d.isLow ? 'text-amber-600' : 'text-gray-900'}`}>
                        {(d.projectedBalance / 1000).toFixed(1)}k€
                    </span>
                </div>
            ))}
        </div>
      </div>

      {/* Colonne Droite: Simulateur - Theme Light */}
      <div className="w-full lg:w-80 flex flex-col h-full bg-white border border-gray-200 text-gray-900 rounded-2xl p-6 shadow-sm">
         <div className="flex items-center gap-2 mb-6 text-indigo-600">
            <Icons.Forecast size={24} weight="duotone" />
            <h3 className="font-bold text-lg text-gray-900">Simulateur</h3>
         </div>
         
         <p className="text-gray-500 text-xs mb-6 leading-relaxed">
            Activez des scénarios pour visualiser leur impact immédiat sur votre courbe de trésorerie.
         </p>

         <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {scenarios.map((scenario) => (
                <div 
                    key={scenario.id} 
                    className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                        scenario.active 
                        ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-500 shadow-sm' 
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => toggleScenario(scenario.id)}
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            scenario.type === 'expense' ? 'text-red-700 bg-red-50' :
                            scenario.type === 'income' ? 'text-emerald-700 bg-emerald-50' :
                            'text-amber-700 bg-amber-50'
                        }`}>
                            {scenario.type === 'expense' ? 'Dépense' : scenario.type === 'income' ? 'Revenu' : 'Décalage'}
                        </span>
                        
                        {/* Toggle Switch Visual */}
                        <div className={`w-10 h-5 rounded-full relative transition-colors border border-transparent ${
                            scenario.active ? 'bg-indigo-600' : 'bg-gray-200'
                        }`}>
                            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                                scenario.active ? 'translate-x-5' : 'translate-x-0.5'
                            }`}></div>
                        </div>
                    </div>
                    
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">{scenario.label}</h4>
                    <p className="text-xs text-gray-500">{scenario.description}</p>
                    
                    {scenario.amount && (
                        <div className={`mt-3 pt-3 border-t text-sm font-mono ${
                            scenario.active ? 'border-indigo-100 text-indigo-700' : 'border-gray-100 text-gray-600'
                        }`}>
                            {scenario.type === 'expense' ? '-' : '+'}{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(scenario.amount)}
                        </div>
                    )}
                </div>
            ))}
         </div>

         <div className="mt-6 pt-6 border-t border-gray-100">
            <button className="w-full py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <Icons.Plus size={16} />
                Créer un scénario
            </button>
         </div>
      </div>
    </div>
  );
};

export default CashFlowForecast;