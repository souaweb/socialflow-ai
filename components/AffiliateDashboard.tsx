
import React, { useState, useEffect } from 'react';
import { User, AffiliateStats, ReferralRecord } from '../types';
import { dbService } from '../services/dbService';
import { 
  Users, TrendingUp, DollarSign, MousePointer2, Copy, Check, 
  Gift, MessageCircle, Instagram, Share2, Sparkles, Loader2, ArrowRight,
  CheckCircle2, ListFilter, Search, ExternalLink, Award, PlayCircle
} from 'lucide-react';
import { generateCrossPostingCaption } from '../services/geminiService';

export const AffiliateDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [copied, setCopied] = useState(false);
  const [kitLoading, setKitLoading] = useState(false);
  const [suggestedCaptions, setSuggestedCaptions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'stats' | 'records' | 'kit'>('stats');

  useEffect(() => {
    const currentUser = dbService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setStats(dbService.getAffiliateStats(currentUser.affiliateCode || ''));
    }
  }, []);

  const referralUrl = `https://socialflow.ai/?ref=${user?.affiliateCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateKit = async () => {
    setKitLoading(true);
    try {
      const caption = await generateCrossPostingCaption(
        "Indique o SocialFlow AI e ganhe 30% de comissão recorrente. A melhor automação de redes sociais do Brasil.",
        "Marketing de Afiliados e Renda Extra com IA"
      );
      setSuggestedCaptions([caption, ...suggestedCaptions]);
    } catch (e) {
      console.error(e);
    } finally {
      setKitLoading(false);
    }
  };

  if (!user || !stats) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Top Banner / Link Section */}
      <div className="bg-indigo-600 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[40%] h-full bg-white/10 skew-x-12 translate-x-1/2"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
             <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md"><Award size={20} /></div>
             <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-100">Parceiro Oficial SocialFlow</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-8 leading-tight">Ganhe Dinheiro <br/>Divulgando a Melhor IA.</h1>
          
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl">
             <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center justify-between">
                <div className="overflow-hidden">
                   <p className="text-[9px] font-black uppercase text-indigo-200 mb-1">Seu Link de Afiliado</p>
                   <p className="text-xs font-mono truncate">{referralUrl}</p>
                </div>
                <button onClick={handleCopy} className="p-3 bg-white text-indigo-600 rounded-xl hover:scale-110 transition-all shadow-lg">
                   {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
             </div>
             <div className="bg-slate-900 px-8 py-4 rounded-2xl flex flex-col justify-center border border-white/10">
                <p className="text-[9px] font-black uppercase text-slate-500 mb-1">Código de Cupom</p>
                <p className="text-xl font-black">{user.affiliateCode}</p>
             </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 p-1.5 bg-slate-200/50 rounded-2xl w-fit mx-auto md:mx-0">
         {[
           { id: 'stats', label: 'Visão Geral', icon: <TrendingUp size={14}/> },
           { id: 'records', label: 'Minhas Indicações', icon: <Users size={14}/> },
           { id: 'kit', label: 'Kit de Produção', icon: <PlayCircle size={14}/> }
         ].map(t => (
           <button 
             key={t.id}
             onClick={() => setActiveTab(t.id as any)}
             className={`px-6 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${activeTab === t.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
           >
             {t.icon} {t.label}
           </button>
         ))}
      </div>

      {activeTab === 'stats' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: <MousePointer2 />, label: 'Cliques Totais', value: stats.clicks, color: 'text-blue-500' },
              { icon: <Users />, label: 'Cadastros (Leads)', value: stats.referrals, color: 'text-purple-500' },
              { icon: <TrendingUp />, label: 'Total Acumulado', value: `R$ ${stats.totalEarned.toLocaleString()}`, color: 'text-emerald-500' },
              { icon: <DollarSign />, label: 'Saldo para Saque', value: `R$ ${stats.balance.toLocaleString()}`, color: 'text-indigo-600' },
            ].map((s, i) => (
              <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:translate-y-[-4px] transition-all">
                 <div className={`${s.color} mb-4`}>{s.icon}</div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                 <p className="text-2xl font-black text-slate-800">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-tighter text-lg"><CheckCircle2 className="text-emerald-500"/> Benefício de Parceiro</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  Como afiliado oficial, você tem acesso <strong>GRATUITO</strong> ao plano Partner. Use o SocialFlow para criar conteúdo, postar em massa e atender interessados sem pagar mensalidade.
                </p>
                <div className="flex gap-4">
                  <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                     <p className="text-[10px] font-black text-indigo-600 uppercase mb-1">Status do Acesso</p>
                     <p className="text-sm font-bold text-slate-800">Ativo e Vitalício</p>
                  </div>
                  <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                     <p className="text-[10px] font-black text-indigo-600 uppercase mb-1">Limite Mensal</p>
                     <p className="text-sm font-bold text-slate-800">Ilimitado para SF</p>
                  </div>
                </div>
             </div>

             <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-xl flex flex-col justify-center">
                <h3 className="text-xl font-black mb-2">Solicitar Saque</h3>
                <p className="text-xs text-slate-400 mb-8">O valor mínimo para resgate é de R$ 100,00 via PIX.</p>
                <button 
                  disabled={stats.balance < 100}
                  className="w-full py-5 bg-white text-slate-900 rounded-[1.5rem] font-black hover:bg-indigo-400 hover:text-white transition-all disabled:opacity-30 disabled:grayscale"
                >
                  SAQUE DISPONÍVEL: R$ {stats.balance.toLocaleString()}
                </button>
             </div>
          </div>
        </>
      )}

      {activeTab === 'records' && (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
           <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="font-black text-slate-800 uppercase tracking-tighter text-lg">Histórico de Produção</h3>
              <div className="relative">
                 <input type="text" placeholder="Buscar indicação..." className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64" />
                 <Search size={14} className="absolute right-4 top-2.5 text-slate-400" />
              </div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="bg-slate-50">
                    <tr>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Indicado</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status da Conta</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Minha Comissão</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ação</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {stats.records.length === 0 ? (
                      <tr><td colSpan={5} className="px-8 py-20 text-center text-slate-400 text-sm">Nenhum registro encontrado. Comece a divulgar seu link!</td></tr>
                    ) : (
                      stats.records.map(rec => (
                        <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs uppercase">{rec.name[0]}</div>
                                 <div>
                                    <p className="text-xs font-bold text-slate-800">{rec.name}</p>
                                    <p className="text-[10px] text-slate-400 font-medium">{rec.email}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6 text-xs text-slate-500">{new Date(rec.date).toLocaleDateString()}</td>
                           <td className="px-8 py-6">
                              <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase ${
                                rec.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 
                                rec.status === 'trial' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                              }`}>
                                {rec.status}
                              </span>
                           </td>
                           <td className="px-8 py-6 text-xs font-black text-slate-800">R$ {rec.commission.toLocaleString()}</td>
                           <td className="px-8 py-6 text-right">
                              <button className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg"><ExternalLink size={14}/></button>
                           </td>
                        </tr>
                      ))
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {activeTab === 'kit' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                 <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2 text-lg"><Sparkles className="text-indigo-600"/> Sugestões de Legendas IA</h3>
                 <div className="space-y-4">
                    {suggestedCaptions.map((cap, i) => (
                      <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 relative group animate-in slide-in-from-bottom-2">
                         <p className="text-xs text-slate-600 leading-relaxed font-medium">"{cap}"</p>
                         <button onClick={() => { navigator.clipboard.writeText(cap); }} className="absolute top-4 right-4 p-2 bg-white rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                            <Copy size={14} className="text-indigo-600" />
                         </button>
                      </div>
                    ))}
                    <button 
                      onClick={handleGenerateKit}
                      disabled={kitLoading}
                      className="w-full py-4 border-2 border-dashed border-slate-200 rounded-[1.5rem] text-slate-400 font-bold hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                    >
                      {kitLoading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Gerar Novas Ideias de Conteúdo
                    </button>
                 </div>
              </div>
           </div>
           <div className="space-y-6">
              <div className="bg-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100">
                 <h4 className="font-black text-indigo-900 mb-4 uppercase tracking-tighter">Como Divulgar</h4>
                 <ul className="space-y-4">
                    {[
                      { t: 'Stories com Link', d: 'Fale sobre como você economiza tempo usando a IA e coloque o sticker de link.' },
                      { t: 'Direct Estratégico', d: 'Responda dúvidas de empreendedores enviando seu cupom de desconto.' },
                      { t: 'Bio do Instagram', d: 'Coloque seu link oficial na bio para capturar tráfego orgânico 24h.' }
                    ].map((item, i) => (
                      <li key={i} className="flex gap-3">
                         <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-[10px] font-black text-indigo-600 flex-shrink-0">{i+1}</div>
                         <div>
                            <p className="text-xs font-bold text-indigo-900">{item.t}</p>
                            <p className="text-[10px] text-indigo-700/70 leading-relaxed">{item.d}</p>
                         </div>
                      </li>
                    ))}
                 </ul>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const Plus = ({size}: {size: number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7v14"/></svg>
);
