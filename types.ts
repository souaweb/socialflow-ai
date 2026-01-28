
export type Platform = 'instagram' | 'facebook' | 'tiktok' | 'youtube' | 'whatsapp' | 'kwai';
export type PlanLevel = 'free' | 'starter' | 'pro' | 'consultancy' | 'partner';
export type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'canceled' | 'unpaid';
export type GatewayType = 'asaas' | 'mercadopago' | 'stripe';

export type UserPermission = 
  | 'view_dashboard' 
  | 'manage_posts' 
  | 'manage_chat' 
  | 'view_leads' 
  | 'manage_automations' 
  | 'manage_team' 
  | 'manage_settings'
  | 'manage_media'
  | 'view_reports'
  | 'view_affiliates';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'affiliate';
  plan: PlanLevel;
  subscriptionActive: boolean;
  subscriptionStatus?: SubscriptionStatus;
  nextBillingDate?: Date;
  permissions: UserPermission[];
  businessId?: string;
  identityVerified: boolean;
  identityType?: 'CPF' | 'CNPJ';
  identityNumber?: string;
  affiliateCode?: string;
  referredBy?: string;
}

export interface BusinessProfile {
  id: string;
  ownerId: string;
  name: string;
  industry: string;
  knowledgeBase: string;
  createdAt: Date;
  verified: boolean;
}

export interface SocialAccount {
  id: string;
  businessId: string;
  platform: Platform;
  username: string;
  avatar: string;
  status: 'connected' | 'disconnected';
  lastSync: string;
  apiHealth: number;
}

export interface ActivityLog {
  id: string;
  businessId: string;
  platform: Platform;
  user: string;
  timestamp: Date | string;
  content: string;
  aiResponse?: string;
}

export interface Lead {
  id: string;
  businessId: string;
  name: string;
  platform: Platform;
  status: 'hot' | 'warm' | 'cold';
  lastInteraction: Date | string;
  summary: string;
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  platform: 'whatsapp' | 'instagram' | 'facebook';
  isAi: boolean;
  intent?: string;
}

export interface ReferralRecord {
  id: string;
  name: string;
  email: string;
  status: 'lead' | 'trial' | 'active' | 'cancelled';
  date: Date;
  commission: number;
}

export interface AffiliateStats {
  clicks: number;
  referrals: number;
  totalEarned: number;
  balance: number;
  lastPaymentDate?: Date;
  records: ReferralRecord[];
}

export interface Transaction {
  id: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  method: 'card' | 'pix';
  gateway: GatewayType;
  date: Date;
  plan: PlanLevel;
  affiliateId?: string;
  commissionAmount?: number;
}
