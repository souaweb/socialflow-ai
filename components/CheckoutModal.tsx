
import React, { useState, useEffect } from 'react';
import { 
  CreditCard, QrCode, CheckCircle2, Loader2, X, ShieldCheck, 
  Lock, Copy, Check, ExternalLink, Ticket, ArrowRight, 
  Clock, Star, Users, ShieldAlert, Award, Zap, ChevronLeft,
  Shield
} from 'lucide-react';
import { PlanLevel, GatewayType } from '../types';
import { dbService } from '../services/dbService';

interface CheckoutModalProps {
  plan: PlanLevel;
  onClose: () => void;
  onSuccess: () => void;
}

const planData = {
  starter: { price: 197, name: 'Plano Starter', oldPrice: 297, savings: 'R$ 100' },
  pro: { price: 397, name: 'Plano Pro', oldPrice: 597, savings: 'R$ 200' },
  consultancy: { price: 1497, name: 'Consultoria VIP', oldPrice: 2497, savings: 'R$ 1.000' }
};

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ plan, onClose, onSuccess }) => {
  const [method, setMethod] = useState<'card' | 'pix' | 'boleto'>('card');
  const [gateway, setGateway] = useState<GatewayType>('stripe');
  const [step, setStep] = useState<'pay' | 'processing' | 'success'>('pay');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutos para maior urgência
  const [copied, setCopied] = useState(false);
  const [doc, setDoc] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [recentSales, setRecentSales] = useState<{name: string, city: string} | null>(null);

  const selectedPlan = planData[plan === 'free' ? 'starter' : plan];

  // Máscara para CPF/CNPJ
  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else {
      value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }
    setDoc(value);
  };

  // Timer Regressivo
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  // Prova Social
  useEffect(() => {
    const names = ['André', 'Camila', 'Rodrigo', 'Juliana', 'Felipe', 'Patrícia'];
    const cities = ['São Paulo', 'Belo Horizonte', 'Porto Alegre', 'Recife', 'Brasília'];
    const interval = setInterval(() => {
      setRecentSales({
        name: names[Math.floor(Math.random() * names.length)],
        city: cities[Math.floor(Math.random() * cities.length)]
      });
      setTimeout(() => setRecentSales(null), 4000);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    setTimeout(() => {
      dbService.addTransaction(selectedPlan.price, method === 'pix' ? 'pix' : 'card', plan, gateway);
      dbService.updateSubscription(plan, 'active');
      setStep('success');
      setTimeout(onSuccess, 1800);
    }, 3000);
  };

  const getCardIcon = () => {
    if (cardNumber.startsWith('4')) return <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />;
    if (cardNumber.startsWith('5')) return <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />;
    return <CreditCard size={20} className="text-slate-300" />;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/60 backdrop-blur-xl p-0 md:p-4 overflow-y-auto">
      {/* Social Proof Toast */}
      {recentSales && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0 z-[110] bg-white rounded-2xl shadow-2xl p-4 border border-indigo-100 flex items-center gap-4 animate-in slide-in-from-top-10 md:slide-in-from-left-10 duration-500">
           <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">{recentSales.name[0]}</div>
           <div>
              <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight">{recentSales.name} acabou de ativar o {plan}!</p>
              <p className="text-[9px] text-indigo-500 font-bold">📍 {recentSales.city}, Brasil</p>
           </div>
        </div>
      )}

      <div className="bg-white w-full max-w-5xl md:rounded-[3.5rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] flex flex-col md:flex-row relative min-h-screen md:min-h-0 border border-slate-100">
        
        {/* Lado A: Resumo do Pedido (Desktop Right, Mobile Top) */}
        <div className="bg-slate-50 p-8 md:p-12 md:w-5/12 flex flex-col border-b md:border-b-0 md:border-r border-slate-100">
           <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-2 text-indigo-600 font-black text-xl">
                 <ShieldCheck size={24} /> <span>SocialFlow</span>
              </div>
              <button onClick={onClose} className="md:hidden text-slate-400 p-2"><X /></button>
           </div>

           <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative">
                 <span className="absolute -top-3 left-6 bg-indigo-600 text-white text-[8px] font-black px-3 py-1 rounded-full">VOCÊ ESCOLHEU</span>
                 <div className="flex justify-between items-start mb-4">
                    <div>
                       <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">{selectedPlan.name}</h3>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Acesso Ilimitado à IA</p>
                    </div>
                    <div className="text-right">
                       <p className="text-2xl font-black text-slate-800">R$ {selectedPlan.price}</p>
                       <p className="text-[10px] text-slate-400 line-through">R$ {selectedPlan.oldPrice}</p>
                    </div>
                 </div>
                 <div className="space-y-2 pt-4 border-t border-slate-100">
                    {['Automação Completa', 'Multi-Canal API', 'Relatórios em Tempo Real'].map(item => (
                      <div key={item} className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                        <Check size={14} className="text-emerald-500" /> {item}
                      </div>
                    ))}
                 </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                 <Clock size={20} className="text-indigo-600 animate-pulse" />
                 <p className="text-[10px] font-bold text-indigo-900 uppercase tracking-tight">
                    Oferta expira em <span className="text-indigo-600 font-black">{formatTime(timeLeft)}</span> minutos
                 </p>
              </div>

              <div className="mt-8">
                 <div className="flex items-center gap-2 mb-4 text-emerald-600">
                    <Award size={20} />
                    <span className="text-xs font-black uppercase tracking-widest">Garantia Incondicional</span>
                 </div>
                 <p className="text-[11px] text-slate-500 leading-relaxed">
                    Teste por 7 dias. Se não estiver 100% satisfeito com a conversão da sua IA, nós devolvemos cada centavo.
                 </p>
              </div>
           </div>

           <div className="mt-auto pt-12 flex items-center justify-between grayscale opacity-40">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" className="h-4" />
              <img src="https://logodownload.org/wp-content/uploads/2019/06/mercado-pago-logo.png" className="h-4" />
              <img src="https://www.asaas.com/assets/images/logos/asaas-logo-blue.svg" className="h-4" />
           </div>
        </div>

        {/* Lado B: Checkout Transparente */}
        <div className="p-8 md:p-16 flex-1 bg-white relative">
          <button onClick={onClose} className="absolute top-12 right-12 hidden md:block text-slate-300 hover:text-slate-500 transition-colors"><X size={28}/></button>
          
          {step === 'pay' && (
            <div className="max-w-md mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-10">
                 <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Checkout Seguro</h2>
                 <p className="text-xs text-slate-400 font-medium">Preencha os dados abaixo para ativar sua conta.</p>
              </div>

              {/* Seletor de Pagamento Transparente */}
              <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-10">
                 {[
                   { id: 'card', label: 'Cartão', icon: <CreditCard size={14}/> },
                   { id: 'pix', label: 'PIX', icon: <QrCode size={14}/> },
                   { id: 'boleto', label: 'Boleto', icon: <Ticket size={14}/> }
                 ].map(m => (
                   <button 
                     key={m.id}
                     onClick={() => setMethod(m.id as any)}
                     className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase transition-all ${method === m.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                   >
                     {m.icon} {m.label}
                   </button>
                 ))}
              </div>

              {/* Formulário Principal */}
              <form onSubmit={handlePay} className="space-y-5">
                {/* Campo Identidade Unificado */}
                <div className="space-y-1.5">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">CPF ou CNPJ do Titular</label>
                   <div className="relative">
                      <input 
                        required 
                        value={doc}
                        onChange={handleDocChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-black focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" 
                        placeholder="000.000.000-00" 
                      />
                      <Shield size={16} className="absolute right-5 top-4.5 text-slate-300" />
                   </div>
                </div>

                {method === 'card' ? (
                  <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2">
                    <div className="space-y-1.5">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Número do Cartão</label>
                       <div className="relative">
                          <input 
                            required 
                            value={cardNumber}
                            onChange={e => setCardNumber(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-black focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all pr-12" 
                            placeholder="0000 0000 0000 0000" 
                          />
                          <div className="absolute right-5 top-4.5">{getCardIcon()}</div>
                       </div>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Nome Impresso no Cartão</label>
                       <input 
                         required 
                         className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-black focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" 
                         placeholder="NOME COMPLETO" 
                         style={{textTransform: 'uppercase'}}
                       />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Vencimento</label>
                          <input required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-black" placeholder="MM/AA" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">CVC / CVV</label>
                          <input required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-black" placeholder="123" />
                       </div>
                    </div>
                  </div>
                ) : method === 'pix' ? (
                  <div className="py-6 text-center animate-in zoom-in duration-300">
                     <div className="p-6 bg-slate-50 rounded-[3rem] border-2 border-slate-100 inline-block mb-6 shadow-sm">
                        <QrCode size={180} className="text-slate-800" />
                     </div>
                     <p className="text-xs text-slate-500 font-medium mb-4">Aponte a câmera do seu banco para o QR Code acima</p>
                  </div>
                ) : (
                  <div className="py-12 text-center bg-slate-50 rounded-[2rem] border border-slate-200 animate-in slide-in-from-bottom-2">
                     <Ticket size={48} className="mx-auto text-slate-300 mb-4" />
                     <p className="text-sm font-black text-slate-800 uppercase">Gerar Boleto Bancário</p>
                     <p className="text-[10px] text-slate-400 mt-2 px-10">O boleto será enviado para seu e-mail e o acesso liberado após compensação.</p>
                  </div>
                )}

                <div className="pt-6">
                   <button type="submit" className="w-full py-5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                      {method === 'card' ? 'FINALIZAR PAGAMENTO AGORA' : method === 'pix' ? 'JÁ FIZ O PIX, LIBERAR ACESSO' : 'GERAR MEU BOLETO'}
                      <ArrowRight size={20} />
                   </button>
                   <div className="flex items-center justify-center gap-4 mt-6">
                      <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase">
                         <Lock size={12}/> Ambiente Criptografado
                      </div>
                      <div className="h-3 w-px bg-slate-200"></div>
                      <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase">
                         <ShieldCheck size={12}/> Checkout Transparente
                      </div>
                   </div>
                </div>
              </form>
            </div>
          )}

          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center py-40 text-center">
               <div className="relative mb-8">
                  <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse"></div>
                  <Loader2 size={64} className="text-indigo-600 animate-spin relative" />
               </div>
               <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Validando seus dados</h3>
               <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Comunicando com {gateway}...</p>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in duration-500">
               <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-emerald-200 shadow-2xl">
                  <CheckCircle2 size={48} />
               </div>
               <h3 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Acesso Ativado!</h3>
               <p className="text-sm text-slate-500 mt-3 font-medium max-w-xs">Sua IA já está pronta para começar a vender. Vamos lá?</p>
               <button onClick={onSuccess} className="mt-10 px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black hover:bg-slate-800 transition-all flex items-center gap-3">
                 ENTRAR NO PAINEL <ArrowRight />
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
