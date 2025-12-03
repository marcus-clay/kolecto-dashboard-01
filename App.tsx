import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import HealthGauge from './components/HealthGauge';
import MetricCard from './components/MetricCard';
import CashFlowChart from './components/CashFlowChart';
import AlertsPanel from './components/AlertsPanel';
import CashFlowView from './components/CashFlowView';
import InvoicesView from './components/InvoicesView';
import CustomersView from './components/CustomersView';
import { Icons } from './components/Icons';
import { FinancialMetric, Alert, CashFlowDataPoint, HealthScoreData } from './types';

// Mock Data
const MOCK_METRICS: FinancialMetric[] = [
  {
    id: 'cash',
    label: 'Trésorerie Disponible',
    value: 24500,
    unit: '€',
    trendValue: 12,
    trendDirection: 'up',
    trendLabel: 'vs mois dernier',
    status: 'good'
  },
  {
    id: 'overdue',
    label: 'Factures en Retard',
    value: 3200,
    unit: '€',
    trendValue: 5,
    trendDirection: 'up', // 'up' in bad metric means it increased (bad)
    trendLabel: 'vs mois dernier',
    status: 'warning'
  },
  {
    id: 'receivables',
    label: 'Encaissements à venir',
    value: 12800,
    unit: '€',
    trendValue: 2,
    trendDirection: 'neutral',
    trendLabel: 'vs mois dernier',
    status: 'neutral'
  }
];

const MOCK_ALERTS: Alert[] = [
  {
    id: '1',
    type: 'danger',
    title: 'Retards Critiques',
    description: '3 factures client dépassent 30 jours de retard pour un total de 1 200€.',
    actionLabel: 'Relancer en 1 clic'
  },
  {
    id: '2',
    type: 'warning',
    title: 'Solde bas prévu',
    description: 'Votre solde pourrait passer sous le seuil de 5k€ le 15 du mois.',
    actionLabel: 'Voir le prévisionnel'
  }
];

const MOCK_CHART_DATA: CashFlowDataPoint[] = [
  { date: 'Jan', amount: 18000, expenses: 15000 },
  { date: 'Fév', amount: 22000, expenses: 16000 },
  { date: 'Mar', amount: 19000, expenses: 21000 },
  { date: 'Avr', amount: 24000, expenses: 14000 },
  { date: 'Mai', amount: 23500, expenses: 18000 },
  { date: 'Juin', amount: 24500, expenses: 15000 },
];

const MOCK_HEALTH: HealthScoreData = {
  score: 72,
  factors: [
    { label: 'Trésorerie stable', impact: 'positive' },
    { label: 'Délai paiement client élevé', impact: 'negative' },
    { label: 'Charges fixes maîtrisées', impact: 'positive' },
  ]
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [timeRange, setTimeRange] = useState('Mois en cours');

  const renderContent = () => {
    switch(currentView) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            {/* Left Column: Metrics & Chart */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Key Metrics Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 {MOCK_METRICS.map((metric) => (
                   <div key={metric.id} className="h-full">
                     <MetricCard 
                        metric={metric} 
                        icon={
                            metric.id === 'cash' ? Icons.Cash : 
                            metric.id === 'overdue' ? Icons.Warning : Icons.Receipt
                        } 
                     />
                   </div>
                 ))}
              </div>

              {/* Main Chart */}
              <CashFlowChart data={MOCK_CHART_DATA} />

              {/* Quick Actions (Concepts) */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 shadow-md text-white flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                      <h3 className="text-lg font-bold mb-1">Besoin de financement ?</h3>
                      <p className="text-primary-100 text-sm max-w-md">
                          Votre profil de santé financière vous rend éligible à un financement de trésorerie instantané.
                      </p>
                  </div>
                  <button className="bg-white text-primary-700 px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-primary-50 transition-colors shadow-sm whitespace-nowrap">
                      Tester mon éligibilité
                  </button>
              </div>
            </div>

            {/* Right Column: Health Score & Alerts */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* Health Score Component */}
                <div className="h-[340px]">
                    <HealthGauge data={MOCK_HEALTH} />
                </div>

                {/* Alerts List */}
                <div className="flex-1 min-h-[300px]">
                    <AlertsPanel alerts={MOCK_ALERTS} />
                </div>
            </div>
          </div>
        );
      case 'cash':
        return <CashFlowView chartData={MOCK_CHART_DATA} />;
      case 'invoices':
        return <InvoicesView />;
      case 'customers':
        return <CustomersView />;
      default:
        return <div>Vue en construction</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      
      <main className="lg:pl-64 min-h-screen transition-all duration-300">
        <div className="max-w-[1280px] mx-auto p-4 sm:p-6 lg:p-8">
          
          {/* Header - Only show on Dashboard for greetings, customized for others in components */}
          {currentView === 'dashboard' && (
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                  Bonjour, Jean 👋
                </h1>
                <p className="text-gray-500 mt-1">
                  Voici la santé financière de <span className="font-medium text-gray-700">SARL Durand</span> au {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}.
                </p>
              </div>
              
              <div className="flex items-center gap-3 bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
                  {['Mois en cours', 'Trimestre', 'Année'].map((range) => (
                      <button
                          key={range}
                          onClick={() => setTimeRange(range)}
                          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                              timeRange === range 
                              ? 'bg-gray-900 text-white shadow-sm' 
                              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                      >
                          {range}
                      </button>
                  ))}
              </div>
            </header>
          )}

          {/* Main Content Area */}
          {renderContent()}
          
        </div>
      </main>
    </div>
  );
};

export default App;