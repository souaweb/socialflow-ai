import { Injectable } from '@nestjs/common';
import { CreateAffiliateDto } from './dtos/create-affiliate.dto';

@Injectable()
export class AffiliateService {
  
  async getAffiliateDashboard() {
    // Retorna dashboard do afiliado
    return {
      affiliateCode: 'AFF12345',
      status: 'active',
      totalInvites: 45,
      totalConversions: 12,
      conversionRate: '26.7%',
      earnings: {
        thisMonth: 2400.00,
        lastMonth: 1800.00,
        total: 12450.00,
        pending: 2400.00,
        paid: 10050.00
      },
      commissionRate: 20,
      nextPayment: new Date('2026-02-15'),
      metrics: {
        viewsThisMonth: 8500,
        clicksThisMonth: 1245,
        conversionValue: 2400.00
      }
    };
  }

  async getAffiliateStats(affiliateCode: string) {
    // Retorna estatísticas detalhadas do afiliado
    return {
      affiliateCode,
      period: 'last_30_days',
      stats: {
        impressions: 8500,
        clicks: 1245,
        clickThroughRate: '14.6%',
        conversions: 12,
        conversionRate: '0.14%',
        revenue: 2400.00,
        avgOrderValue: 200.00,
        commission: 480.00
      },
      topReferringSources: [
        { source: 'instagram', conversions: 5, revenue: 1000.00 },
        { source: 'facebook', conversions: 4, revenue: 800.00 },
        { source: 'website', conversions: 3, revenue: 600.00 }
      ]
    };
  }

  async registerAffiliate(dto: CreateAffiliateDto) {
    // Registra novo afiliado
    const affiliateCode = Math.random().toString(36).substr(2, 8).toUpperCase();
    
    return {
      success: true,
      message: 'Afiliado registrado com sucesso',
      affiliate: {
        id: 'aff_' + Math.random().toString(36).substr(2, 9),
        email: dto.email,
        affiliateCode,
        status: 'active',
        commissionRate: 20,
        createdAt: new Date(),
        inviteLink: `https://socialflow.com?ref=${affiliateCode}`,
        bannerLink: `https://socialflow.com/banners?ref=${affiliateCode}`
      }
    };
  }

  async getReferrals(affiliateCode: string, page: number = 1) {
    // Retorna lista de referrais do afiliado
    return {
      affiliateCode,
      page,
      totalReferrals: 45,
      pageSize: 10,
      referrals: [
        {
          id: 'ref_001',
          email: 'cliente1@empresa.com',
          name: 'Empresa 1',
          inviteDate: '2026-01-15',
          planChosen: 'pro',
          status: 'active',
          revenue: 299.00,
          commission: 59.80
        },
        {
          id: 'ref_002',
          email: 'cliente2@empresa.com',
          name: 'Empresa 2',
          inviteDate: '2026-01-20',
          planChosen: 'starter',
          status: 'active',
          revenue: 99.00,
          commission: 19.80
        },
        {
          id: 'ref_003',
          email: 'cliente3@empresa.com',
          name: 'Empresa 3',
          inviteDate: '2026-01-22',
          planChosen: 'pro',
          status: 'pending',
          revenue: 0,
          commission: 0
        }
      ]
    };
  }

  async getPayouts(affiliateCode: string) {
    // Retorna histórico de pagamentos
    return {
      affiliateCode,
      payouts: [
        {
          id: 'payout_001',
          date: '2026-01-15',
          amount: 1200.00,
          status: 'paid',
          method: 'bank_transfer',
          bankAccount: '****5678',
          transactionId: 'TXN123456'
        },
        {
          id: 'payout_002',
          date: '2025-12-15',
          amount: 950.00,
          status: 'paid',
          method: 'bank_transfer',
          bankAccount: '****5678',
          transactionId: 'TXN123457'
        },
        {
          id: 'payout_003',
          date: '2025-11-15',
          amount: 800.00,
          status: 'paid',
          method: 'bank_transfer',
          bankAccount: '****5678',
          transactionId: 'TXN123458'
        }
      ],
      totalPaid: 10050.00,
      pendingBalance: 2400.00,
      nextPaymentDate: '2026-02-15'
    };
  }

  async requestPayout(amount: number) {
    // Solicita pagamento do saldo
    return {
      success: true,
      message: `Solicitação de pagamento de R$ ${amount.toFixed(2)} enviada`,
      requestId: 'preq_' + Date.now(),
      amount,
      estimatedPaymentDate: new Date('2026-02-15'),
      status: 'pending'
    };
  }

  async getTopAffiliates(limit: number = 10) {
    // Retorna top afiliados por earnings
    return {
      period: 'last_30_days',
      topAffiliates: [
        {
          rank: 1,
          name: 'Top Afiliado 1',
          affiliateCode: 'AFF00001',
          earnings: 5200.00,
          conversions: 26,
          conversionRate: '28.9%'
        },
        {
          rank: 2,
          name: 'Top Afiliado 2',
          affiliateCode: 'AFF00002',
          earnings: 4100.00,
          conversions: 20,
          conversionRate: '25.0%'
        },
        {
          rank: 3,
          name: 'Top Afiliado 3',
          affiliateCode: 'AFF00003',
          earnings: 3400.00,
          conversions: 17,
          conversionRate: '22.3%'
        }
      ]
    };
  }

  async updateAffiliateProfile(affiliateCode: string, body: any) {
    // Atualiza dados bancários do afiliado
    return {
      success: true,
      message: 'Perfil atualizado com sucesso',
      affiliate: {
        affiliateCode,
        bankAccount: body.bankAccount,
        bankCode: body.bankCode,
        updatedAt: new Date()
      }
    };
  }
}
