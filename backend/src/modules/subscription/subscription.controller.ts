import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dtos/create-subscription.dto';
import { 
  CreateCheckoutPreferenceDto, 
  CreatePixPaymentDto, 
  CreateBoletoPaymentDto, 
  CreateCardPaymentDto,
  RefundPaymentDto 
} from './dtos/payment.dto';

@Controller('subscription')
@UseGuards(JwtAuthGuard)
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('plans')
  async getAvailablePlans() {
    return this.subscriptionService.getAvailablePlans();
  }

  @Get('current/:userId')
  async getCurrentSubscription(@Param('userId') userId: string) {
    return this.subscriptionService.getCurrentSubscription(userId);
  }

  @Post('upgrade')
  async upgradePlan(@Body() dto: CreateSubscriptionDto) {
    return this.subscriptionService.upgradePlan(dto);
  }

  @Post('downgrade')
  async downgradePlan(@Body() body: { plan: string }) {
    return this.subscriptionService.downgradePlan(body.plan);
  }

  @Post('cancel')
  async cancelSubscription(@Body() body: { reason?: string }) {
    return this.subscriptionService.cancelSubscription(body.reason);
  }

  @Put('pause')
  async pauseSubscription() {
    return this.subscriptionService.pauseSubscription();
  }

  @Put('resume')
  async resumeSubscription() {
    return this.subscriptionService.resumeSubscription();
  }

  @Get('billing-history/:userId')
  async getBillingHistory(@Param('userId') userId: string) {
    return this.subscriptionService.getBillingHistory(userId);
  }

  // === Mercado Pago Integration ===

  @Post('mercadopago/checkout')
  async createCheckout(@Body() dto: CreateCheckoutPreferenceDto) {
    return this.subscriptionService.createCheckoutPreference(dto);
  }

  @Post('mercadopago/pix')
  async createPixPayment(@Body() dto: CreatePixPaymentDto) {
    return this.subscriptionService.createPixPayment(dto);
  }

  @Post('mercadopago/boleto')
  async createBoletoPayment(@Body() dto: CreateBoletoPaymentDto) {
    return this.subscriptionService.createBoletoPayment(dto);
  }

  @Post('mercadopago/card')
  async createCardPayment(@Body() dto: CreateCardPaymentDto) {
    return this.subscriptionService.createCardPayment(dto);
  }

  @Get('mercadopago/payment/:paymentId')
  async getPaymentStatus(@Param('paymentId') paymentId: string) {
    return this.subscriptionService.getPaymentStatus(paymentId);
  }

  @Post('mercadopago/refund')
  async refundPayment(@Body() dto: RefundPaymentDto) {
    return this.subscriptionService.refundPayment(dto);
  }

  @Get('mercadopago/subscription/:subscriptionId')
  async getSubscriptionStatus(@Param('subscriptionId') subscriptionId: string) {
    return this.subscriptionService.getSubscriptionStatus(subscriptionId);
  }

  @Post('mercadopago/subscription/cancel/:subscriptionId')
  async cancelMercadoPagoSubscription(
    @Param('subscriptionId') subscriptionId: string,
    @Body() body: { reason?: string }
  ) {
    return this.subscriptionService.cancelMercadoPagoSubscription(subscriptionId, body.reason);
  }

  @Post('apply-coupon')
  async applyCoupon(@Body() body: { couponCode: string }) {
    return this.subscriptionService.applyCoupon(body.couponCode);
  }
}
