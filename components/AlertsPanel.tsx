import React from 'react';
import { Alert } from '../types';
import { Icons } from './Icons';

interface AlertsPanelProps {
  alerts: Alert[];
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-gray-900 font-semibold text-lg flex items-center">
            <Icons.Lightning weight="duotone" className="text-amber-500 mr-2" size={20} />
            Actions Prioritaires
        </h3>
        <span className="bg-amber-50 text-amber-700 text-xs font-bold px-2 py-1 rounded-full">
            {alerts.length}
        </span>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-start p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group">
            <div className={`mt-0.5 p-1.5 rounded-full flex-shrink-0 ${
              alert.type === 'danger' ? 'bg-red-100 text-red-600' : 
              alert.type === 'warning' ? 'bg-amber-100 text-amber-600' : 
              'bg-blue-100 text-blue-600'
            }`}>
              {alert.type === 'danger' ? <Icons.Warning size={14} weight="bold" /> : <Icons.Warning size={14} weight="bold" />}
            </div>
            
            <div className="ml-3 flex-1">
              <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary-700 transition-colors">
                {alert.title}
              </h4>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                {alert.description}
              </p>
              {alert.actionLabel && (
                  <button className="mt-2 text-xs font-semibold text-primary-600 hover:text-primary-800 flex items-center">
                    {alert.actionLabel}
                    <Icons.CaretRight size={12} className="ml-1" />
                  </button>
              )}
            </div>
          </div>
        ))}

        {alerts.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">
                Aucune alerte en cours. Tout va bien !
            </div>
        )}
      </div>
      
      <button className="w-full mt-4 py-2 text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors border-t border-gray-100">
        Voir toutes les notifications
      </button>
    </div>
  );
};

export default AlertsPanel;