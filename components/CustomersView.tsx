import React from 'react';
import { Icons } from './Icons';

const CUSTOMERS = [
  { id: 1, name: 'TechSolutions SAS', contact: 'Jean Dupont', email: 'j.dupont@tech.com', outstanding: 4500, dso: 45, status: 'good' },
  { id: 2, name: 'Studio Design', contact: 'Marie Martin', email: 'marie@studio.com', outstanding: 1200, dso: 65, status: 'warning' },
  { id: 3, name: 'Marketing Agency', contact: 'Pierre Duris', email: 'p.duris@marketing.agency', outstanding: 3200, dso: 28, status: 'good' },
  { id: 4, name: 'Consulting Corp', contact: 'Sophie Bernard', email: 's.bernard@consulting.com', outstanding: 850, dso: 32, status: 'good' },
  { id: 5, name: 'Startup Inc', contact: 'Luc Besson', email: 'luc@startup.io', outstanding: 2100, dso: 90, status: 'danger' },
];

const CustomersView: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Clients</h2>
          <p className="text-gray-500 text-sm mt-1">Répertoire client et suivi des comportements de paiement</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm shadow-primary-200">
          <Icons.Plus size={16} weight="bold" />
          Ajouter un client
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Quick Stats */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
             <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="bg-indigo-50 text-indigo-600 p-3 rounded-lg">
                    <Icons.Customers size={24} weight="duotone" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-gray-900">24</p>
                    <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Clients Actifs</p>
                </div>
             </div>
             <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="bg-amber-50 text-amber-600 p-3 rounded-lg">
                    <Icons.Clock size={24} weight="duotone" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-gray-900">42j</p>
                    <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Délai moyen (DSO)</p>
                </div>
             </div>
             <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg">
                    <Icons.CheckCircle size={24} weight="duotone" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-gray-900">92%</p>
                    <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Score de fiabilité</p>
                </div>
             </div>
          </div>

          {/* Customer List */}
          <div className="lg:col-span-4 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
             <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="relative max-w-sm w-full">
                    <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Rechercher un client, SIRET..." 
                      className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                        <Icons.Filter size={20} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                        <Icons.Download size={20} />
                    </button>
                </div>
             </div>
             
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Société</th>
                            <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                            <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Encours</th>
                            <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Délai Payeur</th>
                            <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {CUSTOMERS.map((customer) => (
                            <tr key={customer.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                                <td className="py-4 px-6">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs mr-3">
                                            {customer.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900">{customer.name}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-900">{customer.contact}</span>
                                        <span className="text-xs text-gray-400">{customer.email}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <span className="text-sm font-medium text-gray-900">
                                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(customer.outstanding)}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                                        customer.status === 'good' ? 'bg-emerald-50 text-emerald-700' :
                                        customer.status === 'warning' ? 'bg-amber-50 text-amber-700' :
                                        'bg-red-50 text-red-700'
                                    }`}>
                                        {customer.dso} jours
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors" title="Envoyer email">
                                            <Icons.Envelope size={18} />
                                        </button>
                                        <button className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors" title="Voir fiche">
                                            <Icons.CaretRight size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
          </div>
      </div>
    </div>
  );
};

export default CustomersView;