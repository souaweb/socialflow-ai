
import React, { useState } from 'react';
import { dbService } from '../services/dbService';
import { ShieldCheck, FileText, CheckCircle2, Loader2, AlertCircle, ArrowRight, X } from 'lucide-react';

interface IdentityVerificationProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const IdentityVerification: React.FC<IdentityVerificationProps> = ({ onSuccess, onClose }) => {
  const [type, setType] = useState<'CPF' | 'CNPJ'>('CPF');
  const [number, setNumber] = useState('');
  const [step, setStep] = useState<'form' | 'loading' | 'success'>('form');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('loading');
    // Simula validação em birô de crédito/receita federal
    setTimeout(() => {
      dbService.verifyIdentity(type, number);
      setStep('success');
      setTimeout(onSuccess, 1500);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in">
        <div className="bg-indigo-600 p-8 text-white text-center relative">
          <button onClick={onClose} className="absolute top-6 right-6 hover:bg-white/20 p-2 rounded-full"><X size={20}/></button>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-xl font-bold">Verificação de Identidade</h2>
          <p className="text-indigo-100 text-xs mt-2 uppercase tracking-widest font-bold">Segurança Anti-Fraude & Compliance</p>
        </div>

        <div className="p-10">
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-bottom-4">
              <div className="flex gap-4 mb-2">
                <button 
                  type="button"
                  onClick={() => setType('CPF')}
                  className={`flex-1 py-3 rounded-xl border-2 font-bold text-xs transition-all ${type === 'CPF' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-400'}`}
                >
                  Pessoa Física (CPF)
                </button>
                <button 
                  type="button"
                  onClick={() => setType('CNPJ')}
                  className={`flex-1 py-3 rounded-xl border-2 font-bold text-xs transition-all ${type === 'CNPJ' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-400'}`}
                >
                  Pessoa Jurídica (CNPJ)
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase px-1">Número do Documento</label>
                <input 
                  required
                  placeholder={type === 'CPF' ? '000.000.000-00' : '00.000.000/0000-00'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={number}
                  onChange={e => setNumber(e.target.value)}
                />
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                <AlertCircle size={18} className="text-amber-600 flex-shrink-0" />
                <p className="text-[10px] text-amber-800 leading-relaxed font-medium">
                  Seus dados são criptografados e utilizados apenas para cumprir normas de segurança das redes sociais e prevenir SPAM.
                </p>
              </div>

              <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                Validar Documento <ArrowRight size={18} />
              </button>
            </form>
          )}

          {step === 'loading' && (
            <div className="flex flex-col items-center py-12 text-center animate-pulse">
               <Loader2 size={48} className="text-indigo-600 animate-spin mb-6" />
               <h3 className="text-lg font-bold text-slate-800">Sincronizando com a Receita</h3>
               <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Verificando autenticidade do documento...</p>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center py-10 text-center animate-in zoom-in">
               <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} />
               </div>
               <h3 className="text-2xl font-bold text-slate-800">Identidade Verificada!</h3>
               <p className="text-xs text-slate-500 mt-2">Sua conta agora está em conformidade total.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
