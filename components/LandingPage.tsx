
import React, { useState } from 'react';
import { 
  ShieldCheck, Zap, MessageSquare, Target, CheckCircle2, Star, Globe, 
  TrendingUp, Users, ArrowRight, MousePointer2, Smartphone, 
  BarChart3, BrainCircuit, Heart, MessageCircle, PlayCircle, Layers,
  Award, Gift, ChevronDown, Check, Sparkles, Rocket
} from 'lucide-react';
import { PlanLevel } from '../types';
import { dbService } from '../services/dbService';

interface LandingPageProps {
  onStart: (plan: PlanLevel) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  const handleAffiliateSignup = async () => {
    const email = prompt("Qual seu e-mail para cadastro de parceiro?");
    if (email) {
      await dbService.login(email, 'partner', true);
      window.location.reload();
    }
  };

  const pricingPlans = [
    { 
      id: 'free' as PlanLevel, 
      name: 'Teste Grátis', 
      price: '0', 
      desc: 'Explore todas as funcionalidades.',
      features: ['Acesso Completo por 7 dias', 'Todas as Redes Sociais', 'IA Especialista', 'Dashboard Completo', 'Sem Cartão de Crédito'] 
    },
    { 
      id: 'starter' as PlanLevel, 
      name: 'Starter', 
      price: '197', 
      desc: 'Ideal para pequenos negócios.',
      features: ['2 Redes Sociais', 'IA Básica', '500 Interações/mês', 'Suporte via Chat'] 
    },
    { 
      id: 'pro' as PlanLevel, 
      name: 'Pro', 
      price: '397', 
      featured: true,
      desc: 'O mais vendido para escala.',
      features: ['Todas as Redes (Unlimited)', 'IA Especialista Vendedora', 'Interações Ilimitadas', 'Dashboard de ROI', 'Media Studio AI (Veo)'] 
    },
    { 
      id: 'consultancy' as PlanLevel, 
      name: 'Consultoria VIP', 
      price: '1.497', 
      desc: 'Implementação feita por nós.',
      features: ['Tudo do Plano Pro', 'Setup Personalizado', 'Treinamento de Equipe', 'Gestor de Contas Dedicado'] 
    }
  ];

  const faqs = [
    { q: "A IA responde de forma humana?", a: "Sim, utilizamos o modelo Gemini 3 Pro treinado especificamente com a base de conhecimento do seu negócio para garantir respostas naturais e persuasivas." },
    { q: "Quais redes sociais são suportadas?", a: "Instagram (Direct/Story), Facebook, TikTok, Kwai, YouTube (Comentários) e WhatsApp Business API oficial." },
    { q: "Como funciona a multi-postagem?", a: "Você cria um conteúdo e a IA adapta automaticamente a legenda e o formato para cada rede, postando em todas simultaneamente com um clique." },
    { q: "O sistema é seguro contra bloqueios?", a: "Sim, operamos 100% via APIs oficiais das plataformas, garantindo a integridade e segurança total das suas contas." }
  ];

  return (
    <div className="bg-slate-900 min-h-screen text-white font-sans selection:bg-indigo-500 overflow-x-hidden">
      {/* Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full"></div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-500 p-2 rounded-xl shadow-lg shadow-indigo-500/20"><ShieldCheck size={24} /></div>
            <span className="text-xl font-bold tracking-tight">SocialFlow<span className="text-indigo-400">AI</span></span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-semibold text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Recursos</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">Como Funciona</a>
            <a href="#pricing" className="hover:text-white transition-colors">Preços</a>
            <a href="#affiliates" className="hover:text-white transition-colors font-bold text-indigo-400">Afiliados</a>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => onStart('free')} className="text-white text-sm font-bold hover:text-indigo-400 transition-colors hidden sm:block">Entrar</button>
            <button onClick={() => onStart('free')} className="bg-indigo-600 text-white px-6 py-2.5 rounded-2xl text-sm font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">Teste Grátis</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 pt-24 pb-32 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-full text-indigo-400 text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in">
          <Zap size={14} className="animate-pulse" /> Tecnologia 100% Brasileira
        </div>
        <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight">
          Sua Empresa Vendendo <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Enquanto Você Dorme.</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed">
          A primeira plataforma omnichannel com <strong>IA Generativa Especialista</strong>. 
          Responda comentários, Directs e WhatsApp de forma automática e humana.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-16">
          <button onClick={() => onStart('free')} className="w-full md:w-auto bg-white text-slate-900 px-10 py-5 rounded-2xl text-lg font-black flex items-center justify-center gap-3 hover:bg-indigo-400 hover:text-white hover:scale-105 transition-all shadow-2xl">
            Começar Agora Grátis <ArrowRight size={20} />
          </button>
          <button onClick={handleAffiliateSignup} className="w-full md:w-auto bg-slate-800/50 border border-slate-700 px-10 py-5 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all">
            Quero ser Parceiro <Gift size={20} />
          </button>
        </div>

        {/* Seção de Teste - Usuários de Teste */}
        <div className="max-w-2xl mx-auto mb-16 p-6 bg-slate-800/50 border border-slate-700 rounded-3xl">
          <p className="text-xs font-bold text-slate-400 uppercase text-center mb-4 tracking-widest">👨‍💻 Contas de Teste (Desenvolvimento)</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button 
              onClick={async () => {
                await dbService.createTestUsers.admin();
                window.location.reload();
              }}
              className="bg-purple-600/20 border border-purple-500/50 hover:bg-purple-600/40 text-purple-200 px-6 py-3 rounded-xl text-sm font-bold transition-all"
            >
              🔐 Admin
            </button>
            <button 
              onClick={async () => {
                await dbService.createTestUsers.client();
                window.location.reload();
              }}
              className="bg-blue-600/20 border border-blue-500/50 hover:bg-blue-600/40 text-blue-200 px-6 py-3 rounded-xl text-sm font-bold transition-all"
            >
              👤 Cliente
            </button>
            <button 
              onClick={async () => {
                await dbService.createTestUsers.affiliate();
                window.location.reload();
              }}
              className="bg-green-600/20 border border-green-500/50 hover:bg-green-600/40 text-green-200 px-6 py-3 rounded-xl text-sm font-bold transition-all"
            >
              🤝 Afiliado
            </button>
          </div>
        </div>

        {/* Dash Preview */}
        <div className="relative max-w-5xl mx-auto rounded-[3rem] border border-slate-700 bg-slate-800 p-4 shadow-2xl overflow-hidden group">
           <div className="absolute inset-0 bg-indigo-600/10 group-hover:bg-indigo-600/5 transition-all"></div>
           <div className="relative rounded-[2rem] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426" alt="Dashboard Preview" className="w-full h-auto" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button className="bg-white text-slate-900 p-6 rounded-full shadow-2xl scale-110"><PlayCircle size={48} fill="black" /></button>
              </div>
           </div>
        </div>
      </section>

      {/* Platforms Scroll */}
      <section className="py-12 border-y border-slate-800 bg-slate-950/50">
         <div className="max-w-7xl mx-auto px-6 overflow-hidden">
            <p className="text-center text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-10">Automação Nativa para Todas as Redes</p>
            <div className="flex justify-between items-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all gap-12 flex-wrap md:flex-nowrap">
               <span className="text-2xl font-black">WhatsApp</span>
               <span className="text-2xl font-black">Instagram</span>
               <span className="text-2xl font-black">TikTok</span>
               <span className="text-2xl font-black">Kwai</span>
               <span className="text-2xl font-black">Facebook</span>
               <span className="text-2xl font-black">YouTube</span>
            </div>
         </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="px-6 py-32 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block bg-indigo-500/20 text-indigo-400 px-4 py-1 rounded-full text-xs font-bold uppercase mb-4 tracking-widest">Poder da IA</div>
            <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Vendedor Especialista 24/7</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Sua IA não é um chatbot comum. Ela aprende sobre seu estoque, preços e tom de voz para fechar vendas reais.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <MessageSquare className="text-indigo-400" />, title: 'Omnichat com IA', desc: 'Sua IA aprende sobre seu negócio e responde como um vendedor especialista em qualquer canal.' },
              { icon: <Globe className="text-purple-400" />, title: 'Omnipost', desc: 'Publique em todas as redes de uma vez. A IA adapta legendas e formatos automaticamente.' },
              { icon: <Target className="text-pink-400" />, title: 'Leads Quentes', desc: 'Identificação automática de intenção de compra com alertas instantâneos no celular.' },
              { icon: <Zap className="text-yellow-400" />, title: 'Automação de Fluxo', desc: 'Seguiu de volta? Mandamos DM. Comentou no post? Respondemos com link.' },
              { icon: <Users className="text-blue-400" />, title: 'Multi-Negócios', desc: 'Gerencie dezenas de clientes ou empresas em perfis totalmente isolados e treinados.' },
              { icon: <BarChart3 className="text-emerald-400" />, title: 'Media Studio AI', desc: 'Crie vídeos e imagens cinematográficas para anúncios usando o modelo Veo 3.1.' },
            ].map((f, i) => (
              <div key={i} className="bg-slate-800/50 p-10 rounded-[2.5rem] border border-slate-700 hover:border-indigo-500/50 transition-all group">
                <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-32 px-6">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               <div>
                  <h2 className="text-4xl md:text-6xl font-black mb-12 tracking-tight">Do Zero ao Automático <br/><span className="text-indigo-500">em 10 Minutos.</span></h2>
                  <div className="space-y-12">
                     {[
                       { n: '01', t: 'Conecte seus Canais', d: 'Use o QR Code do WhatsApp e OAuth seguro do Instagram/TikTok.' },
                       { n: '02', t: 'Treine sua IA', d: 'Fale para a IA sobre seus produtos ou envie áudios com seus diferenciais.' },
                       { n: '03', t: 'Assista as Vendas', d: 'A IA assume as conversas e você acompanha os leads quentes no CRM.' }
                     ].map(step => (
                       <div key={step.n} className="flex gap-6 group">
                          <div className="text-4xl font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{step.n}</div>
                          <div>
                             <h4 className="text-xl font-bold mb-2">{step.t}</h4>
                             <p className="text-slate-500 leading-relaxed">{step.d}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
               <div className="relative">
                  <div className="absolute -inset-10 bg-indigo-600/20 blur-[100px] rounded-full"></div>
                  <div className="relative bg-slate-800 p-8 rounded-[3rem] border border-slate-700 shadow-2xl">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-indigo-500 rounded-full animate-pulse"></div>
                        <div className="flex-1 h-3 bg-slate-700 rounded-full"></div>
                     </div>
                     <div className="space-y-4">
                        <div className="w-[80%] h-12 bg-indigo-600/20 rounded-2xl border border-indigo-500/20 p-3 text-xs italic text-indigo-300">"Olá! Vi seu post, qual o preço?"</div>
                        <div className="w-[70%] h-16 bg-slate-700 rounded-2xl p-4 text-[10px] text-slate-400 ml-auto">IA Especialista pensando...</div>
                        <div className="w-[85%] h-20 bg-indigo-600 rounded-2xl p-4 text-xs font-medium ml-auto shadow-xl">"Olá! Nossas consultorias custam R$ 497. Quer agendar uma demonstração?"</div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Affiliate Program Section */}
      <section id="affiliates" className="py-32 bg-indigo-600 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1 rounded-full text-white text-xs font-bold uppercase mb-6">
                 <Award size={14}/> Programa de Parceiros SocialFlow
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Ganhe 30% Recorrente + <span className="text-indigo-200">Acesso Grátis</span></h2>
              <p className="text-indigo-100 text-lg mb-10 leading-relaxed">
                Indique o SocialFlow e receba comissões todos os meses enquanto seu cliente estiver ativo. E o melhor: você usa nosso sistema de graça para divulgar!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                 <div className="bg-white/10 p-6 rounded-[2rem] border border-white/20 backdrop-blur-sm">
                    <h4 className="font-bold text-white mb-2 flex items-center gap-2"><CheckCircle2 size={16}/> Comissões Mensais</h4>
                    <p className="text-indigo-200 text-xs">Receba 30% de cada mensalidade paga pelos seus indicados.</p>
                 </div>
                 <div className="bg-white/10 p-6 rounded-[2rem] border border-white/20 backdrop-blur-sm">
                    <h4 className="font-bold text-white mb-2 flex items-center gap-2"><CheckCircle2 size={16}/> Plano Parceiro</h4>
                    <p className="text-indigo-200 text-xs">Acesso total às ferramentas de IA sem pagar mensalidade.</p>
                 </div>
              </div>
              <button onClick={handleAffiliateSignup} className="bg-white text-indigo-600 px-10 py-5 rounded-[2rem] text-xl font-black hover:scale-105 transition-all shadow-2xl flex items-center gap-3">
                Cadastrar como Afiliado Agora <Rocket size={20} />
              </button>
           </div>
           <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-white/10 blur-[120px] rounded-full"></div>
              <div className="relative bg-slate-900 border border-indigo-400/30 p-10 rounded-[3.5rem] shadow-2xl transform rotate-3">
                 <div className="flex justify-between items-center mb-10">
                    <div className="text-xs font-black uppercase tracking-widest text-slate-500">Saldo Disponível</div>
                    <div className="text-emerald-400 font-black text-2xl tracking-tighter">R$ 4.240,50</div>
                 </div>
                 <div className="space-y-4">
                    {[
                      { n: 'Venda Pro #429', v: '+ R$ 119,10', d: 'Hoje' },
                      { n: 'Renovação #381', v: '+ R$ 59,10', d: 'Ontem' },
                      { n: 'Venda Starter #425', v: '+ R$ 59,10', d: 'Ontem' }
                    ].map((tx, i) => (
                      <div key={i} className="bg-slate-800 p-4 rounded-2xl flex justify-between items-center border border-slate-700">
                         <div className="text-xs font-bold text-slate-200">{tx.n}</div>
                         <div className="text-right">
                            <p className="text-emerald-400 font-black text-xs">{tx.v}</p>
                            <p className="text-[10px] text-slate-500 uppercase">{tx.d}</p>
                         </div>
                      </div>
                    ))}
                 </div>
                 <button className="w-full mt-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest">Solicitar Saque PIX</button>
              </div>
           </div>
        </div>
      </section>

      {/* Pricing Table */}
      <section id="pricing" className="py-32 px-6 bg-slate-950/50">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
               <h2 className="text-4xl md:text-6xl font-black mb-4">Escolha sua Escala</h2>
               <p className="text-slate-500">Cancele quando quiser. Upgrade instantâneo.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {pricingPlans.map(plan => (
                 <div key={plan.id} className={`p-10 rounded-[3rem] border transition-all flex flex-col ${plan.featured ? 'bg-indigo-600 border-indigo-400 shadow-2xl scale-105 z-10' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}>
                    <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter">{plan.name}</h3>
                    <p className={`${plan.featured ? 'text-indigo-200' : 'text-slate-500'} text-xs mb-8`}>{plan.desc}</p>
                    <div className="mb-10 flex items-baseline gap-1">
                       <span className="text-4xl font-black">R$ {plan.price}</span>
                       <span className={`${plan.featured ? 'text-indigo-200' : 'text-slate-500'} text-sm`}>/mês</span>
                    </div>
                    <ul className="space-y-4 mb-12 flex-1">
                       {plan.features.map(f => (
                         <li key={f} className="flex items-center gap-3 text-xs font-medium">
                            <CheckCircle2 size={16} className={plan.featured ? 'text-white' : 'text-indigo-500'} /> {f}
                         </li>
                       ))}
                    </ul>
                    <button 
                      onClick={() => onStart(plan.id)}
                      className={`w-full py-5 rounded-2xl font-black transition-all ${plan.featured ? 'bg-white text-indigo-600 hover:bg-slate-100' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                    >
                      Começar Agora
                    </button>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* FAQ */}
      <section className="py-32 px-6 max-w-4xl mx-auto">
         <h2 className="text-3xl font-black mb-12 text-center uppercase tracking-widest">Dúvidas Frequentes</h2>
         <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
                 <button 
                   onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                   className="w-full p-6 text-left flex justify-between items-center"
                 >
                    <span className="font-bold text-sm">{faq.q}</span>
                    <ChevronDown size={20} className={`transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
                 </button>
                 {activeFaq === i && (
                   <div className="px-6 pb-6 text-slate-400 text-sm leading-relaxed animate-in fade-in slide-in-from-top-2">
                      {faq.a}
                   </div>
                 )}
              </div>
            ))}
         </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 px-6 text-center">
         <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[4rem] p-16 max-w-5xl mx-auto shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full"></div>
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">Chega de perder vendas por demora no atendimento.</h2>
            <p className="text-indigo-100 text-lg mb-12">Teste o SocialFlow AI grátis por 7 dias e sinta o poder da automação humana.</p>
            <button onClick={() => onStart('free')} className="bg-white text-indigo-600 px-12 py-6 rounded-[2rem] text-xl font-black hover:scale-105 transition-all shadow-xl">
               Ativar Minha IA Agora
            </button>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
           <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                 <div className="bg-indigo-500 p-2 rounded-xl text-white"><ShieldCheck size={24} /></div>
                 <span className="text-xl font-bold">SocialFlow<span className="text-indigo-400">AI</span></span>
              </div>
              <p className="text-slate-500 text-sm max-w-sm">A solução definitiva para automação de vendas e atendimento omnichannel com inteligência artificial generativa brasileira.</p>
           </div>
           <div>
              <h4 className="font-bold mb-6 text-xs uppercase tracking-widest text-white">Plataforma</h4>
              <ul className="space-y-4 text-slate-500 text-sm">
                 <li className="hover:text-white transition-colors cursor-pointer">Recursos</li>
                 <li className="hover:text-white transition-colors cursor-pointer">Segurança</li>
                 <li className="hover:text-white transition-colors cursor-pointer">Preços</li>
                 <li className="hover:text-white transition-colors cursor-pointer font-bold text-indigo-400">Afiliados</li>
              </ul>
           </div>
           <div>
              <h4 className="font-bold mb-6 text-xs uppercase tracking-widest text-white">Suporte</h4>
              <ul className="space-y-4 text-slate-500 text-sm">
                 <li className="hover:text-white transition-colors cursor-pointer">Central de Ajuda</li>
                 <li className="hover:text-white transition-colors cursor-pointer">API Docs</li>
                 <li className="hover:text-white transition-colors cursor-pointer">Status</li>
                 <li className="hover:text-white transition-colors cursor-pointer">Termos de Uso</li>
              </ul>
           </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 border-t border-slate-900 pt-12">
          <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">© 2025 SocialFlow AI Corporation. Feito com <Heart size={10} className="inline text-red-500" /> no Brasil.</p>
          <div className="flex gap-6">
             <div className="text-slate-500 hover:text-white cursor-pointer transition-colors"><MessageCircle size={20} /></div>
             <div className="text-slate-500 hover:text-white cursor-pointer transition-colors"><Globe size={20} /></div>
          </div>
        </div>
      </footer>
    </div>
  );
};
