import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingService } from './training.service';
import { TrainingController } from './training.controller';
import { BusinessTypeDetectionService } from './services/business-type-detection.service';
import { VoiceProcessingService } from './services/voice-processing.service';
import { TextProcessingService } from './services/text-processing.service';
import { TrainingData } from './entities/training-data.entity';
import { BusinessProfile } from './entities/business-profile.entity';
import { AIResponse } from './entities/ai-response.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrainingData, BusinessProfile, AIResponse])],
  providers: [
    TrainingService,
    BusinessTypeDetectionService,
    VoiceProcessingService,
    TextProcessingService,
  ],
  controllers: [TrainingController],
  exports: [TrainingService, BusinessTypeDetectionService],
})
export class TrainingModule {}
