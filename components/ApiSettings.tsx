
import React, { useState, useEffect } from 'react';
// Added Loader2 and QrCode to the imports
import { Shield, Key, Globe, Bell, Save, CheckCircle2, AlertCircle, CreditCard, Receipt, Calendar, ArrowRight, Wallet, Loader2, QrCode } from 'lucide-react';
import { dbService } from '../services/dbService';
import { Transaction, User } from '../types';

export const ApiSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'api' | 'billing'>('api');
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [tokens, setTokens] = useState({
    meta_token: localStorage.getItem('meta_token') || '',
    whatsapp_id: localStorage.getItem('whatsapp_id') || '',
    tiktok_client_key: localStorage.getItem('tiktok_client_key') || '',
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setUser(dbService.getCurrentUser());
    setTransactions(dbService.getTransactions());
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem('meta_token', tokens.meta_token);
    localStorage.setItem('whatsapp_id', tokens.whatsapp_id);
    localStorage.setItem('tiktok_client_key', tokens.tiktok_client_key);
    
    setTimeout(() => {
      setIsSaving(false);
      alert('Configurações de API salvas com sucesso!');
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
      {/* Tabs de Configuração */}
      <div className="flex bg-slate-200/50 p-1.5 rounded-[1.5rem] w-fit">
         <button 
           onClick={() => setActiveTab('api')}
           className={`px-8 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${activeTab === 'api' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
         >
           <Key size={14} /> Chaves de API
         </button>
         <button 
           onClick={() => setActiveTab('billing')}
           className={`px-8 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${activeTab === 'billing' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
         >
           <Wallet size={14} /> Faturamento & Plano
         </button>
      </div>

      {activeTab === 'api' ? (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100">
              <Shield size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Integrações Oficiais Cloud</h2>
              <p className="text-sm text-slate-500 font-medium">Conecte o SocialFlow com os ambientes de produção</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Meta Graph Access Token</label>
                <div className="relative">
                  <input 
                    type="password"
                    value={tokens.meta_token}
                    onChange={(e) => setTokens({...tokens, meta_token: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all pr-12"
                    placeholder="EAABw..."
                  />
                  <Key className="absolute right-4 top-3.5 text-slate-300" size={18} />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">WhatsApp Phone ID</label>
                <input 
                  type="text"
                  value={tokens.whatsapp_id}
                  onChange={(e) => setTokens({...tokens, whatsapp_id: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm outline-none focus:border-indigo-500 transition-all"
                  placeholder="1029384756..."
                />
              </div>
            </div>

            <div className="p-8 bg-indigo-50 rounded-[2rem] border border-indigo-100">
               <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs mb-3 uppercase tracking-tight">
                 <Globe size={14} /> Seu Webhook Único
               </div>
               <div className="bg-white px-4 py-3 rounded-xl border border-indigo-200 text-[10px] font-mono text-indigo-600 break-all select-all cursor-pointer">
                 https://api.socialflow.ai/webhook/v1/{user?.id || 'demo'}
               </div>
               <p className="text-[10px] text-indigo-400 mt-4 leading-relaxed font-medium">
                 Use este endpoint para receber eventos de mensagens, comentários e menções em tempo real.
               </p>
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full mt-10 py-5 bg-indigo-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-[0.98]"
          >
            {isSaving ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Salvar Configurações de Rede</>}
          </button>
        </div>
      ) : (
        <div className="space-y-8">
           {/* Card do Plano Atual */}
           <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full"></div>
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                 <div>
                    <div className="flex items-center gap-3 mb-2">
                       <span className="bg-indigo-500 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest">{user?.plan}</span>
                       <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold"><CheckCircle2 size={14}/> {user?.subscriptionStatus === 'active' ? 'Assinatura Ativa' : 'Trial'}</span>
                    </div>
                    <h2 className="text-3xl font-black mb-1">Status da Conta</h2>
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-widest flex items-center gap-2"><Calendar size={14}/> Próxima renovação: {user?.nextBillingDate?.toLocaleDateString() || 'N/A'}</p>
                 </div>
                 <div className="flex gap-3">
                    <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-sm font-bold transition-all">Alterar Plano</button>
                    <button className="px-6 py-3 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-2xl text-sm font-bold transition-all">Cancelar</button>
                 </div>
              </div>
           </div>

           {/* Histórico de Transações */}
           <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-8 border-b border-slate-100 flex items-center gap-3">
                 <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Receipt size={20} /></div>
                 <h3 className="font-bold text-slate-800">Histórico de Pagamentos</h3>
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fatura</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Método</th>
                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Recibo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {transactions.length === 0 ? (
                     <tr>
                        <td colSpan={5} className="px-8 py-12 text-center text-slate-400 text-sm">Nenhuma fatura gerada ainda.</td>
                     </tr>
                   ) : (
                     transactions.map(tx => (
                       <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-8 py-5">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><Receipt size={14}/></div>
                                <span className="text-xs font-bold text-slate-800">#{tx.id.split('_')[1]}</span>
                             </div>
                          </td>
                          <td className="px-8 py-5 text-xs text-slate-500 font-medium">{tx.date.toLocaleDateString()}</td>
                          <td className="px-8 py-5 text-xs font-black text-slate-800">R$ {tx.amount.toLocaleString()}</td>
                          <td className="px-8 py-5">
                             <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase">
                                {tx.method === 'card' ? <CreditCard size={12}/> : <QrCode size={12}/>} {tx.method}
                             </span>
                          </td>
                          <td className="px-8 py-5 text-right">
                             <button className="p-2 hover:bg-slate-100 rounded-lg transition-all text-indigo-600"><ArrowRight size={16} /></button>
                          </td>
                       </tr>
                     ))
                   )}
                </tbody>
              </table>
           </div>

           {/* Métodos de Pagamento Salvos */}
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center"><CreditCard size={24}/></div>
                 <div>
                    <h4 className="font-bold text-slate-800 text-sm">Cartão Principal</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Visa terminado em **** 4242</p>
                 </div>
              </div>
              <button className="text-indigo-600 font-bold text-xs hover:underline uppercase tracking-widest">Alterar Cartão</button>
           </div>
        </div>
      )}
    </div>
  );
};
