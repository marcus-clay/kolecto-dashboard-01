import React, { useState } from 'react';
import { Icons } from './Icons';

// Extended type for mock data
interface InvoiceLine {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface Invoice {
  id: string;
  client: string;
  date: string;
  due: string;
  amount: number;
  status: string;
  address?: string;
  items?: InvoiceLine[];
}

const INVOICES: Invoice[] = [
  { 
    id: 'INV-2023-001', 
    client: 'TechSolutions SAS', 
    date: '10 Oct 2023', 
    due: '10 Nov 2023', 
    amount: 4500, 
    status: 'paid',
    address: '12 Rue de la Paix, 75002 Paris',
    items: [
      { id: 1, description: 'Développement Web Frontend', quantity: 5, unitPrice: 600 },
      { id: 2, description: 'Design UI/UX', quantity: 2, unitPrice: 750 },
    ]
  },
  { 
    id: 'INV-2023-004', 
    client: 'Studio Design', 
    date: '01 Oct 2023', 
    due: '31 Oct 2023', 
    amount: 1200, 
    status: 'overdue',
    address: '45 Avenue de la République, 69002 Lyon',
    items: [
      { id: 1, description: 'Consultation Branding', quantity: 1, unitPrice: 1200 },
    ]
  },
  { 
    id: 'INV-2023-005', 
    client: 'Marketing Agency', 
    date: '25 Oct 2023', 
    due: '25 Nov 2023', 
    amount: 3200, 
    status: 'pending',
    address: '8 Boulevard Haussmann, 75009 Paris',
    items: [
      { id: 1, description: 'Campagne Social Media Octobre', quantity: 1, unitPrice: 2000 },
      { id: 2, description: 'Création de contenu (Posts)', quantity: 8, unitPrice: 150 },
    ]
  },
  { id: 'INV-2023-006', client: 'Consulting Corp', date: '28 Oct 2023', due: '28 Nov 2023', amount: 850, status: 'pending' },
  { id: 'INV-2023-007', client: 'Startup Inc', date: '15 Sep 2023', due: '15 Oct 2023', amount: 2100, status: 'overdue' },
  { id: 'INV-2023-008', client: 'Boulangerie Patisserie', date: '30 Oct 2023', due: '30 Nov 2023', amount: 450, status: 'draft' },
];

const InvoicesView: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showReminderModal, setShowReminderModal] = useState(false);

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'paid': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'overdue': return 'bg-red-50 text-red-700 border-red-200';
      case 'draft': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'paid': return 'Payée';
      case 'pending': return 'En attente';
      case 'overdue': return 'En retard';
      case 'draft': return 'Brouillon';
      default: return status;
    }
  };

  const filteredInvoices = filter === 'all' ? INVOICES : INVOICES.filter(inv => inv.status === filter);

  const totalOverdue = INVOICES.filter(i => i.status === 'overdue').reduce((acc, curr) => acc + curr.amount, 0);
  const totalPending = INVOICES.filter(i => i.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0);

  const handleExportCSV = () => {
    // CSV Headers
    const headers = ['Numéro', 'Client', 'Date', 'Échéance', 'Montant', 'Statut'];
    
    // Convert data to CSV rows
    const rows = filteredInvoices.map(inv => [
      inv.id,
      `"${inv.client}"`, // Quote client name to handle commas
      inv.date,
      inv.due,
      inv.amount,
      getStatusLabel(inv.status)
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `factures_export_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendReminder = () => {
      // Logic to send email would go here
      setShowReminderModal(false);
      // Optional: Add a toast notification here
  };

  // Helper to get items or default items if missing in mock
  const getInvoiceItems = (inv: Invoice) => {
    if (inv.items) return inv.items;
    // Fallback mock items
    return [
        { id: 1, description: 'Prestation de services (Forfait)', quantity: 1, unitPrice: inv.amount }
    ];
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
       <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Factures</h2>
          <p className="text-gray-500 text-sm mt-1">Gérez vos factures clients et suivez les paiements</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Icons.Download size={16} />
            Exporter CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm shadow-primary-200">
            <Icons.Plus size={16} weight="bold" />
            Créer une facture
          </button>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-red-100 shadow-sm flex items-center justify-between">
           <div>
              <p className="text-sm text-gray-500 font-medium">Impayés (&gt; 30j)</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalOverdue)}</p>
           </div>
           <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
              <Icons.Warning size={20} weight="duotone" />
           </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm flex items-center justify-between">
           <div>
              <p className="text-sm text-gray-500 font-medium">À venir</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalPending)}</p>
           </div>
           <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <Icons.Clock size={20} weight="duotone" />
           </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
         {/* Tabs & Filter */}
         <div className="border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg self-start">
               {['all', 'pending', 'overdue', 'paid', 'draft'].map((tab) => (
                   <button
                     key={tab}
                     onClick={() => setFilter(tab)}
                     className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                         filter === tab 
                         ? 'bg-white text-gray-900 shadow-sm' 
                         : 'text-gray-500 hover:text-gray-700'
                     }`}
                   >
                       {tab === 'all' ? 'Tout' : getStatusLabel(tab)}
                   </button>
               ))}
            </div>
            <div className="flex items-center gap-3">
               <div className="relative">
                 <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                 <input 
                   type="text" 
                   placeholder="Rechercher..." 
                   className="pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm w-48 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                 />
               </div>
               <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg border border-transparent hover:border-gray-200 transition-all">
                  <Icons.Filter size={18} />
               </button>
            </div>
         </div>

         {/* Table */}
         <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                     <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Numéro</th>
                     <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                     <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                     <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Échéance</th>
                     <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Montant</th>
                     <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Statut</th>
                     <th className="py-3 px-6 w-10"></th>
                  </tr>
               </thead>
               <tbody>
                  {filteredInvoices.map((inv) => (
                     <tr 
                        key={inv.id} 
                        onClick={() => setSelectedInvoice(inv)}
                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors group cursor-pointer"
                     >
                        <td className="py-4 px-6 text-sm font-medium text-gray-900">{inv.id}</td>
                        <td className="py-4 px-6 text-sm text-gray-600 font-medium">{inv.client}</td>
                        <td className="py-4 px-6 text-sm text-gray-500">{inv.date}</td>
                        <td className="py-4 px-6 text-sm text-gray-500">{inv.due}</td>
                        <td className="py-4 px-6 text-sm font-bold text-gray-900 text-right">
                           {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(inv.amount)}
                        </td>
                        <td className="py-4 px-6 text-center">
                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(inv.status)}`}>
                              {getStatusLabel(inv.status)}
                           </span>
                        </td>
                        <td className="py-4 px-6 text-center relative">
                           <button className="text-gray-400 hover:text-gray-600 p-1.5 rounded hover:bg-white hover:shadow-sm transition-all opacity-0 group-hover:opacity-100">
                              <Icons.More size={20} weight="bold" />
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         
         <div className="border-t border-gray-100 p-4 bg-gray-50 flex items-center justify-between">
            <span className="text-xs text-gray-500">{filteredInvoices.length} factures</span>
            <div className="flex gap-1">
               <button className="p-1 text-gray-400 hover:text-gray-900"><Icons.CaretRight size={14} className="rotate-180"/></button>
               <button className="p-1 text-gray-400 hover:text-gray-900"><Icons.CaretRight size={14} /></button>
            </div>
         </div>
      </div>

      {/* Invoice Detail Slide-over */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-40 flex justify-end" role="dialog">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm transition-opacity" 
                onClick={() => setSelectedInvoice(null)}
            ></div>
            
            {/* Panel */}
            <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                            <Icons.Receipt size={24} weight="duotone" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{selectedInvoice.id}</h3>
                            <p className="text-xs text-gray-500">Créée le {selectedInvoice.date}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                         <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(selectedInvoice.status)}`}>
                              {getStatusLabel(selectedInvoice.status)}
                         </span>
                        <button 
                            onClick={() => setSelectedInvoice(null)}
                            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors ml-2"
                        >
                            <Icons.Close size={20} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    
                    {/* Addresses */}
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">De</p>
                            <p className="text-sm font-semibold text-gray-900">SARL Durand</p>
                            <p className="text-sm text-gray-500 mt-1">
                                14 Avenue des Champs-Élysées<br/>
                                75008 Paris<br/>
                                France
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Pour</p>
                            <p className="text-sm font-semibold text-gray-900">{selectedInvoice.client}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                {selectedInvoice.address || 'Adresse non renseignée'}
                            </p>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-4 border border-gray-100">
                         <div>
                            <p className="text-xs text-gray-500 mb-1">Date d'émission</p>
                            <p className="text-sm font-medium text-gray-900">{selectedInvoice.date}</p>
                         </div>
                         <div>
                            <p className="text-xs text-gray-500 mb-1">Date d'échéance</p>
                            <p className="text-sm font-medium text-gray-900">{selectedInvoice.due}</p>
                         </div>
                    </div>

                    {/* Line Items */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-4">Détails</h4>
                        <table className="w-full text-sm">
                            <thead className="text-gray-500 border-b border-gray-200">
                                <tr>
                                    <th className="text-left font-medium py-2 w-1/2">Description</th>
                                    <th className="text-right font-medium py-2">Qté</th>
                                    <th className="text-right font-medium py-2">Prix unitaire</th>
                                    <th className="text-right font-medium py-2">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {getInvoiceItems(selectedInvoice).map((item) => (
                                    <tr key={item.id}>
                                        <td className="py-3 text-gray-900">{item.description}</td>
                                        <td className="py-3 text-right text-gray-600">{item.quantity}</td>
                                        <td className="py-3 text-right text-gray-600">{item.unitPrice} €</td>
                                        <td className="py-3 text-right font-medium text-gray-900">
                                            {item.quantity * item.unitPrice} €
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end">
                        <div className="w-1/2 space-y-2">
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Sous-total HT</span>
                                <span>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(selectedInvoice.amount * 0.8)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>TVA (20%)</span>
                                <span>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(selectedInvoice.amount * 0.2)}</span>
                            </div>
                            <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                                <span>Total TTC</span>
                                <span>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(selectedInvoice.amount)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between gap-3">
                    {selectedInvoice.status === 'overdue' ? (
                        <>
                             <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors shadow-sm">
                                <Icons.Download size={18} />
                                PDF
                            </button>
                            <button 
                                onClick={() => setShowReminderModal(true)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 rounded-xl text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
                            >
                                <Icons.Send size={18} weight="fill" />
                                Relancer le client
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors shadow-sm">
                                <Icons.Printer size={18} />
                                Imprimer
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors shadow-sm">
                                <Icons.Envelope size={18} />
                                Email
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 rounded-xl text-sm font-medium text-white hover:bg-primary-700 transition-colors shadow-sm">
                                <Icons.Download size={18} />
                                PDF
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
      )}

      {/* Reminder Modal */}
      {showReminderModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             {/* Backdrop */}
             <div 
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
                onClick={() => setShowReminderModal(false)}
            ></div>

            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                <div className="mb-6 text-center">
                    <div className="mx-auto w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-4">
                        <Icons.Send size={24} weight="duotone" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Relance amiable</h3>
                    <p className="text-gray-500 text-sm mt-1">Facture {selectedInvoice.id} • {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(selectedInvoice.amount)}</p>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="flex gap-4">
                        <div className="mt-0.5 text-gray-400">
                            <Icons.Alert size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">Le problème</p>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Cette facture est arrivée à échéance le <span className="font-medium text-gray-700">{selectedInvoice.due}</span>. Le client n'a pas encore initié le paiement.
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="mt-0.5 text-gray-400">
                            <Icons.Envelope size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">Notre solution</p>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Nous allons envoyer un email courtois rappelant les détails de la facture avec un lien de paiement direct, facilitant la régularisation.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                         <div className="mt-0.5 text-gray-400">
                            <Icons.CheckCircle size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">La suite</p>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Vous serez notifié dès que le client ouvre l'email ou effectue le paiement. La plupart des retards se règlent après cette première relance.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={() => setShowReminderModal(false)}
                        className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Annuler
                    </button>
                    <button 
                        onClick={handleSendReminder}
                        className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100"
                    >
                        Envoyer la relance
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesView;