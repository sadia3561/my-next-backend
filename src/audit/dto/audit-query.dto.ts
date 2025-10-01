import { IsOptional, IsString } from 'class-validator';

export class AuditQueryDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  action?: string;

  @IsOptional()
  @IsString()
  fromDate?: string; // ISO string

  @IsOptional()
  @IsString()
  toDate?: string; // ISO string
}
