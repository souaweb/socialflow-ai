import { IsEnum, IsOptional, IsString, IsObject } from 'class-validator';

export class AddTrainingTextDto {
  @IsString()
  content: string;

  @IsEnum([
    'consultoria',
    'ecommerce',
    'agencia_marketing',
    'saas',
    'educacao',
    'saude',
    'fitness',
    'restaurante',
    'imobiliario',
    'servicos',
    'varejo',
    'outro',
  ])
  businessType: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class AddTrainingVoiceDto {
  @IsString()
  audioBase64: string;

  @IsEnum([
    'consultoria',
    'ecommerce',
    'agencia_marketing',
    'saas',
    'educacao',
    'saude',
    'fitness',
    'restaurante',
    'imobiliario',
    'servicos',
    'varejo',
    'outro',
  ])
  businessType: string;

  @IsOptional()
  @IsString()
  language?: string;
}

export class IdentifyBusinessDto {
  @IsString()
  content: string;

  @IsEnum(['text', 'voice', 'file'])
  inputType: 'text' | 'voice' | 'file';
}
