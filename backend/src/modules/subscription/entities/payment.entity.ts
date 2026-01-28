import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  businessId: string;

  @Column()
  mercadoPagoPaymentId: string;

  @Column({ nullable: true })
  preferenceId: string;

  @Column()
  amount: number;

  @Column({ default: 'BRL' })
  currency: string;

  @Column()
  status: 'pending' | 'approved' | 'authorized' | 'in_process' | 'in_mediation' | 'rejected' | 'cancelled' | 'refunded' | 'charged_back';

  @Column({ nullable: true })
  statusDetail: string;

  @Column()
  planId: string;

  @Column()
  planName: string;

  @Column()
  paymentMethodId: string; // card, pix, boleto, transfer, etc

  @Column({ nullable: true })
  cardLastFourDigits: string;

  @Column({ nullable: true })
  cardBrand: string;

  @Column()
  payerEmail: string;

  @Column({ nullable: true })
  payerName: string;

  @Column({ nullable: true })
  payerCPF: string;

  @Column({ nullable: true })
  installments: number;

  @Column({ type: 'float', nullable: true })
  installmentAmount: number;

  @Column({ nullable: true })
  transactionId: string;

  @Column({ nullable: true })
  receiptUrl: string;

  @Column({ nullable: true })
  invoiceNumber: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  approvedAt: Date;

  @Column({ nullable: true })
  refundedAt: Date;

  @Column({ nullable: true })
  refundReason: string;

  @Column({ type: 'float', nullable: true })
  refundAmount: number;
}

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  businessId: string;

  @Column()
  mercadoPagoSubscriptionId: string;

  @Column({ nullable: true })
  mercadoPagoPlanId: string;

  @Column()
  plan: 'free' | 'starter' | 'pro' | 'enterprise';

  @Column({ default: 'active' })
  status: 'active' | 'paused' | 'cancelled' | 'expired' | 'pending';

  @Column({ default: 'monthly' })
  billingCycle: 'monthly' | 'yearly';

  @Column()
  amount: number;

  @Column({ default: 'BRL' })
  currency: string;

  @Column()
  payerEmail: string;

  @Column({ nullable: true })
  payerName: string;

  @Column({ nullable: true })
  paymentMethodId: string;

  @Column({ nullable: true })
  cardLastFourDigits: string;

  @Column()
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column()
  nextBillingDate: Date;

  @Column({ nullable: true })
  lastBillingDate: Date;

  @Column({ default: true })
  autoRenew: boolean;

  @Column({ nullable: true })
  trialEndDate: Date;

  @Column({ default: 0 })
  billingRetries: number;

  @Column({ nullable: true })
  cancellationReason: string;

  @Column({ nullable: true })
  cancellationDate: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('billing_history')
export class BillingHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  businessId: string;

  @Column()
  subscriptionId: string;

  @Column()
  paymentId: string;

  @Column()
  amount: number;

  @Column({ default: 'BRL' })
  currency: string;

  @Column()
  status: 'paid' | 'pending' | 'failed' | 'refunded';

  @Column()
  invoiceNumber: string;

  @Column({ nullable: true })
  receiptUrl: string;

  @Column()
  billingDate: Date;

  @Column({ nullable: true })
  dueDate: Date;

  @Column({ nullable: true })
  paidAt: Date;

  @Column({ nullable: true })
  failureReason: string;

  @Column({ default: 0 })
  retryCount: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
