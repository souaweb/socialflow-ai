import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TrainingService } from './training.service';
import { AddTrainingTextDto, AddTrainingVoiceDto, IdentifyBusinessDto } from './dtos/add-training.dto';

@Controller('training')
@UseGuards(JwtAuthGuard)
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @Post(':businessId/text')
  async addTextTraining(
    @Param('businessId') businessId: string,
    @Body() dto: AddTrainingTextDto,
  ) {
    return this.trainingService.addTextTraining(businessId, dto.content, dto.businessType);
  }

  @Post(':businessId/voice')
  async addVoiceTraining(
    @Param('businessId') businessId: string,
    @Body() dto: AddTrainingVoiceDto,
  ) {
    return this.trainingService.addVoiceTraining(businessId, dto.audioBase64, dto.businessType);
  }

  @Post(':businessId/file')
  async addFileTraining(
    @Param('businessId') businessId: string,
    @Body() body: { fileUrl: string; fileName: string; businessType: string },
  ) {
    return this.trainingService.addFileTraining(
      businessId,
      body.fileUrl,
      body.businessType,
      body.fileName,
    );
  }

  @Post(':businessId/identify')
  async identifyBusinessType(
    @Param('businessId') businessId: string,
    @Body() dto: IdentifyBusinessDto,
  ) {
    return this.trainingService.identifyBusinessType(businessId, dto.content);
  }

  @Get(':businessId/status')
  async getTrainingStatus(@Param('businessId') businessId: string) {
    return this.trainingService.getTrainingStatus(businessId);
  }

  @Get(':businessId/insights')
  async getTrainingInsights(@Param('businessId') businessId: string) {
    return this.trainingService.getTrainingInsights(businessId);
  }

  @Post(':businessId/generate-response')
  async generateResponse(
    @Param('businessId') businessId: string,
    @Body() body: { message: string; trainingDataIds?: string[] },
  ) {
    return this.trainingService.generateAIResponseWithTraining(
      businessId,
      body.message,
      body.trainingDataIds,
    );
  }

  @Get(':businessId/training-list')
  async getTrainingList(
    @Param('businessId') businessId: string,
    @Query('type') type?: 'text' | 'voice' | 'file',
    @Query('limit') limit: number = 20,
  ) {
    return {
      businessId,
      trainingData: [
        {
          id: 'train_001',
          type: 'text',
          content: 'Treinamento de exemplo...',
          businessType: 'agencia_marketing',
          quality: 0.92,
          usageCount: 15,
          createdAt: new Date(),
        },
        {
          id: 'train_002',
          type: 'voice',
          transcription: 'Somos uma agência especializada em marketing...',
          businessType: 'agencia_marketing',
          quality: 0.88,
          usageCount: 8,
          createdAt: new Date(),
        },
      ],
      total: 20,
      limit,
    };
  }
}
