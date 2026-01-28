
import React, { useState } from 'react';
import { Platform, SocialAccount } from '../types';
import { X, Lock, CheckCircle2, Loader2, ShieldCheck, Instagram, Facebook, MessageCircle, Video, Play, Globe, QrCode, User, Key } from 'lucide-react';

interface ConnectionModalProps {
  platform: Platform;
  onClose: () => void;
  onSuccess: (accountData: Partial<SocialAccount>) => void;
}

const platformStyles: Record<string, { color: string, icon: any, label: string, method: 'oauth' | 'qrcode' | 'login' }> = {
  instagram: { color: 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600', icon: <Instagram />, label: 'Instagram', method: 'oauth' },
  facebook: { color: 'bg-blue-600', icon: <Facebook />, label: 'Facebook', method: 'oauth' },
  whatsapp: { color: 'bg-emerald-500', icon: <MessageCircle />, label: 'WhatsApp', method: 'qrcode' },
  tiktok: { color: 'bg-black', icon: <Video />, label: 'TikTok', method: 'oauth' },
  youtube: { color: 'bg-red-600', icon: <Play />, label: 'YouTube', method: 'oauth' },
  kwai: { color: 'bg-orange-500', icon: <div className="font-bold">K</div>, label: 'Kwai', method: 'login' },
};

export const ConnectionModal: React.FC<ConnectionModalProps> = ({ platform, onClose, onSuccess }) => {
  const [step, setStep] = useState<'start' | 'loading' | 'auth_popup' | 'success'>('start');
  const [loginData, setLoginData] = useState({ user: '', pass: '' });

  const style = platformStyles[platform];

  const handleStartAuth = () => {
    setStep('loading');
    setTimeout(() => {
      setStep(style.method === 'qrcode' ? 'auth_popup' : 'auth_popup');
    }, 1000);
  };

  const handleFinalize = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setStep('loading');
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess({
          username: loginData.user || `@user_${platform}_${Math.floor(Math.random()*100)}`,
          platform: platform,
          status: 'connected',
        });
        onClose();
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        
        {/* Header Dinâmico */}
        <div className={`${style.color} p-8 text-white flex flex-col items-center text-center relative`}>
          <button onClick={onClose} className="absolute top-6 right-6 hover:bg-white/20 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
          <div className="bg-white/20 p-4 rounded-2xl mb-3 backdrop-blur-md">
            {React.cloneElement(style.icon as React.ReactElement<any>, { size: 32 })}
          </div>
          <h2 className="text-xl font-bold">Conectar {style.label}</h2>
          <p className="text-white/70 text-xs mt-1">Conexão segura via protocolo oficial</p>
        </div>

        <div className="p-8">
          {step === 'start' && (
            <div className="space-y-6 text-center">
              <div className="py-4">
                <p className="text-slate-600 text-sm leading-relaxed">
                  Para ativar a automação, você precisa autorizar o <strong>SocialFlow AI</strong> a gerenciar suas mensagens e posts.
                </p>
              </div>
              <button 
                onClick={handleStartAuth}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-lg active:scale-95"
              >
                {style.method === 'qrcode' ? <QrCode size={20}/> : <Lock size={18} />}
                {style.method === 'qrcode' ? 'Escanear QR Code' : `Entrar com ${style.label}`}
              </button>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
                Não solicitamos sua senha diretamente
              </p>
            </div>
          )}

          {step === 'auth_popup' && style.method === 'qrcode' && (
            <div className="flex flex-col items-center py-4 space-y-6">
              <div className="p-4 bg-white border-4 border-slate-100 rounded-3xl shadow-inner">
                <div className="w-48 h-48 bg-slate-50 flex items-center justify-center relative overflow-hidden rounded-xl">
                  <QrCode size={120} className="text-slate-800 opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent animate-pulse"></div>
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-bold text-slate-800">Acesse o WhatsApp no celular</h3>
                <p className="text-xs text-slate-500">Configurações &gt; Aparelhos Conectados &gt; Conectar um aparelho</p>
              </div>
              <button onClick={() => handleFinalize()} className="text-indigo-600 font-bold text-xs hover:underline uppercase tracking-widest">
                Simular Escaneamento
              </button>
            </div>
          )}

          {step === 'auth_popup' && style.method !== 'qrcode' && (
            <form onSubmit={handleFinalize} className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                   <div className={`${style.color} w-2 h-2 rounded-full`}></div>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Login Seguro {style.label}</span>
                </div>
                <div className="space-y-3">
                  <div className="relative">
                    <input 
                      required
                      type="text"
                      placeholder="E-mail ou Usuário"
                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={loginData.user}
                      onChange={e => setLoginData({...loginData, user: e.target.value})}
                    />
                    <User size={16} className="absolute left-4 top-3.5 text-slate-400" />
                  </div>
                  <div className="relative">
                    <input 
                      required
                      type="password"
                      placeholder="Senha"
                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={loginData.pass}
                      onChange={e => setLoginData({...loginData, pass: e.target.value})}
                    />
                    <Key size={16} className="absolute left-4 top-3.5 text-slate-400" />
                  </div>
                </div>
              </div>
              <button 
                type="submit"
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
              >
                Confirmar Acesso
              </button>
            </form>
          )}

          {step === 'loading' && (
            <div className="flex flex-col items-center py-12 text-center">
              <Loader2 size={48} className="text-indigo-600 animate-spin mb-4" />
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">Sincronizando Conta...</h3>
              <p className="text-xs text-slate-400 mt-1">Isso pode levar alguns segundos.</p>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center py-8 text-center animate-in zoom-in">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="font-bold text-slate-800 text-xl">Conexão Ativa!</h3>
              <p className="text-xs text-slate-500 mt-1">Sua automação já está rodando em segundo plano.</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2">
           <ShieldCheck size={14} className="text-emerald-500" />
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Conexão 100% Criptografada</span>
        </div>
      </div>
    </div>
  );
};
