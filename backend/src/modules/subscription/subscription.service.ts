import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dtos/create-subscription.dto';
import { MercadoPagoService } from './services/mercadopago.service';
import { 
  CreateCheckoutPreferenceDto, 
  CreatePixPaymentDto, 
  CreateBoletoPaymentDto, 
  CreateCardPaymentDto,
  RefundPaymentDto 
} from './dtos/payment.dto';

@Injectable()
export class SubscriptionService {
  
  constructor(private readonly mercadoPagoService: MercadoPagoService) {}
  
  async getAvailablePlans() {
    // Retorna todos os planos disponíveis
    return [
      {
        id: 'plan_free',
        name: 'Free',
        price: 0,
        currency: 'BRL',
        description: 'Para começar',
        features: [
          'Até 5 posts/mês',
          '1 rede social',
          'Sem IA',
          'Sem suporte prioritário',
          'Conversas básicas'
        ],
        limits: {
          postsPerMonth: 5,
          teamMembers: 1,
          aiEnabled: false,
          analyticsEnabled: false
        }
      },
      {
        id: 'plan_starter',
        name: 'Starter',
        price: 99.00,
        currency: 'BRL',
        description: 'Para pequenos negócios',
        features: [
          'Até 50 posts/mês',
          'Até 4 redes sociais',
          'IA conversacional',
          'Suporte por email',
          'Analytics básicos',
          'Até 3 membros do time'
        ],
        limits: {
          postsPerMonth: 50,
          teamMembers: 3,
          aiEnabled: true,
          analyticsEnabled: true
        }
      },
      {
        id: 'plan_pro',
        name: 'Pro',
        price: 299.00,
        currency: 'BRL',
        description: 'Para crescer',
        features: [
          'Posts ilimitados',
          'Todas as redes sociais',
          'IA avançada com Gemini',
          'Suporte prioritário',
          'Analytics completos',
          'Até 10 membros do time',
          'API access',
          'Automações avançadas'
        ],
        limits: {
          postsPerMonth: 999,
          teamMembers: 10,
          aiEnabled: true,
          analyticsEnabled: true
        }
      },
      {
        id: 'plan_enterprise',
        name: 'Enterprise',
        price: 999.00,
        currency: 'BRL',
        description: 'Para grandes operações',
        features: [
          'Tudo do plano Pro',
          'Membros do time ilimitados',
          'Suporte 24/7 dedicado',
          'SLA garantido (99.9% uptime)',
          'Webhooks em tempo real',
          'Integração customizada',
          'White label disponível',
          'Compliance LGPD/GDPR'
        ],
        limits: {
          postsPerMonth: 999,
          teamMembers: 999,
          aiEnabled: true,
          analyticsEnabled: true
        },
        customPrice: true
      }
    ];
  }

  async getCurrentSubscription(userId: string) {
    // Retorna assinatura atual do usuário
    return {
      userId,
      plan: 'pro',
      status: 'active',
      price: 299.00,
      billingCycle: 'monthly',
      nextBillingDate: new Date('2026-02-28'),
      autoRenew: true,
      features: {
        postsPerMonth: 999,
        teamMembersAllowed: 10,
        aiEnabled: true,
        analyticsEnabled: true
      },
      usage: {
        postsThisMonth: 45,
        teamMembers: 3,
        aiInteractions: 234
      }
    };
  }

  async upgradePlan(dto: CreateSubscriptionDto) {
    // Faz upgrade para novo plano
    return {
      success: true,
      message: `Upgrade para ${dto.plan} confirmado`,
      subscription: {
        plan: dto.plan,
        status: 'active',
        nextBillingDate: new Date('2026-02-28'),
        creditApplied: 50.00,
        newPrice: this.getPlanPrice(dto.plan)
      },
      receipt: `receipt_${Date.now()}`
    };
  }

  async downgradePlan(plan: string) {
    // Faz downgrade para novo plano
    return {
      success: true,
      message: `Downgrade para ${plan} será efetivo no próximo período`,
      effectiveDate: new Date('2026-02-28'),
      refund: 0,
      plan
    };
  }

  async cancelSubscription(reason?: string) {
    // Cancela assinatura
    return {
      success: true,
      message: 'Assinatura cancelada',
      effectiveDate: new Date(),
      reason: reason || 'Not specified',
      refund: 0,
      cancelToken: `cancel_${Date.now()}`
    };
  }

  async pauseSubscription() {
    // Pausa assinatura
    return {
      success: true,
      message: 'Assinatura pausada',
      pausedAt: new Date(),
      note: 'Você pode reativar a qualquer momento'
    };
  }

  async resumeSubscription() {
    // Retoma assinatura pausada
    return {
      success: true,
      message: 'Assinatura ativada novamente',
      resumedAt: new Date(),
      nextBillingDate: new Date('2026-02-28')
    };
  }

  async getBillingHistory(userId: string) {
    // Retorna histórico de faturamento
    return {
      userId,
      transactions: [
        {
          id: 'txn_001',
          date: '2026-01-28',
          amount: 299.00,
          plan: 'pro',
          status: 'paid',
          invoice: 'INV-2026-001',
          receipt: 'receipt_001'
        },
        {
          id: 'txn_002',
          date: '2025-12-28',
          amount: 299.00,
          plan: 'pro',
          status: 'paid',
          invoice: 'INV-2025-012',
          receipt: 'receipt_002'
        },
        {
          id: 'txn_003',
          date: '2025-11-28',
          amount: 99.00,
          plan: 'starter',
          status: 'paid',
          invoice: 'INV-2025-011',
          receipt: 'receipt_003'
        }
      ],
      total: 697.00
    };
  }

  async applyCoupon(couponCode: string) {
    // Aplica cupom de desconto
    const discounts = {
      'SAVE50': 0.50,
      'WELCOME20': 0.20,
      'NEWYEAR30': 0.30
    };

    if (discounts[couponCode]) {
      return {
        success: true,
        couponCode,
        discount: discounts[couponCode] * 100 + '%',
        discountAmount: 150.00,
        newPrice: 150.00,
        message: 'Cupom aplicado com sucesso'
      };
    }

    return {
      success: false,
      message: 'Cupom inválido ou expirado'
    };
  }

  private getPlanPrice(plan: string): number {
    const prices = {
      free: 0,
      starter: 99.00,
      pro: 299.00,
      enterprise: 999.00
    };
    return prices[plan] || 0;
  }

  // === Mercado Pago Integration Methods ===

  async createCheckoutPreference(dto: CreateCheckoutPreferenceDto) {
    try {
      const result = await this.mercadoPagoService.createPaymentPreference({
        planId: dto.planId,
        planName: dto.planName,
        amount: dto.amount,
        currency: dto.currency,
        businessId: dto.businessId,
        buyerEmail: dto.buyerEmail,
        buyerName: dto.buyerName,
        billingCycle: dto.billingCycle,
        description: dto.description
      });

      return {
        success: true,
        checkoutUrl: result.checkoutUrl,
        sandboxUrl: result.sandboxUrl,
        preferenceId: result.preferenceId
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async createPixPayment(dto: CreatePixPaymentDto) {
    try {
      const result = await this.mercadoPagoService.createPixPayment({
        amount: dto.amount,
        description: dto.description,
        payer: {
          email: dto.payerEmail,
          identification: {
            type: 'CPF',
            number: dto.payerCPF
          },
          first_name: dto.payerFirstName,
          last_name: dto.payerLastName
        },
        metadata: {
          planId: dto.planId,
          businessId: dto.businessId,
          ...dto.metadata
        }
      });

      return {
        success: true,
        paymentId: result.paymentId,
        qrCode: result.qrCode,
        qrCodeImage: result.qrCodeImage,
        status: result.status,
        amount: result.amount,
        expiresAt: result.expiresAt
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async createBoletoPayment(dto: CreateBoletoPaymentDto) {
    try {
      const result = await this.mercadoPagoService.createBoletoPayment({
        amount: dto.amount,
        description: dto.description,
        payer: {
          email: dto.payerEmail,
          identification: {
            type: 'CPF',
            number: dto.payerCPF
          },
          first_name: dto.payerFirstName,
          last_name: dto.payerLastName
        },
        metadata: {
          planId: dto.planId,
          businessId: dto.businessId,
          ...dto.metadata
        }
      });

      return {
        success: true,
        paymentId: result.paymentId,
        barcode: result.barcode,
        status: result.status,
        amount: result.amount,
        expiresAt: result.expiresAt
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async createCardPayment(dto: CreateCardPaymentDto) {
    try {
      const result = await this.mercadoPagoService.createPayment({
        amount: dto.amount,
        currency: 'BRL',
        description: dto.description,
        paymentMethodId: 'credit_card',
        token: dto.cardToken,
        payer: {
          email: dto.payerEmail,
          identification: {
            type: 'CPF',
            number: dto.payerCPF
          },
          first_name: dto.payerFirstName,
          last_name: dto.payerLastName
        },
        installments: dto.installments || 1,
        metadata: {
          planId: dto.planId,
          businessId: dto.businessId,
          ...dto.metadata
        }
      });

      return {
        success: true,
        paymentId: result.paymentId,
        status: result.status,
        statusDetail: result.statusDetail,
        amount: result.transactionAmount,
        installmentAmount: result.installmentAmount,
        installments: dto.installments || 1
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getPaymentStatus(paymentId: string) {
    try {
      const result = await this.mercadoPagoService.getPayment(paymentId);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async refundPayment(dto: RefundPaymentDto) {
    try {
      const result = await this.mercadoPagoService.cancelPayment(dto.paymentId);
      return {
        success: true,
        paymentId: result.paymentId,
        status: result.status,
        message: `Pagamento ${dto.paymentId} cancelado/reembolsado`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getSubscriptionStatus(subscriptionId: string) {
    try {
      const result = await this.mercadoPagoService.getSubscription(subscriptionId);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async cancelMercadoPagoSubscription(subscriptionId: string, reason?: string) {
    try {
      const result = await this.mercadoPagoService.cancelSubscription(subscriptionId);
      return {
        success: true,
        subscriptionId: result.subscriptionId,
        status: result.status,
        message: 'Assinatura cancelada com sucesso',
        reason
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }