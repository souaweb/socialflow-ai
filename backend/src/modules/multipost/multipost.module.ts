import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MultiPostService } from './multipost.service';
import { MultiPostController } from './multipost.controller';
import { ContentAdaptationService } from './services/content-adaptation.service';
import { ImageGenerationService } from './services/image-generation.service';
import { VideoGenerationService } from './services/video-generation.service';
import { ChannelOptimizationService } from './services/channel-optimization.service';
import { MultiPost } from './entities/multipost.entity';
import { ContentTemplate } from './entities/content-template.entity';
import { ChannelConfig } from './entities/channel-config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MultiPost, ContentTemplate, ChannelConfig])],
  providers: [
    MultiPostService,
    ContentAdaptationService,
    ImageGenerationService,
    VideoGenerationService,
    ChannelOptimizationService,
  ],
  controllers: [MultiPostController],
  exports: [MultiPostService, ContentAdaptationService],
})
export class MultiPostModule {}
