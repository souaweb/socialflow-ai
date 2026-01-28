
import React, { useState } from 'react';
import { SocialAccount } from '../types';
import { Image as ImageIcon, Video, Send, CheckCircle2, Loader2, Sparkles, Check } from 'lucide-react';
import { generateCrossPostingCaption } from '../services/geminiService';

interface OmnipostProps {
  accounts: SocialAccount[];
  businessContext: string;
}

export const Omnipost: React.FC<OmnipostProps> = ({ accounts, businessContext }) => {
  const [content, setContent] = useState('');
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [optimizing, setOptimizing] = useState(false);

  // Manipula a publicação em massa
  const handlePost = async () => {
    if (!content || selectedAccountIds.length === 0) return;
    setIsPosting(true);
    // Simula disparo para cada conta selecionada
    await new Promise(resolve => setTimeout(resolve, 1000 + (selectedAccountIds.length * 500)));
    setIsPosting(false);
    setIsDone(true);
    setTimeout(() => {
      setIsDone(false);
      setContent('');
      setSelectedAccountIds([]);
    }, 5000);
  };

  // Otimiza o conteúdo usando a IA do Gemini
  const handleOptimize = async () => {
    if (!content) return;
    setOptimizing(true);
    try {
      const optimized = await generateCrossPostingCaption(content, businessContext);
      setContent(optimized);
    } catch (err) {
      console.error("Erro ao otimizar post:", err);
    } finally {
      setOptimizing(false);
    }
  };

  const toggleAccount = (id: string) => {
    setSelectedAccountIds(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedAccountIds.length === accounts.length) setSelectedAccountIds([]);
    else setSelectedAccountIds(accounts.map(a => a.id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Multi-Postagem Inteligente</h2>
        
        <div className="mb-8">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-between">
            <span>Selecione os Canais de Destino ({selectedAccountIds.length})</span>
            <button onClick={selectAll} className="text-indigo-600 hover:underline">
              {selectedAccountIds.length === accounts.length ? 'Desmarcar Todos' : 'Selecionar Todas as Contas'}
            </button>
          </label>
          {accounts.length === 0 ? (
            <div className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center text-slate-400 text-xs">
              Nenhuma conta conectada para publicar.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {accounts.map(acc => (
                <button 
                  key={acc.id}
                  onClick={() => toggleAccount(acc.id)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${
                    selectedAccountIds.includes(acc.id) 
                    ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600 shadow-sm' 
                    : 'border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                    selectedAccountIds.includes(acc.id) ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200'
                  }`}>
                    {selectedAccountIds.includes(acc.id) && <Check size={14} />}
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-700 truncate">{acc.username}</p>
                    <p className="text-[9px] text-slate-400 uppercase font-bold tracking-tighter">{acc.platform}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-indigo-600" /> Conteúdo Unificado
            </div>
            <button 
              onClick={handleOptimize}
              disabled={optimizing || !content}
              className="text-indigo-600 hover:text-indigo-800 disabled:opacity-50 flex items-center gap-1 transition-colors"
            >
              {optimizing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
              Otimizar com IA
            </button>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escreva seu post aqui... A IA adaptará para cada conta automaticamente."
            className="w-full h-40 p-6 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none text-sm font-medium leading-relaxed"
          ></textarea>
        </div>

        <button
          onClick={handlePost}
          disabled={isPosting || selectedAccountIds.length === 0 || !content}
          className={`w-full py-5 rounded-[1.5rem] font-bold flex items-center justify-center gap-3 shadow-xl transition-all ${
            isDone ? 'bg-emerald-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
          }`}
        >
          {isPosting ? (
             <><Loader2 className="animate-spin" /> Distribuindo conteúdo nas APIs...</>
          ) : isDone ? (
             <><CheckCircle2 /> Sucesso em {selectedAccountIds.length} canais!</>
          ) : (
             <><Send size={20} /> Publicar em Massa ({selectedAccountIds.length} Contas)</>
          )}
        </button>
      </div>
    </div>
  );
};
