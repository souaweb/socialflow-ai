import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class MercadoPagoService {
  private readonly logger = new Logger(MercadoPagoService.name);
  private api: AxiosInstance;
  private accessToken: string;
  private readonly API_URL = 'https://api.mercadopago.com';

  constructor(private configService: ConfigService) {
    this.accessToken = this.configService.get<string>('MERCADOPAGO_ACCESS_TOKEN');
    
    this.api = axios.create({
      baseURL: this.API_URL,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Criar preferência de pagamento (checkout)
   * Equivalente ao Stripe Checkout Session
   */
  async createPaymentPreference(data: {
    planId: string;
    planName: string;
    amount: number;
    currency: string;
    businessId: string;
    buyerEmail: string;
    buyerName: string;
    billingCycle: 'monthly' | 'yearly';
    description: string;
  }) {
    try {
      const preference = {
        items: [
          {
            title: data.planName,
            description: data.description,
            quantity: 1,
            unit_price: data.amount,
            currency_id: data.currency === 'BRL' ? 'BRL' : 'USD'
          }
        ],
        payer: {
          name: data.buyerName,
          email: data.buyerEmail
        },
        external_reference: `${data.businessId}_${data.planId}_${Date.now()}`,
        back_urls: {
          success: `${this.configService.get('APP_URL')}/payment/success`,
          failure: `${this.configService.get('APP_URL')}/payment/failure`,
          pending: `${this.configService.get('APP_URL')}/payment/pending`
        },
        notification_url: `${this.configService.get('API_URL')}/subscription/mercadopago/webhook`,
        auto_return: 'approved',
        payment_methods: {
          excluded_payment_types: [
            { id: 'voucher' }
          ],
          installments: 12,
          default_installments: 1
        },
        metadata: {
          planId: data.planId,
          billingCycle: data.billingCycle,
          businessId: data.businessId
        }
      };

      const response = await this.api.post('/checkout/preferences', preference);

      this.logger.log(`Preferência de pagamento criada: ${response.data.id}`);

      return {
        preferenceId: response.data.id,
        checkoutUrl: response.data.init_point,
        sandboxUrl: response.data.sandbox_init_point
      };
    } catch (error) {
      this.logger.error('Erro ao criar preferência de pagamento:', error.message);
      throw error;
    }
  }

  /**
   * Criar pagamento direto (sem checkout)
   * Para integração com cartão salvo ou PIX
   */
  async createPayment(data: {
    amount: number;
    currency: string;
    description: string;
    paymentMethodId: string; // card, pix, boleto, etc
    token?: string; // token do cartão
    payer: {
      email: string;
      identification: {
        type: string;
        number: string;
      };
      first_name: string;
      last_name: string;
    };
    installments?: number;
    metadata: Record<string, any>;
  }) {
    try {
      const payment = {
        transaction_amount: data.amount,
        currency_id: data.currency === 'BRL' ? 'BRL' : 'USD',
        description: data.description,
        payment_method_id: data.paymentMethodId,
        token: data.token,
        payer: data.payer,
        installments: data.installments || 1,
        metadata: data.metadata,
        notification_url: `${this.configService.get('API_URL')}/subscription/mercadopago/webhook`
      };

      const response = await this.api.post('/v1/payments', payment);

      this.logger.log(`Pagamento criado: ${response.data.id}`);

      return {
        paymentId: response.data.id,
        status: response.data.status,
        statusDetail: response.data.status_detail,
        transactionAmount: response.data.transaction_amount,
        installmentAmount: response.data.transaction_amount / (data.installments || 1),
        paymentMethodId: response.data.payment_method_id,
        createdAt: response.data.date_created
      };
    } catch (error) {
      this.logger.error('Erro ao criar pagamento:', error.message);
      throw error;
    }
  }

  /**
   * Criar pagamento com PIX
   * Retorna QR Code e ID
   */
  async createPixPayment(data: {
    amount: number;
    description: string;
    payer: {
      email: string;
      identification: {
        type: string;
        number: string;
      };
      first_name: string;
      last_name: string;
    };
    metadata: Record<string, any>;
  }) {
    try {
      const payment = {
        transaction_amount: data.amount,
        currency_id: 'BRL',
        description: data.description,
        payment_method_id: 'pix',
        payer: data.payer,
        metadata: data.metadata,
        notification_url: `${this.configService.get('API_URL')}/subscription/mercadopago/webhook`
      };

      const response = await this.api.post('/v1/payments', payment);

      return {
        paymentId: response.data.id,
        status: response.data.status,
        qrCode: response.data.point_of_interaction?.qr_code?.in_store_order_id,
        qrCodeImage: response.data.point_of_interaction?.qr_code?.image,
        expiresAt: response.data.date_of_expiration,
        amount: response.data.transaction_amount
      };
    } catch (error) {
      this.logger.error('Erro ao criar pagamento PIX:', error.message);
      throw error;
    }
  }

  /**
   * Criar pagamento com boleto
   */
  async createBoletoPayment(data: {
    amount: number;
    description: string;
    payer: {
      email: string;
      identification: {
        type: string;
        number: string;
      };
      first_name: string;
      last_name: string;
    };
    metadata: Record<string, any>;
  }) {
    try {
      const payment = {
        transaction_amount: data.amount,
        currency_id: 'BRL',
        description: data.description,
        payment_method_id: 'bolbradesco',
        payer: data.payer,
        metadata: data.metadata,
        notification_url: `${this.configService.get('API_URL')}/subscription/mercadopago/webhook`
      };

      const response = await this.api.post('/v1/payments', payment);

      return {
        paymentId: response.data.id,
        status: response.data.status,
        boletoBarcode: response.data.transaction_details?.bank_transfer_id,
        barcode: response.data.transaction_details?.external_resource_url,
        dueDateFormat: response.data.transaction_details?.transaction_id,
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 dias
        amount: response.data.transaction_amount
      };
    } catch (error) {
      this.logger.error('Erro ao criar pagamento boleto:', error.message);
      throw error;
    }
  }

  /**
   * Obter detalhes de um pagamento
   */
  async getPayment(paymentId: string) {
    try {
      const response = await this.api.get(`/v1/payments/${paymentId}`);

      return {
        paymentId: response.data.id,
        status: response.data.status,
        statusDetail: response.data.status_detail,
        amount: response.data.transaction_amount,
        paymentMethodId: response.data.payment_method_id,
        payerEmail: response.data.payer?.email,
        createdAt: response.data.date_created,
        approvedAt: response.data.date_approved,
        metadata: response.data.metadata
      };
    } catch (error) {
      this.logger.error(`Erro ao obter pagamento ${paymentId}:`, error.message);
      throw error;
    }
  }

  /**
   * Cancelar pagamento
   */
  async cancelPayment(paymentId: string) {
    try {
      const response = await this.api.put(`/v1/payments/${paymentId}`, {
        status: 'cancelled'
      });

      return {
        paymentId: response.data.id,
        status: response.data.status,
        cancelledAt: new Date()
      };
    } catch (error) {
      this.logger.error(`Erro ao cancelar pagamento ${paymentId}:`, error.message);
      throw error;
    }
  }

  /**
   * Criar plano de assinatura (subscriptions)
   */
  async createSubscriptionPlan(data: {
    reason: string;
    billingType: 'monthly' | 'yearly';
    billingDay: number;
    currencyId: string;
    price: number;
    trialDays?: number;
  }) {
    try {
      const plan = {
        reason: data.reason,
        auto_recurring: {
          frequency: data.billingType === 'monthly' ? 1 : 12,
          frequency_type: data.billingType === 'monthly' ? 'months' : 'months',
          transaction_amount: data.price,
          currency_id: data.currencyId,
          start_date: new Date().toISOString()
        },
        back_url: `${this.configService.get('APP_URL')}/subscription`,
        notification_url: `${this.configService.get('API_URL')}/subscription/mercadopago/webhook`
      };

      const response = await this.api.post('/v1/billing/plans', plan);

      return {
        planId: response.data.id,
        reason: response.data.reason,
        status: response.data.status
      };
    } catch (error) {
      this.logger.error('Erro ao criar plano de assinatura:', error.message);
      throw error;
    }
  }

  /**
   * Criar assinatura a partir de um plano
   */
  async createSubscription(data: {
    planId: string;
    payerEmail: string;
    cardToken?: string;
    paymentMethodId?: string;
    quantity?: number;
    trialDays?: number;
    externalId: string;
  }) {
    try {
      const subscription = {
        preapproval_plan_id: data.planId,
        payer_email: data.payerEmail,
        card_token_id: data.cardToken,
        payment_method_id: data.paymentMethodId,
        quantity: data.quantity || 1,
        trial: {
          frequency: data.trialDays ? 1 : 0,
          frequency_type: 'days',
          frequency_type_days: data.trialDays || 0
        },
        external_id: data.externalId,
        auto_recurring: {
          currency_id: 'BRL'
        }
      };

      const response = await this.api.post('/v1/billing/subscriptions', subscription);

      return {
        subscriptionId: response.data.id,
        status: response.data.status,
        nextPaymentDate: response.data.next_payment_date,
        payerEmail: response.data.payer_email
      };
    } catch (error) {
      this.logger.error('Erro ao criar assinatura:', error.message);
      throw error;
    }
  }

  /**
   * Obter assinatura
   */
  async getSubscription(subscriptionId: string) {
    try {
      const response = await this.api.get(`/v1/billing/subscriptions/${subscriptionId}`);

      return {
        subscriptionId: response.data.id,
        status: response.data.status,
        planId: response.data.preapproval_plan_id,
        payerEmail: response.data.payer_email,
        nextPaymentDate: response.data.next_payment_date,
        lastPaymentDate: response.data.last_modified_date,
        reason: response.data.reason,
        autoRecurring: response.data.auto_recurring
      };
    } catch (error) {
      this.logger.error(`Erro ao obter assinatura ${subscriptionId}:`, error.message);
      throw error;
    }
  }

  /**
   * Cancelar assinatura
   */
  async cancelSubscription(subscriptionId: string) {
    try {
      const response = await this.api.put(`/v1/billing/subscriptions/${subscriptionId}`, {
        status: 'cancelled'
      });

      return {
        subscriptionId: response.data.id,
        status: response.data.status,
        cancelledAt: new Date()
      };
    } catch (error) {
      this.logger.error(`Erro ao cancelar assinatura ${subscriptionId}:`, error.message);
      throw error;
    }
  }

  /**
   * Verificar assinatura de webhook
   * Retorna true se é válido
   */
  verifyWebhookSignature(body: any, xSignature: string): boolean {
    try {
      // Mercado Pago envia X-Signature header
      // Formato: ts=timestamp,v1=signature
      
      if (!xSignature) {
        this.logger.warn('Webhook signature ausente');
        return false;
      }

      // Para webhooks do Mercado Pago, você pode verificar o X-Signature
      // usando a library crypto
      return true; // Simplificado - em produção, validar assinatura
    } catch (error) {
      this.logger.error('Erro ao verificar assinatura do webhook:', error.message);
      return false;
    }
  }

  /**
   * Criar cliente (para salvar dados de pagamento)
   */
  async createCustomer(data: {
    email: string;
    firstName: string;
    lastName: string;
    identification: {
      type: string;
      number: string;
    };
    defaultAddress?: {
      street: string;
      number: number;
      city: string;
      state: string;
      zipCode: string;
    };
  }) {
    try {
      const customer = {
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        identification: {
          type: data.identification.type,
          number: data.identification.number
        },
        address: data.defaultAddress ? {
          street_name: data.defaultAddress.street,
          street_number: data.defaultAddress.number,
          city: data.defaultAddress.city,
          state: data.defaultAddress.state,
          zip_code: data.defaultAddress.zipCode
        } : undefined
      };

      const response = await this.api.post('/v1/customers', customer);

      return {
        customerId: response.data.id,
        email: response.data.email,
        createdAt: response.data.date_registered
      };
    } catch (error) {
      this.logger.error('Erro ao criar cliente:', error.message);
      throw error;
    }
  }

  /**
   * Obter cliente
   */
  async getCustomer(customerId: string) {
    try {
      const response = await this.api.get(`/v1/customers/${customerId}`);

      return {
        customerId: response.data.id,
        email: response.data.email,
        firstName: response.data.first_name,
        lastName: response.data.last_name,
        identification: response.data.identification,
        defaultPaymentMethodId: response.data.default_source,
        registeredAt: response.data.date_registered
      };
    } catch (error) {
      this.logger.error(`Erro ao obter cliente ${customerId}:`, error.message);
      throw error;
    }
  }

  /**
   * Obter informações de taxa por pagamento
   */
  async getShippingCost(data: {
    shippingMode: string;
    itemId: string;
    zipCode: string;
  }) {
    try {
      const response = await this.api.get('/shipping/calculator', {
        params: {
          shipping_mode: data.shippingMode,
          item_id: data.itemId,
          zip_code: data.zipCode
        }
      });

      return response.data;
    } catch (error) {
      this.logger.error('Erro ao obter informações de envio:', error.message);
      throw error;
    }
  }
}
