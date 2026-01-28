
import React, { useState } from 'react';
import { ImageIcon, Video, Sparkles, Loader2, Download, Send, Play, Layers } from 'lucide-react';
import { generateAIImage, generateAIVideo } from '../services/geminiService';

interface MediaStudioProps {
  businessId: string;
}

export const MediaStudio: React.FC<MediaStudioProps> = ({ businessId }) => {
  const [tab, setTab] = useState<'image' | 'video'>('image');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedItems, setGeneratedItems] = useState<{url: string, type: 'image' | 'video', prompt: string}[]>([]);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      let url = "";
      if (tab === 'image') {
        url = await generateAIImage(prompt);
      } else {
        url = await generateAIVideo(prompt);
      }
      setGeneratedItems([{url, type: tab, prompt}, ...generatedItems]);
      setPrompt('');
    } catch (e) {
      alert("Erro ao gerar mídia. Verifique seu crédito.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Media Studio AI</h2>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">Crie anúncios cinematográficos em segundos</p>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
            <button 
              onClick={() => setTab('image')}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${tab === 'image' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <ImageIcon size={14} /> Imagens
            </button>
            <button 
              onClick={() => setTab('video')}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${tab === 'video' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Video size={14} /> Vídeos (Veo)
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={tab === 'image' ? "Descreva o anúncio perfeito... Ex: Um café luxuoso em cima de uma mesa de mármore com luz suave do sol." : "Descreva a cena... Ex: Drone voando sobre uma cidade futurista neon com carros voadores."}
            className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] p-6 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none h-32 leading-relaxed"
          />
          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black flex items-center justify-center gap-3 shadow-xl hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-95"
          >
            {isGenerating ? (
              <><Loader2 className="animate-spin" /> {tab === 'image' ? 'Renderizando Imagem...' : 'O Veo está processando seu vídeo...'}</>
            ) : (
              <><Sparkles size={20} /> Gerar com Inteligência Artificial</>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {generatedItems.length === 0 ? (
          <div className="col-span-full py-20 text-center opacity-30 border-2 border-dashed border-slate-200 rounded-[3rem]">
             <Layers size={48} className="mx-auto mb-4" />
             <p className="font-bold">Sua galeria de mídias aparecerá aqui.</p>
          </div>
        ) : (
          generatedItems.map((item, i) => (
            <div key={i} className="group bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all">
              <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
                {item.type === 'image' ? (
                  <img src={item.url} alt={item.prompt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center relative">
                    <video src={item.url} className="w-full h-full object-cover" controls />
                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-2 py-1 rounded-md text-[8px] text-white font-bold uppercase tracking-widest">Veo 3.1</div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                   <p className="text-[10px] text-white/80 line-clamp-2 italic mb-4">"{item.prompt}"</p>
                   <div className="flex gap-2">
                     <button className="flex-1 bg-white text-slate-900 py-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 hover:bg-indigo-500 hover:text-white transition-all"><Download size={12}/> Baixar</button>
                     <button className="flex-1 bg-indigo-600 text-white py-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all"><Send size={12}/> Publicar</button>
                   </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
