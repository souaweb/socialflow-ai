
import React from 'react';
import { Lead } from '../types';
import { TrendingUp, DollarSign, Target, PieChart, ArrowUpRight, ArrowDownRight, Users, MessageSquare } from 'lucide-react';

interface ReportsProps {
  businessId: string;
  leads: Lead[];
}

export const Reports: React.FC<ReportsProps> = ({ leads }) => {
  const hotLeadsCount = leads.filter(l => l.status === 'hot').length;
  const estimatedRevenue = hotLeadsCount * 497; // Ticket médio simulado

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full"></div>
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Faturamento Estimado</p>
          <div className="flex items-end gap-2 mb-4">
            <h3 className="text-3xl font-black">R$ {estimatedRevenue.toLocaleString()}</h3>
            <span className="text-emerald-400 text-xs font-bold flex items-center gap-1 mb-1"><ArrowUpRight size={14}/> +12%</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">Projeção baseada em leads "Quentes" qualificados pela IA este mês.</p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Custo por Lead (CPL)</p>
          <div className="flex items-end gap-2 mb-4">
            <h3 className="text-3xl font-black text-slate-800">R$ 4,12</h3>
            <span className="text-red-400 text-xs font-bold flex items-center gap-1 mb-1"><ArrowDownRight size={14}/> -3%</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">Melhoria de performance via automação de respostas orgânicas.</p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">ROI de Automação</p>
          <div className="flex items-end gap-2 mb-4">
            <h3 className="text-3xl font-black text-slate-800">8.4x</h3>
            <span className="text-emerald-400 text-xs font-bold flex items-center gap-1 mb-1"><ArrowUpRight size={14}/> +2.1</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">Retorno sobre cada real investido em créditos de IA.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Canais (Simulado) */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><PieChart size={18} className="text-indigo-600"/> Origem dos Leads</h3>
              <select className="bg-slate-50 border-none text-[10px] font-bold uppercase rounded-lg px-2 py-1 outline-none">
                 <option>Últimos 30 dias</option>
                 <option>Última semana</option>
              </select>
           </div>
           
           <div className="space-y-6">
              {[
                { platform: 'WhatsApp', value: 65, color: 'bg-emerald-500' },
                { platform: 'Instagram', value: 25, color: 'bg-pink-500' },
                { platform: 'Facebook', value: 10, color: 'bg-blue-600' }
              ].map(item => (
                <div key={item.platform} className="space-y-2">
                   <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight">
                      <span className="text-slate-500">{item.platform}</span>
                      <span className="text-slate-800">{item.value}%</span>
                   </div>
                   <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{width: `${item.value}%`}}></div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Funil de Vendas */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
           <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-8"><Target size={18} className="text-indigo-600"/> Funil de Conversão IA</h3>
           
           <div className="flex flex-col gap-1">
              <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded-xl flex justify-between items-center mb-2">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center"><MessageSquare size={14}/></div>
                   <span className="text-xs font-bold text-indigo-900">Mensagens Recebidas</span>
                 </div>
                 <span className="text-sm font-black">2.481</span>
              </div>
              <div className="bg-indigo-100/50 border-l-4 border-indigo-400 p-4 rounded-xl flex justify-between items-center mb-2 ml-4">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-indigo-400 text-white rounded-lg flex items-center justify-center"><Users size={14}/></div>
                   <span className="text-xs font-bold text-indigo-800">Leads Identificados</span>
                 </div>
                 <span className="text-sm font-black">412</span>
              </div>
              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-xl flex justify-between items-center ml-8">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-emerald-500 text-white rounded-lg flex items-center justify-center"><DollarSign size={14}/></div>
                   <span className="text-xs font-bold text-emerald-900">Vendas Convertidas</span>
                 </div>
                 <span className="text-sm font-black">58</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
