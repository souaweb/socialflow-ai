import { IsString, IsNumber, IsEmail, IsEnum, IsOptional, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePaymentDto {
  @IsString()
  planId: string;

  @IsString()
  planName: string;

  @IsNumber()
  amount: number;

  @IsEnum(['BRL', 'USD'])
  currency: string;

  @IsString()
  businessId: string;

  @IsEmail()
  buyerEmail: string;

  @IsString()
  buyerName: string;

  @IsEnum(['monthly', 'yearly'])
  billingCycle: 'monthly' | 'yearly';

  @IsString()
  description: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class CreatePixPaymentDto {
  @IsNumber()
  amount: number;

  @IsString()
  description: string;

  @IsEmail()
  payerEmail: string;

  @IsString()
  payerFirstName: string;

  @IsString()
  payerLastName: string;

  @IsString()
  payerCPF: string;

  @IsString()
  planId: string;

  @IsString()
  businessId: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class CreateBoletoPaymentDto {
  @IsNumber()
  amount: number;

  @IsString()
  description: string;

  @IsEmail()
  payerEmail: string;

  @IsString()
  payerFirstName: string;

  @IsString()
  payerLastName: string;

  @IsString()
  payerCPF: string;

  @IsString()
  planId: string;

  @IsString()
  businessId: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class CreateCardPaymentDto {
  @IsNumber()
  amount: number;

  @IsString()
  description: string;

  @IsEmail()
  payerEmail: string;

  @IsString()
  payerFirstName: string;

  @IsString()
  payerLastName: string;

  @IsString()
  payerCPF: string;

  @IsString()
  cardToken: string; // Token gerado no frontend

  @IsOptional()
  @IsNumber()
  installments?: number; // 1-12

  @IsString()
  planId: string;

  @IsString()
  businessId: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class CreateCheckoutPreferenceDto {
  @IsString()
  planId: string;

  @IsString()
  planName: string;

  @IsNumber()
  amount: number;

  @IsEnum(['BRL', 'USD'])
  currency: string;

  @IsString()
  businessId: string;

  @IsEmail()
  buyerEmail: string;

  @IsString()
  buyerName: string;

  @IsEnum(['monthly', 'yearly'])
  billingCycle: 'monthly' | 'yearly';

  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  installments?: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class ConfirmPaymentDto {
  @IsString()
  paymentId: string;

  @IsString()
  preferenceId?: string;

  @IsString()
  status: string;

  @IsString()
  planId: string;

  @IsString()
  businessId: string;

  @IsEmail()
  payerEmail: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class ProcessWebhookDto {
  @IsString()
  id: string;

  @IsString()
  topic: string; // 'payment' | 'plan' | 'subscription' | 'invoice'

  @IsString()
  resource: string; // URL do recurso

  @IsOptional()
  @IsObject()
  data?: Record<string, any>;
}

export class CreateSubscriptionDto {
  @IsString()
  plan: 'starter' | 'pro' | 'enterprise';

  @IsEmail()
  payerEmail: string;

  @IsString()
  payerName: string;

  @IsString()
  payerCPF: string;

  @IsEnum(['monthly', 'yearly'])
  billingCycle: 'monthly' | 'yearly';

  @IsString()
  paymentMethodId: 'card' | 'pix' | 'boleto';

  @IsOptional()
  @IsString()
  cardToken?: string;

  @IsString()
  businessId: string;

  @IsOptional()
  @IsNumber()
  installments?: number;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class UpdateSubscriptionDto {
  @IsOptional()
  @IsString()
  plan?: 'starter' | 'pro' | 'enterprise';

  @IsOptional()
  @IsEnum(['monthly', 'yearly'])
  billingCycle?: 'monthly' | 'yearly';

  @IsOptional()
  @IsString()
  paymentMethodId?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class RefundPaymentDto {
  @IsString()
  paymentId: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsString()
  reason: string;

  @IsString()
  businessId: string;
}

export class PaymentStatusResponseDto {
  paymentId: string;
  status: string;
  statusDetail: string;
  amount: number;
  installments?: number;
  installmentAmount?: number;
  paymentMethodId: string;
  createdAt: Date;
  approvedAt?: Date;
  metadata: Record<string, any>;
}

export class SubscriptionStatusResponseDto {
  subscriptionId: string;
  status: string;
  plan: string;
  amount: number;
  billingCycle: string;
  nextPaymentDate: Date;
  lastPaymentDate?: Date;
  createdAt: Date;
  metadata: Record<string, any>;
}
