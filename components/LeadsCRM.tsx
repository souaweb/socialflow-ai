
import React from 'react';
import { Lead } from '../types';
import { MoreVertical, Phone, Mail, Instagram, MessageCircle, AlertCircle } from 'lucide-react';

interface LeadsCRMProps {
  leads: Lead[];
}

export const LeadsCRM: React.FC<LeadsCRMProps> = ({ leads }) => {
  const statusColors = {
    hot: 'bg-red-100 text-red-700 border-red-200',
    warm: 'bg-orange-100 text-orange-700 border-orange-200',
    cold: 'bg-blue-100 text-blue-700 border-blue-200',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-400 font-bold uppercase">Total Leads</p>
            <p className="text-xl font-bold text-slate-800">154</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-400 font-bold uppercase">Taxa de Conversão</p>
            <p className="text-xl font-bold text-emerald-600">22%</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Lead</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status IA</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Última Interação</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Resumo da IA</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {leads.map(lead => (
              <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold">{lead.name[0]}</div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{lead.name}</p>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        {lead.platform === 'instagram' ? <Instagram size={10} /> : <MessageCircle size={10} />}
                        <span className="capitalize">{lead.platform}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${statusColors[lead.status]}`}>
                    {lead.status === 'hot' ? '🔥 Quente' : lead.status === 'warm' ? '☀️ Morno' : '❄️ Frio'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(lead.lastInteraction).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 max-w-xs">
                  <p className="text-xs text-slate-600 line-clamp-2 italic">"{lead.summary}"</p>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Phone size={16} /></button>
                    <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><MessageCircle size={16} /></button>
                    <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><MoreVertical size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-4 rounded-xl border border-amber-100">
        <AlertCircle size={14} />
        A IA identifica automaticamente a temperatura do lead baseada na análise de sentimento e palavras-chave de intenção de compra.
      </div>
    </div>
  );
};
