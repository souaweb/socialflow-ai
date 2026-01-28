
import React, { useState, useEffect, useRef } from 'react';
import { BusinessProfile } from '../types';
import { 
  Bot, Save, Zap, CheckCircle2, Sparkles, Building2, Target, 
  Mic, Square, Upload, Loader2, Music, Trash2, Volume2, 
  UserPlus, MessageSquare, Instagram, Heart, Link as LinkIcon
} from 'lucide-react';
import { extractFacts, transcribeAudio } from '../services/geminiService';

interface AutomationsProps {
  business: BusinessProfile;
  onSaveBusiness: (updated: BusinessProfile) => void;
}

export const Automations: React.FC<AutomationsProps> = ({ business, onSaveBusiness }) => {
  const [localKnowledge, setLocalKnowledge] = useState(business.knowledgeBase);
  const [localName, setLocalName] = useState(business.name);
  const [localIndustry, setLocalIndustry] = useState(business.industry);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Gatilhos de Automação
  const [triggers, setTriggers] = useState({
    follow_welcome: true,
    story_reply: true,
    comment_to_dm: true,
    whatsapp_salesman: true
  });

  // Estados de Voz
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setLocalKnowledge(business.knowledgeBase);
    setLocalName(business.name);
    setLocalIndustry(business.industry);
  }, [business]);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onSaveBusiness({
        ...business,
        name: localName,
        industry: localIndustry,
        knowledgeBase: localKnowledge
      });
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1500);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordTime(0);
      timerRef.current = window.setInterval(() => {
        setRecordTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      alert("Erro ao acessar microfone. Verifique as permissões.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const processAudio = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      const transcription = await transcribeAudio(blob);
      const facts = await extractFacts(transcription);
      const formattedFacts = facts.join("\n- ");
      setLocalKnowledge(prev => prev + (prev ? "\n\n" : "") + `Áudio extraído:\n- ${formattedFacts}`);
      setIsTranscribing(false);
    } catch (error) {
      alert("Erro ao processar áudio.");
      setIsTranscribing(false);
    }
  };

  const toggleTrigger = (key: keyof typeof triggers) => {
    setTriggers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500 pb-20">
      <div className="space-y-6">
        {/* Perfil e Gatilhos */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <Zap size={20} className="text-indigo-600" /> Gatilhos de Interação IA
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
             {[
               { id: 'follow_welcome', label: 'Seguiu -> Enviar Link DM', desc: 'Sempre que alguém seguir sua conta, a IA envia uma saudação com seu link oficial.', icon: <UserPlus className="text-blue-500" /> },
               { id: 'story_reply', label: 'Responder Stories', desc: 'A IA reage e responde menções ou respostas em seus stories de forma humana.', icon: <Instagram className="text-pink-500" /> },
               { id: 'comment_to_dm', label: 'Comentário -> Enviar DM', desc: 'Ao detectar palavras como "quero" ou "preço", a IA responde e chama no privado.', icon: <MessageSquare className="text-indigo-500" /> },
               { id: 'whatsapp_salesman', label: 'Vendedor WhatsApp 24h', desc: 'Atendimento total via WhatsApp agindo como vendedor especialista.', icon: <Bot className="text-emerald-500" /> }
             ].map((t) => (
               <div 
                key={t.id} 
                onClick={() => toggleTrigger(t.id as any)}
                className={`p-5 rounded-3xl border-2 cursor-pointer transition-all flex items-start gap-4 ${triggers[t.id as keyof typeof triggers] ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'border-slate-100 hover:border-slate-200'}`}
               >
                 <div className={`mt-1 p-2 rounded-xl ${triggers[t.id as keyof typeof triggers] ? 'bg-white shadow-sm' : 'bg-slate-50'}`}>
                    {t.icon}
                 </div>
                 <div className="flex-1">
                    <p className={`text-xs font-black uppercase tracking-tight ${triggers[t.id as keyof typeof triggers] ? 'text-indigo-700' : 'text-slate-400'}`}>{t.label}</p>
                    <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{t.desc}</p>
                 </div>
                 <div className={`w-10 h-6 rounded-full relative transition-colors ${triggers[t.id as keyof typeof triggers] ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${triggers[t.id as keyof typeof triggers] ? 'left-5' : 'left-1'}`}></div>
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Card de Treinamento por Voz */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                 <Mic size={18} className="text-indigo-600" /> Treinar Especialista por Voz
              </h3>
           </div>

           <div className="space-y-4">
             {isRecording ? (
               <div className="bg-red-50 border border-red-100 rounded-3xl p-6 flex flex-col items-center gap-4 animate-pulse">
                  <span className="text-xl font-mono font-bold text-red-600">{Math.floor(recordTime/60)}:{(recordTime%60).toString().padStart(2, '0')}</span>
                  <button onClick={stopRecording} className="bg-red-600 text-white p-4 rounded-full shadow-lg"><Square size={24} fill="white" /></button>
               </div>
             ) : isTranscribing ? (
               <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-8 flex flex-col items-center gap-4 text-center">
                  <Loader2 className="animate-spin text-indigo-600" size={32} />
                  <p className="text-sm font-bold text-indigo-800 uppercase tracking-widest">IA Absorvendo Conhecimento...</p>
               </div>
             ) : (
               <div className="grid grid-cols-2 gap-3">
                  <button onClick={startRecording} className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm mb-3 group-hover:scale-110 transition-transform"><Mic size={24} /></div>
                    <span className="text-[10px] font-black text-slate-600 uppercase">Gravar Áudio</span>
                  </button>
                  <label className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group cursor-pointer">
                    <input type="file" accept="audio/*" className="hidden" onChange={(e) => e.target.files?.[0] && processAudio(e.target.files[0])} />
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm mb-3 group-hover:scale-110 transition-transform"><Upload size={24} /></div>
                    <span className="text-[10px] font-black text-slate-600 uppercase">Subir Arquivo</span>
                  </label>
               </div>
             )}
           </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden h-fit">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-xl font-bold flex items-center gap-2"><Sparkles className="text-indigo-400" size={20} /> Cérebro do Vendedor</h3>
               {saved && <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full animate-bounce">Sincronizado</span>}
            </div>

            <div className="space-y-6">
              <textarea 
                className="w-full bg-slate-800/50 border border-slate-700 rounded-3xl p-6 text-sm focus:ring-2 focus:ring-indigo-500 h-[30rem] text-slate-200 resize-none leading-relaxed"
                placeholder="Ex: Somos uma loja de móveis de luxo. Entregamos em 7 dias. Aceitamos PIX com 10% desconto..."
                value={localKnowledge}
                onChange={(e) => setLocalKnowledge(e.target.value)}
              ></textarea>

              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all flex items-center justify-center gap-3"
              >
                {isSaving ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Salvar Treinamento e Ativar Gatilhos</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
