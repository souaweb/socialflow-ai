import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { RedisModule } from '@nestjs-modules/redis';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './modules/auth/auth.module';
import { PlatformsModule } from './modules/platforms/platforms.module';
import { ConversationsModule } from './modules/conversations/conversations.module';
import { PostsModule } from './modules/posts/posts.module';
import { CrmModule } from './modules/crm/crm.module';
import { AiModule } from './modules/ai/ai.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { AutomationsModule } from './modules/automations/automations.module';
import { ReportsModule } from './modules/reports/reports.module';
import { TeamModule } from './modules/team/team.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { AffiliateModule } from './modules/affiliate/affiliate.module';
import { TrainingModule } from './modules/training/training.module';
import { MultiPostModule } from './modules/multipost/multipost.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),

    // PostgreSQL (Dados Relacionais)
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      username: process.env.DATABASE_USER || 'socialflow',
      password: process.env.DATABASE_PASSWORD || 'socialflow123',
      database: process.env.DATABASE_NAME || 'socialflow_db',
      synchronize: process.env.DATABASE_SYNC === 'true' || process.env.NODE_ENV === 'development',
      logging: process.env.DATABASE_LOGGING === 'true' || process.env.NODE_ENV === 'development',
      autoLoadEntities: true,
      migrations: ['src/migrations/*.ts'],
      migrationsRun: true,
    }),

    // MongoDB (Analytics e Logs)
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://socialflow:socialflow123@localhost:27017/socialflow_analytics?authSource=admin'
    ),

    // Redis (Cache e Fila)
    RedisModule.forRoot({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || 'socialflow123',
      db: parseInt(process.env.REDIS_DB || '0'),
    }),

    // Bull Queue (Fila de Jobs)
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD || 'socialflow123',
        db: parseInt(process.env.REDIS_DB || '0'),
      },
    }),

    // Módulos da Aplicação
    AuthModule,
    PlatformsModule,
    ConversationsModule,
    PostsModule,
    CrmModule,
    AiModule,
    WebhooksModule,
    AutomationsModule,
    ReportsModule,
    TeamModule,
    SubscriptionModule,
    AffiliateModule,
    TrainingModule,
    MultiPostModule,
  ],
})
export class AppModule {}
