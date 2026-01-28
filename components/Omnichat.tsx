
import React, { useState } from 'react';
import { Message, SocialAccount } from '../types';
import { Send, Bot, User, Instagram, MessageCircle, Facebook, Sparkles, Loader2, Zap } from 'lucide-react';
import { generateSalesResponse } from '../services/geminiService';

interface OmnichatProps {
  accounts: SocialAccount[];
  businessContext: string;
}

export const Omnichat: React.FC<OmnichatProps> = ({ accounts, businessContext }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'Lucas', content: 'Boa tarde! Gostaria de saber o valor da consultoria.', timestamp: new Date(), platform: 'whatsapp', isAi: false, intent: 'purchase_intent' },
    { id: '2', sender: 'SocialFlow AI', content: 'Olá Lucas! Que ótimo interesse. Nossa consultoria de automação começa em R$ 497/mês. Você gostaria de agendar uma demonstração rápida?', timestamp: new Date(), platform: 'whatsapp', isAi: true }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const platformIcons: any = {
    whatsapp: <MessageCircle size={12} className="text-emerald-500" />,
    instagram: <Instagram size={12} className="text-pink-500" />,
    facebook: <Facebook size={12} className="text-blue-500" />
  };

  const handleSend = () => {
    if (!inputValue) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'Você',
      content: inputValue,
      timestamp: new Date(),
      platform: 'whatsapp',
      isAi: false
    };
    setMessages([...messages, newMessage]);
    setInputValue('');
  };

  const handleAiSuggestion = async () => {
    setIsGenerating(true);
    try {
      const lastCustomerMessage = [...messages].reverse().find(m => !m.isAi)?.content || "";
      
      // Fix: Removed 4th argument to match the function signature defined in geminiService.ts (3 arguments expected)
      const aiResponse = await generateSalesResponse(
        'whatsapp',
        lastCustomerMessage,
        businessContext
      );
      
      setInputValue(aiResponse);
    } catch (error) {
      console.error("Erro ao gerar sugestão de IA:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-160px)] gap-6 animate-in fade-in duration-500">
      {/* Lista de Conversas Ativas */}
      <div className="w-80 bg-white rounded-3xl border border-slate-200 overflow-hidden flex flex-col shadow-sm">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-bold text-slate-800">Mensagens</h2>
          <span className="bg-indigo-100 text-indigo-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">4 Ativas</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {['Lucas', 'Maria', 'João', 'Felipe'].map((name, i) => (
            <div key={i} className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 flex items-center gap-3 transition-colors ${i === 0 ? 'bg-indigo-50/50 border-r-4 border-r-indigo-500' : ''}`}>
               <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 group-hover:scale-110 transition-transform">{name[0]}</div>
               <div className="flex-1 overflow-hidden">
                 <div className="flex justify-between items-center mb-0.5">
                   <span className="font-bold text-sm text-slate-800">{name}</span>
                   <span className="text-[10px] text-slate-400 font-medium tracking-tight">14:02</span>
                 </div>
                 <p className="text-xs text-slate-500 truncate leading-relaxed">Interessado no produto...</p>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Janela do Chat Principal */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200 flex flex-col overflow-hidden shadow-xl shadow-slate-200/50">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-200">L</div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">Lucas</span>
                <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border border-emerald-200">QUENTE 🔥</span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Atendimento via WhatsApp Business API
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors border border-slate-100">
               <Zap size={18} />
            </button>
            <button className="text-indigo-600 text-sm font-bold bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-colors flex items-center gap-2">
              <Bot size={18} /> Histórico IA
            </button>
          </div>
        </div>

        <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-slate-50/40">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.isAi ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[75%] rounded-3xl p-5 shadow-sm relative ${
                m.isAi ? 'bg-white text-slate-800 border border-slate-200 rounded-tl-none' : 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-100'
              }`}>
                <div className={`flex items-center gap-1.5 mb-2 ${m.isAi ? 'text-indigo-600' : 'text-indigo-100'} opacity-80`}>
                   {m.isAi ? <Bot size={12} /> : <User size={12} />}
                   <span className="text-[10px] font-bold uppercase tracking-widest">{m.sender}</span>
                   <span className="ml-auto">{platformIcons[m.platform]}</span>
                </div>
                <p className="text-sm leading-relaxed font-medium">{m.content}</p>
                <span className="text-[9px] mt-3 block opacity-40 text-right font-bold tracking-wider uppercase">Enviado</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-white border-t border-slate-100 space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide no-scrollbar">
            <button 
              onClick={handleAiSuggestion}
              disabled={isGenerating}
              className="flex-shrink-0 bg-indigo-600 text-white text-xs px-4 py-2.5 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              IA Especialista: Sugerir Resposta
            </button>
            <button className="flex-shrink-0 bg-slate-100 text-slate-700 text-xs px-4 py-2.5 rounded-2xl font-bold hover:bg-slate-200 transition-colors">
              Enviar Link de Pagamento
            </button>
            <button className="flex-shrink-0 bg-slate-100 text-slate-700 text-xs px-4 py-2.5 rounded-2xl font-bold hover:bg-slate-200 transition-colors">
              Informar Prazo
            </button>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Responda ou clique na sugestão IA..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium"
              />
            </div>
            <button 
              onClick={handleSend}
              className="bg-indigo-600 text-white px-6 rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 active:scale-95 transition-all flex items-center justify-center group"
            >
              <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
