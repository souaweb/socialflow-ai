import { IsEmail, IsEnum, IsOptional, IsArray } from 'class-validator';

export class InviteTeamDto {
  @IsEmail()
  email: string;

  @IsEnum(['admin', 'manager', 'analyst', 'viewer'])
  role: 'admin' | 'manager' | 'analyst' | 'viewer';

  @IsOptional()
  @IsArray()
  permissions?: string[];
}
