import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class OrgProfileDto {
  @IsNotEmpty()
  @IsString()
  orgName: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  gstin?: string; // GST number
}
