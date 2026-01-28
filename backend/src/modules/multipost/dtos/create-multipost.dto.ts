import { IsArray, IsEnum, IsString, IsOptional, IsObject } from 'class-validator';

export class CreateMultiPostDto {
  @IsString()
  content: string;

  @IsArray()
  @IsEnum(['instagram', 'facebook', 'tiktok', 'youtube', 'whatsapp'], { each: true })
  channels: string[];

  @IsEnum(['post', 'reel', 'story', 'carousel', 'video'])
  contentType: 'post' | 'reel' | 'story' | 'carousel' | 'video';

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  aiGenerate?: boolean;

  @IsOptional()
  @IsString()
  aiImagePrompt?: string;

  @IsOptional()
  @IsString()
  aiVideoPrompt?: string;

  @IsOptional()
  scheduledAt?: Date;
}

export class GenerateAIContentDto {
  @IsString()
  prompt: string;

  @IsEnum(['image', 'video', 'carousel'])
  contentType: 'image' | 'video' | 'carousel';

  @IsOptional()
  @IsString()
  style?: string;

  @IsOptional()
  @IsObject()
  options?: Record<string, any>;
}

export class AdaptContentDto {
  @IsString()
  content: string;

  @IsArray()
  @IsEnum(['instagram', 'facebook', 'tiktok', 'youtube', 'whatsapp'], { each: true })
  channels: string[];

  @IsEnum(['post', 'reel', 'story', 'carousel', 'video'])
  contentType: 'post' | 'reel' | 'story' | 'carousel' | 'video';

  @IsOptional()
  @IsString()
  tone?: string;

  @IsOptional()
  @IsString()
  keywords?: string;
}
