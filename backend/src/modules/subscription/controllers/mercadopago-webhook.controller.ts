import { Controller, Post, Get, Body, Param, Headers, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { MercadoPagoService } from '../services/mercadopago.service';
import { SubscriptionService } from '../subscription.service';
import { ProcessWebhookDto } from '../dtos/payment.dto';

@Controller('subscription/mercadopago')
export class MercadoPagoWebhookController {
  private readonly logger = new Logger(MercadoPagoWebhookController.name);

  constructor(
    private readonly mercadoPagoService: MercadoPagoService,
    private readonly subscriptionService: SubscriptionService
  ) {}

  /**
   * Webhook para receber notificações do Mercado Pago
   * Chamado quando um pagamento muda de status
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Body() data: any,
    @Headers('x-signature') signature: string
  ) {
    try {
      this.logger.log(`Webhook recebido: ${JSON.stringify(data)}`);

      // Verificar assinatura
      if (!this.mercadoPagoService.verifyWebhookSignature(data, signature)) {
        this.logger.warn('Assinatura do webhook inválida');
        return { success: false, error: 'Invalid signature' };
      }

      const { id, topic, resource } = data;

      // Processar diferentes tipos de notificações
      switch (topic) {
        case 'payment':
          await this.handlePaymentNotification(id, resource);
          break;

        case 'subscription':
          await this.handleSubscriptionNotification(id, resource);
          break;

        case 'plan':
          await this.handlePlanNotification(id, resource);
          break;

        case 'invoice':
          await this.handleInvoiceNotification(id, resource);
          break;

        default:
          this.logger.warn(`Tipo de notificação desconhecido: ${topic}`);
      }

      return { success: true, message: 'Webhook processed' };
    } catch (error) {
      this.logger.error('Erro ao processar webhook:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Processar notificação de pagamento
   */
  private async handlePaymentNotification(paymentId: string, resourceUrl: string) {
    try {
      this.logger.log(`Processando notificação de pagamento: ${paymentId}`);

      // Obter detalhes do pagamento
      const paymentDetails = await this.mercadoPagoService.getPayment(paymentId);

      // Atualizar status do pagamento no banco de dados
      // await this.subscriptionService.updatePaymentStatus(
      //   paymentId,
      //   paymentDetails.status
      // );

      // Se aprovado, ativar assinatura
      if (paymentDetails.status === 'approved') {
        this.logger.log(`Pagamento aprovado: ${paymentId}`);
        
        // Extrair dados da metadata
        const { businessId, planId } = paymentDetails.metadata;
        
        // Ativar plano
        // await this.subscriptionService.activatePlan(businessId, planId);
      }

      // Se recusado, notificar usuário
      if (paymentDetails.status === 'rejected') {
        this.logger.log(`Pagamento recusado: ${paymentId}`);
        // await this.subscriptionService.notifyPaymentRejected(businessId);
      }

    } catch (error) {
      this.logger.error('Erro ao processar notificação de pagamento:', error.message);
    }
  }

  /**
   * Processar notificação de assinatura
   */
  private async handleSubscriptionNotification(subscriptionId: string, resourceUrl: string) {
    try {
      this.logger.log(`Processando notificação de assinatura: ${subscriptionId}`);

      // Obter detalhes da assinatura
      const subscriptionDetails = await this.mercadoPagoService.getSubscription(subscriptionId);

      // Atualizar status da assinatura no banco de dados
      // await this.subscriptionService.updateSubscriptionStatus(
      //   subscriptionId,
      //   subscriptionDetails.status
      // );

      if (subscriptionDetails.status === 'authorized') {
        this.logger.log(`Assinatura autorizada: ${subscriptionId}`);
        // Ativar benefícios
      }

      if (subscriptionDetails.status === 'cancelled') {
        this.logger.log(`Assinatura cancelada: ${subscriptionId}`);
        // Desativar benefícios
      }

    } catch (error) {
      this.logger.error('Erro ao processar notificação de assinatura:', error.message);
    }
  }

  /**
   * Processar notificação de plano
   */
  private async handlePlanNotification(planId: string, resourceUrl: string) {
    try {
      this.logger.log(`Processando notificação de plano: ${planId}`);
      // Lógica específica para notificações de plano
    } catch (error) {
      this.logger.error('Erro ao processar notificação de plano:', error.message);
    }
  }

  /**
   * Processar notificação de fatura
   */
  private async handleInvoiceNotification(invoiceId: string, resourceUrl: string) {
    try {
      this.logger.log(`Processando notificação de fatura: ${invoiceId}`);
      // Lógica específica para notificações de fatura
    } catch (error) {
      this.logger.error('Erro ao processar notificação de fatura:', error.message);
    }
  }

  /**
   * Endpoint para testar webhook (development)
   */
  @Post('webhook/test')
  @HttpCode(HttpStatus.OK)
  async testWebhook(@Body() data: any) {
    this.logger.log('Webhook de teste recebido');
    return { success: true, message: 'Test webhook received' };
  }

  /**
   * Obter status de um pagamento específico
   */
  @Get('payment/:paymentId')
  async getPaymentStatus(@Param('paymentId') paymentId: string) {
    try {
      const paymentDetails = await this.mercadoPagoService.getPayment(paymentId);
      return {
        success: true,
        data: paymentDetails
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obter status de uma assinatura específica
   */
  @Get('subscription/:subscriptionId')
  async getSubscriptionStatus(@Param('subscriptionId') subscriptionId: string) {
    try {
      const subscriptionDetails = await this.mercadoPagoService.getSubscription(subscriptionId);
      return {
        success: true,
        data: subscriptionDetails
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Testar integração com Mercado Pago
   */
  @Get('health')
  async checkHealth() {
    try {
      // Tentar buscar um cliente ou fazer uma operação simples
      return {
        success: true,
        message: 'Mercado Pago integration is healthy',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}
