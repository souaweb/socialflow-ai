import { IsEnum, IsOptional } from 'class-validator';

export class CreateSubscriptionDto {
  @IsEnum(['free', 'starter', 'pro', 'enterprise'])
  plan: 'free' | 'starter' | 'pro' | 'enterprise';

  @IsOptional()
  @IsEnum(['monthly', 'yearly'])
  billingCycle?: 'monthly' | 'yearly';

  @IsOptional()
  paymentMethodId?: string;
}
