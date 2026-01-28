import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateAffiliateDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  bankAccount?: string;

  @IsOptional()
  @IsString()
  bankCode?: string;

  @IsOptional()
  @IsString()
  cpf?: string;
}
