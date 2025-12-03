import React, { useState } from 'react';
import CashFlowChart from './CashFlowChart';
import CashFlowForecast from './CashFlowForecast';
import { Icons } from './Icons';
import { CashFlowDataPoint } from '../types';

interface CashFlowViewProps {
  chartData: CashFlowDataPoint[];
}

const TRANSACTIONS = [
  { id: 1, label: 'Virement Client - TechSolutions', date: 'Aujourd\'hui', amount: 4500, type: 'credit', category: 'Ventes' },
  { id: 2, label: 'Loyer Bureau', date: 'Hier', amount: -1200, type: 'debit', category: 'Locaux' },
  { id: 3, label: 'URSSAF', date: '15 Oct', amount: -2450, type: 'debit', category: 'Charges' },
  { id: 4, label: 'Virement Client - Marketing Agency', date: '14 Oct', amount: 3200, type: 'credit', category: 'Ventes' },
  { id: 5, label: 'Abonnement Logiciel SaaS', date: '12 Oct', amount: -149, type: 'debit', category: 'Logiciels' },
  { id: 6, label: 'Remboursement Note de Frais', date: '10 Oct', amount: -85, type: 'debit', category: 'RH' },
];

const CashFlowView: React.FC<CashFlowViewProps> = ({ chartData }) => {
  const [viewMode, setViewMode] = useState<'realized' | 'forecast'>('realized');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Trésorerie</h2>
          <p className="text-gray-500 text-sm mt-1">
             {viewMode === 'realized' 
                ? 'Suivi des flux réels et solde bancaire actuel'
                : 'Anticipez votre trésorerie avec le moteur de scénarios'
             }
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Mode Switcher */}
          <div className="bg-gray-100 p-1 rounded-lg flex items-center shadow-inner">
             <button 
                onClick={() => setViewMode('realized')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                    viewMode === 'realized' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
             >
                <Icons.Cash size={16} />
                Réalisé
             </button>
             <button 
                onClick={() => setViewMode('forecast')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                    viewMode === 'forecast' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
             >
                <Icons.Forecast size={16} />
                Prévisionnel
             </button>
          </div>

          <div className="h-6 w-px bg-gray-200 mx-1"></div>

          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm">
            <Icons.Plus size={16} />
            <span className="hidden sm:inline">Opération</span>
          </button>
        </div>
      </header>

      {viewMode === 'realized' ? (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* KPI Cards */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
                    <Icons.Cash size={24} weight="duotone" />
                    </div>
                    <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                    <Icons.TrendUp className="mr-1" /> +12%
                    </span>
                </div>
                <div className="mt-4">
                    <p className="text-sm text-gray-500 font-medium">Solde actuel</p>
                    <p className="text-3xl font-bold text-gray-900 tracking-tight mt-1">24 500 €</p>
                </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <Icons.Income size={24} weight="duotone" />
                    </div>
                    <span className="text-gray-400 text-xs font-medium">Ce mois</span>
                </div>
                <div className="mt-4">
                    <p className="text-sm text-gray-500 font-medium">Entrées</p>
                    <p className="text-3xl font-bold text-gray-900 tracking-tight mt-1">+18 240 €</p>
                </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                    <Icons.Expense size={24} weight="duotone" />
                    </div>
                    <span className="text-gray-400 text-xs font-medium">Ce mois</span>
                </div>
                <div className="mt-4">
                    <p className="text-sm text-gray-500 font-medium">Sorties</p>
                    <p className="text-3xl font-bold text-gray-900 tracking-tight mt-1">-12 350 €</p>
                </div>
                </div>
            </div>

            <CashFlowChart data={chartData} />

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-gray-900">Dernières transactions</h3>
                <div className="relative">
                    <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                    type="text" 
                    placeholder="Rechercher une opération..." 
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    />
                </div>
                </div>
                
                <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Libellé</th>
                        <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Catégorie</th>
                        <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Montant</th>
                        <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {TRANSACTIONS.map((tx) => (
                        <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                        <td className="py-4 px-6 text-sm text-gray-600">{tx.date}</td>
                        <td className="py-4 px-6 text-sm font-medium text-gray-900">{tx.label}</td>
                        <td className="py-4 px-6 text-sm text-gray-500">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {tx.category}
                            </span>
                        </td>
                        <td className={`py-4 px-6 text-sm font-bold text-right ${tx.type === 'credit' ? 'text-emerald-600' : 'text-gray-900'}`}>
                            {tx.type === 'credit' ? '+' : ''}{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(tx.amount)}
                        </td>
                        <td className="py-4 px-6 text-center">
                            <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100">
                            <Icons.More size={20} weight="bold" />
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-center">
                <button className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                    Voir tout l'historique
                </button>
                </div>
            </div>
        </>
      ) : (
        <CashFlowForecast />
      )}
    </div>
  );
};

export default CashFlowView;