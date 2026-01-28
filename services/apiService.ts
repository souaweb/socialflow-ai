/**
 * API Service - Integração com Backend NestJS
 * 
 * Este arquivo centraliza todas as chamadas HTTP para o backend
 */

import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Adicionar token JWT em cada requisição
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Tratamento de erros
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expirado, fazer logout
          localStorage.removeItem('access_token');
          window.location.href = '/';
        }
        return Promise.reject(error);
      },
    );
  }

  // ==================== AUTH ====================

  async register(email: string, name: string, password: string) {
    const response = await this.api.post('/auth/register', {
      email,
      name,
      password,
    });
    const { access_token } = response.data;
    localStorage.setItem('access_token', access_token);
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.api.post('/auth/login', { email, password });
    const { access_token } = response.data;
    localStorage.setItem('access_token', access_token);
    return response.data;
  }

  async logout() {
    localStorage.removeItem('access_token');
    return { message: 'Logout realizado' };
  }

  async getCurrentUser() {
    const response = await this.api.get('/auth/me');
    return response.data;
  }

  // ==================== OAUTH ====================

  async getMetaOAuthUrl() {
    const response = await this.api.get('/auth/oauth/meta/url');
    return response.data;
  }

  async getTikTokOAuthUrl() {
    const response = await this.api.get('/auth/oauth/tiktok/url');
    return response.data;
  }

  async getYoutubeOAuthUrl() {
    const response = await this.api.get('/auth/oauth/youtube/url');
    return response.data;
  }

  // ==================== PLATFORMS ====================

  async getConnectedPlatforms() {
    const response = await this.api.get('/platforms');
    return response.data;
  }

  async disconnectPlatform(accountId: string) {
    const response = await this.api.post(`/platforms/disconnect/${accountId}`);
    return response.data;
  }

  // ==================== CONVERSATIONS ====================

  async getConversations(platform?: string) {
    const params = platform ? { platform } : {};
    const response = await this.api.get('/conversations', { params });
    return response.data;
  }

  async getMessages(conversationId: string) {
    const response = await this.api.get(`/conversations/${conversationId}/messages`);
    return response.data;
  }

  async sendMessage(conversationId: string, message: string, platform: string) {
    const response = await this.api.post(
      `/conversations/${conversationId}/messages`,
      { message, platform },
    );
    return response.data;
  }

  async syncConversations() {
    const response = await this.api.post('/conversations/sync');
    return response.data;
  }

  // ==================== POSTS ====================

  async createPost(content: string, media: string[], hashtags: string[]) {
    const response = await this.api.post('/posts', {
      content,
      media,
      hashtags,
    });
    return response.data;
  }

  async schedulePost(
    postId: string,
    scheduledFor: Date,
    accounts: string[],
  ) {
    const response = await this.api.post(`/posts/${postId}/schedule`, {
      scheduledFor,
      accounts,
    });
    return response.data;
  }

  async publishPost(postId: string, accounts: string[]) {
    const response = await this.api.post(`/posts/${postId}/publish`, {
      accounts,
    });
    return response.data;
  }

  async replicatePost(postId: string, accounts: string[]) {
    const response = await this.api.post(`/posts/${postId}/replicate`, {
      accounts,
    });
    return response.data;
  }

  async getPostStats(postId: string, accountId: string) {
    const response = await this.api.get(`/posts/${postId}/stats`, {
      params: { accountId },
    });
    return response.data;
  }

  // ==================== CRM ====================

  async getLeads(quality?: string) {
    const params = quality ? { quality } : {};
    const response = await this.api.get('/crm/leads', { params });
    return response.data;
  }

  async createLead(leadData: any) {
    const response = await this.api.post('/crm/leads', leadData);
    return response.data;
  }

  async updateLead(leadId: string, updates: any) {
    const response = await this.api.put(`/crm/leads/${leadId}`, updates);
    return response.data;
  }

  async tagLead(leadId: string, tags: string[]) {
    const response = await this.api.post(`/crm/leads/${leadId}/tags`, { tags });
    return response.data;
  }

  async scheduleFollowUp(
    leadId: string,
    scheduledFor: Date,
    message: string,
  ) {
    const response = await this.api.post(
      `/crm/leads/${leadId}/followup`,
      { scheduledFor, message },
    );
    return response.data;
  }

  async getLeadScore(leadId: string) {
    const response = await this.api.get(`/crm/leads/${leadId}/score`);
    return response.data;
  }

  // ==================== IA ====================

  async analyzeMessage(message: string, context?: any) {
    const response = await this.api.post('/ai/analyze', {
      message,
      context,
    });
    return response.data;
  }

  async generateResponse(
    message: string,
    businessContext: any,
    conversationHistory?: any[],
  ) {
    const response = await this.api.post('/ai/generate-response', {
      message,
      businessContext,
      conversationHistory,
    });
    return response.data;
  }

  async detectPurchaseIntent(message: string) {
    const response = await this.api.post('/ai/purchase-intent', {
      message,
    });
    return response.data;
  }

  async extractFacts(text: string) {
    const response = await this.api.post('/ai/extract-facts', { text });
    return response.data;
  }

  async generateHashtags(content: string, platform: string) {
    const response = await this.api.post('/ai/generate-hashtags', {
      content,
      platform,
    });
    return response.data;
  }

  // ==================== AUTOMATIONS ====================

  async getRules() {
    const response = await this.api.get('/automations');
    return response.data;
  }

  async createRule(ruleData: any) {
    const response = await this.api.post('/automations', ruleData);
    return response.data;
  }

  async updateRule(ruleId: string, updates: any) {
    const response = await this.api.put(`/automations/${ruleId}`, updates);
    return response.data;
  }

  async deleteRule(ruleId: string) {
    const response = await this.api.delete(`/automations/${ruleId}`);
    return response.data;
  }

  async triggerRule(ruleId: string, event: any) {
    const response = await this.api.post(`/automations/${ruleId}/trigger`, event);
    return response.data;
  }

  // ==================== REPORTS ====================

  async getDashboardMetrics(businessId: string) {
    const response = await this.api.get(`/reports/dashboard/${businessId}`);
    return response.data;
  }

  async getEngagementReport(businessId: string, period: string = 'month') {
    const response = await this.api.get(`/reports/engagement/${businessId}`, {
      params: { period },
    });
    return response.data;
  }

  async getLeadsReport(businessId: string, status?: string) {
    const response = await this.api.get(`/reports/leads/${businessId}`, {
      params: { status },
    });
    return response.data;
  }

  async getRevenueReport(businessId: string) {
    const response = await this.api.get(`/reports/revenue/${businessId}`);
    return response.data;
  }

  async getAiReport(businessId: string, period: string = 'month') {
    const response = await this.api.get(`/reports/ai-interactions/${businessId}`, {
      params: { period },
    });
    return response.data;
  }

  async getPlatformPerformance(businessId: string) {
    const response = await this.api.get(`/reports/platform-performance/${businessId}`);
    return response.data;
  }

  async exportReport(businessId: string, reportType: string, format: string) {
    const response = await this.api.post(`/reports/export/${businessId}`, {
      reportType,
      format,
    });
    return response.data;
  }

  // ==================== TEAM ====================

  async getTeamMembers(businessId: string) {
    const response = await this.api.get(`/team/${businessId}`);
    return response.data;
  }

  async inviteTeamMember(businessId: string, email: string, role: string, permissions?: string[]) {
    const response = await this.api.post(`/team/${businessId}/invite`, {
      email,
      role,
      permissions,
    });
    return response.data;
  }

  async updateTeamMember(businessId: string, memberId: string, role: string, permissions?: string[]) {
    const response = await this.api.put(`/team/${businessId}/members/${memberId}`, {
      role,
      permissions,
    });
    return response.data;
  }

  async removeTeamMember(businessId: string, memberId: string) {
    const response = await this.api.delete(`/team/${businessId}/members/${memberId}`);
    return response.data;
  }

  async getAvailableRoles() {
    const response = await this.api.get('/team/roles');
    return response.data;
  }

  async resendTeamInvite(businessId: string, memberId: string) {
    const response = await this.api.post(`/team/${businessId}/members/${memberId}/resend-invite`);
    return response.data;
  }

  // ==================== SUBSCRIPTION ====================

  async getAvailablePlans() {
    const response = await this.api.get('/subscription/plans');
    return response.data;
  }

  async getCurrentSubscription(userId: string) {
    const response = await this.api.get(`/subscription/current/${userId}`);
    return response.data;
  }

  async upgradePlan(plan: string, billingCycle: string = 'monthly') {
    const response = await this.api.post('/subscription/upgrade', {
      plan,
      billingCycle,
    });
    return response.data;
  }

  async downgradePlan(plan: string) {
    const response = await this.api.post('/subscription/downgrade', { plan });
    return response.data;
  }

  async cancelSubscription(reason?: string) {
    const response = await this.api.post('/subscription/cancel', { reason });
    return response.data;
  }

  async pauseSubscription() {
    const response = await this.api.put('/subscription/pause');
    return response.data;
  }

  async resumeSubscription() {
    const response = await this.api.put('/subscription/resume');
    return response.data;
  }

  async getBillingHistory(userId: string) {
    const response = await this.api.get(`/subscription/billing-history/${userId}`);
    return response.data;
  }

  async applyCoupon(couponCode: string) {
    const response = await this.api.post('/subscription/apply-coupon', { couponCode });
    return response.data;
  }

  // ==================== AFFILIATE ====================

  async getAffiliateDashboard() {
    const response = await this.api.get('/affiliate/dashboard');
    return response.data;
  }

  async getAffiliateStats(affiliateCode: string) {
    const response = await this.api.get(`/affiliate/stats/${affiliateCode}`);
    return response.data;
  }

  async registerAffiliate(email: string, bankAccount?: string, bankCode?: string, cpf?: string) {
    const response = await this.api.post('/affiliate/register', {
      email,
      bankAccount,
      bankCode,
      cpf,
    });
    return response.data;
  }

  async getReferrals(affiliateCode: string, page: number = 1) {
    const response = await this.api.get(`/affiliate/referrals/${affiliateCode}`, {
      params: { page },
    });
    return response.data;
  }

  async getPayouts(affiliateCode: string) {
    const response = await this.api.get(`/affiliate/payouts/${affiliateCode}`);
    return response.data;
  }

  async requestPayout(amount: number) {
    const response = await this.api.post('/affiliate/request-payout', { amount });
    return response.data;
  }

  async getTopAffiliates(limit: number = 10) {
    const response = await this.api.get('/affiliate/top-affiliates', {
      params: { limit },
    });
    return response.data;
  }

  async updateAffiliateProfile(affiliateCode: string, bankAccount?: string, bankCode?: string) {
    const response = await this.api.put(`/affiliate/profile/${affiliateCode}`, {
      bankAccount,
      bankCode,
    });
    return response.data;
  }

  // ==================== TRAINING ====================

  async addTextTraining(businessId: string, content: string, businessType: string, metadata?: any) {
    const response = await this.api.post(`/training/${businessId}/text`, {
      content,
      businessType,
      metadata,
    });
    return response.data;
  }

  async addVoiceTraining(businessId: string, audioBase64: string, businessType: string, language?: string) {
    const response = await this.api.post(`/training/${businessId}/voice`, {
      audioBase64,
      businessType,
      language,
    });
    return response.data;
  }

  async addFileTraining(businessId: string, fileUrl: string, fileName: string, businessType: string) {
    const response = await this.api.post(`/training/${businessId}/file`, {
      fileUrl,
      fileName,
      businessType,
    });
    return response.data;
  }

  async identifyBusinessType(businessId: string, content: string, inputType: string = 'text') {
    const response = await this.api.post(`/training/${businessId}/identify`, {
      content,
      inputType,
    });
    return response.data;
  }

  async getTrainingStatus(businessId: string) {
    const response = await this.api.get(`/training/${businessId}/status`);
    return response.data;
  }

  async getTrainingInsights(businessId: string) {
    const response = await this.api.get(`/training/${businessId}/insights`);
    return response.data;
  }

  async generateResponseWithTraining(businessId: string, message: string, trainingDataIds?: string[]) {
    const response = await this.api.post(`/training/${businessId}/generate-response`, {
      message,
      trainingDataIds,
    });
    return response.data;
  }

  async getTrainingList(businessId: string, type?: string, limit: number = 20) {
    const response = await this.api.get(`/training/${businessId}/training-list`, {
      params: { type, limit },
    });
    return response.data;
  }

  // ==================== MULTIPOST ====================

  async createMultiPost(
    businessId: string,
    content: string,
    channels: string[],
    contentType: string,
    options?: {
      aiGenerate?: boolean;
      aiImagePrompt?: string;
      aiVideoPrompt?: string;
      imageUrl?: string;
      videoUrl?: string;
      scheduledAt?: Date;
    }
  ) {
    const response = await this.api.post(`/multipost/${businessId}/create`, {
      content,
      channels,
      contentType,
      ...options,
    });
    return response.data;
  }

  async previewMultiPost(
    businessId: string,
    content: string,
    channels: string[],
    contentType: string
  ) {
    const response = await this.api.post(`/multipost/${businessId}/preview`, {
      content,
      channels,
      contentType,
    });
    return response.data;
  }

  async publishMultiPost(businessId: string, postId: string) {
    const response = await this.api.post(`/multipost/${businessId}/publish/${postId}`);
    return response.data;
  }

  async scheduleMultiPost(businessId: string, postId: string, scheduledAt: Date) {
    const response = await this.api.post(`/multipost/${businessId}/schedule/${postId}`, {
      scheduledAt,
    });
    return response.data;
  }

  async adaptContent(
    businessId: string,
    content: string,
    channels: string[],
    contentType: string,
    tone?: string,
    keywords?: string
  ) {
    const response = await this.api.post(`/multipost/${businessId}/adapt-content`, {
      content,
      channels,
      contentType,
      tone,
      keywords,
    });
    return response.data;
  }

  async generateAIImage(businessId: string, prompt: string, style?: string, options?: any) {
    const response = await this.api.post(`/multipost/${businessId}/generate-ai-image`, {
      prompt,
      contentType: 'image',
      style,
      options,
    });
    return response.data;
  }

  async generateAIVideo(businessId: string, prompt: string, contentType?: string, options?: any) {
    const response = await this.api.post(`/multipost/${businessId}/generate-ai-video`, {
      prompt,
      contentType: contentType || 'video',
      options,
    });
    return response.data;
  }

  async getMultiPostTemplates(businessId: string) {
    const response = await this.api.get(`/multipost/${businessId}/templates`);
    return response.data;
  }

  async getSmartSchedule(businessId: string, channels: string[]) {
    const response = await this.api.get(`/multipost/${businessId}/schedule-recommendations`, {
      params: { channels: channels.join(',') },
    });
    return response.data;
  }

  async getMultiPostAnalytics(businessId: string, timeframe: string = 'week') {
    const response = await this.api.get(`/multipost/${businessId}/analytics`, {
      params: { timeframe },
    });
    return response.data;
  }

  async getMultiPosts(businessId: string, status?: string, limit: number = 20) {
    const response = await this.api.get(`/multipost/${businessId}/posts`, {
      params: { status, limit },
    });
    return response.data;
  }

  // ==================== SUBSCRIPTION ====================

  async getAvailablePlans() {
    const response = await this.api.get('/subscription/plans');
    return response.data;
  }

  async getCurrentSubscription(userId: string) {
    const response = await this.api.get(`/subscription/current/${userId}`);
    return response.data;
  }

  async upgradePlan(plan: string) {
    const response = await this.api.post('/subscription/upgrade', { plan });
    return response.data;
  }

  async downgradePlan(plan: string) {
    const response = await this.api.post('/subscription/downgrade', { plan });
    return response.data;
  }

  async cancelSubscription(reason?: string) {
    const response = await this.api.post('/subscription/cancel', { reason });
    return response.data;
  }

  async pauseSubscription() {
    const response = await this.api.put('/subscription/pause');
    return response.data;
  }

  async resumeSubscription() {
    const response = await this.api.put('/subscription/resume');
    return response.data;
  }

  async getBillingHistory(userId: string) {
    const response = await this.api.get(`/subscription/billing-history/${userId}`);
    return response.data;
  }

  // ==================== MERCADO PAGO ====================

  async createCheckoutPreference(planId: string, planName: string, amount: number, businessId: string, buyerEmail: string, buyerName: string, billingCycle: 'monthly' | 'yearly' = 'monthly') {
    const response = await this.api.post('/subscription/mercadopago/checkout', {
      planId,
      planName,
      amount,
      currency: 'BRL',
      businessId,
      buyerEmail,
      buyerName,
      billingCycle,
      description: `Assinatura ${planName} - SocialFlow`
    });
    return response.data;
  }

  async createPixPayment(amount: number, payerEmail: string, payerFirstName: string, payerLastName: string, payerCPF: string, planId: string, businessId: string) {
    const response = await this.api.post('/subscription/mercadopago/pix', {
      amount,
      description: `Assinatura - SocialFlow`,
      payerEmail,
      payerFirstName,
      payerLastName,
      payerCPF,
      planId,
      businessId
    });
    return response.data;
  }

  async createBoletoPayment(amount: number, payerEmail: string, payerFirstName: string, payerLastName: string, payerCPF: string, planId: string, businessId: string) {
    const response = await this.api.post('/subscription/mercadopago/boleto', {
      amount,
      description: `Assinatura - SocialFlow`,
      payerEmail,
      payerFirstName,
      payerLastName,
      payerCPF,
      planId,
      businessId
    });
    return response.data;
  }

  async createCardPayment(amount: number, payerEmail: string, payerFirstName: string, payerLastName: string, payerCPF: string, cardToken: string, planId: string, businessId: string, installments: number = 1) {
    const response = await this.api.post('/subscription/mercadopago/card', {
      amount,
      description: `Assinatura - SocialFlow`,
      payerEmail,
      payerFirstName,
      payerLastName,
      payerCPF,
      cardToken,
      planId,
      businessId,
      installments
    });
    return response.data;
  }

  async getPaymentStatus(paymentId: string) {
    const response = await this.api.get(`/subscription/mercadopago/payment/${paymentId}`);
    return response.data;
  }

  async refundPayment(paymentId: string, reason: string, businessId: string, amount?: number) {
    const response = await this.api.post('/subscription/mercadopago/refund', {
      paymentId,
      amount,
      reason,
      businessId
    });
    return response.data;
  }

  async getSubscriptionStatus(subscriptionId: string) {
    const response = await this.api.get(`/subscription/mercadopago/subscription/${subscriptionId}`);
    return response.data;
  }

  async cancelMercadoPagoSubscription(subscriptionId: string, reason?: string) {
    const response = await this.api.post(`/subscription/mercadopago/subscription/cancel/${subscriptionId}`, {
      reason
    });
    return response.data;
  }

