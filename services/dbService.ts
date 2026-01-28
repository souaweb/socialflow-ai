
import { 
  Lead, ActivityLog, SocialAccount, BusinessProfile, User, 
  PlanLevel, UserPermission, Transaction, SubscriptionStatus, 
  AffiliateStats, GatewayType, ReferralRecord 
} from '../types';

// URL da sua API na Hostinger
const API_URL = '/api/index.php';

async function apiFetch(action: string, method: 'GET' | 'POST' = 'GET', body?: any) {
  const url = new URL(window.location.origin + API_URL);
  url.searchParams.append('action', action);
  
  if (method === 'GET' && body) {
    Object.keys(body).forEach(key => url.searchParams.append(key, body[key]));
  }

  const response = await fetch(url.toString(), {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: method === 'POST' ? JSON.stringify(body) : undefined
  });

  return response.json();
}

export const dbService = {
  getCurrentUser: (): User | null => {
    const data = localStorage.getItem('socialflow_user');
    if (!data) return null;
    const user = JSON.parse(data);
    if (user.nextBillingDate) user.nextBillingDate = new Date(user.nextBillingDate);
    return user;
  },

  login: async (email: string, plan: PlanLevel = 'free', isAffiliate: boolean = false): Promise<User> => {
    // Para desenvolvimento, usar localStorage apenas
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    const user: User = {
      id: 'u_' + Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      role: isAffiliate ? 'affiliate' : 'owner',
      plan: isAffiliate ? 'partner' : plan,
      subscriptionActive: true,
      subscriptionStatus: 'active',
      nextBillingDate: nextMonth,
      identityVerified: false,
      affiliateCode: Math.random().toString(36).substr(2, 6).toUpperCase(),
      permissions: ['view_dashboard', 'manage_posts', 'manage_chat', 'view_leads', 'manage_automations', 'manage_team', 'manage_settings', 'manage_media', 'view_reports', 'view_affiliates']
    };

    localStorage.setItem('socialflow_user', JSON.stringify(user));
    return user;
  },

  getBusinesses: async (): Promise<BusinessProfile[]> => {
    const user = dbService.getCurrentUser();
    if (!user) return [];
    // Para desenvolvimento, retornar dados do localStorage
    const data = localStorage.getItem('socialflow_businesses');
    return data ? JSON.parse(data) : [];
  },

  saveBusiness: async (business: BusinessProfile) => {
    const user = dbService.getCurrentUser();
    if (!user) return [];
    // Para desenvolvimento, salvar no localStorage
    let businesses = [];
    const data = localStorage.getItem('socialflow_businesses');
    if (data) {
      businesses = JSON.parse(data);
      const index = businesses.findIndex((b: BusinessProfile) => b.id === business.id);
      if (index >= 0) {
        businesses[index] = business;
      } else {
        businesses.push(business);
      }
    } else {
      businesses = [business];
    }
    localStorage.setItem('socialflow_businesses', JSON.stringify(businesses));
    return businesses;
  },

  getStats: async (businessId: string) => {
    // Em produção, isso seria uma query SQL COUNT no PHP
    const logs = await dbService.getLogs(businessId);
    return {
      totalInteractions: logs.length,
      conversionRate: 15, // Simulado ou calculado via SQL
      hotLeads: 5,
      aiInteractions: logs.filter(l => l.aiResponse).length
    };
  },

  getAccounts: async (businessId: string): Promise<SocialAccount[]> => {
    // Para desenvolvimento, retornar dados do localStorage
    const data = localStorage.getItem(`socialflow_accounts_${businessId}`);
    return data ? JSON.parse(data) : [];
  },

  saveAccount: async (account: SocialAccount) => {
    // Para desenvolvimento, salvar no localStorage
    const businessId = account.businessId;
    let accounts = [];
    const data = localStorage.getItem(`socialflow_accounts_${businessId}`);
    if (data) {
      accounts = JSON.parse(data);
      const index = accounts.findIndex((a: SocialAccount) => a.id === account.id);
      if (index >= 0) {
        accounts[index] = account;
      } else {
        accounts.push(account);
      }
    } else {
      accounts = [account];
    }
    localStorage.setItem(`socialflow_accounts_${businessId}`, JSON.stringify(accounts));
    return account;
  },

  deleteAccount: async (id: string) => {
     // Para desenvolvimento, remover do localStorage
     // Encontrar qual negócio tem essa conta
     const businessData = localStorage.getItem('socialflow_businesses');
     if (businessData) {
       const businesses = JSON.parse(businessData);
       for (const business of businesses) {
         const accountsData = localStorage.getItem(`socialflow_accounts_${business.id}`);
         if (accountsData) {
           const accounts = JSON.parse(accountsData).filter((a: SocialAccount) => a.id !== id);
           localStorage.setItem(`socialflow_accounts_${business.id}`, JSON.stringify(accounts));
         }
       }
     }
     const user = dbService.getCurrentUser();
     return user ? dbService.getAccounts(user.id) : [];
  },

  getLeads: async (businessId: string): Promise<Lead[]> => {
    // Para desenvolvimento, retornar dados do localStorage
    const data = localStorage.getItem(`socialflow_leads_${businessId}`);
    return data ? JSON.parse(data) : [];
  },

  getLogs: async (businessId: string): Promise<ActivityLog[]> => {
    // Para desenvolvimento, retornar dados do localStorage
    const data = localStorage.getItem(`socialflow_logs_${businessId}`);
    return data ? JSON.parse(data) : [];
  },

  getTransactions: (): Transaction[] => {
    const data = localStorage.getItem('socialflow_transactions');
    return data ? JSON.parse(data).map((t: any) => ({ ...t, date: new Date(t.date) })) : [];
  },

  addTransaction: async (amount: number, method: 'card' | 'pix', plan: PlanLevel, gateway: GatewayType) => {
    const newTx: Transaction = {
      id: 'tx_' + Math.random().toString(36).substr(2, 9),
      amount, 
      status: 'paid', 
      method, 
      gateway, 
      date: new Date(), 
      plan
    };
    // Para desenvolvimento, salvar no localStorage
    let transactions = [];
    const data = localStorage.getItem('socialflow_transactions');
    if (data) {
      transactions = JSON.parse(data);
    }
    transactions.push(newTx);
    localStorage.setItem('socialflow_transactions', JSON.stringify(transactions));
    return transactions;
  },

  trackReferralClick: (code: string) => {
    localStorage.setItem('pending_referral', code);
  },

  getAffiliateStats: (code: string): AffiliateStats => {
    return { clicks: 0, referrals: 0, totalEarned: 0, balance: 0, records: [] };
  },

  verifyIdentity: async (type: 'CPF' | 'CNPJ', number: string) => {
    const user = dbService.getCurrentUser();
    if (user) {
      user.identityVerified = true;
      user.identityType = type;
      user.identityNumber = number;
      localStorage.setItem('socialflow_user', JSON.stringify(user));
      return user;
    }
    return null;
  },

  // Added updateSubscription to handle plan upgrades and status changes from checkout
  updateSubscription: async (plan: PlanLevel, status: SubscriptionStatus) => {
    const user = dbService.getCurrentUser();
    if (user) {
      user.plan = plan;
      user.subscriptionStatus = status;
      user.subscriptionActive = status === 'active';
      if (status === 'active') {
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        user.nextBillingDate = nextMonth;
      }
      localStorage.setItem('socialflow_user', JSON.stringify(user));
      return user;
    }
    return null;
  },

  getTeamMembers: async (businessId: string): Promise<User[]> => {
    const data = localStorage.getItem(`socialflow_team_${businessId}`);
    return data ? JSON.parse(data) : [];
  },

  addTeamMember: async (businessId: string, name: string, email: string, permissions: UserPermission[]): Promise<User[]> => {
    const newMember: User = {
      id: 'u_' + Math.random().toString(36).substr(2, 9),
      name,
      email,
      role: 'member',
      plan: 'free',
      subscriptionActive: true,
      subscriptionStatus: 'active',
      nextBillingDate: new Date(),
      identityVerified: false,
      affiliateCode: Math.random().toString(36).substr(2, 6).toUpperCase(),
      permissions
    };

    let team = [];
    const data = localStorage.getItem(`socialflow_team_${businessId}`);
    if (data) team = JSON.parse(data);
    
    team.push(newMember);
    localStorage.setItem(`socialflow_team_${businessId}`, JSON.stringify(team));
    
    return team;
  },

  deleteTeamMember: async (userId: string, businessId: string): Promise<User[]> => {
    let team = [];
    const data = localStorage.getItem(`socialflow_team_${businessId}`);
    if (data) {
      team = JSON.parse(data).filter((u: User) => u.id !== userId);
      localStorage.setItem(`socialflow_team_${businessId}`, JSON.stringify(team));
    }
    return team;
  },

  logout: () => {
    localStorage.removeItem('socialflow_user');
    window.location.reload();
  },

  // Funções de teste para criar usuários de teste
  createTestUsers: {
    admin: async () => {
      const user = {
        id: 'u_admin_001',
        name: 'Admin',
        email: 'admin@socialflow.ai',
        role: 'owner' as const,
        plan: 'consultancy' as PlanLevel,
        subscriptionActive: true,
        subscriptionStatus: 'active' as SubscriptionStatus,
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        identityVerified: true,
        identityType: 'CNPJ' as const,
        identityNumber: '12.345.678/0001-90',
        affiliateCode: 'ADMIN001',
        permissions: ['view_dashboard', 'manage_posts', 'manage_chat', 'view_leads', 'manage_automations', 'manage_team', 'manage_settings', 'manage_media', 'view_reports', 'view_affiliates'] as UserPermission[]
      };
      localStorage.setItem('socialflow_user', JSON.stringify(user));
      
      // Criar negócios de teste
      const adminBusiness: BusinessProfile = {
        id: 'b_admin_001',
        ownerId: user.id,
        name: 'Agência Admin',
        industry: 'Marketing Digital',
        knowledgeBase: 'Somos uma agência especializada em automação de vendas com IA',
        createdAt: new Date(),
        verified: true
      };
      let businesses = [];
      const bizData = localStorage.getItem('socialflow_businesses');
      if (bizData) businesses = JSON.parse(bizData);
      if (!businesses.find((b: BusinessProfile) => b.id === adminBusiness.id)) {
        businesses.push(adminBusiness);
        localStorage.setItem('socialflow_businesses', JSON.stringify(businesses));
      }
      
      // Criar contas sociais de teste
      const testAccounts: SocialAccount[] = [
        {
          id: 'acc_admin_ig_001',
          businessId: adminBusiness.id,
          platform: 'instagram',
          username: 'agencia.admin',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=instagram',
          status: 'connected',
          lastSync: 'Agora',
          apiHealth: 100
        },
        {
          id: 'acc_admin_fb_001',
          businessId: adminBusiness.id,
          platform: 'facebook',
          username: 'agencia.admin',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=facebook',
          status: 'connected',
          lastSync: '5 min',
          apiHealth: 95
        }
      ];
      localStorage.setItem(`socialflow_accounts_${adminBusiness.id}`, JSON.stringify(testAccounts));
      
      return user;
    },
    
    client: async () => {
      const user = {
        id: 'u_client_001',
        name: 'João Cliente',
        email: 'cliente@example.com',
        role: 'owner' as const,
        plan: 'pro' as PlanLevel,
        subscriptionActive: true,
        subscriptionStatus: 'active' as SubscriptionStatus,
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        identityVerified: true,
        identityType: 'CPF' as const,
        identityNumber: '123.456.789-00',
        affiliateCode: 'CLI001',
        permissions: ['view_dashboard', 'manage_posts', 'manage_chat', 'view_leads', 'manage_automations', 'manage_team', 'manage_settings', 'manage_media', 'view_reports'] as UserPermission[]
      };
      localStorage.setItem('socialflow_user', JSON.stringify(user));
      
      const clientBusiness: BusinessProfile = {
        id: 'b_client_001',
        ownerId: user.id,
        name: 'E-commerce João',
        industry: 'E-commerce',
        knowledgeBase: 'Vendemos produtos de moda e estilo para todo Brasil',
        createdAt: new Date(),
        verified: false
      };
      let businesses = [];
      const bizData = localStorage.getItem('socialflow_businesses');
      if (bizData) businesses = JSON.parse(bizData);
      if (!businesses.find((b: BusinessProfile) => b.id === clientBusiness.id)) {
        businesses.push(clientBusiness);
        localStorage.setItem('socialflow_businesses', JSON.stringify(businesses));
      }
      
      const testAccounts: SocialAccount[] = [
        {
          id: 'acc_client_ig_001',
          businessId: clientBusiness.id,
          platform: 'instagram',
          username: 'ecommerce.joao',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao',
          status: 'connected',
          lastSync: 'Agora',
          apiHealth: 100
        }
      ];
      localStorage.setItem(`socialflow_accounts_${clientBusiness.id}`, JSON.stringify(testAccounts));
      
      return user;
    },
    
    affiliate: async () => {
      const user = {
        id: 'u_affiliate_001',
        name: 'Maria Afiliada',
        email: 'afiliada@example.com',
        role: 'affiliate' as const,
        plan: 'partner' as PlanLevel,
        subscriptionActive: true,
        subscriptionStatus: 'active' as SubscriptionStatus,
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        identityVerified: true,
        identityType: 'CPF' as const,
        identityNumber: '987.654.321-11',
        affiliateCode: 'MARIA001',
        permissions: ['view_affiliates', 'view_reports'] as UserPermission[]
      };
      localStorage.setItem('socialflow_user', JSON.stringify(user));
      
      return user;
    }
  }
};