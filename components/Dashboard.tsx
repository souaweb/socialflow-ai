
import React, { useState, useEffect } from 'react';
import { SocialAccount, ActivityLog, Platform } from '../types';
import { Instagram, Facebook, MessageCircle, Video, Play, Plus, Zap, TrendingUp, Users, Target, Trash2, Smartphone } from 'lucide-react';
import { dbService } from '../services/dbService';

interface DashboardProps {
  // Added businessId to props to pass to getStats
  businessId: string;
  accounts: SocialAccount[];
  logs: ActivityLog[];
  onConnect: (platform: Platform) => void;
  onDeleteAccount: (id: string) => void;
}

const platformConfig: Record<string, { icon: React.ReactNode, color: string, label: string }> = {
  instagram: { icon: <Instagram size={20} />, color: 'text-pink-500', label: 'Instagram' },
  facebook: { icon: <Facebook size={20} />, color: 'text-blue-600', label: 'Facebook' },
  tiktok: { icon: <Video size={20} />, color: 'text-slate-900', label: 'TikTok' },
  youtube: { icon: <Play size={20} />, color: 'text-red-600', label: 'YouTube' },
  whatsapp: { icon: <MessageCircle size={20} />, color: 'text-emerald-500', label: 'WhatsApp' },
  kwai: { icon: <div className="font-bold">K</div>, color: 'text-orange-500', label: 'Kwai' },
};

export const Dashboard: React.FC<DashboardProps> = ({ businessId, accounts, logs, onConnect, onDeleteAccount }) => {
  const [stats, setStats] = useState({ totalInteractions: 0, conversionRate: 0, hotLeads: 0, aiInteractions: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      // Fix: dbService.getStats requires businessId argument
      const s = await dbService.getStats(businessId);
      setStats(s);
    };
    fetchStats();
  }, [logs, businessId]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600"><TrendingUp size={28} /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vendas/Interações</p>
            <p className="text-2xl font-black text-slate-800">{stats.totalInteractions.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600"><Target size={28} /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Conversão IA</p>
            <p className="text-2xl font-black text-slate-800">{stats.conversionRate}%</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600"><Users size={28} /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Leads Quentes</p>
            <p className="text-2xl font-black text-slate-800">{stats.hotLeads}</p>
          </div>
        </div>
        <div className="bg-slate-900 p-6 rounded-[2rem] shadow-xl flex items-center gap-4 text-white">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white"><Zap size={28} /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">IA Operando</p>
            <p className="text-2xl font-black">{stats.aiInteractions}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Grade de Seleção de Redes */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Plus size={18} className="text-indigo-600" /> Adicionar Novo Canal
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {(Object.keys(platformConfig) as Platform[]).map((p) => (
                <button 
                  key={p}
                  onClick={() => onConnect(p)}
                  className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-100 rounded-3xl hover:border-indigo-500 hover:bg-white hover:shadow-xl transition-all group active:scale-95"
                >
                  <div className={`${platformConfig[p].color} mb-3 group-hover:scale-110 transition-transform`}>
                    {platformConfig[p].icon}
                  </div>
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">{platformConfig[p].label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Listagem de Contas */}
          <section>
            <div className="flex items-center justify-between mb-4 px-2">
               <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Canais Conectados ({accounts.length})</h2>
            </div>
            {accounts.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center">
                 <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <Smartphone size={32} />
                 </div>
                 <p className="text-slate-400 text-sm font-medium">Nenhuma conta ativa no momento.</p>
                 <p className="text-[10px] text-slate-300 uppercase mt-1">Conecte uma rede social acima para começar</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {accounts.map((acc) => (
                  <div key={acc.id} className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center justify-between group hover:shadow-lg transition-all border-l-4 border-l-indigo-500">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 bg-slate-50 rounded-2xl ${platformConfig[acc.platform].color}`}>
                        {platformConfig[acc.platform].icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm">{acc.username}</h3>
                        <div className="flex items-center gap-2">
                           <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                           <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Ativo e Monitorando</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => onDeleteAccount(acc.id)}
                      className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                      title="Desconectar Conta"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Webhook Monitor */}
          <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <Zap size={18} className="text-indigo-600" /> Fluxo de Atendimento em Tempo Real
              </h2>
              <span className="text-[10px] font-black text-emerald-500 animate-pulse bg-emerald-50 px-3 py-1 rounded-full uppercase">Live</span>
            </div>
            <div className="divide-y divide-slate-50 max-h-[400px] overflow-y-auto bg-slate-50/30">
              {logs.length === 0 ? (
                <div className="p-20 text-center opacity-40">Aguardando gatilhos...</div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="p-6 flex gap-4 hover:bg-white transition-colors animate-in slide-in-from-top-4">
                    <div className="mt-1 flex-shrink-0 text-slate-400">{platformConfig[log.platform]?.icon || <Zap size={18}/>}</div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-bold text-sm text-slate-800">{log.user}</span>
                        <span className="text-[10px] text-slate-400 font-bold">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-3 italic">"{log.content}"</p>
                      {log.aiResponse && (
                        <div className="bg-indigo-600 p-4 rounded-2xl text-white shadow-lg shadow-indigo-100 relative">
                          <div className="absolute -top-2 -left-2 bg-white text-indigo-600 p-1 rounded-lg border border-indigo-100 shadow-sm">
                            <Zap size={10} />
                          </div>
                          <p className="text-[10px] font-bold text-indigo-200 mb-1 uppercase tracking-tighter">IA Especialista (Resposta Enviada)</p>
                          <p className="text-xs font-medium leading-relaxed">{log.aiResponse}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Status */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
            <h3 className="text-lg font-bold mb-6">Status dos Workers</h3>
            <div className="space-y-5">
              <div className="flex justify-between items-center text-sm">
                <div className="flex flex-col">
                   <span className="text-slate-400 text-[10px] uppercase font-bold">Banco de Dados</span>
                   <span className="font-medium text-white">Sincronizado</span>
                </div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_#34d399]"></div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex flex-col">
                   <span className="text-slate-400 text-[10px] uppercase font-bold">Respostas IA</span>
                   <span className="font-medium text-white">Latência 1.2s</span>
                </div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex flex-col">
                   <span className="text-slate-400 text-[10px] uppercase font-bold">Tráfego Webhook</span>
                   <span className="font-medium text-white">Ativo (200 OK)</span>
                </div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl">
             <h3 className="font-bold mb-4">Dica do Especialista</h3>
             <p className="text-xs text-indigo-100 leading-relaxed mb-4">
               "Sua IA converte melhor quando você ensina sobre <strong>Preços</strong> e <strong>Prazos</strong> na aba de Treinamento."
             </p>
             <button className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all">
               Otimizar Agora
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
