import React from 'react';
import { Icons } from './Icons';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard', icon: Icons.Dashboard, label: 'Tableau de bord' },
    { id: 'cash', icon: Icons.Cash, label: 'Trésorerie' },
    { id: 'invoices', icon: Icons.Invoices, label: 'Factures' },
    { id: 'customers', icon: Icons.Customers, label: 'Clients' },
  ];

  const bottomItems = [
    { id: 'settings', icon: Icons.Settings, label: 'Paramètres' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 z-50">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
           <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md shadow-primary-200">
                B
           </div>
           <span className="font-bold text-xl text-gray-900 tracking-tight">Bankee</span>
        </div>
        
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gray-50 text-gray-900 shadow-sm ring-1 ring-gray-200'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <item.icon 
                  size={18} 
                  weight={isActive ? "fill" : "regular"} 
                  className={isActive ? "text-primary-600" : "text-gray-400"}
                />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-gray-100">
         <div className="mb-4 px-3 py-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-gray-700">Synchro active</span>
            </div>
            <p className="text-xs text-gray-400">Dernière maj: il y a 2 min</p>
         </div>

         <nav className="space-y-1">
          {bottomItems.map((item) => (
            <button
              key={item.id}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <item.icon size={18} weight="regular" />
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-100">
            <img src="https://picsum.photos/seed/felix/32/32" alt="User" className="w-8 h-8 rounded-full bg-gray-200 border border-gray-100" />
            <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">Jean D.</span>
                <span className="text-xs text-gray-500">SARL Durand</span>
            </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;