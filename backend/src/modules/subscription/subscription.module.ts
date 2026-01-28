import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { MercadoPagoService } from './services/mercadopago.service';
import { MercadoPagoWebhookController } from './controllers/mercadopago-webhook.controller';
import { User } from '../auth/entities/user.entity';
import { Subscription } from './entities/subscription.entity';
import { Payment } from './entities/payment.entity';
import { BillingHistory } from './entities/payment.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User, Subscription, Payment, BillingHistory])
  ],
  providers: [SubscriptionService, MercadoPagoService],
  controllers: [SubscriptionController, MercadoPagoWebhookController],
  exports: [SubscriptionService, MercadoPagoService],
})
export class SubscriptionModule {}
