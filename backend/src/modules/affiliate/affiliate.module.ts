import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AffiliateService } from './affiliate.service';
import { AffiliateController } from './affiliate.controller';
import { User } from '../auth/entities/user.entity';
import { Affiliate } from './entities/affiliate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Affiliate])],
  providers: [AffiliateService],
  controllers: [AffiliateController],
  exports: [AffiliateService],
})
export class AffiliateModule {}
