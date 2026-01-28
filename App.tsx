
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Omnipost } from './components/Omnipost';
import { Automations } from './components/Automations';
import { Omnichat } from './components/Omnichat';
import { LeadsCRM } from './components/LeadsCRM';
import { ApiSettings } from './components/ApiSettings';
import { ConnectionModal } from './components/ConnectionModal';
import { LandingPage } from './components/LandingPage';
import { CheckoutModal } from './components/CheckoutModal';
import { TeamManagement } from './components/TeamManagement';
import { IdentityVerification } from './components/IdentityVerification';
import { MediaStudio } from './components/MediaStudio';
import { Reports } from './components/Reports';
import { AffiliateDashboard } from './components/AffiliateDashboard';
import { BusinessProfile, SocialAccount, ActivityLog, Lead, Platform, User, PlanLevel, UserPermission } from './types';
import { dbService } from './services/dbService';
import { ChevronDown, Plus, Building2, Briefcase, LogOut, Crown, ShieldAlert } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'dashboard' | 'omnipost' | 'automations' | 'chat' | 'leads' | 'settings' | 'team' | 'media' | 'reports' | 'affiliates'>('dashboard');
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
  const [activeBusiness, setActiveBusiness] = useState<BusinessProfile | null>(null);
  
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [connectingPlatform, setConnectingPlatform] = useState<Platform | null>(null);
  const [checkoutPlan, setCheckoutPlan] = useState<PlanLevel | null>(null);
  const [showIdentityModal, setShowIdentityModal] = useState(false);

  console.log('🔍 App montado, user:', user);

  useEffect(() => {
    console.log('📌 useEffect rodando');
    // Capturar afiliado da URL
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) dbService.trackReferralClick(ref);

    const currentUser = dbService.getCurrentUser();
    console.log('👤 Current user:', currentUser);
    if (currentUser) {
      setUser(currentUser);
      loadBusinesses(currentUser);
    } else {
      console.log('⚠️ Nenhum usuário encontrado, mostrando landing page');
    }
  }, []);

  const loadBusinesses = async (currentUser: User) => {
    const b = await dbService.getBusinesses();
    setBusinesses(b);
    if (b.length > 0) setActiveBusiness(b[0]);
  };

  useEffect(() => {
    if (!activeBusiness) return;
    const loadData = async () => {
      const bId = activeBusiness.id;
      setAccounts(await dbService.getAccounts(bId));
      setLeads(await dbService.getLeads(bId));
      setLogs(await dbService.getLogs(bId));
    };
    loadData();
  }, [activeBusiness, view]);

  const handleStartPlan = async (plan: PlanLevel) => {
    if (plan === 'free') {
       // Usuário de teste sem checkout
       const newUser = await dbService.login('teste@socialflow.ai', 'free');
       setUser(newUser);
       const businesses = await dbService.getBusinesses();
       if (businesses.length === 0) {
         // Criar negócio de teste automático
         const testBusiness: BusinessProfile = {
           id: `b_${Date.now()}`,
           ownerId: newUser.id,
           name: 'Negócio de Teste',
           industry: 'Consultoria',
           knowledgeBase: 'Esta é uma conta de teste para explorar todas as funcionalidades',
           createdAt: new Date(),
           verified: false
         };
         const saved = await dbService.saveBusiness(testBusiness);
         setBusinesses(saved);
         setActiveBusiness(testBusiness);
       } else {
         setBusinesses(businesses);
         setActiveBusiness(businesses[0]);
       }
    } else {
       setCheckoutPlan(plan);
    }
  };

  const handleCheckoutSuccess = async () => {
    if (checkoutPlan) {
      const newUser = await dbService.login('cliente@exemplo.com', checkoutPlan);
      setUser(newUser);
      setCheckoutPlan(null);
      setShowIdentityModal(true);
    }
  };

  const handleCreateBusiness = async () => {
    const name = prompt("Nome do novo Negócio/Empresa:");
    if (!name) return;
    try {
      const newB: BusinessProfile = {
        id: `b_${Date.now()}`,
        ownerId: user!.id,
        name,
        industry: 'Geral',
        knowledgeBase: '',
        createdAt: new Date(),
        verified: false
      };
      const updated = await dbService.saveBusiness(newB);
      setBusinesses(updated);
      setActiveBusiness(newB);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleConnectionSuccess = async (accountData: Partial<SocialAccount>) => {
    if (!activeBusiness) return;
    const newAccount: SocialAccount = {
      id: `acc_${Date.now()}`,
      businessId: activeBusiness.id,
      platform: accountData.platform!,
      username: accountData.username || `${accountData.platform}_${Math.floor(Math.random() * 1000)}`,
      avatar: '',
      status: 'connected',
      lastSync: 'Agora',
      apiHealth: 100
    };
    await dbService.saveAccount(newAccount);
    setAccounts(await dbService.getAccounts(activeBusiness.id));
  };

  if (!user) {
    console.log('✅ Renderizando LandingPage');
    return (
      <>
        <LandingPage onStart={handleStartPlan} />
        {checkoutPlan && (
          <CheckoutModal 
            plan={checkoutPlan} 
            onClose={() => setCheckoutPlan(null)} 
            onSuccess={handleCheckoutSuccess} 
          />
        )}
      </>
    );
  }

  console.log('✅ Renderizando Dashboard');
  const userPermissions = user.permissions || [];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      <Sidebar currentView={view} setView={setView} permissions={userPermissions} />
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative group">
               <button className="flex items-center gap-3 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-2xl transition-all border border-slate-200">
                 <div className="bg-indigo-600 p-1.5 rounded-lg text-white"><Briefcase size={14} /></div>
                 <div className="text-left">
                    <p className="text-[9px] font-bold text-slate-400 uppercase leading-none mb-0.5">Perfil Ativo</p>
                    <p className="text-xs font-black text-slate-800 flex items-center gap-2">{activeBusiness?.name || 'Nenhum Negócio'} <ChevronDown size={12} /></p>
                 </div>
               </button>
               
               {user.role === 'owner' && (
                 <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-3 hidden group-hover:block animate-in fade-in slide-in-from-top-2 z-50">
                    <p className="text-[10px] font-bold text-slate-400 uppercase p-2 tracking-widest">Meus Negócios</p>
                    <div className="space-y-1 max-h-60 overflow-y-auto">
                      {businesses.map(b => (
                        <button 
                          key={b.id} 
                          onClick={() => setActiveBusiness(b)}
                          className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-colors ${activeBusiness?.id === b.id ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-600'}`}
                        >
                          <Building2 size={16} />
                          <span className="text-xs font-bold">{b.name}</span>
                        </button>
                      ))}
                    </div>
                    <button 
                      onClick={handleCreateBusiness}
                      className="w-full mt-3 p-3 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-800"
                    >
                      <Plus size={14} /> Novo Negócio
                    </button>
                 </div>
               )}
            </div>
          </div>

          <div className="flex items-center gap-6">
             {!user.identityVerified && (
               <button 
                 onClick={() => setShowIdentityModal(true)}
                 className="flex items-center gap-2 bg-amber-50 text-amber-700 border border-amber-200 px-4 py-2 rounded-xl text-[10px] font-bold uppercase animate-pulse"
               >
                 <ShieldAlert size={14} /> Verificar Identidade
               </button>
             )}

             <div className="flex items-center gap-3 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100">
                <Crown size={16} className="text-indigo-600" />
                <div className="text-left">
                   <p className="text-[9px] font-bold text-indigo-400 uppercase leading-none mb-0.5">Plano Atual</p>
                   <p className="text-xs font-black text-indigo-700 capitalize">{user.plan}</p>
                </div>
             </div>
             
             <div className="h-8 w-[1px] bg-slate-200"></div>

             <div className="flex items-center gap-4">
               <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-800">{user.name}</span>
                  <button onClick={() => dbService.logout()} className="text-[10px] font-bold text-red-400 uppercase flex items-center gap-1 justify-end hover:text-red-600 transition-colors">
                     Sair da Conta <LogOut size={10} />
                  </button>
               </div>
               <div className="w-10 h-10 rounded-xl bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-400">
                 {user.name[0]}
               </div>
             </div>
          </div>
        </header>

        <div className="p-8">
           {activeBusiness ? (
             <>
               {view === 'dashboard' && <Dashboard businessId={activeBusiness.id} accounts={accounts} logs={logs} onConnect={setConnectingPlatform} onDeleteAccount={async (id) => { setAccounts(await dbService.deleteAccount(id)); }} />}
               {view === 'media' && userPermissions.includes('manage_media') && <MediaStudio businessId={activeBusiness.id} />}
               {view === 'reports' && userPermissions.includes('view_reports') && <Reports businessId={activeBusiness.id} leads={leads} />}
               {view === 'affiliates' && userPermissions.includes('view_affiliates') && <AffiliateDashboard />}
               {view === 'omnipost' && userPermissions.includes('manage_posts') && <Omnipost accounts={accounts} businessContext={activeBusiness.knowledgeBase} />}
               {view === 'automations' && userPermissions.includes('manage_automations') && <Automations business={activeBusiness} onSaveBusiness={async (updated) => { const list = await dbService.saveBusiness(updated); setBusinesses(list); setActiveBusiness(updated); }} />}
               {view === 'chat' && userPermissions.includes('manage_chat') && <Omnichat accounts={accounts} businessContext={activeBusiness.knowledgeBase} />}
               {view === 'leads' && userPermissions.includes('view_leads') && <LeadsCRM leads={leads} />}
               {view === 'team' && userPermissions.includes('manage_team') && <TeamManagement businessId={activeBusiness.id} />}
               {view === 'settings' && userPermissions.includes('manage_settings') && <ApiSettings />}
             </>
           ) : (
             <div className="flex flex-col items-center justify-center h-[70vh] text-center">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-6">
                   <Building2 size={40} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Pronto para começar?</h2>
                <button onClick={handleCreateBusiness} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold">Criar Primeiro Perfil</button>
             </div>
           )}
        </div>
      </main>

      {connectingPlatform && (
        <ConnectionModal 
          platform={connectingPlatform} 
          onClose={() => setConnectingPlatform(null)} 
          onSuccess={handleConnectionSuccess} 
        />
      )}

      {showIdentityModal && (
        <IdentityVerification 
          onSuccess={() => { setUser(dbService.getCurrentUser()); setShowIdentityModal(false); }} 
          onClose={() => setShowIdentityModal(false)}
        />
      )}
    </div>
  );
};

export default App;
