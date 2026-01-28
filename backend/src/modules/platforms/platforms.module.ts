import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PlatformsService } from './platforms.service';
import { PlatformsController } from './platforms.controller';
import { MetaService } from './services/meta.service';
import { TikTokService } from './services/tiktok.service';
import { YouTubeService } from './services/youtube.service';
import { WhatsAppService } from './services/whatsapp.service';
import { ConnectedAccount } from '../auth/entities/connected-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConnectedAccount])],
  providers: [
    PlatformsService,
    MetaService,
    TikTokService,
    YouTubeService,
    WhatsAppService,
  ],
  controllers: [PlatformsController],
  exports: [
    PlatformsService,
    MetaService,
    TikTokService,
    YouTubeService,
    WhatsAppService,
  ],
})
export class PlatformsModule {}
